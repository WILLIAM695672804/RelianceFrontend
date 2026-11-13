import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { updateJobStatus, getQuotesForRequest, createJob, type TechnicianJob, type Quote } from '../../services/operationsService';
import matchingService from '../../services/matchingService';
import DiagnosticFee from '../../components/finance/DiagnosticFee';
import './MissionDetail.css';

const MissionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [mission, setMission] = useState<any>(null);
    const [job, setJob] = useState<TechnicianJob | null>(null);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // Get active mission data
            const missionData = await matchingService.getActiveMission();
            setMission(missionData.data);

            const requestId = missionData.data?.request?.id || id;
            if (requestId) {
                const q = await getQuotesForRequest(requestId);
                setQuotes(q);
            }

            // Try to get or create job
            if (missionData.data?.job) {
                setJob(missionData.data.job);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = async () => {
        if (!mission?.request?.id) return;
        try {
            const newJob = await createJob({ request_id: mission.request.id });
            setJob(newJob);
        } catch {
            // silent
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!job) return;
        setStatusUpdating(true);
        try {
            const updated = await updateJobStatus(job.id, { status: newStatus });
            setJob(updated);
        } catch {
            // silent
        } finally {
            setStatusUpdating(false);
        }
    };

    const statusFlow: Record<string, { next: string; label: string; icon: string }> = {
        pending: { next: 'en_route', label: 'Demarrer le trajet', icon: 'directions_car' },
        en_route: { next: 'arrived', label: 'Je suis arrive', icon: 'location_on' },
        arrived: { next: 'in_progress', label: 'Commencer les travaux', icon: 'construction' },
        in_progress: { next: 'completed', label: 'Terminer la mission', icon: 'check_circle' },
    };

    const statusLabels: Record<string, { label: string; cls: string }> = {
        pending: { label: 'En attente', cls: 'md-status-pending' },
        en_route: { label: 'En route', cls: 'md-status-enroute' },
        arrived: { label: 'Sur place', cls: 'md-status-arrived' },
        in_progress: { label: 'En cours', cls: 'md-status-progress' },
        completed: { label: 'Terminee', cls: 'md-status-completed' },
        cancelled: { label: 'Annulee', cls: 'md-status-cancelled' },
    };

    if (loading) {
        return <div className="md-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>Chargement...</div>;
    }

    const request = mission?.request;
    const currentStatus = job ? statusLabels[job.status] : null;
    const nextAction = job ? statusFlow[job.status] : null;

    return (
        <div className="md-page">
            {/* Header */}
            <div className="md-header">
                <button className="md-back-btn" onClick={() => navigate('/technicien/dashboard')}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="md-header-info">
                    <h1 className="md-title">{request?.title || 'Detail Mission'}</h1>
                    <p className="md-subtitle">{request?.category || 'Intervention technique'}</p>
                </div>
                {currentStatus && (
                    <span className={`md-status-pill ${currentStatus.cls}`}>{currentStatus.label}</span>
                )}
            </div>

            <div className="md-grid">
                {/* Left: Mission info */}
                <div className="md-main">
                    {/* Request details */}
                    <div className="md-card">
                        <h3 className="md-card-title">
                            <span className="material-symbols-outlined">description</span>
                            Details de la demande
                        </h3>
                        <p className="md-description">{request?.description || 'Aucune description'}</p>
                        <div className="md-meta-grid">
                            <div className="md-meta-item">
                                <span className="material-symbols-outlined">calendar_today</span>
                                <span>{request?.created_at ? new Date(request.created_at).toLocaleDateString('fr-FR') : '-'}</span>
                            </div>
                            <div className="md-meta-item">
                                <span className="material-symbols-outlined">person</span>
                                <span>{mission?.client?.name || 'Client'}</span>
                            </div>
                            {mission?.address && (
                                <div className="md-meta-item">
                                    <span className="material-symbols-outlined">location_on</span>
                                    <span>{mission.address.address}, {mission.address.city}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Job workflow */}
                    <div className="md-card">
                        <h3 className="md-card-title">
                            <span className="material-symbols-outlined">timeline</span>
                            Suivi d'intervention
                        </h3>

                        {!job ? (
                            <div className="md-no-job">
                                <p>Aucun job cree pour cette mission.</p>
                                <button className="md-btn-primary" onClick={handleCreateJob}>
                                    <span className="material-symbols-outlined">add_task</span>
                                    Demarrer l'intervention
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Status timeline */}
                                <div className="md-timeline">
                                    {['pending', 'en_route', 'arrived', 'in_progress', 'completed'].map((step, i) => {
                                        const steps = ['pending', 'en_route', 'arrived', 'in_progress', 'completed'];
                                        const currentIdx = steps.indexOf(job.status);
                                        const isDone = i <= currentIdx;
                                        const isCurrent = i === currentIdx;
                                        return (
                                            <div key={step} className={`md-timeline-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                                                <div className="md-timeline-dot">
                                                    {isDone && <span className="material-symbols-outlined">check</span>}
                                                </div>
                                                <span className="md-timeline-label">{statusLabels[step]?.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Phases */}
                                {job.phases && job.phases.length > 0 && (
                                    <div className="md-phases">
                                        <h4>Phases de travail</h4>
                                        {job.phases.map((phase, i) => (
                                            <div key={i} className={`md-phase-item md-phase-${phase.status}`}>
                                                <span className="material-symbols-outlined">
                                                    {phase.status === 'completed' ? 'check_circle' : phase.status === 'in_progress' ? 'pending' : 'radio_button_unchecked'}
                                                </span>
                                                <span>{phase.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Next action */}
                                {nextAction && job.status !== 'completed' && (
                                    <button
                                        className="md-btn-primary md-btn-full"
                                        onClick={() => handleStatusChange(nextAction.next)}
                                        disabled={statusUpdating}
                                    >
                                        <span className="material-symbols-outlined">{nextAction.icon}</span>
                                        {statusUpdating ? 'Mise a jour...' : nextAction.label}
                                    </button>
                                )}

                                {job.status === 'in_progress' && (
                                    <Link to={`/technicien/mission/${id}/travaux`} className="md-btn-secondary md-btn-full">
                                        <span className="material-symbols-outlined">build</span>
                                        Gerer les phases de travail
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="md-sidebar">
                    {request?.id && job && <DiagnosticFee requestId={request.id} role="technicien" />}
                    {/* Quick actions */}
                    <div className="md-card">
                        <h3 className="md-card-title">
                            <span className="material-symbols-outlined">bolt</span>
                            Actions rapides
                        </h3>
                        <div className="md-actions-list">
                            <Link to={`/technicien/mission/${id}/devis`} className="md-action-link">
                                <span className="material-symbols-outlined">receipt_long</span>
                                Editer un devis
                            </Link>
                            <Link to="/technicien/cockpit" className="md-action-link">
                                <span className="material-symbols-outlined">navigation</span>
                                Navigation GPS
                            </Link>
                        </div>
                    </div>

                    {/* Quotes summary */}
                    <div className="md-card">
                        <h3 className="md-card-title">
                            <span className="material-symbols-outlined">receipt_long</span>
                            Devis ({quotes.length})
                        </h3>
                        {quotes.length === 0 ? (
                            <p className="md-empty-text">Aucun devis</p>
                        ) : (
                            <div className="md-quotes-summary">
                                {quotes.map((q) => (
                                    <div key={q.id} className="md-quote-mini">
                                        <span className={`qe-status-badge ${q.status === 'accepted' ? 'qe-status-accepted' : q.status === 'sent' ? 'qe-status-sent' : 'qe-status-draft'}`}>
                                            {q.status}
                                        </span>
                                        <span className="md-quote-mini-amount">{Number(q.total_amount).toLocaleString()} XAF</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionDetail;
