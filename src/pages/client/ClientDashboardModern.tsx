import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { financeService } from '../../services/financeService';
import requestService from '../../services/requestService';
import ClientLocationMap from '../../components/maps/ClientLocationMap';
import { EmptyState } from '../../components/common/AsyncStates';
import { formatNumber } from '../../utils/format';
import './ClientDashboardModern.css';

const ClientDashboardModern: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user, requires2faSetup } = useAuth();
    const [resendStatus, setResendStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [showVerifiedModal, setShowVerifiedModal] = React.useState(searchParams.get('verified') === '1');

    const { data: reqRes } = useQuery({ queryKey: ['client-requests'], queryFn: () => requestService.list() });
    const requests: any[] = reqRes?.data ?? reqRes ?? [];
    const activeRequests = requests.filter((r: any) => !['completed', 'cancelled', 'closed', 'done'].includes(String(r.status)));

    const { data: holdsRes } = useQuery({ queryKey: ['client-holds'], queryFn: () => financeService.getHolds() });
    const holds: any[] = holdsRes?.data?.data ?? holdsRes?.data ?? [];
    const pendingEscrow = holds.filter((h: any) => h.status === 'held').reduce((s: number, h: any) => s + Number(h.amount || 0), 0);

    const { data: txRes } = useQuery({ queryKey: ['client-wallet-transactions'], queryFn: () => financeService.getTransactions(1) });
    const txList: any[] = txRes?.data?.data ?? [];
    const lifetimeSpend = txList.filter((t: any) => Number(t.amount) < 0).reduce((s: number, t: any) => s + Math.abs(Number(t.amount)), 0);

    // Clear the query param when modal is dismissed
    const dismissVerifiedModal = () => {
        setShowVerifiedModal(false);
        searchParams.delete('verified');
        setSearchParams(searchParams, { replace: true });
    };

    const handleResendEmail = async () => {
        setResendStatus('loading');
        try {
            await authService.resendVerificationEmail();
            setResendStatus('success');
            setTimeout(() => setResendStatus('idle'), 5000);
        } catch {
            setResendStatus('error');
            setTimeout(() => setResendStatus('idle'), 5000);
        }
    };

    return (
        <div className="stitch-modern-wrapper">

            <main className="sm-main-content">

                {/* Email Verification Banner */}
                {user && !user.email_verified_at && (
                    <div className="verification-banner glass-card">
                        <div className="v-banner-content">
                            <span className="material-symbols-outlined v-icon">mail</span>
                            <div className="v-text">
                                <strong>Vérifiez votre adresse e-mail</strong>
                                <p>Certaines fonctionnalités comme le KYC sont bloquées tant que votre compte n'est pas vérifié.</p>
                            </div>
                        </div>
                        <button
                            className={`v-resend-btn ${resendStatus === 'loading' ? 'loading' : ''}`}
                            onClick={handleResendEmail}
                            disabled={resendStatus === 'loading' || resendStatus === 'success'}
                        >
                            {resendStatus === 'loading' ? 'Envoi...' : (resendStatus === 'success' ? 'E-mail envoyé !' : 'Renvoyer le lien')}
                        </button>
                    </div>
                )}

                {/* Double authentification exigée avant les actions financières (REQUIRE_2FA_CLIENTS) */}
                {requires2faSetup && (
                    <div className="verification-banner glass-card" role="alert">
                        <div className="v-banner-content">
                            <span className="material-symbols-outlined v-icon">shield_lock</span>
                            <div className="v-text">
                                <strong>Activez la double authentification</strong>
                                <p>Elle est requise pour recharger votre portefeuille, payer une facture ou convertir des devises.</p>
                            </div>
                        </div>
                        <button className="v-resend-btn" onClick={() => navigate('/espace-client/profil')}>Activer</button>
                    </div>
                )}

                {/* Hero Section: Ask AI */}
                <section className="sm-hero-section">
                    <div className="sm-hero-blobs">
                        <div className="sm-blob-1"></div>
                        <div className="sm-blob-2"></div>
                    </div>

                    <div className="sm-hero-content">
                        <h1 className="sm-hero-title">What can we help you fix today?</h1>
                        <div className="sm-search-group">
                            <input type="text" className="sm-hero-input" placeholder="Describe the issue (e.g. 'Leaking pipe in master bathroom')" />
                            <button className="sm-ask-ai-btn" onClick={() => navigate('/espace-client/demande')}>
                                <span className="material-symbols-outlined">auto_awesome</span>
                                Ask AI
                            </button>
                        </div>
                        <div className="sm-suggestions">
                            <span className="sm-sug-label">Suggestions:</span>
                            <button className="sm-sug-btn" onClick={() => navigate('/espace-client/demande')}>Plumbing</button>
                            <button className="sm-sug-btn" onClick={() => navigate('/espace-client/demande')}>Electrical</button>
                            <button className="sm-sug-btn" onClick={() => navigate('/espace-client/demande')}>HVAC</button>
                            <button className="sm-sug-btn" onClick={() => navigate('/espace-client/demande')}>Smart Home</button>
                        </div>
                    </div>
                </section>

                {/* Bento Grid */}
                <div className="sm-bento-grid">

                    {/* Left Column: Stats */}
                    <div className="sm-col-stats">
                        <div className="sm-dispatch-card glass-card">
                            <div className="sm-ping-container">
                                <span className="sm-ping-animate"></span>
                                <span className="sm-ping-dot"></span>
                            </div>
                            <p className="sm-dispatch-subtitle">Estimated Dispatch</p>
                            <h3 className="sm-dispatch-time">12 <span>min</span></h3>
                            <p className="sm-dispatch-desc">Top-rated technicians in your zone are currently active.</p>
                            <div className="sm-dispatch-footer">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>
                                Priority Queue Active
                            </div>
                        </div>

                        <div className="sm-summary-stats">
                            <div className="sm-stat-item">
                                <div className="sm-stat-left">
                                    <div className="sm-stat-icon sm-icon-1"><span className="material-symbols-outlined">construction</span></div>
                                    <div>
                                        <p className="sm-stat-name">Interventions actives</p>
                                        <p className="sm-stat-value">{String(activeRequests.length).padStart(2, '0')}</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined" style={{ color: '#cbd5e1' }}>chevron_right</span>
                            </div>

                            <div className="sm-stat-item">
                                <div className="sm-stat-left">
                                    <div className="sm-stat-icon sm-icon-2"><span className="material-symbols-outlined">account_balance_wallet</span></div>
                                    <div>
                                        <p className="sm-stat-name">Escrow en attente</p>
                                        <p className="sm-stat-value">{formatNumber(pendingEscrow)} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>XAF</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="sm-stat-item">
                                <div className="sm-stat-left">
                                    <div className="sm-stat-icon sm-icon-3"><span className="material-symbols-outlined">monitoring</span></div>
                                    <div>
                                        <p className="sm-stat-name">Total dépensé</p>
                                        <p className="sm-stat-value">{formatNumber(lifetimeSpend)} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>XAF</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Map — Client Live Position */}
                    <div className="sm-col-map">
                        <div className="sm-map-container">
                            <ClientLocationMap />
                        </div>
                    </div>

                    {/* Right Column: Status Updates */}
                    <div className="sm-col-status">
                        <div className="sm-status-card">
                            <h4 className="sm-status-title">
                                <span className="material-symbols-outlined" style={{ color: 'var(--ds-secondary)' }}>history</span>
                                Status Updates
                            </h4>

                            <div className="sm-timeline">
                                <div className="sm-timeline-line"></div>

                                {requests.length === 0 ? (
                                    <EmptyState icon="history" title="Aucune activité" message="Vos demandes apparaîtront ici." />
                                ) : (
                                    requests.slice(0, 4).map((r: any, i: number) => (
                                        <div key={r.id} className="sm-tl-item">
                                            <div className={`sm-tl-dot sm-dot-${(i % 3) + 1}`}></div>
                                            <div className="sm-tl-content">
                                                <p className="sm-tl-title" style={{ textTransform: 'capitalize' }}>{String(r.status).replace(/_/g, ' ')}</p>
                                                <p className="sm-tl-desc">{r.title}</p>
                                                <p className="sm-tl-time">{new Date(r.created_at).toLocaleDateString('fr-FR')}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <button className="sm-status-btn-full" onClick={() => navigate('/espace-client/notifications')}>Full Activity Log</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Active Jobs */}
                <section className="sm-jobs-section">
                    <div className="sm-jobs-header">
                        <h2 className="sm-jobs-title">Active Jobs</h2>
                        <button className="sm-jobs-link" onClick={() => navigate('/espace-client/factures')}>Mes Factures</button>
                    </div>

                    <div className="sm-jobs-grid">
                        {activeRequests.length === 0 ? (
                            <EmptyState icon="construction" title="Aucune intervention active" message="Créez une demande pour démarrer." />
                        ) : (
                            activeRequests.slice(0, 6).map((r: any) => (
                                <div key={r.id} className="sm-job-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/espace-client/suivi')}>
                                    <div className="sm-job-left">
                                        <div className="sm-job-tags">
                                            <span className="sm-job-badge sm-badge-secondary" style={{ textTransform: 'capitalize' }}>{String(r.status).replace(/_/g, ' ')}</span>
                                            <span className="sm-job-id">#{String(r.id).slice(0, 6)}</span>
                                        </div>
                                        <h3 className="sm-job-name">{r.title}</h3>
                                        <div className="sm-job-meta">
                                            <span><span className="material-symbols-outlined text-[14px]">calendar_today</span> {new Date(r.created_at).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Floating Action Button (FAB) */}
            <button className="sm-fab" onClick={() => navigate('/espace-client/demande')}>
                <span className="material-symbols-outlined">add</span>
            </button>

            {/* Email Verified Confirmation Modal */}
            {showVerifiedModal && (
                <div className="verified-modal-overlay" onClick={dismissVerifiedModal}>
                    <div className="verified-modal glass-card" onClick={e => e.stopPropagation()}>
                        <div className="verified-modal-icon">
                            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--ds-primary)', fontVariationSettings: "'FILL' 1" }}>
                                verified
                            </span>
                        </div>
                        <h3 style={{ margin: '16px 0 8px', fontSize: '1.25rem', fontWeight: 600 }}>E-mail verifie !</h3>
                        <p style={{ color: 'var(--ds-on-surface-variant)', marginBottom: '24px', fontSize: '0.9rem' }}>
                            Votre adresse e-mail a ete confirmee avec succes. Toutes les fonctionnalites sont maintenant accessibles.
                        </p>
                        <button
                            className="btn-primary"
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.95rem' }}
                            onClick={dismissVerifiedModal}
                        >
                            Continuer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDashboardModern;
