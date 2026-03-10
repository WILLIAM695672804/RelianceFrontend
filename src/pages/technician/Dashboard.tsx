import React from 'react';
import {
    FaCalendarAlt,
    FaSyncAlt,
    FaFilter,
    FaDownload,
    FaEllipsisV,
    FaArrowUp,
    FaArrowDown
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard: React.FC = () => {

    return (
        <div className="tech-page dashboard-page">

            {/* Top Bar */}
            <div className="dashboard-top-bar">
                <div className="dashboard-controls">
                    <div className="control-btn">
                        <FaCalendarAlt color="#94a3b8" />
                        <span>Fév 2026</span>
                        <select className="control-select">
                            <option>Mensuel</option>
                            <option>Hebdo</option>
                        </select>
                    </div>
                    <button className="control-btn icon-btn" title="Actualiser">
                        <FaSyncAlt color="#64748b" />
                    </button>
                    <button className="control-btn icon-btn" title="Filtres">
                        <FaFilter color="#64748b" />
                    </button>
                </div>
                <button className="export-btn">
                    <FaDownload color="#64748b" /> Export Data
                </button>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                {/* Card 0:solde */}
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Solde</span>
                        <FaEllipsisV className="kpi-more" />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-value">2 000 000 FCFA</span>
                        <span className="kpi-trend negative"><FaArrowDown /> 5%</span>
                    </div>
                    <div className="kpi-footer">Depuis le mois dernier</div>
                </div>
                {/* Card 1: Revenues */}
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Revenus (Mois)</span>
                        <FaEllipsisV className="kpi-more" />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-value">2 315K</span>
                        <span className="kpi-trend positive"><FaArrowUp /> 5%</span>
                    </div>
                    <div className="kpi-footer">Depuis le mois dernier</div>
                </div>

                {/* Card 2: Missions */}
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Missions Terminées</span>
                        <FaEllipsisV className="kpi-more" />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-value">154</span>
                        <span className="kpi-trend positive"><FaArrowUp /> 12</span>
                    </div>
                    <div className="kpi-footer">Depuis le mois dernier</div>
                </div>

                {/* Card 3: Acceptance Rate */}
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Taux d'Acceptation</span>
                        <FaEllipsisV className="kpi-more" />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-value">85%</span>
                        <span className="kpi-trend negative"><FaArrowDown /> 5%</span>
                    </div>
                    <div className="kpi-footer">Depuis le mois dernier</div>
                </div>

                {/* Card 4: Rating */}
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-title">Note Moyenne</span>
                        <FaEllipsisV className="kpi-more" />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-value">4.8</span>
                        <span className="kpi-trend positive"><FaArrowUp /> 0.1</span>
                    </div>
                    <div className="kpi-footer">Depuis le mois dernier</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                {/* Bar Chart: Engagement / Revenues */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Statistiques de Revenus</h3>
                        <div className="chart-legend">
                            <div className="legend-item">
                                <span className="legend-dot purple"></span> Interventions
                            </div>
                            <div className="legend-item">
                                <span className="legend-dot cyan"></span> Devis Suppl.
                            </div>
                        </div>
                    </div>

                    <div className="mock-bar-chart">
                        <div className="y-axis">
                            <span>15K</span>
                            <span>10K</span>
                            <span>5K</span>
                            <span>0</span>
                        </div>
                        {/* Mock data bars representing weeks/days */}
                        {[
                            { x: '01', h1: '40%', h2: '20%' },
                            { x: '02', h1: '50%', h2: '65%' },
                            { x: '03', h1: '35%', h2: '45%' },
                            { x: '04', h1: '15%', h2: '8%' },
                            { x: '05', h1: '80%', h2: '60%' },
                            { x: '06', h1: '35%', h2: '35%' },
                            { x: '07', h1: '70%', h2: '30%' },
                            { x: '08', h1: '75%', h2: '65%' },
                        ].map((data, i) => (
                            <div key={i} className="chart-group">
                                <div className="bar purple" style={{ height: data.h1 }}></div>
                                <div className="bar cyan" style={{ height: data.h2 }}></div>
                                <div className="x-label">{data.x}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Line Chart: Performance */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Performance</h3>
                        <FaEllipsisV className="kpi-more" />
                    </div>
                    <div className="ads-metrics">
                        <div className="ads-metric purple">
                            <div className="ads-metric-value">92%</div>
                            <div className="ads-metric-label">Ponctualité</div>
                        </div>
                        <div className="ads-metric cyan">
                            <div className="ads-metric-value">14 min</div>
                            <div className="ads-metric-label">Temps de réponse</div>
                        </div>
                    </div>

                    <div className="mock-line-chart">
                        <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
                            {/* Purple Line */}
                            <path d="M 0,100 C 50,90 100,50 150,70 C 200,90 250,110 300,80 C 350,50 400,20 400,20"
                                fill="none" stroke="#7c3aed" strokeWidth="2" />
                            <path d="M 0,100 C 50,90 100,50 150,70 C 200,90 250,110 300,80 C 350,50 400,20 400,20 L 400,140 L 0,140 Z"
                                fill="rgba(124, 58, 237, 0.05)" stroke="none" />
                            {/* Cyan Line */}
                            <path d="M 0,120 C 50,110 100,80 150,80 C 200,80 250,90 300,100 C 350,110 400,40 400,40"
                                fill="none" stroke="#06b6d4" strokeDasharray="4,4" strokeWidth="2" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="bottom-row">
                {/* Map Widget */}
                <div className="map-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Zone d'Intervention Active</h3>
                        <FaEllipsisV className="kpi-more" />
                    </div>
                    <div className="mock-map">
                        {/* Mock Markers */}
                        <div className="map-marker" style={{ top: '30%', left: '25%' }}>
                            <div className="marker-dot red"></div> Douala
                        </div>
                        <div className="map-marker" style={{ top: '60%', left: '60%' }}>
                            <div className="marker-dot green"></div> Bonapriso
                        </div>
                        <div className="map-marker" style={{ top: '40%', right: '20%' }}>
                            <div className="marker-dot green"></div> Akwa
                        </div>
                    </div>
                </div>

                {/* Table Widget */}
                <div className="table-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Dernières Missions</h3>
                        <FaEllipsisV className="kpi-more" />
                    </div>
                    <table className="latest-traffic-table">
                        <thead>
                            <tr>
                                <th>Mission ID</th>
                                <th>Statut</th>
                                <th>Quartier</th>
                                <th>Modifié</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>M-2684</td>
                                <td><div className="status-cell"><div className="status-dot online"></div> En cours</div></td>
                                <td>Bonanjo</td>
                                <td>Il y a 3 heures</td>
                            </tr>
                            <tr>
                                <td>M-2683</td>
                                <td><div className="status-cell"><div className="status-dot online"></div> En cours</div></td>
                                <td>Deido</td>
                                <td>Il y a 2 heures</td>
                            </tr>
                            <tr>
                                <td>M-2680</td>
                                <td><div className="status-cell"><div className="status-dot offline"></div> Clôturée</div></td>
                                <td>Logpom</td>
                                <td>Hier</td>
                            </tr>
                            <tr>
                                <td>M-2685</td>
                                <td><div className="status-cell"><div className="status-dot pending"></div> En attente</div></td>
                                <td>Akwa</td>
                                <td>Il y a 45 min</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
