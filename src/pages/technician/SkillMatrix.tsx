import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SkillMatrix.css';

const SkillMatrix: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="tech-matrix-page">
            {/* Header Section */}
            <header className="tech-matrix-header">
                <div className="tech-matrix-title-group">
                    <button 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.25rem', 
                            padding: 0, 
                            marginBottom: '0.75rem', 
                            color: 'var(--tech-on-surface-variant)', 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}
                        onClick={() => navigate(-1)}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_back</span>
                        Back to Profile
                    </button>
                    <h1>Skill &amp; Certification Matrix</h1>
                    <p>
                        Your verified capabilities determine your algorithmic prioritization. Expanding your matrix increases your <span>Match Score</span> for high-value industrial contracts.
                    </p>
                </div>
                <div className="tech-matrix-actions">
                    <button className="tech-btn-secondary">
                        <span className="material-symbols-outlined">upload_file</span>
                        Upload Cert
                    </button>
                    <button className="tech-btn-primary">
                        <span className="material-symbols-outlined">add</span>
                        Add New Skill
                    </button>
                </div>
            </header>

            {/* Bento Layout */}
            <div className="tech-matrix-grid">
                
                {/* Left: Match Score Indicator */}
                <section className="tech-matrix-left">
                    <div className="tech-score-card">
                        <div className="tech-score-bg-circle"></div>
                        <h3 className="tech-score-title">Current Performance</h3>
                        
                        <div className="tech-score-display">
                            <div className="tech-circular-progress">
                                <svg viewBox="0 0 96 96">
                                    <circle className="tech-progress-bg" cx="48" cy="48" r="42"></circle>
                                    <circle className="tech-progress-fill" cx="48" cy="48" r="42"></circle>
                                </svg>
                                <span className="tech-progress-text">98<span>%</span></span>
                            </div>
                            <div className="tech-score-info">
                                <h4>Match Score</h4>
                                <p>Top 2% of Network</p>
                            </div>
                        </div>

                        <div className="tech-score-bars">
                            <div className="tech-bar-row">
                                <span className="tech-bar-label">Skill Coverage</span>
                                <span className="tech-bar-value">+12.4%</span>
                            </div>
                            <div className="tech-bar-bg">
                                <div className="tech-bar-fill" style={{width: '88%'}}></div>
                            </div>
                            
                            <div className="tech-bar-row">
                                <span className="tech-bar-label">Cert. Recency</span>
                                <span className="tech-bar-value">+8.1%</span>
                            </div>
                            <div className="tech-bar-bg">
                                <div className="tech-bar-fill" style={{width: '94%'}}></div>
                            </div>
                        </div>
                    </div>

                    <div className="tech-growth-card group">
                        <div className="tech-growth-icon">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <h3>Growth Projection</h3>
                        <p>Add 'Quantum PLC Calibration' to unlock Tier 1 data center projects worth an estimated +$14k/yr.</p>
                        <button>
                            View Skill Path <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </section>

                {/* Right: Skills Grid */}
                <section className="tech-matrix-right">
                    
                    <div className="tech-skills-section">
                        <div className="tech-skills-header">
                            <h2>Verified Technical Skills</h2>
                            <span>6 Total Skills</span>
                        </div>
                        
                        <div className="tech-skills-grid">
                            {/* Skill Card 1 */}
                            <div className="tech-skill-card">
                                <div className="tech-skill-card-top">
                                    <div className="tech-skill-icon">
                                        <span className="material-symbols-outlined">hvac</span>
                                    </div>
                                    <span className="tech-verified-badge">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                        Verified
                                    </span>
                                </div>
                                <h4>HVAC Maintenance</h4>
                                <p className="tech-skill-desc">Industrial Grade Systems & Chilling Plants</p>
                                <div className="tech-skill-stats">
                                    <div>
                                        <p className="tech-stat-label">Proficiency</p>
                                        <p className="tech-stat-value">Expert (L5)</p>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <p className="tech-stat-label">Experience</p>
                                        <p className="tech-stat-value">8 Years</p>
                                    </div>
                                </div>
                            </div>

                            {/* Skill Card 2 */}
                            <div className="tech-skill-card">
                                <div className="tech-skill-card-top">
                                    <div className="tech-skill-icon bg-secondary">
                                        <span className="material-symbols-outlined">bolt</span>
                                    </div>
                                    <span className="tech-verified-badge">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                        Verified
                                    </span>
                                </div>
                                <h4>Industrial Wiring</h4>
                                <p className="tech-skill-desc">High Voltage Control Panels & Layouts</p>
                                <div className="tech-skill-stats">
                                    <div>
                                        <p className="tech-stat-label">Proficiency</p>
                                        <p className="tech-stat-value">Intermediate (L3)</p>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <p className="tech-stat-label">Experience</p>
                                        <p className="tech-stat-value">4 Years</p>
                                    </div>
                                </div>
                            </div>

                            {/* Skill Card 3 */}
                            <div className="tech-skill-card">
                                <div className="tech-skill-card-top">
                                    <div className="tech-skill-icon bg-tertiary">
                                        <span className="material-symbols-outlined">grid_view</span>
                                    </div>
                                    <span className="tech-verified-badge">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                        Verified
                                    </span>
                                </div>
                                <h4>Smart Grid Integration</h4>
                                <p className="tech-skill-desc">IoT Sensor Deployment & Telemetry</p>
                                <div className="tech-skill-stats">
                                    <div>
                                        <p className="tech-stat-label">Proficiency</p>
                                        <p className="tech-stat-value">Expert (L4)</p>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <p className="tech-stat-label">Experience</p>
                                        <p className="tech-stat-value">3 Years</p>
                                    </div>
                                </div>
                            </div>

                            {/* Skill Card 4 (Action) */}
                            <div className="tech-skill-card-empty">
                                <div className="tech-empty-icon">
                                    <span className="material-symbols-outlined">add_circle</span>
                                </div>
                                <h4>Expand Matrix</h4>
                                <p>Add a new technical domain to your profile.</p>
                            </div>
                        </div>
                    </div>

                    {/* Certifications Section */}
                    <div className="tech-cert-section">
                        <h2>Professional Certifications</h2>
                        <div className="tech-cert-table-wrapper">
                            <table className="tech-cert-table">
                                <thead>
                                    <tr>
                                        <th>Credential</th>
                                        <th>Issuer</th>
                                        <th>Status</th>
                                        <th style={{textAlign: 'right'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="tech-cert-name">
                                                <span className="material-symbols-outlined">description</span>
                                                <div>
                                                    <p className="cert-title">Certified Network Installer (CNI)</p>
                                                    <p className="cert-id">ID: CERT-8821-XP</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>TechCorp Global</td>
                                        <td>
                                            <span className="tech-cert-status status-approved">
                                                <span className="status-dot"></span> Approved
                                            </span>
                                        </td>
                                        <td style={{textAlign: 'right'}}>
                                            <button className="tech-btn-icon"><span className="material-symbols-outlined">visibility</span></button>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className="tech-cert-name">
                                                <span className="material-symbols-outlined">description</span>
                                                <div>
                                                    <p className="cert-title">Advanced PLC Diploma</p>
                                                    <p className="cert-id">ID: DPL-2209-BA</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Industrial Academy</td>
                                        <td>
                                            <span className="tech-cert-status status-pending">
                                                <span className="status-dot"></span> Pending
                                            </span>
                                        </td>
                                        <td style={{textAlign: 'right'}}>
                                            <button className="tech-btn-icon"><span className="material-symbols-outlined">visibility</span></button>
                                        </td>
                                    </tr>

                                    <tr className="tech-cert-expired-row">
                                        <td>
                                            <div className="tech-cert-name">
                                                <span className="material-symbols-outlined">history</span>
                                                <div>
                                                    <p className="cert-title">OSHA 10 Safety Card</p>
                                                    <p className="cert-id">ID: SFT-0012-L1</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>OSHA Board</td>
                                        <td>
                                            <span className="tech-cert-status status-expired">
                                                <span className="status-dot"></span> Expired
                                            </span>
                                        </td>
                                        <td style={{textAlign: 'right'}}>
                                            <button className="tech-btn-renew">Renew</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </section>
            </div>
        </div>
    );
};

export default SkillMatrix;
