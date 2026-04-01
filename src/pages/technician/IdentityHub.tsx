import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IdentityHub.css';

const IdentityHub: React.FC = () => {
    const [isFabOpen, setIsFabOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="tech-profile-page">
            <div className="tech-profile-header-wrap">
                <h1 className="tech-profile-title">Professional Profile</h1>
            </div>

            {/* Profile Header Section */}
            <section className="tech-profile-card tech-profile-hero">
                {/* Decorative Background Shape */}
                <div className="tech-profile-bg-shape"></div>
                
                <div className="tech-profile-avatar-wrapper">
                    <img 
                        className="tech-profile-avatar" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDApdzrtN2CY7S77Ae06vC61H1UTCsmCZMrTYTl7tQrRezWqxBN9NV9Vtezvji2jOiGOcZMRAmdh8lh5iFsWkgXW6ltEfqrfBN7-oqMJzX8mbLgXbwkA0XXANGkBn5p09BpYCZvwp26K2c3AXEK-pJ9_iLLycYP0EJadP26RWwfn-jmEK1hgkSyKHKG_MFsu2bSxl1KulTBBDJ1Ki_2JCSW26S3FdbYk9kwGtytV3dIhJ4hfBK8QnKmKJ68ioZkSO8ydn6-BjDonw" 
                        alt="Professional headshot" 
                    />
                    <div className="tech-profile-verified-badge">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                    </div>
                </div>

                <div className="tech-profile-info">
                    <div className="tech-profile-name-row">
                        <h2>Marcus T.</h2>
                        <span className="tech-badge-verified">Verified Specialist</span>
                    </div>
                    <p className="tech-profile-id">Tech ID: 88291</p>
                    
                    <div className="tech-profile-stats">
                        <div className="tech-stat-item">
                            <span className="material-symbols-outlined text-yellow-500" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                            <span className="tech-stat-bold">4.9</span>
                            <span className="tech-stat-muted">(124 Reviews)</span>
                        </div>
                        <div className="tech-stat-divider"></div>
                        <div className="tech-stat-item text-muted">
                            <span className="material-symbols-outlined">task_alt</span>
                            <span>248 Missions Completed</span>
                        </div>
                    </div>
                </div>

                <div className="tech-profile-actions">
                    <button className="tech-btn-public">Public View</button>
                    <button className="tech-btn-share">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </section>

            {/* Bento Grid Layout */}
            <div className="tech-profile-grid">
                
                {/* Personal Information (Main Column) */}
                <div className="tech-profile-main">
                    
                    {/* Personal Info */}
                    <div className="tech-profile-card">
                        <div className="tech-card-header">
                            <h3>Personal Information</h3>
                            <button className="tech-btn-text">
                                <span className="material-symbols-outlined text-sm">edit</span> Edit
                            </button>
                        </div>
                        <div className="tech-info-grid">
                            <div className="tech-info-item">
                                <label>Full Name</label>
                                <p>Marcus Thompson</p>
                            </div>
                            <div className="tech-info-item">
                                <label>Email Address</label>
                                <p>m.thompson@reliance.tech</p>
                            </div>
                            <div className="tech-info-item">
                                <label>Phone Number</label>
                                <p>+237 670 000 000</p>
                            </div>
                            <div className="tech-info-item">
                                <label>Languages</label>
                                <div className="tech-lang-tags">
                                    <span>French</span>
                                    <span>English</span>
                                </div>
                            </div>
                        </div>
                        <div className="tech-info-bio">
                            <label>Professional Bio</label>
                            <p>Certified HVAC Specialist with over 8 years of experience in high-precision cooling systems and residential maintenance. Dedicated to providing efficient, long-lasting solutions for modern infrastructure. Specialist in advanced thermodynamic diagnostics and green energy installations.</p>
                        </div>
                    </div>

                    {/* Service Perimeter */}
                    <div className="tech-profile-card">
                        <div className="tech-card-header">
                            <h3>Service Perimeter</h3>
                            <button className="tech-btn-text">
                                <span className="material-symbols-outlined text-sm">map</span> Update Area
                            </button>
                        </div>
                        
                        <div className="tech-map-container">
                            <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-gHUd6twbBX2413_MezCAV3lIOOCxNuBFYLE5w5x7HWbILrIaMhpF66yxknjNKVWYIwhuNj_3VsXxDk-nMiHR3LP7qKtYjmGJvXllz8JZO2JyJGGz-oyxbbUM84RYL4DUm7rY3hFEauYyuf-jPAr7EgD7aaFRZwG4YnffT0vNb8VlKqtob3C3abMeQ1Kp7IwIrWycSVRTok1cfu3Y3IDITY_-trZxN-4IasC4J3C0LDnlfq0jo99bUktKLCudVk3QUJC68mcjrA" 
                                alt="Service Zones" 
                            />
                            <div className="tech-map-overlay-tint"></div>
                            {/* Map Overlay UI */}
                            <div className="tech-map-ui">
                                <span className="material-symbols-outlined text-secondary">location_on</span>
                                <div>
                                    <p className="tech-map-ui-title">Active Hub</p>
                                    <p className="tech-map-ui-desc">Douala Metropolitan Area</p>
                                </div>
                            </div>
                        </div>

                        <div className="tech-zone-tags">
                            <span className="tech-zone-tag">
                                <span className="material-symbols-outlined">check_circle</span> Akwa
                            </span>
                            <span className="tech-zone-tag">
                                <span className="material-symbols-outlined">check_circle</span> Bonamoussadi
                            </span>
                            <span className="tech-zone-tag">
                                <span className="material-symbols-outlined">check_circle</span> Bali
                            </span>
                            <span className="tech-zone-tag">
                                <span className="material-symbols-outlined">check_circle</span> Deido
                            </span>
                        </div>
                    </div>

                </div>

                {/* Settings & Status (Side Column) */}
                <div className="tech-profile-sidebar">
                    
                    {/* Trust/KYC Status Card */}
                    <div className="tech-kyc-card">
                        <div className="tech-kyc-bg-icon">
                            <span className="material-symbols-outlined">verified_user</span>
                        </div>
                        <div className="z-10 relative">
                            <h4>KYC Status</h4>
                            <p>Your identity documents are fully verified.</p>
                            <div className="tech-kyc-status">
                                <span className="tech-kyc-dot"></span>
                                <span className="tech-kyc-label">Fully Compliant</span>
                            </div>
                            <button className="tech-btn-kyc">View Credentials</button>
                        </div>
                    </div>

                    {/* Account Settings Links */}
                    <div className="tech-profile-card">
                        <h3 className="tech-settings-title">Account Settings</h3>
                        <div className="tech-settings-list">
                            <a href="#" className="tech-settings-item">
                                <div className="tech-settings-item-main">
                                    <span className="material-symbols-outlined">security</span>
                                    <span>Login &amp; Security</span>
                                </div>
                                <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                            </a>
                            <a href="#" className="tech-settings-item">
                                <div className="tech-settings-item-main">
                                    <span className="material-symbols-outlined">notifications_active</span>
                                    <span>Notification Preferences</span>
                                </div>
                                <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                            </a>
                            <a href="#" className="tech-settings-item">
                                <div className="tech-settings-item-main">
                                    <span className="material-symbols-outlined">payments</span>
                                    <span>Payout Settings</span>
                                </div>
                                <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                            </a>
                            <a href="#" className="tech-settings-item">
                                <div className="tech-settings-item-main">
                                    <span className="material-symbols-outlined">privacy_tip</span>
                                    <span>Data &amp; Privacy</span>
                                </div>
                                <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                            </a>
                        </div>
                        <div className="tech-settings-footer">
                            <button className="tech-btn-logout">
                                <span className="material-symbols-outlined">logout</span> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Help Widget */}
                    <div className="tech-help-card">
                        <span className="material-symbols-outlined tech-help-icon">contact_support</span>
                        <h4>Need assistance?</h4>
                        <p>Our dedicated technician support team is available 24/7.</p>
                        <button className="tech-btn-text">Contact Support</button>
                    </div>

                </div>
            </div>
            {/* Backdrop pour l'effet de flou et fermer en cliquant à côté */}
            <div 
                className={`tech-fab-backdrop ${isFabOpen ? 'open' : ''}`}
                onClick={() => setIsFabOpen(false)}
            ></div>

            {/* Floating Action Button (FAB) */}
            <div className="tech-fab-container">
                <div className={`tech-fab-menu ${isFabOpen ? 'open' : ''}`}>
                    <button 
                        className="tech-fab-item"
                        onClick={() => navigate('/technicien/competences')}
                    >
                        <span className="material-symbols-outlined">workspace_premium</span>
                        Certification
                    </button>
                    <button 
                        className="tech-fab-item"
                        onClick={() => navigate('/technicien/audit-sla')}
                    >
                        <span className="material-symbols-outlined">gavel</span>
                        Compliance
                    </button>
                </div>
                <button 
                    className={`tech-fab-main ${isFabOpen ? 'open' : ''}`}
                    onClick={() => setIsFabOpen(!isFabOpen)}
                    aria-label="Menu d'actions"
                >
                    <span className="material-symbols-outlined">
                        {isFabOpen ? 'close' : 'add'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default IdentityHub;
