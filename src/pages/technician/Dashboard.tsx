import React, { useState, useEffect } from 'react';
import {
    FaCloudSun,
    FaWallet,
    FaStar,
    FaMapMarkerAlt,
    FaClock,
    FaTools,
    FaBolt,
    FaSnowflake,
    FaPowerOff
} from 'react-icons/fa';
import './Dashboard.css';

interface Job {
    id: string;
    title: string;
    type: 'PLUMBING' | 'ELECTRICITY' | 'AC';
    distance: string;
    price: string;
    timeLeft: number; // seconds
}

const initialJobs: Job[] = [
    {
        id: '1',
        title: 'Fuite d\'eau salle de bain',
        type: 'PLUMBING',
        distance: '2.5 km',
        price: '15.000 FCFA',
        timeLeft: 59
    },
    {
        id: '2',
        title: 'Panne climatiseur Split',
        type: 'AC',
        distance: '4.1 km',
        price: '25.000 FCFA',
        timeLeft: 120
    }
];

const Dashboard: React.FC = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [jobs, setJobs] = useState<Job[]>(initialJobs);

    // Timer effect
    useEffect(() => {
        if (!isOnline) return;

        const interval = setInterval(() => {
            setJobs(currentJobs =>
                currentJobs.map(job => ({
                    ...job,
                    timeLeft: job.timeLeft > 0 ? job.timeLeft - 1 : 0
                })).filter(job => job.timeLeft > 0)
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [isOnline]);

    const handleToggleOnline = () => {
        setIsOnline(!isOnline);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'PLUMBING': return <FaTools />;
            case 'ELECTRICITY': return <FaBolt />;
            case 'AC': return <FaSnowflake />;
            default: return <FaTools />;
        }
    };

    return (
        <div className="tech-page dashboard-page">
            {/* Header with Switch */}
            <div className="dashboard-header">
                <div className="welcome-text">
                    <h1>Bonjour, William 👋</h1>
                    <p>Prêt pour une nouvelle journée ?</p>
                </div>
                <div className="status-toggle">
                    <span className={`toggle-label ${isOnline ? 'online' : 'offline'}`}>
                        {isOnline ? 'EN LIGNE' : 'HORS LIGNE'}
                    </span>
                    <label className="switch">
                        <input type="checkbox" checked={isOnline} onChange={handleToggleOnline} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>

            {/* Widgets */}
            <div className="widgets-grid">
                <div className="widget-card">
                    <div className="widget-icon weather">
                        <FaCloudSun />
                    </div>
                    <div className="widget-content">
                        <h3>Météo • Douala</h3>
                        <p className="widget-value">28°C</p>
                        <p className="widget-subtext">Ciel partiellement couvert</p>
                    </div>
                </div>

                <div className="widget-card">
                    <div className="widget-icon finance">
                        <FaWallet />
                    </div>
                    <div className="widget-content">
                        <h3>Solde du jour</h3>
                        <p className="widget-value">15.000 FCFA</p>
                        <p className="widget-subtext">3 missions complétées</p>
                    </div>
                </div>

                <div className="widget-card">
                    <div className="widget-icon rating">
                        <FaStar />
                    </div>
                    <div className="widget-content">
                        <h3>Ma Note</h3>
                        <p className="widget-value">4.8 / 5</p>
                        <p className="widget-subtext">Basée sur 42 avis</p>
                    </div>
                </div>
            </div>

            {/* Job Feed */}
            <div className="job-feed-section">
                <div className="section-header">
                    <div className="feed-title">
                        Fil d'Actualité {isOnline && <span className="live-badge">LIVE</span>}
                    </div>
                    {isOnline && <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Recherche de missions à proximité...</span>}
                </div>

                {isOnline ? (
                    jobs.length > 0 ? (
                        <div className="job-list">
                            {jobs.map(job => (
                                <div key={job.id} className="job-card">
                                    <div
                                        className="job-progress-bar"
                                        style={{ width: `${(job.timeLeft / 120) * 100}%` }}
                                    ></div>

                                    <div className="job-main-info">
                                        <div className="job-type-icon">
                                            {getIcon(job.type)}
                                        </div>
                                        <div className="job-details">
                                            <h4>{job.title}</h4>
                                            <div className="job-meta">
                                                <span><FaMapMarkerAlt /> {job.distance}</span>
                                                <span><FaClock /> Arrivée ~15 min</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="job-price">
                                        <span className="price-tag">{job.price}</span>
                                        <span className="timer-tag">
                                            <FaClock /> {formatTime(job.timeLeft)}
                                        </span>
                                    </div>

                                    <div className="job-actions">
                                        <button className="btn-refuse">REFUSER</button>
                                        <button className="btn-accept">ACCEPTER</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="offline-state" style={{ padding: '30px' }}>
                            <FaClock className="offline-icon" style={{ fontSize: '2rem' }} />
                            <p>Aucune nouvelle mission pour le moment.<br />Restez connecté...</p>
                        </div>
                    )
                ) : (
                    <div className="offline-state">
                        <FaPowerOff className="offline-icon" />
                        <h3>Vous êtes hors ligne</h3>
                        <p>Passez en ligne pour recevoir des propositions de mission.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
