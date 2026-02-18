import React from 'react';
import './Stats.css';

const Stats: React.FC = () => {
    const stats = [
        { value: '500+', label: 'Techniciens actifs' },
        { value: '2,000+', label: 'Interventions réussies' },
        { value: '4.8/5', label: 'Note moyenne' },
        { value: '98%', label: 'Clients satisfaits' }
    ];

    return (
        <section id="statistiques" className="stats section">
            <div className="stats-overlay"></div>
            <div className="container stats-content">
                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-item">
                            <h3 className="stat-value">{stat.value}</h3>
                            <p className="stat-label">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
