import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getTechProfile } from '../../services/technicianService';
import TechServiceMap from '../../components/maps/TechServiceMap';
import matchingService from '../../services/matchingService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [profile, setProfile] = useState<any>(null);
    const [pendingProposals, setPendingProposals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showVerifiedModal, setShowVerifiedModal] = useState(searchParams.get('verified') === '1');

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
                        <button className="tech-online-btn">
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
                            <span className="tech-kpi-badge green">+12%</span>
                        </div>
                        <p className="tech-kpi-subtitle">Wallet Balance</p>
                        <h3 className="tech-kpi-value">450,200 <span>XAF</span></h3>
                    </div>

                    {/* Monthly Earnings */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon blue">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <span className="tech-kpi-badge slate">Current Mo.</span>
                        </div>
                        <p className="tech-kpi-subtitle">Monthly Earnings</p>
                        <h3 className="tech-kpi-value">1,280,000 <span>XAF</span></h3>
                    </div>

                    {/* Completion Rate */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon green">
                                <span className="material-symbols-outlined">task_alt</span>
                            </div>
                        </div>
                        <p className="tech-kpi-subtitle">Completion Rate</p>
                        <h3 className="tech-kpi-value">98.4<span>%</span></h3>
                    </div>

                    {/* Global Rating */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon orange">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            </div>
                        </div>
                        <p className="tech-kpi-subtitle">Global Rating</p>
                        <h3 className="tech-kpi-value" style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                            4.92 <span style={{ paddingBottom: '2px' }}>/ 5.0</span>
                        </h3>
                    </div>
                </div>

                {/* Main Charts & Map Bento Grid */}
                <div className="tech-charts-grid">
                    {/* Revenue Breakdown (Donut) */}
                    <div className="tech-card-white">
                        <h4 className="tech-card-title">Revenue Breakdown</h4>
                        <div className="tech-donut-wrapper">
                            <svg viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)', width: '10rem', height: '10rem' }}>
                                <circle cx="80" cy="80" fill="transparent" r="70" stroke="#f1f5f9" strokeWidth="12"></circle>
                                <circle cx="80" cy="80" fill="transparent" r="70" stroke="#1a365d" strokeDasharray="440" strokeDashoffset="110" strokeWidth="12"></circle>
                                <circle cx="80" cy="80" fill="transparent" r="70" stroke="#003f23" strokeDasharray="440" strokeDashoffset="350" strokeWidth="12"></circle>
                            </svg>
                            <div className="tech-donut-text">
                                <span className="tech-donut-percentage">75%</span>
                                <span className="tech-donut-label">Installation</span>
                            </div>
                        </div>
                        <div className="tech-legend-list">
                            <div className="tech-legend-item">
                                <div className="tech-legend-left">
                                    <div className="tech-legend-dot blue"></div>
                                    <span className="tech-legend-name">Installations</span>
                                </div>
                                <span className="tech-legend-amount">960k</span>
                            </div>
                            <div className="tech-legend-item">
                                <div className="tech-legend-left">
                                    <div className="tech-legend-dot green"></div>
                                    <span className="tech-legend-name">Maintenance</span>
                                </div>
                                <span className="tech-legend-amount">320k</span>
                            </div>
                        </div>
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
                        <h4 className="tech-card-title" style={{ margin: 0 }}>Field Performance</h4>
                        <div className="tech-bar-chart-legend">
                            <div className="tech-bar-chart-legend-item">
                                <div className="tech-bar-chart-legend-color" style={{ backgroundColor: '#1960a3' }}></div>
                                <span className="tech-bar-chart-legend-text">Punctuality</span>
                            </div>
                            <div className="tech-bar-chart-legend-item">
                                <div className="tech-bar-chart-legend-color" style={{ backgroundColor: '#e2e8f0' }}></div>
                                <span className="tech-bar-chart-legend-text">Response Time</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="tech-bar-chart-area">
                        {[
                            { day: 'MON', p: '80%', r: '40%' },
                            { day: 'TUE', p: '95%', r: '30%' },
                            { day: 'WED', p: '70%', r: '60%' },
                            { day: 'THU', p: '85%', r: '45%' },
                            { day: 'FRI', p: '90%', r: '20%' },
                            { day: 'SAT', p: '60%', r: '15%' },
                        ].map((item, idx) => (
                            <div key={idx} className="tech-bar-group">
                                <div className="tech-bars-wrapper">
                                    <div className="tech-bar primary" style={{ height: item.p }}></div>
                                    <div className="tech-bar secondary" style={{ height: item.r }}></div>
                                </div>
                                <span className="tech-bar-label">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission Status Table */}
                <div className="tech-table-card-modern">
                    <div className="tech-table-header-modern">
                        <h4>Missions History</h4>
                        <button>View All Missions</button>
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
                                <tr>
                                    <td className="tech-table-id">#RX-4492</td>
                                    <td>
                                        <div className="tech-table-client-info">
                                            <span className="tech-table-client-name">Avenue de Gaulle</span>
                                            <span className="tech-table-client-loc">Bonapriso, Douala</span>
                                        </div>
                                    </td>
                                    <td><span className="tech-table-type">Electrical</span></td>
                                    <td><span className="tech-table-status progress">IN PROGRESS</span></td>
                                    <td className="tech-table-price">25,000</td>
                                    <td><button className="tech-table-action-btn"><span className="material-symbols-outlined">more_horiz</span></button></td>
                                </tr>
                                <tr>
                                    <td className="tech-table-id">#RX-4481</td>
                                    <td>
                                        <div className="tech-table-client-info">
                                            <span className="tech-table-client-name">Immeuble Krystal</span>
                                            <span className="tech-table-client-loc">Akwa, Douala</span>
                                        </div>
                                    </td>
                                    <td><span className="tech-table-type">HVAC</span></td>
                                    <td><span className="tech-table-status closed">CLOSED</span></td>
                                    <td className="tech-table-price">48,500</td>
                                    <td><button className="tech-table-action-btn"><span className="material-symbols-outlined">more_horiz</span></button></td>
                                </tr>
                                <tr>
                                    <td className="tech-table-id">#RX-4475</td>
                                    <td>
                                        <div className="tech-table-client-info">
                                            <span className="tech-table-client-name">Total Station</span>
                                            <span className="tech-table-client-loc">Yassa, Douala</span>
                                        </div>
                                    </td>
                                    <td><span className="tech-table-type">Plumbing</span></td>
                                    <td><span className="tech-table-status pending">PENDING</span></td>
                                    <td className="tech-table-price">12,000</td>
                                    <td><button className="tech-table-action-btn"><span className="material-symbols-outlined">more_horiz</span></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Right Sidebar (Pro Network) */}
            <div className="tech-dashboard-sidebar">
                <div className="tech-sidebar-container">
                    <div className="tech-sidebar-header">
                        <h4 className="tech-sidebar-title">Pro Network</h4>
                        <span className="tech-sidebar-live">LIVE</span>
                    </div>

                    <div className="tech-feed-list">
                        <div className="tech-network-item">
                            <div className="tech-network-avatar">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Reliance" alt="User" />
                            </div>
                            <div className="tech-network-content">
                                <p><span>Jerome K.</span> just completed a Gold-tier maintenance.</p>
                                <p className="tech-network-time">2 mins ago</p>
                            </div>
                        </div>

                        <div className="tech-network-item">
                            <div className="tech-network-avatar">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Reliance" alt="User" />
                            </div>
                            <div className="tech-network-content">
                                <p><span>Sandra M.</span> is now online in <span className="blue">Douala West</span>.</p>
                                <p className="tech-network-time">15 mins ago</p>
                            </div>
                        </div>

                        <div className="tech-network-item">
                            <div className="tech-network-icon">
                                <span className="material-symbols-outlined">workspace_premium</span>
                            </div>
                            <div className="tech-network-content">
                                <p><span>New Badge!</span> You've unlocked the "Punctual Pro" status.</p>
                                <p className="tech-network-time">1 hour ago</p>
                            </div>
                        </div>
                    </div>

                    <hr className="tech-sidebar-divider" />

                    {/* Promo Card */}
                    <div className="tech-promo-card">
                        <div className="tech-promo-content">
                            <h5 className="tech-promo-title">Reliance Premium</h5>
                            <p className="tech-promo-desc">Boost your mission visibility and get exclusive priority support.</p>
                            <button className="tech-promo-btn">Upgrade Now</button>
                        </div>
                        <span className="material-symbols-outlined bg-icon">verified_user</span>
                    </div>

                    {/* Helpful Links */}
                    <div className="tech-helpful-links">
                        <a href="#" className="tech-link-item">
                            <span className="material-symbols-outlined">support_agent</span>
                            Contact Tech Support
                        </a>
                        <a href="#" className="tech-link-item">
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
