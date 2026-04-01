import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientDashboardModern.css';

const ClientDashboardModern: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="stitch-modern-wrapper">

            <main className="sm-main-content">
                
                {/* Hero Section: Ask AI */}
                <section className="sm-hero-section">
                    <div className="sm-hero-blobs">
                        <div className="sm-blob-1"></div>
                        <div className="sm-blob-2"></div>
                    </div>
                    
                    <div className="sm-hero-content">
                        <h1 className="sm-hero-title">What can we help you fix today?</h1>
                        <div className="sm-search-group">
                            <input type="text" className="sm-hero-input" placeholder="Describe the issue (e.g. 'Leaking pipe in master bathroom')" />
                            <button className="sm-ask-ai-btn">
                                <span className="material-symbols-outlined">auto_awesome</span>
                                Ask AI
                            </button>
                        </div>
                        <div className="sm-suggestions">
                            <span className="sm-sug-label">Suggestions:</span>
                            <button className="sm-sug-btn">Plumbing</button>
                            <button className="sm-sug-btn">Electrical</button>
                            <button className="sm-sug-btn">HVAC</button>
                            <button className="sm-sug-btn">Smart Home</button>
                        </div>
                    </div>
                </section>

                {/* Bento Grid */}
                <div className="sm-bento-grid">
                    
                    {/* Left Column: Stats */}
                    <div className="sm-col-stats">
                        <div className="sm-dispatch-card glass-card">
                            <div className="sm-ping-container">
                                <span className="sm-ping-animate"></span>
                                <span className="sm-ping-dot"></span>
                            </div>
                            <p className="sm-dispatch-subtitle">Estimated Dispatch</p>
                            <h3 className="sm-dispatch-time">12 <span>min</span></h3>
                            <p className="sm-dispatch-desc">Top-rated technicians in your zone are currently active.</p>
                            <div className="sm-dispatch-footer">
                                <span className="material-symbols-outlined text-[14px]">bolt</span>
                                Priority Queue Active
                            </div>
                        </div>

                        <div className="sm-summary-stats">
                            <div className="sm-stat-item">
                                <div className="sm-stat-left">
                                    <div className="sm-stat-icon sm-icon-1"><span className="material-symbols-outlined">construction</span></div>
                                    <div>
                                        <p className="sm-stat-name">Active Interventions</p>
                                        <p className="sm-stat-value">02</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined" style={{color: '#cbd5e1'}}>chevron_right</span>
                            </div>

                            <div className="sm-stat-item">
                                <div className="sm-stat-left">
                                    <div className="sm-stat-icon sm-icon-2"><span className="material-symbols-outlined">account_balance_wallet</span></div>
                                    <div>
                                        <p className="sm-stat-name">Pending Escrow</p>
                                        <p className="sm-stat-value">45,500 <span style={{fontSize: '0.75rem', color: '#64748b'}}>XAF</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="sm-stat-item">
                                <div className="sm-stat-left">
                                    <div className="sm-stat-icon sm-icon-3"><span className="material-symbols-outlined">monitoring</span></div>
                                    <div>
                                        <p className="sm-stat-name">Lifetime Spend</p>
                                        <p className="sm-stat-value">820,000 <span style={{fontSize: '0.75rem', color: '#64748b', fontWeight: 'normal'}}>XAF</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Column: Map & Tech Profile */}
                    <div className="sm-col-map">
                        <div className="sm-map-container">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmOdRi9w3w5DCbNGNg5MLruo2Ub8FrYNVATSUkMAEuej1Q_YzLBtpPpJzYP1XEF6GYRK1mrSKVRtSSq5eJwkI9_o3WCbAQmto6cSaiAFAOLXwXv3pbt4N0GkbirmN5RLf3D8oNQ5W2OQ13isH7EvszzO4d4XSIc0Jwxq_F6VGx2S1M3_IF4UGP1ILkUaUHJP0MfcNM65ADp5MklFwbV0U5pFbq4ZJcP-eOmp4OmebuZ5nYgHz4ResEbgepvs6fpS4MSedfywYZVw" alt="Map" className="sm-map-img" />
                            
                            <div className="sm-map-marker">
                                <div className="sm-marker-avatar">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH-wn2eQoUJ31i2-ogAlYD-0J9aHyW3OsvWkobI3EK1DWU_eI5ZAVKozCMsKwpFu4uVg4qtLOvoY913717cvIVOtYdYKbTleojqOfUgI0Xn7rq4u5k8nqDCr3p9ioeEsCx2n9sYxnNIxzd11N-rPnwuhftmxW1d64qx8XqFC9gGge_j3d1M5fFIohF9pK2AcXQ5nITj11QYYG_7gHx7dTmPldZ0s22DAiQ-jKlx9kFxYCO8sBC99MDEr4r8ekUVYfusCykyxwCXg" alt="Marker" />
                                </div>
                                <div className="sm-marker-label">Jean-Marc T.</div>
                            </div>

                            <div className="sm-floating-tech">
                                <div className="sm-tech-glass glass-card">
                                    <div className="sm-tech-img-box">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7CE1-7mRv-P1s9sSUhbGvn44RPKARE3osGYRlQtg5bYs4ajg3Pnh5-DmH4Y93ncmFN30MK_fZFaPxQxvoXw8kubGz3yai8OVwBURQEgf2NGgbICaFPmtI3fxUwhgkLMedU_yq0gXOIZGb4_6YKAoCP-5ahKqobGnnWlFR3AMWwvJn70s2sXV_pTIcqT24rztTKhrL8aI7d5gC8lAQ7zaXb4W5hRG79b2_0otDyCDge8w-OiA4YeZmayvl_vlK-_bFT7G_Bu2FAw" alt="Jean-Marc T." />
                                    </div>
                                    <div className="sm-tech-info">
                                        <div className="sm-tech-header">
                                            <h4>Jean-Marc T.</h4>
                                            <span className="sm-tech-rating">
                                                <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                                4.9
                                            </span>
                                        </div>
                                        <p className="sm-tech-desc">Expert Electrician • 12km away</p>
                                        <div className="sm-tech-actions">
                                            <button className="sm-btn-primary" onClick={() => navigate('/espace-client/demande')}>Request Now</button>
                                            <button className="sm-btn-outline">View Profile</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Status Updates */}
                    <div className="sm-col-status">
                        <div className="sm-status-card">
                            <h4 className="sm-status-title">
                                <span className="material-symbols-outlined" style={{color: 'var(--ds-secondary)'}}>history</span>
                                Status Updates
                            </h4>

                            <div className="sm-timeline">
                                <div className="sm-timeline-line"></div>
                                
                                <div className="sm-tl-item">
                                    <div className="sm-tl-dot sm-dot-1"></div>
                                    <div className="sm-tl-content">
                                        <p className="sm-tl-title">Job Completed</p>
                                        <p className="sm-tl-desc">Central AC Unit repaired successfully by Jean-Marc T.</p>
                                        <p className="sm-tl-time">Today, 11:45 AM</p>
                                    </div>
                                </div>

                                <div className="sm-tl-item">
                                    <div className="sm-tl-dot sm-dot-2"></div>
                                    <div className="sm-tl-content">
                                        <p className="sm-tl-title">Technician En-route</p>
                                        <p className="sm-tl-desc">Samuel O. is traveling to your location in Bastos.</p>
                                        <p className="sm-tl-time">Today, 09:30 AM</p>
                                    </div>
                                </div>

                                <div className="sm-tl-item sm-disabled">
                                    <div className="sm-tl-dot sm-dot-3"></div>
                                    <div className="sm-tl-content">
                                        <p className="sm-tl-title">Inspection Scheduled</p>
                                        <p className="sm-tl-desc">Pre-inspection for roof renovation booked for Tomorrow.</p>
                                        <p className="sm-tl-time">Yesterday, 04:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            <button className="sm-status-btn-full">Full Activity Log</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Active Jobs */}
                <section className="sm-jobs-section">
                    <div className="sm-jobs-header">
                        <h2 className="sm-jobs-title">Active Jobs</h2>
                        <button className="sm-jobs-link">View All Requests</button>
                    </div>

                    <div className="sm-jobs-grid">
                        
                        {/* Job 1 */}
                        <div className="sm-job-card">
                            <div className="sm-job-left">
                                <div className="sm-job-tags">
                                    <span className="sm-job-badge sm-badge-secondary">In Progress</span>
                                    <span className="sm-job-id">#REL-89231</span>
                                </div>
                                <h3 className="sm-job-name">Main Board Replacement</h3>
                                <div className="sm-job-meta">
                                    <span><span className="material-symbols-outlined text-[14px]">schedule</span> 45m left</span>
                                    <span><span className="material-symbols-outlined text-[14px]">location_on</span> Bastos Residence</span>
                                </div>
                            </div>
                            <div className="sm-job-right">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTLxDnTAD3sbbHChS2_li2mK3eBdBerKzYdGxtDKXwmSkWD3FHO2Z4-qGC_l9w6TW4FHNhXbK1f1AJlTGWf1TOSxjAXPSvuSWrxDOIFRb1Tnt_ZR48kUkT-H9XYT6QmgmMSvsIO17E4bIietY8aLl1mFgZLyeJTJGDmLB8LA9tQz69p7q4hMKMiGTlVh4an7iQTiIHHupIRxlONc6fBncR4uZlNAtkReOTMlEW44Kn2hQPrF1C3HWnyOx7oG-JkCRsAOLixMXfcg" alt="Samuel O." className="sm-assignee-avatar" />
                                <div className="sm-assignee-info">
                                    <p className="sm-assignee-name">Samuel O.</p>
                                    <p className="sm-assignee-role">Master Electrician</p>
                                </div>
                            </div>
                        </div>

                        {/* Job 2 */}
                        <div className="sm-job-card">
                            <div className="sm-job-left">
                                <div className="sm-job-tags">
                                    <span className="sm-job-badge sm-badge-tertiary">Arrival Impending</span>
                                    <span className="sm-job-id">#REL-89245</span>
                                </div>
                                <h3 className="sm-job-name">Kitchen Sink Leak</h3>
                                <div className="sm-job-meta">
                                    <span><span className="material-symbols-outlined text-[14px]">schedule</span> 5m left</span>
                                    <span><span className="material-symbols-outlined text-[14px]">location_on</span> Mvan Office</span>
                                </div>
                            </div>
                            <div className="sm-job-right">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBI6T8IrmSofMZVpBPI8MWdO9hqPLm7jvev7kreztBz7bsB4WnCre66Oqf1LK_bxfZ_VXZorwMRXoIIm_cmDc0uR1Usas4UT1LJDe5SDv9dZzkY-Q5YwrwVnmE7hWGUhRaB7lFfrP2ogLTh5XOF_EJ_skMHGWGGHZe74hzxf5ShTjBrAnFc4l0RPDp4dew4cxFDWHSQAV6Ipc9j1f3VvPWNzuQ7BgBI5H0MRPk-R0lO1zVQyen_MkmdzNBcH0yOlzMx0KaxXKvUCw" alt="Fiona K." className="sm-assignee-avatar" />
                                <div className="sm-assignee-info">
                                    <p className="sm-assignee-name">Fiona K.</p>
                                    <p className="sm-assignee-role">Plumbing Specialist</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            {/* Floating Action Button (FAB) */}
            <button className="sm-fab" onClick={() => navigate('/espace-client/demande')}>
                <span className="material-symbols-outlined">add</span>
            </button>
        </div>
    );
};

export default ClientDashboardModern;
