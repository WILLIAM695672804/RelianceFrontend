import React from 'react';
import './Trophies.css';

const Trophies: React.FC = () => {
    // Mock Data
    const currentLevel = 7;
    const currentXP = 3450;
    const nextLevelXP = 5000;
    const progressPercent = (currentXP / nextLevelXP) * 100;

    const trophies = [
        {
            id: 1,
            title: "Premier Pas",
            description: "Avoir complété sa première mission avec succès.",
            icon: "🥇",
            current: 1,
            max: 1,
            completed: true,
            date: "12 Jan 2026"
        },
        {
            id: 2,
            title: "Expert 5 Étoiles",
            description: "Obtenir 50 avis notés 5 étoiles.",
            icon: "⭐",
            current: 42,
            max: 50,
            completed: false,
            date: null
        },
        {
            id: 3,
            title: "Marathonien",
            description: "Travailler plus de 100 heures cumulées.",
            icon: "⏱️",
            current: 100,
            max: 100,
            completed: true,
            date: "10 Fév 2026"
        },
        {
            id: 4,
            title: "Mécène",
            description: "Parrainer 5 nouveaux techniciens sur la plateforme.",
            icon: "🤝",
            current: 1,
            max: 5,
            completed: false,
            date: null
        },
        {
            id: 5,
            title: "Impeccable",
            description: "Aucun retard signalé sur 10 missions consécutives.",
            icon: "🚀",
            current: 8,
            max: 10,
            completed: false,
            date: null
        },
        {
            id: 6,
            title: "Légende Reliance",
            description: "Atteindre le niveau 50.",
            icon: "👑",
            current: 7,
            max: 50,
            completed: false,
            date: null,
            locked: true
        }
    ];

    return (
        <div className="tech-page trophies-page" style={{ paddingTop: 0, marginTop: 0, boxShadow: 'none' }}>
            {/* Level & XP Hero */}
            <div className="trophies-hero">
                <div className="level-info">
                    <div className="current-level">
                        <div className="level-badge-large">{currentLevel}</div>
                        <div className="level-text">
                            <h2>Expert Gold</h2>
                            <span>Niveau {currentLevel}</span>
                        </div>
                    </div>
                    <div className="next-rank">
                        <h4>Prochain Rang : Master</h4>
                        <p>Plus que {nextLevelXP - currentXP} XP</p>
                    </div>
                </div>

                <div className="xp-bar-wrapper">
                    <div className="xp-bar-container">
                        <div className="xp-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="xp-stats">
                        <span>{currentXP} XP</span>
                        <span>{nextLevelXP} XP</span>
                    </div>
                </div>
            </div>

            {/* Trophies Grid */}
            <h2 style={{ marginBottom: '20px', color: '#334155' }}>Collection de Badges</h2>
            <div className="trophies-grid">
                {trophies.map(trophy => (
                    <div key={trophy.id} className={`trophy-card ${trophy.completed ? 'completed' : ''} ${trophy.locked ? 'locked' : ''}`}>
                        <div className="trophy-icon">{trophy.icon}</div>
                        <div className="trophy-info">
                            <h3>{trophy.title}</h3>
                            <p>{trophy.description}</p>

                            {!trophy.locked && (
                                <div className="trophy-progress">
                                    <span className="progress-label">
                                        {trophy.completed ? 'Complété' : `${trophy.current} / ${trophy.max}`}
                                    </span>
                                    <div className="mini-progress-bar">
                                        <div
                                            className="mini-progress-fill"
                                            style={{ width: `${(trophy.current / trophy.max) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {trophy.completed && trophy.date && (
                                <div className="trophy-date">Obtenu le {trophy.date}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Trophies;
