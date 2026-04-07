import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import ClientLocationMap from '../../components/maps/ClientLocationMap';
import './ClientDashboardModern.css';

const ClientDashboardModern: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    const [resendStatus, setResendStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [showVerifiedModal, setShowVerifiedModal] = React.useState(searchParams.get('verified') === '1');

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
        } catch (error) {
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
                            <button className="sm-ask-ai-btn">
                                <span className="material-symbols-outlined">auto_awesome</span>
                                Ask AI
                            </button>
                        </div>
                        <div className="sm-suggestions">
                            <span className="sm-sug-label">Suggestions:</span>
                            <button className="sm-sug-btn">Plumbing</button>
                            <button className="sm-sug-btn">Electrical</button>
                            <button className="sm-sug-btn">HVAC</button>
                            <button className="sm-sug-btn">Smart Home</button>
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
                                        <p className="sm-stat-name">Active Interventions</p>
                                        <p className="sm-stat-value">02</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined" style={{ color: '#cbd5e1' }}>chevron_right</span>
                            </div>

                            <div className="sm-stat-item">
                                <div className="sm-stat-left">
                                    <div className="sm-stat-icon sm-icon-2"><span className="material-symbols-outlined">account_balance_wallet</span></div>
                                    <div>
                                        <p className="sm-stat-name">Pending Escrow</p>
                                        <p className="sm-stat-value">45,500 <span style={{ fontSize: '0.75rem', color: '#64748b' }}>XAF</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="sm-stat-item">
                                <div className="sm-stat-left">
                                    <div className="sm-stat-icon sm-icon-3"><span className="material-symbols-outlined">monitoring</span></div>
                                    <div>
                                        <p className="sm-stat-name">Lifetime Spend</p>
                                        <p className="sm-stat-value">820,000 <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal' }}>XAF</span></p>
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

                                <div className="sm-tl-item">
                                    <div className="sm-tl-dot sm-dot-1"></div>
                                    <div className="sm-tl-content">
                                        <p className="sm-tl-title">Job Completed</p>
                                        <p className="sm-tl-desc">Central AC Unit repaired successfully by Jean-Marc T.</p>
                                        <p className="sm-tl-time">Today, 11:45 AM</p>
                                    </div>
                                </div>

                                <div className="sm-tl-item">
                                    <div className="sm-tl-dot sm-dot-2"></div>
                                    <div className="sm-tl-content">
                                        <p className="sm-tl-title">Technician En-route</p>
                                        <p className="sm-tl-desc">Samuel O. is traveling to your location in Bastos.</p>
                                        <p className="sm-tl-time">Today, 09:30 AM</p>
                                    </div>
                                </div>

                                <div className="sm-tl-item sm-disabled">
                                    <div className="sm-tl-dot sm-dot-3"></div>
                                    <div className="sm-tl-content">
                                        <p className="sm-tl-title">Inspection Scheduled</p>
                                        <p className="sm-tl-desc">Pre-inspection for roof renovation booked for Tomorrow.</p>
                                        <p className="sm-tl-time">Yesterday, 04:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <button className="sm-status-btn-full">Full Activity Log</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Active Jobs */}
                <section className="sm-jobs-section">
                    <div className="sm-jobs-header">
                        <h2 className="sm-jobs-title">Active Jobs</h2>
                        <button className="sm-jobs-link">View All Requests</button>
                    </div>

                    <div className="sm-jobs-grid">

                        {/* Job 1 */}
                        <div className="sm-job-card">
                            <div className="sm-job-left">
                                <div className="sm-job-tags">
                                    <span className="sm-job-badge sm-badge-secondary">In Progress</span>
                                    <span className="sm-job-id">#REL-89231</span>
                                </div>
                                <h3 className="sm-job-name">Main Board Replacement</h3>
                                <div className="sm-job-meta">
                                    <span><span className="material-symbols-outlined text-[14px]">schedule</span> 45m left</span>
                                    <span><span className="material-symbols-outlined text-[14px]">location_on</span> Bastos Residence</span>
                                </div>
                            </div>
                            <div className="sm-job-right">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maker" alt="Samuel O." className="sm-assignee-avatar" />
                                <div className="sm-assignee-info">
                                    <p className="sm-assignee-name">Samuel O.</p>
                                    <p className="sm-assignee-role">Master Electrician</p>
                                </div>
                            </div>
                        </div>

                        {/* Job 2 */}
                        <div className="sm-job-card">
                            <div className="sm-job-left">
                                <div className="sm-job-tags">
                                    <span className="sm-job-badge sm-badge-tertiary">Arrival Impending</span>
                                    <span className="sm-job-id">#REL-89245</span>
                                </div>
                                <h3 className="sm-job-name">Kitchen Sink Leak</h3>
                                <div className="sm-job-meta">
                                    <span><span className="material-symbols-outlined text-[14px]">schedule</span> 5m left</span>
                                    <span><span className="material-symbols-outlined text-[14px]">location_on</span> Mvan Office</span>
                                </div>
                            </div>
                            <div className="sm-job-right">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maker" alt="Fiona K." className="sm-assignee-avatar" />
                                <div className="sm-assignee-info">
                                    <p className="sm-assignee-name">Fiona K.</p>
                                    <p className="sm-assignee-role">Plumbing Specialist</p>
                                </div>
                            </div>
                        </div>

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
