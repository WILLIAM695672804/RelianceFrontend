import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaWrench, FaComments } from 'react-icons/fa';
import './TechProfile.css';

const PublicTechProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated, openAuthModal } = useAuth();
    const navigate = useNavigate();

    // Mock data based on ID
    const techName = id === 'sarah-kone' ? 'Sarah Koné' : 'Alain Dupont';
    const techProfession = id === 'sarah-kone' ? 'Électricienne Experte' : 'Plombier Certifié';

    const handleRequestIntervention = () => {
        if (!isAuthenticated) {
            openAuthModal();
        } else {
            // Logged in: redirect to the request wizard pre-filled with this tech
            navigate('/client/demande');
        }
    };

    return (
        <div className="public-profile-container">
            {/* Cover Image */}
            <div className="profile-cover">
                <img src="https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=1200" alt="Cover" />
            </div>

            <div className="profile-content">
                {/* Header Info */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        <img src={`https://ui-avatars.com/api/?name=${techName}&background=0D8ABC&color=fff&size=120`} alt={techName} />
                    </div>
                    <div className="profile-actions">
                        <button className="btn-secondary-action" onClick={() => !isAuthenticated ? openAuthModal() : alert('Message envoye')}>
                            <FaComments /> Message
                        </button>
                        <button className="btn-primary-action" onClick={handleRequestIntervention}>
                            <FaWrench /> Demander un devis
                        </button>
                    </div>
                </div>

                <div className="profile-main-info">
                    <h1>{techName} <FaCheckCircle className="verified-badge" title="Profil Vérifié KYC" /></h1>
                    <h2>{techProfession}</h2>
                    
                    <div className="profile-stats-row">
                        <span className="stat-item"><FaStar className="star-icon" /> 4.9 (124 avis)</span>
                        <span className="stat-item"><FaMapMarkerAlt /> Douala, Akwa (Intervient à 15km)</span>
                    </div>
                </div>

                {/* About Section */}
                <div className="profile-section">
                    <h3>À propos</h3>
                    <p>
                        Artisan passionné avec plus de 10 ans d'expérience. Spécialisé dans les dépannages d'urgence et les installations complexes. 
                        Je garantis un travail propre, rapide et respectueux des normes de sécurité en vigueur.
                        Maîtrise complète des nouveaux matériaux.
                    </p>
                </div>

                {/* Portfolio / Réalisations */}
                <div className="profile-section">
                    <h3>Portfolio & Réalisations</h3>
                    <div className="portfolio-grid">
                        <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400" alt="Réalisation 1" />
                        <img src="https://images.unsplash.com/photo-1486262715619-67081010308f?auto=format&fit=crop&q=80&w=400" alt="Réalisation 2" />
                        <img src="https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&q=80&w=400" alt="Réalisation 3" />
                    </div>
                </div>

                {/* Reviews Summary */}
                <div className="profile-section">
                    <h3>Avis clients récents</h3>
                    <div className="review-card">
                        <div className="review-stars">
                            ★★★★★
                        </div>
                        <p className="review-text">"Intervention très rapide et professionnelle. Le problème a été résolu en moins d'une heure. Je recommande vivement !"</p>
                        <span className="review-author">- Paul M., Il y a 2 jours</span>
                    </div>
                    <div className="review-card">
                        <div className="review-stars">
                            ★★★★★
                        </div>
                        <p className="review-text">"Travail soigné et explications claires sur l'origine de la panne."</p>
                        <span className="review-author">- Marie F., La semaine dernière</span>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="mobile-sticky-cta">
                <button className="btn-primary-action full-width" onClick={handleRequestIntervention}>
                    <FaWrench /> Demander une intervention
                </button>
            </div>
        </div>
    );
};

export default PublicTechProfile;
