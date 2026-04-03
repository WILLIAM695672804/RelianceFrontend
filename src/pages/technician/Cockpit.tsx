import React from 'react';
import TechServiceMap from '../../components/maps/TechServiceMap';
import './Cockpit.css';

const Cockpit: React.FC = () => {
    return (
        <div className="tech-cockpit-page">
            <section className="tech-cockpit-grid">
                {/* Left Column */}
                <div className="tech-cockpit-main">
                    <div className="tech-cockpit-hero">
                        <div>
                            <p className="tech-hero-subtitle">Current Session</p>
                            <h2 className="tech-hero-title">Cockpit Control</h2>
                        </div>
                        <div className="tech-hero-stats">
                            <div className="tech-stat-box">
                                <p>Active Time</p>
                                <p className="stat-value primary">4h 12m</p>
                            </div>
                            <div className="tech-stat-box">
                                <p>Nearby Opportunities</p>
                                <p className="stat-value tertiary">3</p>
                            </div>
                        </div>
                    </div>

                    <div className="tech-earnings-bento">
                        <div className="tech-earnings-bg-circle"></div>
                        <div className="tech-bento-content">
                            <div>
                                <span className="material-symbols-outlined bento-icon" style={{fontVariationSettings:"'FILL' 1"}}>payments</span>
                                <h3>Potential Earnings</h3>
                                <p className="tech-bento-value">12,500 <span>XAF</span></p>
                            </div>
                            <div className="tech-bento-footer">
                                <p>Calculated based on 3 open tickets in your perimeter</p>
                                <button>View Breakdown</button>
                            </div>
                        </div>
                    </div>

                    <div className="tech-opportunities-grid">
                        <div className="tech-opp-card">
                            <div className="tech-opp-header">
                                <div className="tech-opp-icon">
                                    <span className="material-symbols-outlined">ac_unit</span>
                                </div>
                                <span className="tech-opp-badge">HIGH DEMAND</span>
                            </div>
                            <h4>HVAC Maintenance</h4>
                            <p>Bonapriso, Douala (2.4km)</p>
                            <div className="tech-opp-footer">
                                <p className="tech-opp-price">4,500 XAF</p>
                                <span className="material-symbols-outlined">chevron_right</span>
                            </div>
                        </div>
                        <div className="tech-opp-card">
                            <div className="tech-opp-header">
                                <div className="tech-opp-icon">
                                    <span className="material-symbols-outlined">bolt</span>
                                </div>
                            </div>
                            <h4>Panel Upgrade</h4>
                            <p>Akwa, Douala (1.1km)</p>
                            <div className="tech-opp-footer">
                                <p className="tech-opp-price">8,000 XAF</p>
                                <span className="material-symbols-outlined">chevron_right</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Active Journey */}
                <div className="tech-cockpit-sidebar">
                    <div className="tech-journey-card">
                        <div className="tech-journey-header">
                            <h3>Active Journey</h3>
                            <button>Details</button>
                        </div>
                        <div className="tech-journey-map" style={{ height: '300px' }}>
                            <TechServiceMap 
                                latitude={4.0511} // Fixed for Cockpit demo
                                longitude={9.7679}
                                radiusInKm={5} 
                            />
                            <div className="tech-journey-route">
                                <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1", color: '#2563eb'}}>location_on</span>
                                <span>Route: 12 min</span>
                            </div>
                        </div>
                        <div className="tech-journey-info">
                            <span className="tech-journey-badge">In Progress</span>
                            <h4>Industrial HVAC Repair</h4>
                            <p className="tech-layer-client">Client: SABC Beverage Facility</p>
                            
                            <div className="tech-journey-details">
                                <div className="tech-detail-row">
                                    <span className="material-symbols-outlined icon-faded">inventory_2</span>
                                    <div>
                                        <p className="detail-label">Required Parts</p>
                                        <p className="detail-value">Filter Assembly, Coolant X-12</p>
                                    </div>
                                </div>
                                <div className="tech-detail-row">
                                    <span className="material-symbols-outlined icon-faded">history</span>
                                    <div>
                                        <p className="detail-label">Estimated Finish</p>
                                        <p className="detail-value">16:45 (Local Time)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="tech-journey-actions">
                                <button className="tech-btn-complete">
                                    <span>Complete Checklist</span>
                                    <span className="material-symbols-outlined">fact_check</span>
                                </button>
                                <button className="tech-btn-delay">Report Delay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Cockpit;
