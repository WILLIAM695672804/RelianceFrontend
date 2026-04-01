import React, { useState } from 'react';
import { 
    FaCheck, FaCircle, FaDotCircle, FaFileInvoiceDollar, 
    FaCommentAlt, FaPaperPlane, FaPenNib, FaTimes, FaCheckCircle
} from 'react-icons/fa';
import './MissionTracking.css';

interface ChatMessage {
    id: number;
    user: 'client' | 'tech';
    text: string;
    timestamp: string;
}

const MissionTracking: React.FC = () => {
    // Mock Data
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, user: 'tech', text: 'Bonjour Alexandre, je suis en route. J\'arrive dans 20 minutes.', timestamp: '14:30' },
        { id: 2, user: 'client', text: 'Super, merci. Vous trouverez facilement avec le GPS.', timestamp: '14:32' },
        { id: 3, user: 'tech', text: 'Je suis sur place. Je vais couper l\'arrivée d\'eau pour commencer le diagnostic.', timestamp: '14:55' }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [quoteAccepted, setQuoteAccepted] = useState(false);

    // Current step index (0 to 4)
    const currentStepIndex = 2; // "En cours"

    const timelineSteps = [
        { label: 'Demande Validée', desc: 'L\'expert a accepté.', time: '14:15' },
        { label: 'En Route', desc: 'Le technicien se déplace.', time: '14:30' },
        { label: 'Sur Place & Devis', desc: 'Diagnostic en cours.', time: '14:55' },
        { label: 'Travaux', desc: 'En attente validation devis.', time: '' },
        { label: 'Terminé', desc: 'Intervention finalisée.', time: '' }
    ];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setMessages([
            ...messages,
            { id: Date.now(), user: 'client', text: newMessage, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
        setNewMessage('');
    };

    return (
        <div className="tracking-container">
            <div className="tracking-header">
                <div>
                    <h1>Fuite d'eau sous l'évier</h1>
                    <span className="mission-id">Intervention N° #REQ-019</span>
                </div>
                <div className="tech-assigned-badge">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Tech" />
                    <div className="tech-assigned-info">
                        <strong>Jean-Marc D.</strong>
                        <span>Plombier expert</span>
                    </div>
                </div>
            </div>

            <div className="tracking-grid">
                {/* Left Column: Timeline & Devis */}
                <div className="tracking-left-col">
                    {/* Timeline Widget */}
                    <div className="tracking-widget timeline-widget">
                        <h3>Avancement</h3>
                        <div className="timeline-wrapper">
                            {timelineSteps.map((step, idx) => {
                                const isCompleted = idx < currentStepIndex;
                                const isActive = idx === currentStepIndex;

                                return (
                                    <div key={idx} className={`timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                                        <div className="timeline-marker">
                                            {isCompleted ? <FaCheck className="marker-icon" /> : (isActive ? <FaDotCircle className="marker-icon pulse" /> : <FaCircle className="marker-icon empty" />)}
                                            {idx < timelineSteps.length - 1 && <div className="timeline-connector"></div>}
                                        </div>
                                        <div className="timeline-content">
                                            <h4>{step.label}</h4>
                                            <p>{step.desc}</p>
                                        </div>
                                        {step.time && <div className="timeline-time">{step.time}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Card: Quote Viewer */}
                    <div className="tracking-widget quote-alert-widget">
                        <div className="quote-icon-box">
                            <FaFileInvoiceDollar />
                        </div>
                        <div className="quote-alert-info">
                            <h3>Un devis nécessite votre attention</h3>
                            <p>Le technicien a généré le devis suite à son diagnostic. Veuillez le valider pour démarrer les travaux.</p>
                        </div>
                        <button 
                            className="btn-view-quote"
                            onClick={() => setShowQuoteModal(true)}
                        >
                            Voir le Devis
                        </button>
                    </div>
                </div>

                {/* Right Column: Chat integration */}
                <div className="tracking-right-col">
                    <div className="chat-widget">
                        <div className="chat-header">
                            <h3><FaCommentAlt /> Messagerie Instantanée</h3>
                        </div>
                        
                        <div className="chat-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`chat-bubble-wrapper ${msg.user === 'client' ? 'mine' : 'theirs'}`}>
                                    {msg.user === 'tech' && (
                                        <img src="https://i.pravatar.cc/150?img=11" alt="Tech" className="chat-avatar" />
                                    )}
                                    <div className="chat-bubble">
                                        <p>{msg.text}</p>
                                        <span className="chat-timestamp">{msg.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <input 
                                type="text" 
                                placeholder="Écrivez votre message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" disabled={!newMessage.trim()}>
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal: Visualiseur de devis */}
            {showQuoteModal && (
                <div className="quote-modal-overlay">
                    <div className="quote-modal-content">
                        <button className="btn-close-modal" onClick={() => setShowQuoteModal(false)}>
                            <FaTimes />
                        </button>
                        
                        <div className="quote-document">
                            <div className="quote-doc-header">
                                <h2>DEVIS N° DEV-019-2026</h2>
                                <p>Émis le 18 Mars 2026 par Jean-Marc D.</p>
                            </div>
                            
                            <table className="quote-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th style={{textAlign: 'right'}}>Montant (FCFA)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Remplacement Siphon évier cuisines</td>
                                        <td style={{textAlign: 'right'}}>15 000</td>
                                    </tr>
                                    <tr>
                                        <td>Frais de déplacement</td>
                                        <td style={{textAlign: 'right'}}>5 000</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td><strong>TOTAL TTC</strong></td>
                                        <td style={{textAlign: 'right', fontSize: '1.2rem', color: '#0f172a'}}><strong>20 000 FCFA</strong></td>
                                    </tr>
                                </tfoot>
                            </table>

                            {quoteAccepted ? (
                                <div className="quote-signed-banner">
                                    <FaCheckCircle className="signed-icon" />
                                    Devis signé électroniquement. Les travaux peuvent démarrer.
                                </div>
                            ) : (
                                <div className="quote-actions">
                                    <button className="btn-reject-quote" onClick={() => setShowQuoteModal(false)}>Refuser</button>
                                    <button className="btn-sign-quote" onClick={() => setQuoteAccepted(true)}>
                                        <FaPenNib /> Signer & Bloquer les fonds (Escrow)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MissionTracking;
