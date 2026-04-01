import React, { useState } from 'react';
import './MissionTracking.css';

interface ChatMessage {
    id: number;
    user: 'client' | 'tech';
    text: string;
    timestamp: string;
}

const MissionTracking: React.FC = () => {
    // Chat states
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, user: 'tech', text: "Bonjour, je suis en route. J'arrive dans 14 minutes.", timestamp: '12:30' },
        { id: 2, user: 'client', text: 'Super, merci. Vous trouverez facilement avec le GPS.', timestamp: '12:32' },
        { id: 3, user: 'tech', text: 'Je suis sur place. Je vais couper l\'arrivée d\'eau pour commencer le diagnostic.', timestamp: '12:45' }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [showChatModal, setShowChatModal] = useState(false);

    // Chat handler
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setMessages([
            ...messages,
            { id: Date.now(), user: 'client', text: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        setNewMessage('');
        
        // Auto-scroll logic could be added here in a real app
    };

    return (
        <div className="mt-page">
            {/* Background Map Layer */}
            <div className="mt-map-layer">
                <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDm36n7rgR8kElN9wqdt_3SEJ8UTWEOo9gU3oAJ8q2Vf-B1tx8x03Bh-rPEIEU0EuRMNP7kUQSVHuHVWeEPDMYBbG9dBZIETykA8PDZyH85pIWA1bwkhMhVafQe75b2HofDTyWrJGi-tv6lKg2Vb7UQ05LTgaQ-5qr7sQqK0X13fZMpb20IcoNUT_FK5ucnTEPQfE-AwUyq014d9gPZ8ywjVrGGRzcuQ39xEKueAW0D1b8RcByNc0Z6KnM7MsZjfzGBIMS93XtJQ"
                    alt="Map Background"
                />
                
                {/* Technician Marker Pulse */}
                <div className="mt-map-marker tech-marker">
                    <div className="marker-pulse"></div>
                    <div className="marker-icon-container">
                        <span className="material-symbols-outlined">local_shipping</span>
                    </div>
                    <div className="marker-label">Jean-Luc (En Route)</div>
                </div>

                {/* Destination Marker */}
                <div className="mt-map-marker dest-marker">
                    <div className="marker-icon-container primary">
                        <span className="material-symbols-outlined">home_pin</span>
                    </div>
                </div>
            </div>

            {/* Main Content Layout Overlay */}
            <div className="mt-content-overlay">
                
                {/* Left Info Panel */}
                <div className="mt-left-panel">
                    
                    {/* Status Card */}
                    <div className="mt-glass-card">
                        <div className="mt-card-header">
                            <span className="mt-mission-id">Mission ID: #REL-4829</span>
                            <div className="mt-live-badge">LIVE</div>
                        </div>
                        <h1 className="mt-main-title">Technician En Route</h1>
                        <p className="mt-subtitle">Repairing: HVAC System Maintenance</p>
                        
                        {/* ETA Wrapper */}
                        <div className="mt-eta-wrapper">
                            <div className="mt-eta-icon">
                                <span className="material-symbols-outlined">schedule</span>
                            </div>
                            <div className="mt-eta-details">
                                <p className="mt-eta-label">Estimated Arrival</p>
                                <p className="mt-eta-time">12:45 <span className="mt-eta-meridiem">PM</span></p>
                            </div>
                            <div className="mt-eta-countdown">
                                <p className="mt-eta-label text-right">ETA</p>
                                <p className="mt-eta-min">14 min</p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="mt-timeline">
                            <div className="mt-timeline-step completed">
                                <div className="mt-step-icon"><span className="material-symbols-outlined">check</span></div>
                                <div className="mt-step-info">
                                    <p className="mt-step-title">Job Accepted</p>
                                    <p className="mt-step-time">12:15 PM</p>
                                </div>
                            </div>
                            <div className="mt-timeline-step active">
                                <div className="mt-step-icon pulse"><span className="material-symbols-outlined">navigation</span></div>
                                <div className="mt-step-info">
                                    <p className="mt-step-title">Traveling</p>
                                    <p className="mt-step-desc">Jean-Luc is on his way</p>
                                </div>
                            </div>
                            <div className="mt-timeline-step pending">
                                <div className="mt-step-icon"></div>
                                <div className="mt-step-info">
                                    <p className="mt-step-title">Arrived</p>
                                </div>
                            </div>
                            <div className="mt-timeline-step pending">
                                <div className="mt-step-icon"></div>
                                <div className="mt-step-info">
                                    <p className="mt-step-title">Working</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="mt-glass-card mt-profile-card">
                        <img 
                            className="mt-profile-avatar"
                            alt="Jean-Luc"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo8WSFPZ1MtFtZ1BD6tBTl9w91TOSas52ZqDloWcw4NP3t_lbraL_an-_RlFciP-Ao_hboOWaNRZwtLVF7kkZdX_rBW-g41K6jC-lXm0H-beC1f7qadD6XRntqr11-bqxZhzRhiIHQDDjVeAUy9VhPlkkgL7AWtJCy6NmwbvZyofgY8TWzdrj-Gk81unAQZPCjJPULbpNeBHbIa1ABib7isrZAW0gBFlSazqFWaxH0YGi6Qlh-PaR1DFq20_sc79cf1h2PJBBVaA" 
                        />
                        <div className="mt-profile-info">
                            <h3 className="mt-profile-name">Jean-Luc M.</h3>
                            <div className="mt-profile-rating">
                                <span className="material-symbols-outlined fill-icon" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                <span>4.9 (120+ Jobs)</span>
                            </div>
                        </div>
                        <div className="mt-profile-actions">
                            <button className="mt-action-btn secondary" onClick={() => setShowChatModal(true)} title="Ouvrir le chat">
                                <span className="material-symbols-outlined">chat</span>
                            </button>
                            <button className="mt-action-btn primary" title="Appeler">
                                <span className="material-symbols-outlined">call</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Bottom Corner Bento - Mission Summary */}
                <div className="mt-right-panel">
                    <div className="mt-bento-grid">
                        {/* Location Bento */}
                        <div className="mt-glass-card mt-bento-card">
                            <div className="mt-bento-header">
                                <div className="mt-bento-icon primary-bg">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <span className="mt-bento-label">Site Address</span>
                            </div>
                            <p className="mt-bento-title">Avenue Kennedy, Rue 1204</p>
                            <p className="mt-bento-subtitle">Yaoundé, Cameroon</p>
                        </div>
                        
                        {/* Payment Bento */}
                        <div className="mt-glass-card mt-bento-card">
                            <div className="mt-bento-header">
                                <div className="mt-bento-icon tertiary-bg">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <span className="mt-bento-label">Total Estimate</span>
                            </div>
                            <p className="mt-bento-amount">25,000 <span>XAF</span></p>
                            <p className="mt-bento-hint">Auto-debit on completion</p>
                        </div>

                        {/* Actions Bento */}
                        <div className="mt-glass-card mt-bento-actions">
                            <button className="mt-btn-danger">
                                <span className="material-symbols-outlined">cancel</span>
                                Cancel Mission
                            </button>
                            <button className="mt-btn-outline">
                                <span className="material-symbols-outlined">help_center</span>
                                Get Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Interactions Overlay (Bottom Right) */}
            <div className="mt-map-controls">
                <button className="mt-control-btn glass">
                    <span className="material-symbols-outlined">my_location</span>
                </button>
                <div className="mt-control-group glass">
                    <button className="mt-control-btn">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <button className="mt-control-btn">
                        <span className="material-symbols-outlined">remove</span>
                    </button>
                </div>
            </div>

            {/* Floating Chat Modal (Glassmorphism) */}
            {showChatModal && (
                <div className="mt-chat-modal-backdrop" onClick={() => setShowChatModal(false)}>
                    <div className="mt-chat-modal" onClick={e => e.stopPropagation()}>
                        <div className="mt-chat-header">
                            <div>
                                <h3>Messages Techniques</h3>
                                <p>En direct avec Jean-Luc M.</p>
                            </div>
                            <button className="mt-chat-close" onClick={() => setShowChatModal(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="mt-chat-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`mt-chat-bubble-wrapper ${msg.user === 'client' ? 'mine' : 'theirs'}`}>
                                    {msg.user === 'tech' && (
                                        <img 
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo8WSFPZ1MtFtZ1BD6tBTl9w91TOSas52ZqDloWcw4NP3t_lbraL_an-_RlFciP-Ao_hboOWaNRZwtLVF7kkZdX_rBW-g41K6jC-lXm0H-beC1f7qadD6XRntqr11-bqxZhzRhiIHQDDjVeAUy9VhPlkkgL7AWtJCy6NmwbvZyofgY8TWzdrj-Gk81unAQZPCjJPULbpNeBHbIa1ABib7isrZAW0gBFlSazqFWaxH0YGi6Qlh-PaR1DFq20_sc79cf1h2PJBBVaA" 
                                            alt="Tech" 
                                            className="mt-chat-avatar" 
                                        />
                                    )}
                                    <div className="mt-chat-bubble">
                                        <p>{msg.text}</p>
                                        <span className="mt-chat-time">{msg.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form className="mt-chat-input-area" onSubmit={handleSendMessage}>
                            <input 
                                type="text" 
                                placeholder="Écrivez votre message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" disabled={!newMessage.trim()} className="mt-chat-send">
                                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MissionTracking;
