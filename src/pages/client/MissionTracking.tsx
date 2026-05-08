import React, { useState, useEffect, useCallback } from 'react';
import matchingService from '../../services/matchingService';
import RouteMap from '../../components/maps/RouteMap';
import ReviewModal from '../../components/reviews/ReviewModal';
import { useChat } from '../../context/ChatContext';
import { useProposalChannel } from '../../hooks/useProposalChannel';
import { useTrackingChannel } from '../../hooks/useTrackingChannel';
import './MissionTracking.css';

interface MissionData {
    job_id: string | null;
    request: {
        id: string;
        title: string;
        description: string;
        status: string;
        category: string | null;
        created_at: string;
    };
    address: {
        label: string;
        city: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
    } | null;
    proposal: {
        id: string;
        price: number;
        status: string;
    } | null;
    technician: {
        id: string;
        name: string;
        phone: string;
        avatar: string | null;
        rating: number;
        num_reviews: number;
    } | null;
}

const MissionTracking: React.FC = () => {
    const [mission, setMission] = useState<MissionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [myPosition, setMyPosition] = useState<{ latitude: number; longitude: number } | null>(null);
    const [techPosition, setTechPosition] = useState<{ latitude: number; longitude: number } | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const { openChat } = useChat();

    // Fetch mission data
    useEffect(() => {
        const fetchMission = async () => {
            try {
                const res = await matchingService.getClientActiveMission();
                setMission(res.data);
            } catch { /* silent */ }
            finally { setLoading(false); }
        };
        fetchMission();
    }, []);

    // Real-time updates for proposal status changes
    useProposalChannel({
        onProposalAccepted: () => {
            matchingService.getClientActiveMission().then(res => setMission(res.data)).catch(() => {});
        },
        onProposalRefused: () => {
            matchingService.getClientActiveMission().then(res => setMission(res.data)).catch(() => {});
        },
    });

    // Client geolocation
    useEffect(() => {
        if (!navigator.geolocation) return;
        const watchId = navigator.geolocation.watchPosition(
            (pos) => setMyPosition({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            () => {},
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Initial fetch of technician position
    useEffect(() => {
        const fetchInitialPosition = async () => {
            try {
                const res = await matchingService.getTechnicianPosition();
                if (res.data) {
                    setTechPosition({ latitude: res.data.latitude, longitude: res.data.longitude });
                }
            } catch { /* silent */ }
        };
        fetchInitialPosition();
    }, []);

    // Real-time position updates via WebSocket
    useTrackingChannel({
        jobId: mission?.job_id ?? undefined,
        onPositionUpdated: (data) => {
            setTechPosition({ latitude: data.latitude, longitude: data.longitude });
        },
    });

    const getStatusLabel = () => {
        if (!mission) return '';
        if (mission.proposal?.status === 'accepted' || mission.request.status === 'assigned') return 'Technicien assigné';
        if (mission.proposal?.status === 'pending') return 'En attente de réponse';
        return 'Mission en cours';
    };

    const getStatusStep = () => {
        if (!mission) return 0;
        if (mission.proposal?.status === 'pending') return 1;
        if (mission.proposal?.status === 'accepted') return 2;
        return 1;
    };

    if (loading) {
        return (
            <div className="mt-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                    <p style={{ marginTop: '1rem' }}>Chargement de votre mission...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    if (!mission) {
        return (
            <div className="mt-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>search_off</span>
                    <p style={{ marginTop: '1rem' }}>Aucune mission active pour le moment.</p>
                </div>
            </div>
        );
    }

    const step = getStatusStep();
    const tech = mission.technician;

    return (
        <div className="mt-page">
            {/* Background Map Layer with Route */}
            <div className="mt-map-layer">
                <RouteMap
                    origin={myPosition}
                    destination={techPosition}
                    originLabel="Vous"
                    destinationLabel={tech?.name.split(' ')[0] ?? 'Technicien'}
                    originType="client"
                />
            </div>

            {/* Left Info Panel */}
            <div className="mt-left-panel">

                    {/* Status Card */}
                    <div className="mt-glass-card">
                        <div className="mt-card-header">
                            <span className="mt-mission-id">Mission #{mission.request.id.substring(0, 8).toUpperCase()}</span>
                            <div className="mt-live-badge">{mission.proposal?.status === 'accepted' ? 'ASSIGNÉ' : 'EN ATTENTE'}</div>
                        </div>
                        <h1 className="mt-main-title">{getStatusLabel()}</h1>
                        <p className="mt-subtitle">{mission.request.title}</p>

                        {/* ETA Wrapper */}
                        <div className="mt-eta-wrapper">
                            <div className="mt-eta-icon">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <div className="mt-eta-details">
                                <p className="mt-eta-label">Prix estimé</p>
                                <p className="mt-eta-time">{mission.proposal ? `${Number(mission.proposal.price).toLocaleString()} XAF` : '—'}</p>
                            </div>
                            <div className="mt-eta-countdown">
                                <p className="mt-eta-label text-right">Catégorie</p>
                                <p className="mt-eta-min">{mission.request.category ?? '—'}</p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="mt-timeline">
                            <div className={`mt-timeline-step ${step >= 1 ? 'completed' : 'pending'}`}>
                                <div className="mt-step-icon"><span className="material-symbols-outlined">check</span></div>
                                <div className="mt-step-info">
                                    <p className="mt-step-title">Demande envoyée</p>
                                    <p className="mt-step-time">{new Date(mission.request.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                            <div className={`mt-timeline-step ${step >= 2 ? 'completed' : step === 1 ? 'active' : 'pending'}`}>
                                <div className={`mt-step-icon ${step === 1 ? 'pulse' : ''}`}><span className="material-symbols-outlined">{step >= 2 ? 'check' : 'hourglass_top'}</span></div>
                                <div className="mt-step-info">
                                    <p className="mt-step-title">{step >= 2 ? 'Technicien a accepté' : 'En attente de réponse'}</p>
                                    {tech && step < 2 && <p className="mt-step-desc">Proposition envoyée à {tech.name}</p>}
                                </div>
                            </div>
                            <div className={`mt-timeline-step ${techPosition ? 'active' : 'pending'}`}>
                                <div className={`mt-step-icon ${techPosition ? 'pulse' : ''}`}>
                                    {techPosition && <span className="material-symbols-outlined">navigation</span>}
                                </div>
                                <div className="mt-step-info">
                                    <p className="mt-step-title">En route</p>
                                    {techPosition && <p className="mt-step-desc">Position en direct</p>}
                                </div>
                            </div>
                            <div className="mt-timeline-step pending">
                                <div className="mt-step-icon"></div>
                                <div className="mt-step-info">
                                    <p className="mt-step-title">Intervention</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Card */}
                    {tech && (
                        <div className="mt-glass-card mt-profile-card">
                            <img
                                className="mt-profile-avatar"
                                alt={tech.name}
                                src={tech.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.name)}&background=1a365d&color=fff&size=96`}
                            />
                            <div className="mt-profile-info">
                                <h3 className="mt-profile-name">{tech.name}</h3>
                                <div className="mt-profile-rating">
                                    <span className="material-symbols-outlined fill-icon" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                    <span>{tech.rating} ({tech.num_reviews} avis)</span>
                                </div>
                            </div>
                            <div className="mt-profile-actions">
                                <button className="mt-action-btn secondary" onClick={openChat} title="Chat">
                                    <span className="material-symbols-outlined">chat</span>
                                </button>
                                {tech.phone && (
                                    <a href={`tel:${tech.phone}`} className="mt-action-btn primary" title="Appeler">
                                        <span className="material-symbols-outlined">call</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Review Button - shown when mission is completed */}
                    {mission?.request?.status === 'completed' && tech && !reviewSubmitted && (
                        <button className="mt-btn-review" onClick={() => setShowReviewModal(true)}>
                            <span className="material-symbols-outlined">rate_review</span>
                            Laisser un avis
                        </button>
                    )}
                    {reviewSubmitted && (
                        <div className="mt-review-done">
                            <span className="material-symbols-outlined">check_circle</span>
                            Merci pour votre avis !
                        </div>
                    )}
                </div>

                {/* Right Panel */}
                <div className="mt-right-panel">
                    <div className="mt-bento-grid">
                        <div className="mt-glass-card mt-bento-card">
                            <div className="mt-bento-header">
                                <div className="mt-bento-icon primary-bg">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <span className="mt-bento-label">Adresse du site</span>
                            </div>
                            <p className="mt-bento-title">{mission.address?.address ?? mission.address?.label ?? '—'}</p>
                            <p className="mt-bento-subtitle">{mission.address?.city ?? 'Cameroun'}</p>
                        </div>

                        <div className="mt-glass-card mt-bento-card">
                            <div className="mt-bento-header">
                                <div className="mt-bento-icon tertiary-bg">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <span className="mt-bento-label">Estimation totale</span>
                            </div>
                            <p className="mt-bento-amount">{mission.proposal ? Number(mission.proposal.price).toLocaleString() : '—'} <span>XAF</span></p>
                            <p className="mt-bento-hint">Débit automatique à la fin</p>
                        </div>

                        <div className="mt-glass-card mt-bento-actions">
                            <button className="mt-btn-danger">
                                <span className="material-symbols-outlined">cancel</span>
                                Annuler la mission
                            </button>
                            <button className="mt-btn-outline">
                                <span className="material-symbols-outlined">help_center</span>
                                Aide
                            </button>
                        </div>
                    </div>
                </div>

            

            {/* Review Modal */}
            {showReviewModal && mission?.request && tech && (
                <ReviewModal
                    requestId={mission.request.id}
                    technicianName={tech.name}
                    onClose={() => setShowReviewModal(false)}
                    onSubmitted={() => {
                        setShowReviewModal(false);
                        setReviewSubmitted(true);
                    }}
                />
            )}

        </div>
    );
};

export default MissionTracking;
