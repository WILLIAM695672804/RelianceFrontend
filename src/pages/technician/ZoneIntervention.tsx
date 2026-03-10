import React, { useState } from 'react';
import { FaMapMarkerAlt, FaHome, FaBriefcase, FaPlus, FaSave, FaDrawPolygon, FaCircleNotch } from 'react-icons/fa';
import './ZoneIntervention.css';

const ZoneIntervention: React.FC = () => {
    const [radius, setRadius] = useState(15); // km
    const [mode, setMode] = useState<'radius' | 'polygon'>('radius');
    const [activeAddress, setActiveAddress] = useState('home');

    const addresses = [
        { id: 'home', type: 'Domicile', label: '123 Rue de la République, Douala', icon: <FaHome /> },
        { id: 'office', type: 'Atelier', label: 'Zone Industrielle Bassa, Douala', icon: <FaBriefcase /> }
    ];

    // Calculate simulated circle size based on radius (visual only)
    const circleSize = 200 + (radius * 5);

    return (
        <div className="tech-page zone-page" style={{ paddingTop: 0, marginTop: 0 }}>
            <div className="zone-container">
                {/* Controls Panel */}
                <div className="zone-controls">
                    {/* Address Selection */}
                    <div className="control-section">
                        <div className="section-title">
                            <FaMapMarkerAlt /> Point de départ
                        </div>
                        <div className="address-list">
                            {addresses.map(addr => (
                                <div
                                    key={addr.id}
                                    className={`address-item ${activeAddress === addr.id ? 'active' : ''}`}
                                    onClick={() => setActiveAddress(addr.id)}
                                >
                                    <div className="address-icon">{addr.icon}</div>
                                    <div className="address-info">
                                        <h4>{addr.type}</h4>
                                        <p>{addr.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="add-address-btn">
                            <FaPlus /> Ajouter une adresse
                        </button>
                    </div>

                    {/* Mode Selection */}
                    <div className="control-section">
                        <div className="section-title">Type de Zone</div>
                        <div className="mode-toggle">
                            <button
                                className={`mode-btn ${mode === 'radius' ? 'active' : ''}`}
                                onClick={() => setMode('radius')}
                            >
                                <FaCircleNotch style={{ marginRight: '5px' }} /> Rayon (km)
                            </button>
                            <button
                                className={`mode-btn ${mode === 'polygon' ? 'active' : ''}`}
                                onClick={() => setMode('polygon')}
                            >
                                <FaDrawPolygon style={{ marginRight: '5px' }} /> Forme Libre
                            </button>
                        </div>
                    </div>

                    {/* Radius Slider */}
                    {mode === 'radius' && (
                        <div className="control-section">
                            <div className="section-title">Rayon d'action</div>
                            <div className="radius-control">
                                <span className="radius-value">{radius} km</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={radius}
                                    onChange={(e) => setRadius(parseInt(e.target.value))}
                                    className="radius-slider"
                                />
                                <div className="expertise-labels">
                                    <span>1 km</span>
                                    <span>50 km</span>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '10px' }}>
                                Vous recevrez des missions situées dans un rayon de {radius} km autour de votre {addresses.find(a => a.id === activeAddress)?.type.toLowerCase()}.
                            </p>
                        </div>
                    )}
                </div>

                {/* Map Panel (Mockup) */}
                <div className="map-container">
                    <div className="map-placeholder-overlay">
                        {/* Interactive Visualizations */}
                        <div className="map-marker">
                            <FaMapMarkerAlt />
                        </div>

                        {mode === 'radius' && (
                            <div
                                className="map-circle"
                                style={{
                                    width: `${circleSize}px`,
                                    height: `${circleSize}px`
                                }}
                            ></div>
                        )}

                        <div style={{ marginTop: '200px', opacity: 0.5 }}>
                            Carte Interactive (Simulation)
                        </div>
                    </div>

                    <button className="btn btn-primary save-zone-btn">
                        <FaSave style={{ marginRight: '10px' }} />
                        Valider la zone
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ZoneIntervention;
