import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobTracking, getQuotesForRequest, acceptQuote, rejectQuote, type Quote } from '../../services/operationsService';
import './JobTracking.css';

interface TrackingData {
    job_id: string;
    status: string;
    phases: { title: string; status: string; notes?: string }[] | null;
    route: any;
    estimated_travel_seconds: number | null;
    started_at: string | null;
    completed_at: string | null;
    technician: { id: string; name: string };
}

const JobTracking: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const [tracking, setTracking] = useState<TrackingData | null>(null);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchTracking();
        const interval = setInterval(fetchTracking, 10000);
        return () => clearInterval(interval);
    }, [jobId]);

    const fetchTracking = async () => {
        if (!jobId) return;
        try {
            const data = await getJobTracking(jobId);
            setTracking(data);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptQuote = async (quoteId: string) => {
        setActionLoading(true);
        try {
            await acceptQuote(quoteId);
            if (requestId) {
                const q = await getQuotesForRequest(requestId);
                setQuotes(q);
            }
        } catch {
            // silent
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectQuote = async (quoteId: string) => {
        setActionLoading(true);
        try {
            await rejectQuote(quoteId);
            if (requestId) {
                const q = await getQuotesForRequest(requestId);
                setQuotes(q);
            }
        } catch {
            // silent
        } finally {
            setActionLoading(false);
        }
    };

    const statusLabels: Record<string, { label: string; icon: string; color: string }> = {
        pending: { label: 'En attente', icon: 'schedule', color: '#64748b' },
        en_route: { label: 'En route vers vous', icon: 'directions_car', color: '#2563eb' },
        arrived: { label: 'Arrive sur place', icon: 'location_on', color: '#7c3aed' },
        in_progress: { label: 'Travaux en cours', icon: 'construction', color: '#d97706' },
        completed: { label: 'Intervention terminee', icon: 'check_circle', color: '#16a34a' },
        cancelled: { label: 'Annulee', icon: 'cancel', color: '#dc2626' },
    };

    if (loading) {
        return <div className="jt-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>Chargement du suivi...</div>;
    }

    if (!tracking) {
        return (
            <div className="jt-page">
                <div className="jt-empty">
                    <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#cbd5e1' }}>search_off</span>
                    <p>Suivi non disponible.</p>
                    <button className="jt-btn-back" onClick={() => navigate(-1)}>Retour</button>
                </div>
            </div>
        );
    }

    const currentStatus = statusLabels[tracking.status] || statusLabels.pending;
    const phases = tracking.phases || [];
    const completedPhases = phases.filter(p => p.status === 'completed').length;
    const progressPercent = phases.length > 0 ? Math.round((completedPhases / phases.length) * 100) : 0;

    return (
        <div className="jt-page">
            <div className="jt-header">
                <button className="jt-back-btn" onClick={() => navigate(-1)}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="jt-title">Suivi en direct</h1>
            </div>

            {/* Status banner */}
            <div className="jt-status-banner" style={{ borderLeftColor: currentStatus.color }}>
                <span className="material-symbols-outlined" style={{ color: currentStatus.color, fontSize: '2rem' }}>
                    {currentStatus.icon}
                </span>
                <div>
                    <h2 className="jt-status-label">{currentStatus.label}</h2>
                    <p className="jt-tech-name">Technicien: {tracking.technician.name}</p>
                    {tracking.estimated_travel_seconds && tracking.status === 'en_route' && (
                        <p className="jt-eta">Arrivee estimee: ~{Math.round(tracking.estimated_travel_seconds / 60)} min</p>
                    )}
                </div>
            </div>

            {/* Timeline */}
            <div className="jt-card">
                <h3 className="jt-card-title">
                    <span className="material-symbols-outlined">timeline</span>
                    Progression
                </h3>
                <div className="jt-timeline">
                    {['pending', 'en_route', 'arrived', 'in_progress', 'completed'].map((step, i) => {
                        const steps = ['pending', 'en_route', 'arrived', 'in_progress', 'completed'];
                        const currentIdx = steps.indexOf(tracking.status);
                        const isDone = i <= currentIdx;
                        const isCurrent = i === currentIdx;
                        const stepLabel = statusLabels[step];
                        return (
                            <div key={step} className={`jt-timeline-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                                <div className="jt-timeline-dot" style={isDone ? { background: stepLabel.color, borderColor: stepLabel.color } : {}}>
                                    {isDone && <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#fff' }}>check</span>}
                                </div>
                                <span className="jt-timeline-label">{stepLabel.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Phases de travail */}
            {phases.length > 0 && (
                <div className="jt-card">
                    <h3 className="jt-card-title">
                        <span className="material-symbols-outlined">checklist</span>
                        Phases de travail ({completedPhases}/{phases.length})
                    </h3>
                    <div className="jt-progress-bar">
                        <div className="jt-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="jt-phases">
                        {phases.map((phase, i) => (
                            <div key={i} className={`jt-phase jt-phase-${phase.status}`}>
                                <span className="material-symbols-outlined">
                                    {phase.status === 'completed' ? 'check_circle' : phase.status === 'in_progress' ? 'pending' : 'radio_button_unchecked'}
                                </span>
                                <span>{phase.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quotes to review */}
            {quotes.filter(q => q.status === 'sent').length > 0 && (
                <div className="jt-card">
                    <h3 className="jt-card-title">
                        <span className="material-symbols-outlined">receipt_long</span>
                        Devis a valider
                    </h3>
                    {quotes.filter(q => q.status === 'sent').map((q) => (
                        <div key={q.id} className="jt-quote-review">
                            <div className="jt-quote-amount">{Number(q.total_amount).toLocaleString()} XAF</div>
                            {q.breakdown && (
                                <div className="jt-quote-breakdown">
                                    {q.breakdown.map((b, i) => (
                                        <div key={i} className="jt-breakdown-line">
                                            <span>{b.label}</span>
                                            <span>{Number(b.amount).toLocaleString()} XAF</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="jt-quote-actions">
                                <button className="jt-btn-reject" onClick={() => handleRejectQuote(q.id)} disabled={actionLoading}>
                                    Refuser
                                </button>
                                <button className="jt-btn-accept" onClick={() => handleAcceptQuote(q.id)} disabled={actionLoading}>
                                    Accepter le devis
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Completion info */}
            {tracking.status === 'completed' && (
                <div className="jt-completed">
                    <span className="material-symbols-outlined">verified</span>
                    <h3>Intervention terminee !</h3>
                    <p>Le technicien a termine l'intervention le {tracking.completed_at ? new Date(tracking.completed_at).toLocaleDateString('fr-FR') : '-'}.</p>
                </div>
            )}
        </div>
    );
};

export default JobTracking;
