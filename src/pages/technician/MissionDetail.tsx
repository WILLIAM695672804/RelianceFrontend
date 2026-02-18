import React, { useState } from 'react';
import {
    FaArrowLeft,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaCommentAlt,
    FaStar,
    FaClock,
    FaTools,
    FaCheck,
    FaDirections,
    FaShieldAlt,
    FaCamera
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import './MissionDetail.css';

const MissionDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock Data (would ideally come from an API based on ID)
    const mission = {
        id: id || 'M-2684',
        title: "Réparation Fuite d'Eau - Salle de Bain",
        status: 'ACCEPTED', // ACCEPTED, EN_ROUTE, IN_PROGRESS, COMPLETED
        address: "123 Rue de la République, Douala",
        client: {
            name: "Sophie M.",
            rating: 4.9,
            phone: "+237 699 99 99 99"
        },
        description: "Fuite importante sous le lavabo de la salle de bain principale. Le joint semble usé. Merci d'apporter des joints de rechange.",
        price: "15.000 FCFA",
        checklist: [
            { id: 1, label: "Port des EPI (Chaussures, Gants)", checked: false },
            { id: 2, label: "Coupure d'eau générale", checked: false },
            { id: 3, label: "Protection du sol", checked: false },
            { id: 4, label: "Photo Avant Travaux", checked: false }
        ]
    };

    const [currentStep, setCurrentStep] = useState(0); // 0: Accepted, 1: En Route, 2: In Progress, 3: Completed
    const [checklist, setChecklist] = useState(mission.checklist);

    const toggleCheckItem = (itemId: number) => {
        setChecklist(prev => prev.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleMainAction = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
            // In a real app, this would update the backend status
        } else {
            navigate('/technicien/dashboard');
        }
    };

    const getButtonLabel = () => {
        switch (currentStep) {
            case 0: return "JE PARS (EN ROUTE)";
            case 1: return "JE SUIS ARRIVÉ";
            case 2: return "TERMINER LA MISSION";
            case 3: return "RETOUR DASHBOARD";
            default: return "ACTION";
        }
    };

    const getButtonIcon = () => {
        switch (currentStep) {
            case 0: return <FaDirections />;
            case 1: return <FaMapMarkerAlt />;
            case 2: return <FaCheck />;
            case 3: return <FaArrowLeft />;
            default: return <FaCheck />;
        }
    };

    return (
        <div className="tech-page mission-detail-page">
            {/* Header */}
            <div className="mission-header">
                <button className="back-btn" onClick={() => navigate('/technicien/dashboard')}>
                    <FaArrowLeft /> Retour
                </button>
                <div className="mission-id">#{mission.id}</div>
            </div>

            <div className="mission-grid">
                {/* Main Content */}
                <div className="mission-main">
                    {/* Map Section */}
                    <div className="map-card">
                        <div className="map-placeholder">
                            <FaMapMarkerAlt style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '10px' }} />
                            <span>Carte Intéractive (Simulation)</span>
                        </div>
                        <div className="map-overlay-info">
                            <FaDirections style={{ color: '#2563eb' }} />
                            <span>15 min (2.5 km)</span>
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="client-card">
                        <div className="client-info">
                            <div className="client-avatar">SM</div>
                            <div className="client-details">
                                <h3>{mission.client.name}</h3>
                                <div className="client-rating">
                                    <FaStar /> {mission.client.rating}
                                </div>
                            </div>
                        </div>
                        <div className="contact-actions">
                            <button className="contact-btn message"><FaCommentAlt /></button>
                            <button className="contact-btn phone"><FaPhoneAlt /></button>
                        </div>
                    </div>

                    {/* Job Info */}
                    <div className="job-info-card">
                        <h2 className="job-title">{mission.title}</h2>
                        <div className="info-row">
                            <FaMapMarkerAlt className="info-icon" />
                            <div className="info-content">
                                <label>Adresse d'intervention</label>
                                <p>{mission.address}</p>
                            </div>
                        </div>
                        <div className="info-row">
                            <FaTools className="info-icon" />
                            <div className="info-content">
                                <label>Description</label>
                                <p>{mission.description}</p>
                            </div>
                        </div>
                        <div className="info-row">
                            <FaClock className="info-icon" />
                            <div className="info-content">
                                <label>Rendez-vous</label>
                                <p>Aujourd'hui, 14:00 - 16:00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="mission-sidebar">
                    {/* Security Checklist */}
                    <div className="checklist-card">
                        <div className="checklist-header">
                            <h3><FaShieldAlt style={{ marginRight: '8px', color: '#16a34a' }} /> Sécurité & Qualité</h3>
                            <span className="progress-pill">
                                {checklist.filter(i => i.checked).length}/{checklist.length}
                            </span>
                        </div>
                        <div className="checklist-items">
                            {checklist.map(item => (
                                <div
                                    key={item.id}
                                    className={`checklist-item ${item.checked ? 'checked' : ''}`}
                                    onClick={() => toggleCheckItem(item.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => { }} // Handled by div click
                                    />
                                    <span className="checklist-label">{item.label}</span>
                                </div>
                            ))}
                        </div>
                        <button style={{
                            width: '100%',
                            marginTop: '15px',
                            padding: '8px',
                            background: '#f8fafc',
                            border: '1px dashed #cbd5e1',
                            borderRadius: '6px',
                            color: '#64748b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}>
                            <FaCamera /> Ajouter une photo
                        </button>
                    </div>

                    {/* Price Card */}
                    <div className="job-info-card" style={{ textAlign: 'center' }}>
                        <label style={{ color: '#64748b', fontSize: '0.9rem' }}>Revenu Estimé</label>
                        <h2 style={{ fontSize: '2rem', color: '#1e293b', margin: '5px 0' }}>{mission.price}</h2>
                        <span style={{ fontSize: '0.8rem', color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px' }}>
                            Commission incluse
                        </span>
                    </div>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="action-bar">
                <div className="status-steps">
                    <div className={`step-dot ${currentStep >= 0 ? 'done' : ''}`}></div>
                    <div className={`step-dot ${currentStep >= 1 ? 'done' : ''}`}></div>
                    <div className={`step-dot ${currentStep >= 2 ? 'done' : ''}`}></div>
                    <div className={`step-dot ${currentStep >= 3 ? 'done' : ''}`}></div>
                </div>
                <button
                    className={`main-action-btn ${currentStep === 2 ? 'finish' : ''}`}
                    onClick={handleMainAction}
                >
                    {getButtonIcon()} {getButtonLabel()}
                </button>
            </div>
        </div>
    );
};

export default MissionDetail;
