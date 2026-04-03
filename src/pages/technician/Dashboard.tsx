import React, { useState, useEffect } from 'react';
import { getTechProfile } from '../../services/technicianService';
import TechServiceMap from '../../components/maps/TechServiceMap';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getTechProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to load profile on dashboard", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (isLoading) {
        return <div className="tech-dashboard-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading Dashboard...</div>;
    }

    return (
        <div className="tech-dashboard-container">
            {/* Left & Center Main Content */}
            <div className="tech-dashboard-main">
                
                {/* Welcome Header */}
                <div className="tech-welcome-header">
                    <div className="tech-welcome-title">
                        <h1>Technician Dashboard</h1>
                        <p>Welcome back, {profile?.name || 'Professional'}. You have 0 pending interventions.</p>
                    </div>
                    <div>
                        <button className="tech-online-btn">
                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>bolt</span>
                            Go Online
                        </button>
                    </div>
                </div>

                {/* KPI Cards Grid */}
                <div className="tech-kpi-grid">
                    {/* Wallet */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon blue">
                                <span className="material-symbols-outlined">account_balance_wallet</span>
                            </div>
                            <span className="tech-kpi-badge green">+12%</span>
                        </div>
                        <p className="tech-kpi-subtitle">Wallet Balance</p>
                        <h3 className="tech-kpi-value">450,200 <span>XAF</span></h3>
                    </div>

                    {/* Monthly Earnings */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon blue">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                            <span className="tech-kpi-badge slate">Current Mo.</span>
                        </div>
                        <p className="tech-kpi-subtitle">Monthly Earnings</p>
                        <h3 className="tech-kpi-value">1,280,000 <span>XAF</span></h3>
                    </div>

                    {/* Completion Rate */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon green">
                                <span className="material-symbols-outlined">task_alt</span>
                            </div>
                        </div>
                        <p className="tech-kpi-subtitle">Completion Rate</p>
                        <h3 className="tech-kpi-value">98.4<span>%</span></h3>
                    </div>

                    {/* Global Rating */}
                    <div className="glass-panel">
                        <div className="tech-kpi-header">
                            <div className="tech-kpi-icon orange">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            </div>
                        </div>
                        <p className="tech-kpi-subtitle">Global Rating</p>
                        <h3 className="tech-kpi-value" style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                            4.92 <span style={{ paddingBottom: '2px' }}>/ 5.0</span>
                        </h3>
                    </div>
                </div>

                {/* Main Charts & Map Bento Grid */}
                <div className="tech-charts-grid">
                    {/* Revenue Breakdown (Donut) */}
                    <div className="tech-card-white">
                        <h4 className="tech-card-title">Revenue Breakdown</h4>
                        <div className="tech-donut-wrapper">
                            <svg viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)', width: '10rem', height: '10rem' }}>
                                <circle cx="80" cy="80" fill="transparent" r="70" stroke="#f1f5f9" strokeWidth="12"></circle>
                                <circle cx="80" cy="80" fill="transparent" r="70" stroke="#1a365d" strokeDasharray="440" strokeDashoffset="110" strokeWidth="12"></circle>
                                <circle cx="80" cy="80" fill="transparent" r="70" stroke="#003f23" strokeDasharray="440" strokeDashoffset="350" strokeWidth="12"></circle>
                            </svg>
                            <div className="tech-donut-text">
                                <span className="tech-donut-percentage">75%</span>
                                <span className="tech-donut-label">Installation</span>
                            </div>
                        </div>
                        <div className="tech-legend-list">
                            <div className="tech-legend-item">
                                <div className="tech-legend-left">
                                    <div className="tech-legend-dot blue"></div>
                                    <span className="tech-legend-name">Installations</span>
                                </div>
                                <span className="tech-legend-amount">960k</span>
                            </div>
                            <div className="tech-legend-item">
                                <div className="tech-legend-left">
                                    <div className="tech-legend-dot green"></div>
                                    <span className="tech-legend-name">Maintenance</span>
                                </div>
                                <span className="tech-legend-amount">320k</span>
                            </div>
                        </div>
                    </div>

                    {/* Intervention Zones (MapLibre) */}
                    <div className="tech-map-card" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
                        <div className="tech-map-overlay-title" style={{ zIndex: 5, pointerEvents: 'none' }}>
                            <h4>Intervention Zones</h4>
                            <p>Live matching within your service radius</p>
                        </div>
                        <TechServiceMap 
                            latitude={profile?.service_perimeter?.latitude || 4.0511} 
                            longitude={profile?.service_perimeter?.longitude || 9.7679} 
                            city={profile?.service_perimeter?.city || 'Cameroon Hub'}
                            radiusInKm={50}
                        />
                    </div>
                </div>

                {/* Field Performance Charts */}
                <div className="tech-card-white">
                    <div className="tech-bar-chart-header">
                        <h4 className="tech-card-title" style={{ margin: 0 }}>Field Performance</h4>
                        <div className="tech-bar-chart-legend">
                            <div className="tech-bar-chart-legend-item">
                                <div className="tech-bar-chart-legend-color" style={{ backgroundColor: '#1960a3' }}></div>
                                <span className="tech-bar-chart-legend-text">Punctuality</span>
                            </div>
                            <div className="tech-bar-chart-legend-item">
                                <div className="tech-bar-chart-legend-color" style={{ backgroundColor: '#e2e8f0' }}></div>
                                <span className="tech-bar-chart-legend-text">Response Time</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="tech-bar-chart-area">
                        {[
                            { day: 'MON', p: '80%', r: '40%' },
                            { day: 'TUE', p: '95%', r: '30%' },
                            { day: 'WED', p: '70%', r: '60%' },
                            { day: 'THU', p: '85%', r: '45%' },
                            { day: 'FRI', p: '90%', r: '20%' },
                            { day: 'SAT', p: '60%', r: '15%' },
                        ].map((item, idx) => (
                            <div key={idx} className="tech-bar-group">
                                <div className="tech-bars-wrapper">
                                    <div className="tech-bar primary" style={{ height: item.p }}></div>
                                    <div className="tech-bar secondary" style={{ height: item.r }}></div>
                                </div>
                                <span className="tech-bar-label">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mission Status Table */}
                <div className="tech-table-card-modern">
                    <div className="tech-table-header-modern">
                        <h4>Missions History</h4>
                        <button>View All Missions</button>
                    </div>
                    <div className="tech-table-container">
                        <table className="tech-table-modern">
                            <thead>
                                <tr>
                                    <th>Mission ID</th>
                                    <th>Client / Location</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Earnings</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="tech-table-id">#RX-4492</td>
                                    <td>
                                        <div className="tech-table-client-info">
                                            <span className="tech-table-client-name">Avenue de Gaulle</span>
                                            <span className="tech-table-client-loc">Bonapriso, Douala</span>
                                        </div>
                                    </td>
                                    <td><span className="tech-table-type">Electrical</span></td>
                                    <td><span className="tech-table-status progress">IN PROGRESS</span></td>
                                    <td className="tech-table-price">25,000</td>
                                    <td><button className="tech-table-action-btn"><span className="material-symbols-outlined">more_horiz</span></button></td>
                                </tr>
                                <tr>
                                    <td className="tech-table-id">#RX-4481</td>
                                    <td>
                                        <div className="tech-table-client-info">
                                            <span className="tech-table-client-name">Immeuble Krystal</span>
                                            <span className="tech-table-client-loc">Akwa, Douala</span>
                                        </div>
                                    </td>
                                    <td><span className="tech-table-type">HVAC</span></td>
                                    <td><span className="tech-table-status closed">CLOSED</span></td>
                                    <td className="tech-table-price">48,500</td>
                                    <td><button className="tech-table-action-btn"><span className="material-symbols-outlined">more_horiz</span></button></td>
                                </tr>
                                <tr>
                                    <td className="tech-table-id">#RX-4475</td>
                                    <td>
                                        <div className="tech-table-client-info">
                                            <span className="tech-table-client-name">Total Station</span>
                                            <span className="tech-table-client-loc">Yassa, Douala</span>
                                        </div>
                                    </td>
                                    <td><span className="tech-table-type">Plumbing</span></td>
                                    <td><span className="tech-table-status pending">PENDING</span></td>
                                    <td className="tech-table-price">12,000</td>
                                    <td><button className="tech-table-action-btn"><span className="material-symbols-outlined">more_horiz</span></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Right Sidebar (Pro Network) */}
            <div className="tech-dashboard-sidebar">
                <div className="tech-sidebar-container">
                    <div className="tech-sidebar-header">
                        <h4 className="tech-sidebar-title">Pro Network</h4>
                        <span className="tech-sidebar-live">LIVE</span>
                    </div>

                    <div className="tech-feed-list">
                        <div className="tech-network-item">
                            <div className="tech-network-avatar">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjB9F1sZRdipDtg-mBNo-7dkG7YMQNbLlYfIKmw8eqnte0_QynBX2JWKJv9LA6GD4mi6_qcQuf9dYZHu_i3o5dblotDEeRdvrOs6M3U6YR858QnEPdgenlvVt4SCvSnd4gZ0FQEA_jRD15B4iNgYoe1gIE_37tdzc5U-yGBquDQ-XS-eX9EzpSjb0_N2keubM0UgFzx_S4VmS48-Y8H3XmDu4S6YJCjSaJY1QE-sMKfcG6m-ZG3osAdRYT7qjYsS8APZxwLf4PqQ" alt="User" />
                            </div>
                            <div className="tech-network-content">
                                <p><span>Jerome K.</span> just completed a Gold-tier maintenance.</p>
                                <p className="tech-network-time">2 mins ago</p>
                            </div>
                        </div>

                        <div className="tech-network-item">
                            <div className="tech-network-avatar">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEqwlGcaa91KjbvREAedoHREv_icH9T1tGGNABKO5F6hxIYfUbQKp-y0qQp7No5xDB1r1G9_L8EGucuZdhbFM2tPJgJFbA1pB9A4YsWSjTPRLSMgZr7Vi3RTFKSILE13Wsqasdka3ydHDAfa2dJe1kg8rpfoKQpxk9VEGR3eHMs8PoORS3wZFrPHrjW5ah46bocm5u9xejD9daRtRdh_5BXwnkpyXAvvKoqgPyN5k8YnQ3z7ZiuMd7w7_wt4taeXKe5fiTGVHwJw" alt="User" />
                            </div>
                            <div className="tech-network-content">
                                <p><span>Sandra M.</span> is now online in <span className="blue">Douala West</span>.</p>
                                <p className="tech-network-time">15 mins ago</p>
                            </div>
                        </div>

                        <div className="tech-network-item">
                            <div className="tech-network-icon">
                                <span className="material-symbols-outlined">workspace_premium</span>
                            </div>
                            <div className="tech-network-content">
                                <p><span>New Badge!</span> You've unlocked the "Punctual Pro" status.</p>
                                <p className="tech-network-time">1 hour ago</p>
                            </div>
                        </div>
                    </div>

                    <hr className="tech-sidebar-divider" />

                    {/* Promo Card */}
                    <div className="tech-promo-card">
                        <div className="tech-promo-content">
                            <h5 className="tech-promo-title">Reliance Premium</h5>
                            <p className="tech-promo-desc">Boost your mission visibility and get exclusive priority support.</p>
                            <button className="tech-promo-btn">Upgrade Now</button>
                        </div>
                        <span className="material-symbols-outlined bg-icon">verified_user</span>
                    </div>

                    {/* Helpful Links */}
                    <div className="tech-helpful-links">
                        <a href="#" className="tech-link-item">
                            <span className="material-symbols-outlined">support_agent</span>
                            Contact Tech Support
                        </a>
                        <a href="#" className="tech-link-item">
                            <span className="material-symbols-outlined">menu_book</span>
                            Resource Center
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
