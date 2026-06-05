import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteMap from '../../components/maps/RouteMap';
import matchingService from '../../services/matchingService';
import { useChat } from '../../context/ChatContext';
import { createJob, updateJobStatus, type TechnicianJob } from '../../services/operationsService';
import './Cockpit.css';

// Flux de statut d'intervention (identique a MissionDetail) : un cran a la fois.
const STATUS_FLOW: Record<string, { next: string; label: string; icon: string }> = {
    pending: { next: 'en_route', label: 'Démarrer le trajet', icon: 'directions_car' },
    en_route: { next: 'arrived', label: 'Je suis arrivé', icon: 'location_on' },
    arrived: { next: 'in_progress', label: 'Commencer les travaux', icon: 'construction' },
    in_progress: { next: 'completed', label: 'Terminer la mission', icon: 'check_circle' },
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'En attente',
    en_route: 'En route',
    arrived: 'Sur place',
    in_progress: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée',
};

const STATUS_STEPS = ['pending', 'en_route', 'arrived', 'in_progress', 'completed'];

interface ActiveMission {
    proposal_id: string;
    price: number;
    accepted_at: string;
    job: {
        id: string;
        status: string;
        phases: TechnicianJob['phases'];
        started_at: string | null;
    } | null;
    request: {
        id: string;
        title: string;
        description: string;
        status: string;
        photos: string[] | null;
        category: string | null;
    };
    client: {
        id: string;
        name: string;
        phone: string;
        avatar: string | null;
    };
    address: {
        label: string;
        city: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
    } | null;
}

const Cockpit: React.FC = () => {
    const navigate = useNavigate();
    const { openChat, conversation } = useChat();
    const [mission, setMission] = useState<ActiveMission | null>(null);
    const [loading, setLoading] = useState(true);
    const [myPosition, setMyPosition] = useState<{ latitude: number; longitude: number } | null>(null);
    const [statusUpdating, setStatusUpdating] = useState(false);

    // Fetch active mission
    useEffect(() => {
        const fetchMission = async () => {
            try {
                const res = await matchingService.getActiveMission();
                setMission(res.data);
            } catch { /* silent */ }
            finally { setLoading(false); }
        };
        fetchMission();
    }, []);

    // Demarrer le suivi d'intervention (cree un job en statut "pending").
    const handleStartJob = useCallback(async () => {
        if (!mission || statusUpdating) return;
        setStatusUpdating(true);
        try {
            const job = await createJob({ request_id: mission.request.id });
            setMission((prev) => prev ? { ...prev, job: { id: job.id, status: job.status, phases: job.phases, started_at: job.started_at } } : prev);
        } catch { /* silent */ }
        finally { setStatusUpdating(false); }
    }, [mission, statusUpdating]);

    // Faire avancer le statut d'un cran (pending -> en_route -> arrived -> ...).
    const handleAdvanceStatus = useCallback(async (nextStatus: string) => {
        if (!mission?.job || statusUpdating) return;
        setStatusUpdating(true);
        try {
            const updated = await updateJobStatus(mission.job.id, { status: nextStatus });
            setMission((prev) => prev && prev.job ? { ...prev, job: { ...prev.job, status: updated.status, phases: updated.phases, started_at: updated.started_at } } : prev);
        } catch { /* silent */ }
        finally { setStatusUpdating(false); }
    }, [mission, statusUpdating]);

    // Geolocation + send position to backend
    const sendPosition = useCallback(async (lat: number, lng: number) => {
        try {
            await matchingService.updatePosition(lat, lng);
        } catch { /* silent */ }
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setMyPosition({ latitude: lat, longitude: lng });
                sendPosition(lat, lng);
            },
            () => {},
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [sendPosition]);

    if (loading) {
        return (
            <div className="tech-cockpit-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--tech-primary)', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!mission) {
        return (
            <div className="tech-cockpit-page">
                <section className="tech-cockpit-grid">
                    <div className="tech-cockpit-main">
                        <div className="tech-cockpit-hero">
                            <div>
                                <p className="tech-hero-subtitle">Cockpit</p>
                                <h2 className="tech-hero-title">Aucune mission active</h2>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--tech-on-surface-variant)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '64px', opacity: 0.3 }}>work_off</span>
                            <p style={{ marginTop: '1rem', fontSize: '1rem' }}>Vous n'avez pas de mission en cours.</p>
                            <button
                                onClick={() => navigate('/technicien/radar')}
                                style={{
                                    marginTop: '1.5rem', padding: '0.75rem 2rem',
                                    background: 'var(--tech-primary)', color: '#fff',
                                    border: 'none', borderRadius: '12px',
                                    fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                                }}
                            >
                                Voir les propositions
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    const clientAddress = mission.address;
    const clientPosition = clientAddress?.latitude && clientAddress?.longitude
        ? { latitude: clientAddress.latitude, longitude: clientAddress.longitude }
        : null;
    const acceptedDate = new Date(mission.accepted_at);

    return (
        <div className="tech-cockpit-page">
            <section className="tech-cockpit-grid">
                {/* Left Column */}
                <div className="tech-cockpit-main">
                    <div className="tech-cockpit-hero">
                        <div>
                            <p className="tech-hero-subtitle">Mission active</p>
                            <h2 className="tech-hero-title">{mission.request.title}</h2>
                        </div>
                        <div className="tech-hero-stats">
                            <div className="tech-stat-box">
                                <p>Acceptée</p>
                                <p className="stat-value primary">{acceptedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="tech-stat-box">
                                <p>Prix</p>
                                <p className="stat-value tertiary">{Number(mission.price).toLocaleString()} XAF</p>
                            </div>
                        </div>
                    </div>

                    {/* Client info card */}
                    <div className="tech-earnings-bento">
                        <div className="tech-earnings-bg-circle"></div>
                        <div className="tech-bento-content">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <img
                                    src={mission.client.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mission.client.name)}&background=0f172a&color=fff&size=64`}
                                    alt={mission.client.name}
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }}
                                />
                                <div>
                                    <h3 style={{ margin: 0 }}>{mission.client.name}</h3>
                                    <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>Client</p>
                                </div>
                            </div>
                            <div className="tech-bento-footer">
                                <p>{mission.client.phone ?? 'Téléphone non renseigné'}</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={openChat}
                                        disabled={!conversation}
                                        title={conversation ? 'Ouvrir la messagerie' : 'Messagerie en cours de préparation...'}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', opacity: conversation ? 1 : 0.5, cursor: conversation ? 'pointer' : 'not-allowed' }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>chat</span>
                                        Message
                                    </button>
                                    {mission.client.phone && (
                                        <a href={`tel:${mission.client.phone}`} style={{ textDecoration: 'none' }}>
                                            <button>Appeler</button>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description + Address */}
                    <div className="tech-opportunities-grid">
                        <div className="tech-opp-card">
                            <div className="tech-opp-header">
                                <div className="tech-opp-icon">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                {mission.request.category && <span className="tech-opp-badge">{mission.request.category.toUpperCase()}</span>}
                            </div>
                            <h4>Description</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5 }}>{mission.request.description}</p>
                        </div>
                        <div className="tech-opp-card">
                            <div className="tech-opp-header">
                                <div className="tech-opp-icon">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                            </div>
                            <h4>Adresse du client</h4>
                            <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>{clientAddress?.address ?? clientAddress?.label ?? '—'}</p>
                            <div className="tech-opp-footer">
                                <p className="tech-opp-price">{clientAddress?.city ?? 'Cameroun'}</p>
                                <span className="material-symbols-outlined">chevron_right</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Route Map */}
                <div className="tech-cockpit-sidebar">
                    <div className="tech-journey-card">
                        <div className="tech-journey-header">
                            <h3>Itinéraire en direct</h3>
                        </div>
                        <div className="tech-journey-map" style={{ height: '350px' }}>
                            <RouteMap
                                origin={myPosition}
                                destination={clientPosition}
                                originLabel="Vous"
                                destinationLabel={mission.client.name.split(' ')[0]}
                                originType="technician"
                            />
                        </div>
                        <div className="tech-journey-info">
                            <span className="tech-journey-badge">En cours</span>
                            <h4>{mission.request.title}</h4>
                            <p className="tech-layer-client">Client : {mission.client.name}</p>

                            <div className="tech-journey-details">
                                <div className="tech-detail-row">
                                    <span className="material-symbols-outlined icon-faded">payments</span>
                                    <div>
                                        <p className="detail-label">Montant</p>
                                        <p className="detail-value">{Number(mission.price).toLocaleString()} XAF</p>
                                    </div>
                                </div>
                                <div className="tech-detail-row">
                                    <span className="material-symbols-outlined icon-faded">schedule</span>
                                    <div>
                                        <p className="detail-label">Acceptée à</p>
                                        <p className="detail-value">{acceptedDate.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Suivi du statut d'intervention — etape par etape */}
                            {mission.job && (
                                <div className="tech-status-timeline">
                                    {STATUS_STEPS.map((step) => {
                                        const idx = STATUS_STEPS.indexOf(step);
                                        const currentIdx = STATUS_STEPS.indexOf(mission.job!.status);
                                        const done = idx <= currentIdx;
                                        return (
                                            <div key={step} className={`tech-status-step ${done ? 'done' : ''} ${idx === currentIdx ? 'current' : ''}`}>
                                                <span className="tech-status-dot">
                                                    {done && <span className="material-symbols-outlined">check</span>}
                                                </span>
                                                <span className="tech-status-label">{STATUS_LABELS[step]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="tech-journey-actions">
                                {!mission.job ? (
                                    <button className="tech-btn-complete" onClick={handleStartJob} disabled={statusUpdating}>
                                        <span>{statusUpdating ? 'Démarrage...' : "Démarrer l'intervention"}</span>
                                        <span className="material-symbols-outlined">add_task</span>
                                    </button>
                                ) : STATUS_FLOW[mission.job.status] ? (
                                    <button
                                        className="tech-btn-complete"
                                        onClick={() => handleAdvanceStatus(STATUS_FLOW[mission.job!.status].next)}
                                        disabled={statusUpdating}
                                    >
                                        <span>{statusUpdating ? 'Mise à jour...' : STATUS_FLOW[mission.job.status].label}</span>
                                        <span className="material-symbols-outlined">{STATUS_FLOW[mission.job.status].icon}</span>
                                    </button>
                                ) : (
                                    <button className="tech-btn-complete" disabled style={{ opacity: 0.7 }}>
                                        <span>Mission terminée</span>
                                        <span className="material-symbols-outlined">verified</span>
                                    </button>
                                )}

                                {mission.job?.status === 'in_progress' && (
                                    <button className="tech-btn-delay" onClick={() => navigate(`/technicien/mission/${mission.request.id}/travaux`)}>
                                        Gérer les phases de travail
                                    </button>
                                )}
                                <button className="tech-btn-delay" onClick={() => navigate('/technicien/litiges')}>Signaler un problème</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Cockpit;
