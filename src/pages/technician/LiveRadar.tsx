import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TechServiceMap from '../../components/maps/TechServiceMap';
import './LiveRadar.css';
import matchingService from '../../services/matchingService';
import type { Proposal } from '../../services/matchingService';

const LiveRadar: React.FC = () => {
    const navigate = useNavigate();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [acting, setActing] = useState<string | null>(null);

    const fetchProposals = async () => {
        try {
            const result = await matchingService.getProposals();
            const data = result?.data?.data ?? result?.data ?? [];
            setProposals(Array.isArray(data) ? data.filter((p: Proposal) => p.status === 'pending') : []);
        } catch (err) {
            // Silent fail — map still renders
        }
    };

    useEffect(() => {
        fetchProposals();
        const interval = setInterval(fetchProposals, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const handleAccept = async (proposalId: string) => {
        setActing(proposalId);
        try {
            await matchingService.acceptProposal(proposalId);
            await fetchProposals();
            navigate('/technicien/cockpit');
        } catch (err) {
            console.error('Erreur acceptation:', err);
        } finally {
            setActing(null);
        }
    };

    const handleRefuse = async (proposalId: string) => {
        setActing(proposalId);
        try {
            await matchingService.refuseProposal(proposalId);
            setProposals(prev => prev.filter(p => p.id !== proposalId));
        } catch (err) {
            console.error('Erreur refus:', err);
        } finally {
            setActing(null);
        }
    };

    // Active (first pending) proposal to show in the main card
    const activeProposal = proposals[0] ?? null;

    return (
        <div className="tech-liveradar-page">
            {/* Map Background with Radar Effects */}
            <div className="tech-liveradar-bg">
                <TechServiceMap 
                    latitude={3.8480}
                    longitude={11.5021}
                    radiusInKm={10} 
                />
                <div className="tech-radar-center">
                    <div className="tech-radar-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="tech-radar-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="tech-radar-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="tech-radar-dot"></div>
                </div>
            </div>

            {/* UI Overlay */}
            <div className="tech-liveradar-overlay">
                
                {/* Search/Status Bar Area */}
                <div className="tech-radar-top-status">
                    <div className="tech-glass-panel tech-status-bar">
                        <div className="tech-status-icon">
                            <span className="material-symbols-outlined">travel_explore</span>
                        </div>
                        <div className="tech-status-text">
                            <p className="tech-status-label">Propositions en attente</p>
                            <p className="tech-status-value">
                                {proposals.length} mission{proposals.length !== 1 ? 's' : ''} disponible{proposals.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        {proposals.length > 0 && (
                            <div className="tech-status-badge">
                                <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>bolt</span>
                                NOUVEAU
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Cards Container */}
                <div className="tech-radar-cards-container">
                    
                    {/* ACTIVE MISSION CARD */}
                    {activeProposal ? (
                        <div className="tech-active-mission-card">
                            <div className="tech-ai-badge">
                                <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>auto_awesome</span>
                                NOUVEAU MATCH
                            </div>
                            
                            <div className="tech-mission-header">
                                <div className="tech-mission-subtitle">
                                    <span className="tech-dot tech-dot-pulse"></span>
                                    Nouvelle demande
                                </div>
                                <h3>{activeProposal.request?.title ?? 'Intervention'}</h3>
                                <div className="tech-mission-meta">
                                    <span><span className="material-symbols-outlined">schedule</span> Expire dans 24h</span>
                                    <span><span className="material-symbols-outlined">payments</span> {activeProposal.price?.toLocaleString() ?? '–'} XAF</span>
                                </div>
                            </div>

                            {activeProposal.request?.description && (
                                <div className="tech-ai-insight">
                                    <div className="tech-ai-icon">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <div>
                                        <p className="tech-ai-label">Description</p>
                                        <p className="tech-ai-text">{activeProposal.request.description.substring(0, 120)}...</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Area */}
                            <div className="tech-mission-actions">
                                <button 
                                    className="tech-btn-accept"
                                    disabled={acting === activeProposal.id}
                                    onClick={() => handleAccept(activeProposal.id)}
                                >
                                    <div className="tech-btn-bg-blur"></div>
                                    <div className="tech-btn-content">
                                        <span className="material-symbols-outlined">task_alt</span>
                                        {acting === activeProposal.id ? 'EN COURS...' : 'ACCEPTER'}
                                    </div>
                                </button>
                                
                                <button
                                    style={{
                                        background: 'rgba(255,80,80,0.15)',
                                        border: '1px solid rgba(255,80,80,0.3)',
                                        color: '#ff5050',
                                        padding: '0.75rem 1.25rem',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                    }}
                                    disabled={acting === activeProposal.id}
                                    onClick={() => handleRefuse(activeProposal.id)}
                                >
                                    Refuser
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* No proposals — placeholder */
                        <div className="tech-active-mission-card">
                            <div className="tech-mission-header">
                                <div className="tech-mission-subtitle">
                                    <span className="tech-dot"></span>
                                    Aucune mission en attente
                                </div>
                                <h3>En attente de nouvelles demandes...</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    Votre zone est surveillée. Vous serez notifié dès qu'une mission vous correspond.
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Contextual Controls Overlay */}
            <div className="tech-radar-controls">
                <button className="tech-control-btn"><span className="material-symbols-outlined">add</span></button>
                <button className="tech-control-btn"><span className="material-symbols-outlined">remove</span></button>
                <div className="tech-controls-divider"></div>
                <button className="tech-control-btn tech-control-primary">
                    <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>my_location</span>
                </button>
            </div>
            
        </div>
    );
};

export default LiveRadar;
