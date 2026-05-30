import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTechProfile, getTechStats } from '../../services/technicianService';
import reviewService from '../../services/reviewService';
import TechServiceMap from '../../components/maps/TechServiceMap';
import matchingService from '../../services/matchingService';
import { formatNumber } from '../../utils/format';
import { EmptyState } from '../../components/common/AsyncStates';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [profile, setProfile] = useState<any>(null);
    const [pendingProposals, setPendingProposals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showVerifiedModal, setShowVerifiedModal] = useState(searchParams.get('verified') === '1');

    const { data: stats } = useQuery({ queryKey: ['tech-stats'], queryFn: getTechStats });
    const { data: reviewsRes } = useQuery({ queryKey: ['my-reviews'], queryFn: () => reviewService.getMyReviews(1) });
    // myReviews renvoie { data: <paginator{ data: [...] }> } → on extrait le tableau de façon robuste.
    const reviewsPayload: any = reviewsRes?.data;
    const reviews: any[] = Array.isArray(reviewsPayload)
        ? reviewsPayload
        : (Array.isArray(reviewsPayload?.data) ? reviewsPayload.data : []);
    const categories: any[] = stats?.category_breakdown ?? [];
    const catMax = Math.max(1, ...categories.map((c: any) => c.value));
    const monthlyMissions: any[] = stats?.monthly_missions ?? [];
    const missionsMax = Math.max(1, ...monthlyMissions.map((m: any) => m.count));
    const recentMissions: any[] = stats?.recent_missions ?? [];

    const dismissVerifiedModal = () => {
        setShowVerifiedModal(false);
        searchParams.delete('verified');
        setSearchParams(searchParams, { replace: true });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await getTechProfile();
                setProfile(profileData);
                
                const proposalsData = await matchingService.getTechnicianProposals();
                setPendingProposals(proposalsData.data || proposalsData);
            } catch (error) {
                console.error("Failed to load data on dashboard", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="tech-dashboard-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading Dashboard...</div>;
    }

    return (
        <div className="tech-dashboard-container">
            {/* Left & Center Main Content */}
            <div className="tech-dashboard-main">
                
                {/* Welcome Header */}
                <div className="tech-welcome-header">
                    <div className="tech-welcome-title">
                        <h1>Technician Dashboard</h1>
                        <p>Welcome back, {profile?.name || 'Professional'}. You have {pendingProposals.length} new matching opportunities.</p>
                    </div>
                    <div>
                        <button className="tech-online-btn" onClick={() => navigate('/technicien/radar')}>
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>bolt</span>
                            Go Online
                        </button>
                    </div>
                </div>

                {/* AI Matching Opportunities */}
                {pendingProposals.length > 0 && (
                    <div className="tech-opportunities-section mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="tech-card-title flex items-center">
                                <span className="material-symbols-outlined mr-2 text-blue-500">psychology</span>
                                IA Matching Opportunities
                            </h4>
                            <span className="tech-kpi-badge blue">NEW</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingProposals.map((prop) => (
                                <div key={prop.id} className="glass-panel p-4 flex flex-col justify-between border-l-4 border-blue-500" style={{ cursor: 'pointer' }} onClick={() => navigate(`/technicien/mission/${prop.client_request?.id || prop.request_id}`)}>
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="tech-table-type">{prop.client_request?.category || 'Intervention'}</span>
                                            <span className="tech-tech-match text-sm font-bold text-blue-600">{Math.round(prop.score)}% Match</span>
                                        </div>
                                        <h5 className="font-bold text-slate-800">{prop.client_request?.title}</h5>
                                        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{prop.client_request?.description}</p>
                                        <div className="flex items-center text-xs text-slate-400 gap-3">
                                            <span className="flex items-center"><span className="material-symbols-outlined text-xs mr-1">location_on</span> {Math.round(prop.distance)} km</span>
                                            <span className="flex items-center"><span className="material-symbols-outlined text-xs mr-1">payments</span> {prop.estimated_price || 'A négocier'} XAF</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button className="tech-btn-sm-outline flex-1" onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await matchingService.refuseProposal(prop.id);
                                                setPendingProposals(prev => prev.filter(p => p.id !== prop.id));
                                            } catch { /* silent */ }
                                        }}>Décliner</button>
                                        <button className="tech-btn-sm-solid flex-1" onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await matchingService.acceptProposal(prop.id);
                                                navigate(`/technicien/mission/${prop.client_request?.id || prop.request_id}`);
                                            } catch { /* silent */ }
                                        }}>Accepter</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* KPI Cards Grid */}
                <div className="tech-kpi-grid">
                    {/* Wallet */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon blue">
                                <span className="material-symbols-outlined">account_balance_wallet</span>
                            </div>
                        </div>
                        <p className="tech-kpi-subtitle">Solde du wallet</p>
                        <h3 className="tech-kpi-value">{formatNumber(stats?.wallet_balance ?? 0)} <span>XAF</span></h3>
                    </div>

                    {/* Monthly Earnings */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon blue">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <span className="tech-kpi-badge slate">Ce mois</span>
                        </div>
                        <p className="tech-kpi-subtitle">Gains du mois</p>
                        <h3 className="tech-kpi-value">{formatNumber(stats?.monthly_earnings ?? 0)} <span>XAF</span></h3>
                    </div>

                    {/* Completion Rate */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon green">
                                <span className="material-symbols-outlined">task_alt</span>
                            </div>
                        </div>
                        <p className="tech-kpi-subtitle">Taux de complétion</p>
                        <h3 className="tech-kpi-value">{stats?.completion_rate ?? 0}<span>%</span></h3>
                    </div>

                    {/* Global Rating */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon orange">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            </div>
                        </div>
                        <p className="tech-kpi-subtitle">Note globale ({stats?.num_reviews ?? 0} avis)</p>
                        <h3 className="tech-kpi-value" style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                            {(stats?.rating ?? 0).toFixed(2)} <span style={{ paddingBottom: '2px' }}>/ 5.0</span>
                        </h3>
                    </div>
                </div>

                {/* Main Charts & Map Bento Grid */}
                <div className="tech-charts-grid">
                    {/* Revenue Breakdown (Donut) */}
                    <div className="tech-card-white">
                        <h4 className="tech-card-title">Répartition des missions</h4>
                        {categories.length === 0 ? (
                            <EmptyState icon="donut_small" title="Aucune mission" message="La répartition par catégorie apparaîtra ici." />
                        ) : (
                            <div className="tech-legend-list" style={{ marginTop: '1rem' }}>
                                {categories.map((c) => (
                                    <div key={c.label} className="tech-legend-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span className="tech-legend-name" style={{ textTransform: 'capitalize' }}>{c.label}</span>
                                            <span className="tech-legend-amount">{c.value}</span>
                                        </div>
                                        <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999 }}>
                                            <div style={{ width: `${Math.round((c.value / catMax) * 100)}%`, height: '100%', background: '#1960a3', borderRadius: 999 }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Intervention Zones (MapLibre) */}
                    <div className="tech-map-card" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
                        <div className="tech-map-overlay-title" style={{ zIndex: 5, pointerEvents: 'none' }}>
                            <h4>Intervention Zones</h4>
                            <p>Live matching within your service radius</p>
                        </div>
                        <TechServiceMap 
                            latitude={profile?.service_perimeter?.latitude || 4.0511} 
                            longitude={profile?.service_perimeter?.longitude || 9.7679} 
                            city={profile?.service_perimeter?.city || 'Cameroon Hub'}
                            radiusInKm={50}
                        />
                    </div>
                </div>

                {/* Field Performance Charts */}
                <div className="tech-card-white">
                    <div className="tech-bar-chart-header">
                        <h4 className="tech-card-title" style={{ margin: 0 }}>Missions par mois</h4>
                        <div className="tech-bar-chart-legend">
                            <div className="tech-bar-chart-legend-item">
                                <div className="tech-bar-chart-legend-color" style={{ backgroundColor: '#1960a3' }}></div>
                                <span className="tech-bar-chart-legend-text">Missions</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="tech-bar-chart-area">
                        {monthlyMissions.map((m, idx) => (
                            <div key={idx} className="tech-bar-group">
                                <div className="tech-bars-wrapper">
                                    <div className="tech-bar primary" style={{ height: `${Math.max(6, Math.round((m.count / missionsMax) * 100))}%` }} title={`${m.count} mission(s)`}></div>
                                </div>
                                <span className="tech-bar-label">{m.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission Status Table */}
                <div className="tech-table-card-modern">
                    <div className="tech-table-header-modern">
                        <h4>Missions History</h4>
                        <button onClick={() => navigate('/technicien/planning')}>View All Missions</button>
                    </div>
                    <div className="tech-table-container">
                        <table className="tech-table-modern">
                            <thead>
                                <tr>
                                    <th>Mission ID</th>
                                    <th>Client / Location</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Earnings</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentMissions.length === 0 ? (
                                    <tr><td colSpan={6}><EmptyState icon="work_history" title="Aucune mission" message="Vos missions apparaîtront ici." /></td></tr>
                                ) : (
                                    recentMissions.map((m) => (
                                        <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/technicien/mission/${m.id}`)}>
                                            <td className="tech-table-id">#{String(m.id).slice(0, 6)}</td>
                                            <td>
                                                <div className="tech-table-client-info">
                                                    <span className="tech-table-client-name">{m.title}</span>
                                                    <span className="tech-table-client-loc">{m.city}</span>
                                                </div>
                                            </td>
                                            <td><span className="tech-table-type" style={{ textTransform: 'capitalize' }}>{m.category}</span></td>
                                            <td><span className={`tech-table-status ${m.status === 'completed' ? 'closed' : m.status === 'in_progress' ? 'progress' : 'pending'}`} style={{ textTransform: 'uppercase' }}>{m.status}</span></td>
                                            <td className="tech-table-price">—</td>
                                            <td><button className="tech-table-action-btn"><span className="material-symbols-outlined">more_horiz</span></button></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Right Sidebar (Pro Network) */}
            <div className="tech-dashboard-sidebar">
                <div className="tech-sidebar-container">
                    <div className="tech-sidebar-header">
                        <h4 className="tech-sidebar-title">Derniers avis</h4>
                        <span className="tech-sidebar-live">{reviews.length}</span>
                    </div>

                    <div className="tech-feed-list">
                        {reviews.length === 0 ? (
                            <EmptyState icon="reviews" title="Aucun avis" message="Vos avis clients apparaîtront ici." />
                        ) : (
                            reviews.slice(0, 5).map((r: any) => (
                                <div key={r.id} className="tech-network-item">
                                    <div className="tech-network-icon">
                                        <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontVariationSettings: "'FILL' 1" }}>star</span>
                                    </div>
                                    <div className="tech-network-content">
                                        <p><span>{r.reviewer?.name ?? 'Client'}</span> · {Number(r.rating).toFixed(1)}/5{r.comment ? ` — ${r.comment}` : ''}</p>
                                        <p className="tech-network-time">{new Date(r.created_at).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <hr className="tech-sidebar-divider" />

                    {/* Promo Card */}
                    <div className="tech-promo-card">
                        <div className="tech-promo-content">
                            <h5 className="tech-promo-title">Reliance Premium</h5>
                            <p className="tech-promo-desc">Boost your mission visibility and get exclusive priority support.</p>
                            <button className="tech-promo-btn" onClick={() => navigate('/technicien/abonnements')}>Upgrade Now</button>
                        </div>
                        <span className="material-symbols-outlined bg-icon">verified_user</span>
                    </div>

                    {/* Helpful Links */}
                    <div className="tech-helpful-links">
                        <a className="tech-link-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/contact')}>
                            <span className="material-symbols-outlined">support_agent</span>
                            Contact Tech Support
                        </a>
                        <a className="tech-link-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/qui-sommes-nous')}>
                            <span className="material-symbols-outlined">menu_book</span>
                            Resource Center
                        </a>
                    </div>
                </div>
            </div>

            {/* Email Verified Confirmation Modal */}
            {showVerifiedModal && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 9999
                }} onClick={dismissVerifiedModal}>
                    <div className="glass-panel" style={{
                        maxWidth: '380px', width: '90%', padding: '32px 24px',
                        textAlign: 'center', borderRadius: '20px'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.1)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                        }}>
                            <span className="material-symbols-outlined" style={{
                                fontSize: '48px', color: '#6366f1',
                                fontVariationSettings: "'FILL' 1"
                            }}>verified</span>
                        </div>
                        <h3 style={{ margin: '16px 0 8px', fontSize: '1.25rem', fontWeight: 600 }}>E-mail verifie !</h3>
                        <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '0.9rem' }}>
                            Votre adresse e-mail a ete confirmee avec succes. Toutes les fonctionnalites sont maintenant accessibles.
                        </p>
                        <button className="tech-btn-sm-solid" style={{
                            width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.95rem'
                        }} onClick={dismissVerifiedModal}>
                            Continuer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
