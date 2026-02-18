import React, { useState } from 'react';
import {
    FaCamera,
    FaPen,
    FaShareAlt,
    FaCheckCircle,
    FaStar,
    FaBriefcase,
    FaUserClock,
    FaMedal,
    FaPlus
} from 'react-icons/fa';
import './Profile.css';

const Profile: React.FC = () => {
    // Mock Data
    const [bio, setBio] = useState("Plombier certifié avec plus de 5 ans d'expérience. Spécialisé dans les dépannages d'urgence et les rénovations de salle de bain. Travail soigné et garanti.");

    return (
        <div className="tech-page profile-page">
            {/* Header / Cover */}
            <div className="profile-header">
                <div className="cover-photo">
                    <button className="edit-cover-btn">
                        <FaCamera /> Changer la couverture
                    </button>
                </div>

                <div className="profile-info-bar">
                    <div className="profile-identity">
                        <div className="profile-avatar">
                            {/* <img src="/path/to/avatar.jpg" alt="Profile" /> */}
                            <div className="profile-avatar-placeholder">W</div>
                        </div>
                        <div className="identity-text">
                            <h1>William T. <FaCheckCircle className="verified-badge" title="Vérifié" /></h1>
                            <p>Plombier • Bonanjo, Douala</p>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button className="btn-edit-profile">
                            <FaPen /> Modifier
                        </button>
                        <button className="btn-share">
                            <FaShareAlt /> Partager
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-icon rating"><FaStar /></div>
                    <div className="stat-info">
                        <span>Note Moyenne</span>
                        <strong>4.9/5</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon jobs"><FaBriefcase /></div>
                    <div className="stat-info">
                        <span>Missions</span>
                        <strong>142</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon years"><FaUserClock /></div>
                    <div className="stat-info">
                        <span>Expérience</span>
                        <strong>5 Ans</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon badge"><FaMedal /></div>
                    <div className="stat-info">
                        <span>Statut</span>
                        <strong>Expert Gold</strong>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="profile-content">
                {/* Left Column: Bio & Skills */}
                <div className="content-col">
                    <div className="content-section">
                        <h3>À Propos <span className="edit-link">Modifier</span></h3>
                        <p className="bio-text">{bio}</p>
                    </div>

                    <div className="content-section">
                        <h3>Compétences <span className="edit-link">Gérer</span></h3>
                        <div className="skills-tags">
                            <span className="skill-tag">Recherche de fuite</span>
                            <span className="skill-tag">Installation Sanitaire</span>
                            <span className="skill-tag">Chauffe-eau</span>
                            <span className="skill-tag">Débouchage</span>
                            <span className="skill-tag">Soudure Cuivre</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Portfolio */}
                <div className="content-col">
                    <div className="content-section">
                        <h3>Portfolio (Réalisations) <span className="edit-link">Tout voir</span></h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                            Vos meilleures réalisations visibles par les clients.
                        </p>

                        <div className="portfolio-grid">
                            {/* Mock Images - Using colored divs for placeholder */}
                            <div className="portfolio-item" style={{ background: '#e0f2fe' }}></div>
                            <div className="portfolio-item" style={{ background: '#dbeafe' }}></div>
                            <div className="portfolio-item" style={{ background: '#e0e7ff' }}></div>
                            <div className="portfolio-item" style={{ background: '#fae8ff' }}></div>
                            <div className="portfolio-item" style={{ background: '#fce7f3' }}></div>

                            <button className="add-portfolio-btn">
                                <FaPlus />
                                <span>Ajouter</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
