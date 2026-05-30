import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaWrench, FaComments } from 'react-icons/fa';
import api from '../../services/api';
import { Loading } from '../../components/common/AsyncStates';
import './TechProfile.css';

const PublicTechProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated, openAuthModal } = useAuth();
    const navigate = useNavigate();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['public-tech', id],
        queryFn: () => api.get(`/technicians/${id}/profile`).then((r) => r.data?.data ?? r.data),
        enabled: !!id,
    });

    const handleRequestIntervention = () => {
        if (!isAuthenticated) openAuthModal();
        else navigate('/espace-client/demande');
    };

    if (isLoading) {
        return <div className="public-profile-container"><Loading label="Chargement du profil…" /></div>;
    }

    const techName = profile?.name ?? 'Technicien';
    const techProfession = profile?.skills?.[0]?.name ?? profile?.competences ?? 'Professionnel certifié';
    const city = profile?.service_perimeter?.city;
    const radius = profile?.service_perimeter?.radius;
    const reviews: any[] = profile?.recent_reviews ?? [];
    const avatar = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(techName)}&background=0D8ABC&color=fff&size=120`;

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
                        <img src={avatar} alt={techName} />
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
                    <h1>{techName} {profile?.verified && <FaCheckCircle className="verified-badge" title="Profil Vérifié KYC" />}</h1>
                    <h2>{techProfession}</h2>

                    <div className="profile-stats-row">
                        <span className="stat-item"><FaStar className="star-icon" /> {(profile?.rating ?? 0).toFixed(1)} ({profile?.num_reviews ?? 0} avis)</span>
                        {city && (
                            <span className="stat-item"><FaMapMarkerAlt /> {city}{radius ? ` (Intervient à ${radius}km)` : ''}</span>
                        )}
                    </div>
                </div>

                {/* About Section */}
                <div className="profile-section">
                    <h3>À propos</h3>
                    <p>{profile?.bio || 'Ce professionnel n\'a pas encore renseigné de description.'}</p>
                </div>

                {/* Compétences */}
                {profile?.skills?.length > 0 && (
                    <div className="profile-section">
                        <h3>Compétences</h3>
                        <div className="profile-stats-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
                            {profile.skills.map((s: any) => (
                                <span key={s.id} className="stat-item"><FaWrench /> {s.name}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Summary */}
                <div className="profile-section">
                    <h3>Avis clients récents</h3>
                    {reviews.length === 0 ? (
                        <p style={{ color: '#94a3b8' }}>Aucun avis pour le moment.</p>
                    ) : (
                        reviews.map((r: any, i: number) => (
                            <div className="review-card" key={r.id ?? i}>
                                <div className="review-stars">{'★'.repeat(Math.round(Number(r.rating) || 0))}</div>
                                {r.comment && <p className="review-text">"{r.comment}"</p>}
                                <span className="review-author">- {r.reviewer?.name ?? 'Client'}{r.created_at ? `, ${new Date(r.created_at).toLocaleDateString('fr-FR')}` : ''}</span>
                            </div>
                        ))
                    )}
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
