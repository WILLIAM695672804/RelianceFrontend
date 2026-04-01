import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LiveRadar.css';

const LiveRadar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="tech-liveradar-page">
            {/* Map Background with Radar Effects */}
            <div className="tech-liveradar-bg">
                <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqHpc662YF-Vfzi000xYXvWl4QgzICZdDv8GsDp06Y6GkWL3axhISPkj_bv-WMNgNQAZDd8TUswihU1JqQynztR4GjfTNGKerU37dSE_C0sYK6pUSZvcpXPPBYL895l15zj2-FWkvdLyCEk7sC90digjswN5GLU2BI496JHgScCaa15hcRGwD8-BuQDu8WLoaVl3oEsVYfjobpNkycYktfaVXUun1qqXnwbMuNkdaVhrlvgRiPEnoGpyFqQc-jYG_k7n0Ks7u_FA" 
                    alt="Map Background" 
                    className="tech-map-img"
                />
                <div className="tech-radar-center">
                    <div className="tech-radar-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="tech-radar-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="tech-radar-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="tech-radar-dot"></div>
                </div>
            </div>

            {/* UI Overlay */}
            <div className="tech-liveradar-overlay">
                
                {/* Search/Status Bar Area */}
                <div className="tech-radar-top-status">
                    <div className="tech-glass-panel tech-status-bar">
                        <div className="tech-status-icon">
                            <span className="material-symbols-outlined">travel_explore</span>
                        </div>
                        <div className="tech-status-text">
                            <p className="tech-status-label">Current Zone</p>
                            <p className="tech-status-value">Akwa - Bonamoussadi Sector</p>
                        </div>
                        <div className="tech-status-badge">
                            <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>bolt</span>
                            HIGH DEMAND
                        </div>
                    </div>
                </div>

                {/* Floating Cards Container */}
                <div className="tech-radar-cards-container">
                    
                    {/* Small Card 1 */}
                    <div className="tech-glass-card tech-small-card">
                        <div className="tech-card-header">
                            <div className="tech-card-badge">
                                <span className="tech-dot"></span>
                                Nearby Task
                            </div>
                            <span className="tech-card-distance">3.4km away</span>
                        </div>
                        <h4>HVAC Maintenance</h4>
                        <div className="tech-card-location">
                            <span className="material-symbols-outlined">location_on</span>
                            Deido District
                        </div>
                        <div className="tech-card-price">12,000 XAF</div>
                    </div>

                    {/* ACTIVE MISSION CARD */}
                    <div className="tech-active-mission-card">
                        <div className="tech-ai-badge">
                            <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>auto_awesome</span>
                            MATCH SCORE: 98%
                        </div>
                        
                        <div className="tech-mission-header">
                            <div className="tech-mission-subtitle">
                                <span className="tech-dot tech-dot-pulse"></span>
                                New Request: Electrical Diagnostic
                            </div>
                            <h3>Short-circuit in main panel</h3>
                            <div className="tech-mission-meta">
                                <span><span className="material-symbols-outlined">near_me</span> 1.2km</span>
                                <span><span className="material-symbols-outlined">schedule</span> 15m drive</span>
                            </div>
                        </div>

                        {/* AI Insight Section */}
                        <div className="tech-ai-insight">
                            <div className="tech-ai-icon">
                                <span className="material-symbols-outlined">psychology</span>
                            </div>
                            <div>
                                <p className="tech-ai-label">AI Estimated Insight (V2 Model)</p>
                                <p className="tech-ai-text">Likely failure in the secondary breaker group. Carry 40A replacement fuses.</p>
                            </div>
                        </div>

                        <div className="tech-mission-price-row">
                            <div>
                                <p className="tech-price-label">Price Estimate</p>
                                <p className="tech-price-value">15,000 - 20,000 <span>XAF</span></p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p className="tech-price-label">Client Rank</p>
                                <div className="tech-stars">
                                    <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>star</span>
                                    <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>star</span>
                                    <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>star</span>
                                    <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>star</span>
                                    <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>star</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="tech-mission-actions">
                            <button 
                                className="tech-btn-accept"
                                onClick={() => navigate('/technicien/cockpit')}
                            >
                                <div className="tech-btn-bg-blur"></div>
                                <div className="tech-btn-content">
                                    <span className="material-symbols-outlined">task_alt</span>
                                    ACCEPT MISSION
                                </div>
                            </button>
                            
                            {/* Circular Timer */}
                            <div className="tech-timer-container">
                                <svg className="tech-timer-svg" viewBox="0 0 64 64">
                                    <circle className="tech-timer-bg" cx="32" cy="32" r="28"></circle>
                                    <circle className="tech-timer-progress" cx="32" cy="32" r="28"></circle>
                                </svg>
                                <span className="tech-timer-text">42</span>
                            </div>
                        </div>
                    </div>

                    {/* Small Card 2 */}
                    <div className="tech-glass-card tech-small-card">
                        <div className="tech-card-header">
                            <div className="tech-card-badge">
                                <span className="tech-dot"></span>
                                Nearby Task
                            </div>
                            <span className="tech-card-distance">0.8km away</span>
                        </div>
                        <h4>Plumbing Leak</h4>
                        <div className="tech-card-location">
                            <span className="material-symbols-outlined">location_on</span>
                            Akwa Shopping Center
                        </div>
                        <div className="tech-card-price">8,500 XAF</div>
                    </div>

                </div>
            </div>

            {/* Contextual Controls Overlay */}
            <div className="tech-radar-controls">
                <button className="tech-control-btn"><span className="material-symbols-outlined">add</span></button>
                <button className="tech-control-btn"><span className="material-symbols-outlined">remove</span></button>
                <div className="tech-controls-divider"></div>
                <button className="tech-control-btn tech-control-primary">
                    <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>my_location</span>
                </button>
            </div>
            
        </div>
    );
};

export default LiveRadar;
