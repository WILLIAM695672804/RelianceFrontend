import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWrench, FaBolt, FaTint, FaArrowRight, FaClock, FaCheckCircle } from 'react-icons/fa';
import './ClientDashboard.css';

const ClientDashboard: React.FC = () => {
    const navigate = useNavigate();

    // Mock recent requests
    const recentRequests = [
        { id: 'REQ-019', type: 'Plomberie', status: 'En attente de devis', date: 'Aujourd\'hui', icon: <FaTint /> },
        { id: 'REQ-018', type: 'Électricité', status: 'Terminé', date: 'Il y a 3 jours', icon: <FaBolt /> }
    ];

    return (
        <div className="client-dashboard">
            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div className="welcome-text">
                    <h2>Bonjour, Alexandre 👋</h2>
                    <p>Que pouvons-nous réparer pour vous aujourd'hui ?</p>
                </div>
            </div>

            {/* Giant CTA Button (The Core Focus) */}
            <div className="cta-container">
                <button 
                    className="giant-cta-button"
                    onClick={() => navigate('/client/demande')}
                >
                    <div className="cta-icon-wrapper">
                        <FaWrench className="cta-icon" />
                    </div>
                    <div className="cta-text">
                        <h3>J'ai un problème technique</h3>
                        <span>Démarrer un diagnostic immédiat assisté par IA</span>
                    </div>
                    <FaArrowRight className="cta-arrow" />
                </button>
            </div>

            {/* Quick Overview Widget */}
            <div className="overview-widget">
                <div className="widget-header">
                    <h3>Mes interventions récentes</h3>
                    <button className="view-all-btn" onClick={() => navigate('/client/suivi')}>Voir tout</button>
                </div>

                <div className="requests-list">
                    {recentRequests.map(req => (
                        <div key={req.id} className="request-card">
                            <div className="req-icon-box" style={{ background: req.type === 'Plomberie' ? '#e0f2fe' : '#fef08a', color: req.type === 'Plomberie' ? '#0284c7' : '#ca8a04' }}>
                                {req.icon}
                            </div>
                            <div className="req-details">
                                <strong>{req.type}</strong>
                                <span className="req-id">{req.id} • {req.date}</span>
                            </div>
                            <div className={`req-status ${req.status === 'Terminé' ? 'status-done' : 'status-pending'}`}>
                                {req.status === 'Terminé' ? <FaCheckCircle /> : <FaClock />}
                                {req.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
