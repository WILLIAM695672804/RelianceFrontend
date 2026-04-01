import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaStar, FaMapMarkerAlt, FaCheckCircle, 
    FaArrowRight, FaShieldAlt, FaClock 
} from 'react-icons/fa';
import './MatchingResults.css';

interface TechnicianMock {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
    distance: string;
    rating: number;
    reviews: number;
    priceEstimate: string;
    isVerified: boolean;
    eta: string;
}

const MatchingResults: React.FC = () => {
    const navigate = useNavigate();
    const [selectedTech, setSelectedTech] = useState<string | null>(null);

    // Mock data based on the AI analysis previous step
    const technicians: TechnicianMock[] = [
        {
            id: 'TECH-001',
            name: 'Jean-Marc D.',
            avatar: 'https://i.pravatar.cc/150?img=11',
            specialty: 'Plombier Chauffagiste',
            distance: '1.2 km',
            rating: 4.9,
            reviews: 124,
            priceEstimate: '15 000 FCFA',
            isVerified: true,
            eta: 'Dans 25 min'
        },
        {
            id: 'TECH-002',
            name: 'Artisans Express SARL',
            avatar: 'https://i.pravatar.cc/150?img=3',
            specialty: 'Agence de Plomberie',
            distance: '3.5 km',
            rating: 4.7,
            reviews: 89,
            priceEstimate: '12 500 FCFA',
            isVerified: true,
            eta: 'Dans 45 min'
        },
        {
            id: 'TECH-003',
            name: 'Alain T.',
            avatar: 'https://i.pravatar.cc/150?img=68',
            specialty: 'Technicien Polyvalent',
            distance: '5.0 km',
            rating: 4.5,
            reviews: 42,
            priceEstimate: '10 000 FCFA',
            isVerified: false,
            eta: 'Dans 1h'
        }
    ];

    const handleConfirm = () => {
        if (!selectedTech) return;
        // Proceed to HUB 4 Tracking
        navigate('/client/suivi');
    };

    return (
        <div className="matching-results-container">
            <div className="matching-header">
                <div className="match-success-badge">
                    <FaCheckCircle /> 3 Experts trouvés
                </div>
                <h1>Le verdict de l'IA</h1>
                <p>Basé sur vos critères (Fuite d'eau, urgence, Yaoundé Centre), voici les professionnels les plus adaptés pour intervenir rapidement.</p>
            </div>

            <div className="tech-cards-list">
                {technicians.map((tech) => (
                    <div 
                        key={tech.id} 
                        className={`tech-profile-card ${selectedTech === tech.id ? 'selected' : ''}`}
                        onClick={() => setSelectedTech(tech.id)}
                    >
                        <div className="tech-card-left">
                            <div className="avatar-wrapper">
                                <img src={tech.avatar} alt={tech.name} className="tech-avatar" />
                                {tech.isVerified && (
                                    <div className="verified-badge-small" title="Identité Vérifiée">
                                        <FaShieldAlt />
                                    </div>
                                )}
                            </div>
                            <div className="tech-info-main">
                                <h3>{tech.name}</h3>
                                <div className="tech-specialty">{tech.specialty}</div>
                                
                                <div className="tech-meta-row">
                                    <div className="tech-rating">
                                        <FaStar className="star-icon" /> {tech.rating} <span>({tech.reviews} avis)</span>
                                    </div>
                                    <div className="tech-distance">
                                        <FaMapMarkerAlt className="pin-icon" /> {tech.distance}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tech-card-divider"></div>

                        <div className="tech-card-right">
                            <div className="tech-price-block">
                                <span className="price-label">Estimation</span>
                                <div className="price-value">{tech.priceEstimate}</div>
                            </div>
                            <div className="tech-eta">
                                <FaClock /> {tech.eta}
                            </div>
                            
                            <button 
                                className={`btn-select-tech ${selectedTech === tech.id ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTech(tech.id);
                                }}
                            >
                                {selectedTech === tech.id ? 'Sélectionné' : 'Choisir'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sticky Action Footer */}
            <div className={`matching-footer-action ${selectedTech ? 'visible' : ''}`}>
                <div className="selected-summary">
                    Vous avez sélectionné <strong>{technicians.find(t => t.id === selectedTech)?.name}</strong>.
                    L'intervention sera mise en attente de sa validation.
                </div>
                <button className="btn-confirm-match" onClick={handleConfirm}>
                    Confirmer l'expert <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default MatchingResults;
