import React, { useState, useEffect } from 'react';
import {
    FaMapMarkerAlt,
    FaBolt,
    FaStar,
    FaRoute,
    FaCheck,
    FaTimes,
    FaCircleNotch,
    FaRobot
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LiveRadar.css';

interface IncomingMission {
    id: string;
    clientName: string;
    distance: string;
    address: string;
    problem: string;
    mlEstimation: string;
    suggestedPrice: string;
    matchScore: number;
    expiresIn: number; // seconds
}

const LiveRadar: React.FC<{ onAcceptMission?: (id: string) => void }> = ({ onAcceptMission }) => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(true);
    const [incomingMissions, setIncomingMissions] = useState<IncomingMission[]>([]);

    // Simulate incoming missions periodically
    useEffect(() => {
        if (!isScanning) return;

        const timer = setTimeout(() => {
            const newMission: IncomingMission = {
                id: `M-${Math.floor(Math.random() * 10000)}`,
                clientName: 'Alice Dubois',
                distance: '1.2 km',
                address: 'Bonamoussadi, Douala',
                problem: 'Fuite tuyau principal cuisine',
                mlEstimation: 'Dépannage Rapide (Niveau 2) - 45 min estimées',
                suggestedPrice: '15 000 FCFA',
                matchScore: 98,
                expiresIn: 60
            };
            setIncomingMissions(prev => [newMission, ...prev]);
        }, 5000);

        return () => clearTimeout(timer);
    }, [isScanning, incomingMissions]);

    // Timer countdown for missions
    useEffect(() => {
        const interval = setInterval(() => {
            setIncomingMissions(prev =>
                prev.map(m => ({ ...m, expiresIn: m.expiresIn - 1 })).filter(m => m.expiresIn > 0)
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleScanning = () => {
        setIsScanning(!isScanning);
        if (isScanning) {
            setIncomingMissions([]); // clear queue on stop
        }
    };

    const handleAccept = (id: string) => {
        if (onAcceptMission) {
            // V4: Use the Cockpit's slide-over panel
            onAcceptMission(id);
        } else {
            // V3 fallback
            navigate(`/technicien/mission/${id}`);
        }
    };

    const handleReject = (id: string) => {
        setIncomingMissions(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="tech-page radar-page" style={{ paddingTop: 0, marginTop: 0 }}>
            {/* Radar Status Bar is now handled partially by Cockpit, but keeping the visual scanning indicator here */}
            <div className={`radar-status-bar ${isScanning ? 'active' : 'inactive'}`} style={{ marginTop: '16px' }}>
                <div className="status-indicator">
                    <div className={`ping ${isScanning ? 'animate' : ''}`}></div>
                    <h2 style={{ fontSize: '1rem', margin: 0 }}>{isScanning ? 'Recherche de missions en cours...' : 'Radar en pause'}</h2>
                </div>
                <button className={`btn-toggle-radar ${isScanning ? 'stop' : 'start'}`} onClick={toggleScanning}>
                    {isScanning ? 'Mettre en pause' : 'Lancer le Radar'}
                </button>
            </div>

            {/* Live Map Area */}
            <div className="radar-map-area">
                {/* Fake map overlay */}
                <div className="map-overlay-layer"></div>
                <div className="technician-marker">
                    <FaMapMarkerAlt className="tech-icon" />
                    <div className="pulse-ring"></div>
                </div>

                {/* Display incoming requests floating on map (mobile-first list below map though) */}
            </div>

            {/* Incoming Requests Feed (Mobile First) */}
            <div className="incoming-feed">
                {incomingMissions.length === 0 && isScanning && (
                    <div className="empty-scan-state">
                        <FaCircleNotch className="spin-icon" />
                        <p>En attente d'une demande correspondante (PostGIS)...</p>
                    </div>
                )}

                {incomingMissions.map(mission => (
                    <div key={mission.id} className="incoming-mission-card">
                        <div className="timer-bar" style={{ width: `${(mission.expiresIn / 60) * 100}%` }}></div>

                        <div className="card-header">
                            <div className="match-score">
                                <FaBolt /> {mission.matchScore}% Match
                            </div>
                            <div className="expires-text">{mission.expiresIn}s restantes</div>
                        </div>

                        <div className="card-body">
                            <h3 className="mission-title">Intervention #{mission.id}</h3>
                            <div className="mission-location">
                                <FaMapMarkerAlt /> {mission.address} (<span className="distance">{mission.distance}</span>)
                                <a href="#" className="route-link"><FaRoute /> Itinéraire</a>
                            </div>

                            <div className="problem-box">
                                <strong>Client :</strong> {mission.clientName} <br />
                                <strong>Problème :</strong> {mission.problem}
                            </div>

                            <div className="ml-estimation-box">
                                <div className="ml-header"><FaRobot /> Estimation IA (Modèle V2)</div>
                                <p>{mission.mlEstimation}</p>
                                <div className="suggested-price">Prix suggéré : {mission.suggestedPrice}</div>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className="btn-action reject" onClick={() => handleReject(mission.id)}>
                                <FaTimes /> Ignorer
                            </button>
                            <button className="btn-action accept" onClick={() => handleAccept(mission.id)}>
                                <FaCheck /> Accepter
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveRadar;
