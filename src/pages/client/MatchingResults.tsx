import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MatchingResults.css';

interface TechnicianMock {
    id: string;
    name: string;
    avatar: string;
    role: string;
    distance: string;
    reviews: { rating: number; count: number };
    priceEstimate: string;
    isVerified: boolean;
    eta: string;
    matchScore: string;
    skills: string[];
}

const MatchingResults: React.FC = () => {
    const navigate = useNavigate();
    const [selectedTech, setSelectedTech] = useState<string | null>(null);

    const technicians: TechnicianMock[] = [
        {
            id: 'TECH-001',
            name: 'Ibrahim Diallo',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD35VZt27O7T72l9EdqwC7fz4Lf_9VZfJkkU4tqftG_bN7R4mYeXSPzFf8x7eJ9NcKNswsXfn-uxPDfBwp4zfZOCFMPaQKb5sGPkgJQCkmTxkQmgbYXuqxqv8r9BTHVWU9UIFVmCtOwM2LPCCEwgbpJyWFLlou1pd-ce9rDmL8GG2aWupkFKYWNgNlWmELR99Occ4jQgOot68YkIyhNCOV2RyGkUVcTwgZZued2B6YuTJnihFm2h_5Koxmg0vSsmYn7beJnlCZc1A',
            role: 'Master Electrician • 12 years exp.',
            matchScore: '98%',
            priceEstimate: '15,500',
            skills: ['Home Wiring', 'HVAC Systems', 'Smart Home'],
            distance: '1.2 km away',
            reviews: { rating: 4.9, count: 124 },
            eta: 'Next: Today, 2 PM',
            isVerified: true
        },
        {
            id: 'TECH-002',
            name: 'Fatou N\'diaye',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMWA_vEmwFXYVUWj6Yv-qT05SsDZZ-uvWWJq9atTz-LSslHRo0aC1WIT-fPrFZlig-ds8aEGsxYuF4NQKA7rlgIy8NuzNyRngpyxpRsAZbXYNzc4SX_s728z1R5kbl4OSnaG7BuqYQpE5vHlss4UlevNkT1C2O3d-Z-n7p2V6n4-MDzMtr8Bb7ElKKugqIur-Knngv42EnMjR-M_-04sPSRQg_gcW0qqxISJh6jvmheUmHs9wpx-ax6A3enAkJX9CNSC4d67Q82g',
            role: 'Industrial Specialist • 8 years exp.',
            matchScore: '94%',
            priceEstimate: '18,200',
            skills: ['Solar Grid', 'Diagnostics'],
            distance: '2.8 km away',
            reviews: { rating: 5.0, count: 86 },
            eta: 'Next: Tomorrow, 9 AM',
            isVerified: false
        }
    ];

    const handleConfirm = (id: string) => {
        setSelectedTech(id);
        navigate('/espace-client/suivi');
    };

    return (
        <div style={{ backgroundColor: 'var(--surface)', color: 'var(--on-surface)', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            {/* TopNavBar */}
            <nav className="mr-top-navbar">
                <div className="mr-topbar-title">Reliance Marketplace</div>
                
                <div className="mr-topbar-links">
                    <span className="mr-topbar-link">Market</span>
                    <span className="mr-topbar-link active">Matches</span>
                    <span className="mr-topbar-link">Insight</span>
                    <span className="mr-topbar-link">Map</span>
                </div>
                
                <div className="mr-topbar-actions">
                    <div className="mr-search-bar">
                        <span className="material-symbols-outlined" style={{ fontSize: '1.125rem' }}>search</span>
                        <span className="mr-search-text">Search assets...</span>
                    </div>
                    <span className="material-symbols-outlined" style={{ cursor: 'pointer', color: 'var(--primary)' }}>notifications</span>
                    <span className="material-symbols-outlined" style={{ cursor: 'pointer', color: 'var(--primary)' }}>account_circle</span>
                </div>
            </nav>

            <main className="mr-main-container">
                {/* Header */}
                <header className="mr-header">
                    <div>
                        <h1 className="mr-header-title">Technician Matches</h1>
                        <p className="mr-header-subtitle">Optimized results powered by our proprietary matching engine to find the most qualified artisans for your specific needs.</p>
                    </div>
                    <div className="mr-actions">
                        <button className="mr-btn-secondary">
                            <span className="material-symbols-outlined" style={{ marginRight: '0.5rem', fontSize: '1.125rem' }}>tune</span> Filters
                        </button>
                        <button className="mr-btn-primary">
                            <span className="material-symbols-outlined" style={{ marginRight: '0.5rem', fontSize: '1.125rem' }}>history</span> Recent Requests
                        </button>
                    </div>
                </header>

                {/* AI Banner */}
                <section className="mr-ai-banner">
                    <div className="mr-ai-banner-content">
                        <div className="mr-ai-icon-bg">
                            <span className="material-symbols-outlined mr-ai-icon">psychology</span>
                        </div>
                        <div className="mr-ai-text">
                            <h2 className="mr-ai-title">Reliance Insight Analysis Complete</h2>
                            <p className="mr-ai-desc">Our AI has successfully evaluated 45+ critical criteria including verified skills, past performance metrics, proximity, and real-time availability to surface these top {technicians.length} technicians.</p>
                        </div>
                        <div className="mr-ai-badge">
                            <span className="mr-ai-count">45+</span>
                            <span className="mr-ai-crit">Criteria<br/>Processed</span>
                        </div>
                    </div>
                    <div className="mr-ai-bg-decor"></div>
                </section>

                {/* Grid Layout */}
                <div className="mr-grid">
                    {/* Left Col - Tech Cards */}
                    <div className="mr-col-span-2">
                        {technicians.map((tech) => (
                            <div 
                                key={tech.id} 
                                className={`mr-tech-card ${selectedTech === tech.id ? 'selected' : ''}`}
                                onClick={() => setSelectedTech(tech.id)}
                            >
                                <div className="mr-tech-body">
                                    <div className="mr-tech-avatar-wrapper">
                                        <img src={tech.avatar} alt={tech.name} className="mr-tech-img" />
                                        {tech.isVerified && (
                                            <div className="mr-tech-verified">
                                                <span className="material-symbols-outlined" style={{ fontSize: '0.75rem', marginRight: '0.25rem', fontVariationSettings: "'FILL' 1" }}>verified</span> VERIFIED
                                            </div>
                                        )}
                                    </div>
                                    <div className="mr-tech-info">
                                        <div className="mr-tech-header-row">
                                            <div>
                                                <h3 className="mr-tech-name">{tech.name}</h3>
                                                <p className="mr-tech-role">{tech.role}</p>
                                            </div>
                                            <div className="mr-tech-match-wrapper">
                                                <div className="mr-tech-match">
                                                    <span className="material-symbols-outlined" style={{ fontSize: '1.125rem', marginRight: '0.25rem' }}>bolt</span> {tech.matchScore} Match
                                                </div>
                                                <div className="mr-tech-price">{tech.priceEstimate} <span className="mr-tech-price-unit">XAF/hr</span></div>
                                            </div>
                                        </div>
                                        <div className="mr-tech-skills">
                                            {tech.skills.map((skill, index) => (
                                                <span key={index} className="mr-skill-badge">{skill}</span>
                                            ))}
                                        </div>
                                        <div className="mr-tech-meta">
                                            <div className="mr-meta-item"><span className="material-symbols-outlined">location_on</span> {tech.distance}</div>
                                            <div className="mr-meta-item"><span className="material-symbols-outlined">star</span> {tech.reviews.rating} ({tech.reviews.count} reviews)</div>
                                            <div className="mr-meta-item"><span className="material-symbols-outlined">schedule</span> {tech.eta}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mr-tech-footer">
                                    <button className="mr-btn-outline">View Profile</button>
                                    <button 
                                        className="mr-btn-solid" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleConfirm(tech.id);
                                        }}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Col - Maps and Stats */}
                    <div className="mr-side-col">
                        <div className="mr-map-card">
                            <div className="mr-map-header">
                                <h3 className="mr-map-title">
                                    <span className="material-symbols-outlined" style={{ marginRight: '0.5rem' }}>map</span> Visualize proximity
                                </h3>
                                <span className="mr-map-expand">Expand</span>
                            </div>
                            <div className="mr-map-body">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk_dIDlxonE2PflbZOXQeoEyX2m57Lghbw64NOz06vq02Vxxk75S7QbS-o_ngQVMdu8YVP9DiJND1dfijBHNfCe-2qGWZBYbdVok4VKCZH3jIgCnS3t7b2nXqqkVGQ4VYZousbLNovw1tSXWhgPO7li2HLKk8VNRXH5zlAomW0-lCgR9YiaF7jQdzEko4o7G3xHRrXyk107k3HR_m_dVly9SGpHthRaXHzYwhdokTkPq-VafLn8NCxmVHLuSdH3Fpy4bGBnCx-hg" alt="Map Preview" className="mr-map-img" />
                                <div className="mr-map-overlay"></div>
                                <div className="mr-map-center-pin">
                                    <div className="mr-map-pin-icon-wrapper">
                                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>person_pin</span>
                                    </div>
                                    <span className="mr-map-pin-label">Your Location</span>
                                </div>
                                <div className="mr-map-tech-pin-1">
                                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>home_repair_service</span>
                                </div>
                                <div className="mr-map-tech-pin-2">
                                    <span className="material-symbols-outlined" style={{ fontSize: '0.875rem' }}>construction</span>
                                </div>
                            </div>
                            <div className="mr-map-footer">
                                <span>Showing technicians in a 5km radius</span>
                                <button className="mr-map-update-btn">Update Location</button>
                            </div>
                        </div>

                        <div className="mr-stats-card">
                            <h3 className="mr-stats-title">Marketplace Stats</h3>
                            <div className="mr-stats-stack">
                                <div className="mr-stats-row">
                                    <span className="mr-stats-label">Safety Rating</span>
                                    <div className="mr-stats-stars">
                                        {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>)}
                                    </div>
                                </div>
                                <div className="mr-stats-row">
                                    <span className="mr-stats-label">Avg. Arrival Time</span>
                                    <span className="mr-stats-value">34 mins</span>
                                </div>
                                <div className="mr-stats-bar-bg">
                                    <div className="mr-stats-bar-fill"></div>
                                </div>
                                <p className="mr-stats-legal">System Trust Score: 9.8/10</p>
                            </div>
                            <div className="mr-stats-decor"></div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Nav Bar */}
            <nav className="mr-bottom-nav">
                <div className="mr-bottom-item">
                    <span className="material-symbols-outlined mr-bottom-item-icon">storefront</span>
                    <span className="mr-bottom-item-label">Market</span>
                </div>
                <div className="mr-bottom-item active">
                    <span className="material-symbols-outlined mr-bottom-item-icon" style={{fontVariationSettings: "'FILL' 1"}}>analytics</span>
                    <span className="mr-bottom-item-label">Matches</span>
                </div>
                <div className="mr-bottom-item">
                    <span className="material-symbols-outlined mr-bottom-item-icon">psychology</span>
                    <span className="mr-bottom-item-label">Insight</span>
                </div>
                <div className="mr-bottom-item">
                    <span className="material-symbols-outlined mr-bottom-item-icon">map</span>
                    <span className="mr-bottom-item-label">Map</span>
                </div>
            </nav>
        </div>
    );
};

export default MatchingResults;
