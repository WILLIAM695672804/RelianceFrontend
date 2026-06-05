import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import './MatchingResults.css';
import requestService from '../../services/requestService';
import type { MatchedTechnician } from '../../services/matchingService';
import { createAppointment } from '../../services/operationsService';

const MatchingResults: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Real match result passed from RequestWizard via navigate state
    const navState = location.state as { matchResult?: any; requestId?: string } | null;
    const requestId = navState?.requestId ?? searchParams.get('request_id');
    
    const [loading, setLoading] = useState(true);
    const [technicians, setTechnicians] = useState<MatchedTechnician[]>([]);
    const [selectedTech, setSelectedTech] = useState<string | null>(null);
    const [selecting, setSelecting] = useState(false);

    // Modale de planification de rendez-vous
    const [scheduleTech, setScheduleTech] = useState<MatchedTechnician | null>(null);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleNotes, setScheduleNotes] = useState('');
    const [scheduling, setScheduling] = useState(false);
    const [scheduleDone, setScheduleDone] = useState(false);
    const [scheduleError, setScheduleError] = useState<string | null>(null);

    useEffect(() => {
        if (navState?.matchResult) {
            // Data already available from navigation state (fastest path)
            setTechnicians(navState.matchResult.technicians ?? []);
            setLoading(false);
        } else if (requestId) {
            // Fallback: trigger match from URL param
            triggerMatch(requestId);
        } else {
            setLoading(false);
        }
    }, []);

    const triggerMatch = async (id: string) => {
        setLoading(true);
        try {
            const result = await requestService.match(id);
            setTechnicians(result?.data?.technicians ?? []);
        } catch (error) {
            console.error("Erreur lors du matching:", error);
        } finally {
            setLoading(false);
        }
    };

    const openSchedule = (tech: MatchedTechnician) => {
        setScheduleTech(tech);
        setScheduleDate('');
        setScheduleNotes('');
        setScheduleDone(false);
        setScheduleError(null);
    };

    const handleSchedule = async () => {
        if (!scheduleTech || !scheduleDate || scheduling) return;
        if (!requestId) {
            setScheduleError("Demande introuvable. Recommencez depuis votre demande d'intervention.");
            return;
        }
        setScheduling(true);
        setScheduleError(null);
        try {
            await createAppointment({
                request_id: requestId,
                technician_id: scheduleTech.id,
                scheduled_start: new Date(scheduleDate).toISOString(),
                notes: scheduleNotes || undefined,
            });
            setScheduleDone(true);
        } catch (error) {
            console.error('Erreur lors de la planification:', error);
            setScheduleError("Impossible d'enregistrer la demande de rendez-vous. Réessayez.");
        } finally {
            setScheduling(false);
        }
    };

    // Date minimale = maintenant (format datetime-local : YYYY-MM-DDTHH:mm)
    const minDateTime = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

    const handleConfirm = async (technicianId: string, price: number) => {
        if (!requestId || selecting) return;
        setSelecting(true);
        try {
            await requestService.selectTechnician(requestId, technicianId, price);
            navigate('/espace-client/suivi');
        } catch (error) {
            console.error("Erreur lors de la sélection:", error);
            alert("Erreur lors de la sélection du technicien.");
        } finally {
            setSelecting(false);
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--surface)', color: 'var(--on-surface)', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            

            <main className="mr-main-container">
                {/* Header */}
                <header className="mr-header">
                    <div>
                        <h1 className="mr-header-title">Technician trouvers</h1>
                        <p className="mr-header-subtitle">Optimized results powered by our proprietary matching engine to find the most qualified artisans for your specific needs.</p>
                    </div>
                </header>

                {/* AI Banner */}
                <section className="mr-ai-banner">
                    <div className="mr-ai-banner-content">
                        <div className="mr-ai-icon-bg">
                            <span className="material-symbols-outlined mr-ai-icon">psychology</span>
                        </div>
                        <div className="mr-ai-text">
                            <h2 className="mr-ai-title">Reliance Insight Analysis Complete</h2>
                            <p className="mr-ai-desc">Our AI has successfully evaluated 45+ critical criteria including verified skills, past performance metrics, proximity, and real-time availability to surface these top {technicians.length} technicians.</p>
                        </div>
                        <div className="mr-ai-badge">
                            <span className="mr-ai-count">45+</span>
                            <span className="mr-ai-crit">Criteria<br/>Processed</span>
                        </div>
                    </div>
                    <div className="mr-ai-bg-decor"></div>
                </section>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center p-20">
                        <div className="rw-spinner"></div>
                        <p className="ml-4">Recherche des meilleurs experts...</p>
                    </div>
                )}

                {/* Grid Layout */}
                {!loading && (
                    <div className="mr-grid">
                        {/* Left Col - Tech Cards */}
                        <div className="mr-col-span-2">
                            {technicians.length === 0 && (
                                <div className="mr-glass-panel p-10 text-center">
                                    <span className="material-symbols-outlined text-4xl mb-4">search_off</span>
                                    <h3>Aucun technicien trouvé</h3>
                                    <p>Nous n'avons pas trouvé de technicien disponible répondant à vos critères dans votre zone.</p>
                                </div>
                            )}
                            {technicians.map((tech: MatchedTechnician) => (
                                <div 
                                    key={tech.id} 
                                    className={`mr-tech-card ${selectedTech === tech.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedTech(tech.id)}
                                >
                                    <div className="mr-tech-body">
                                        <div className="mr-tech-avatar-wrapper">
                                            <img src={tech.avatar_url ?? 'https://via.placeholder.com/150'} alt={tech.name} className="mr-tech-img" />
                                            {tech.verified && (
                                                <div className="mr-tech-verified">
                                                    <span className="material-symbols-outlined" style={{ fontSize: '0.75rem', marginRight: '0.25rem', fontVariationSettings: "'FILL' 1" }}>verified</span> VERIFIED
                                                </div>
                                            )}
                                        </div>
                                        <div className="mr-tech-info">
                                            <div className="mr-tech-header-row">
                                                <div>
                                                    <h3 className="mr-tech-name">{tech.name}</h3>
                                                    <p className="mr-tech-role">Expert certifié Reliance</p>
                                                </div>
                                                <div className="mr-tech-match-wrapper">
                                                    <div className="mr-tech-match">
                                                        <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', marginRight: '0.25rem' }}>bolt</span> {tech.match_score}% Match
                                                    </div>
                                                    <div className="mr-tech-price">
                                                        {tech.skills[0]?.hourly_rate ? `${tech.skills[0].hourly_rate.toLocaleString()} XAF/h` : 'Sur devis'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mr-tech-skills">
                                                {tech.skills.map((skill, idx) => (
                                                    <span key={idx} className="mr-skill-badge">{skill.name}</span>
                                                ))}
                                            </div>
                                            {tech.badges && tech.badges.length > 0 && (
                                                <div className="mr-tech-badges">
                                                    {tech.badges.map((badge, bIdx) => (
                                                        <span key={bIdx} className="mr-badge-pill">
                                                            <span className="material-symbols-outlined" style={{ fontSize: '0.75rem', fontVariationSettings: "'FILL' 1" }}>{badge.icon_ref}</span>
                                                            {badge.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="mr-tech-meta">
                                                <div className="mr-meta-item"><span className="material-symbols-outlined">location_on</span> {tech.distance_km} km away</div>
                                                <div className="mr-meta-item"><span className="material-symbols-outlined">star</span> {tech.rating} ({tech.num_reviews} avis)</div>
                                                <div className="mr-meta-item"><span className="material-symbols-outlined">schedule</span> Disponible maintenant</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mr-tech-footer">
                                        <button className="mr-btn-outline" onClick={() => navigate(`/artisan/${tech.id}`)}>Voir le profil</button>
                                        <button
                                            className="mr-btn-outline"
                                            onClick={(e) => { e.stopPropagation(); openSchedule(tech); }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1rem', marginRight: '0.25rem', verticalAlign: 'middle' }}>event</span>
                                            Planifier
                                        </button>
                                        <button
                                            className="mr-btn-solid"
                                            disabled={selecting}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleConfirm(tech.id, tech.skills[0]?.hourly_rate ?? 0);
                                            }}
                                        >
                                            {selecting ? 'En cours...' : 'Réserver'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right Col - Maps and Stats */}
                        <div className="mr-side-col">
                            <div className="mr-map-card">
                                <div className="mr-map-header">
                                    <h3 className="mr-map-title">
                                        <span className="material-symbols-outlined" style={{ marginRight: '0.5rem' }}>map</span> Visualize proximity
                                    </h3>
                                    <span className="mr-map-expand">Expand</span>
                                </div>
                                <div className="mr-map-body">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Reliance" alt="Map Preview" className="mr-map-img" />
                                    <div className="mr-map-overlay"></div>
                                    <div className="mr-map-center-pin">
                                        <div className="mr-map-pin-icon-wrapper">
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>person_pin</span>
                                        </div>
                                        <span className="mr-map-pin-label">Your Location</span>
                                    </div>
                                    <div className="mr-map-tech-pin-1">
                                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>home_repair_service</span>
                                    </div>
                                    <div className="mr-map-tech-pin-2">
                                        <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>construction</span>
                                    </div>
                                </div>
                                <div className="mr-map-footer">
                                    <span>Showing technicians in a 5km radius</span>
                                    <button className="mr-map-update-btn" onClick={() => navigate('/espace-client/profil')}>Update Location</button>
                                </div>
                            </div>

                            <div className="mr-stats-card">
                                <h3 className="mr-stats-title">Marketplace Stats</h3>
                                <div className="mr-stats-stack">
                                    <div className="mr-stats-row">
                                        <span className="mr-stats-label">Safety Rating</span>
                                        <div className="mr-stats-stars">
                                            {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                                        </div>
                                    </div>
                                    <div className="mr-stats-row">
                                        <span className="mr-stats-label">Avg. Arrival Time</span>
                                        <span className="mr-stats-value">34 mins</span>
                                    </div>
                                    <div className="mr-stats-bar-bg">
                                        <div className="mr-stats-bar-fill"></div>
                                    </div>
                                    <p className="mr-stats-legal">System Trust Score: 9.8/10</p>
                                </div>
                                <div className="mr-stats-decor"></div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modale de planification de rendez-vous */}
            {scheduleTech && (
                <div className="mr-modal-backdrop" onClick={() => !scheduling && setScheduleTech(null)}>
                    <div className="mr-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="mr-modal-close" onClick={() => !scheduling && setScheduleTech(null)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        {scheduleDone ? (
                            <div className="mr-modal-success">
                                <span className="material-symbols-outlined">event_available</span>
                                <h3>Demande envoyée</h3>
                                <p>Votre demande de rendez-vous a été transmise à {scheduleTech.name}. Vous serez notifié dès qu'il l'aura acceptée.</p>
                                <button className="mr-btn-solid" onClick={() => navigate('/espace-client/rendez-vous')}>
                                    Voir mes rendez-vous
                                </button>
                                <button className="mr-btn-outline" onClick={() => setScheduleTech(null)}>Fermer</button>
                            </div>
                        ) : (
                            <>
                                <h3 className="mr-modal-title">Planifier avec {scheduleTech.name}</h3>
                                <p className="mr-modal-subtitle">Proposez une date et une heure d'intervention. Le technicien confirmera sa disponibilité.</p>

                                <label className="mr-modal-label">Date et heure souhaitées</label>
                                <input
                                    type="datetime-local"
                                    className="mr-modal-input"
                                    value={scheduleDate}
                                    min={minDateTime}
                                    onChange={(e) => setScheduleDate(e.target.value)}
                                />

                                <label className="mr-modal-label">Précisions (optionnel)</label>
                                <textarea
                                    className="mr-modal-input"
                                    rows={3}
                                    placeholder="Ex : portail d'entrée, étage, accès..."
                                    value={scheduleNotes}
                                    onChange={(e) => setScheduleNotes(e.target.value)}
                                />

                                {scheduleError && <p className="mr-modal-error">{scheduleError}</p>}

                                <button
                                    className="mr-btn-solid mr-modal-submit"
                                    disabled={!scheduleDate || scheduling}
                                    onClick={handleSchedule}
                                >
                                    {scheduling ? 'Envoi...' : 'Confirmer la demande'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchingResults;
