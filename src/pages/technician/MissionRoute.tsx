import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaMapMarkerAlt,
    FaArrowLeft,
    FaLocationArrow,
    FaPhone,
    FaPaperPlane,
    FaCheck,
    FaCheckDouble,
    FaPaperclip,
    FaImage,
    FaFileAlt
} from 'react-icons/fa';
import './MissionRoute.css';

interface ChatMessage {
    id: string;
    sender: 'me' | 'client';
    text: string;
    time: string;
    status: 'sent' | 'delivered' | 'read';
    attachment?: { type: 'image' | 'file'; url: string; name: string };
}

const MissionRoute: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const chatEndRef = useRef<HTMLDivElement>(null);

    const [newMessage, setNewMessage] = useState('');
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

    // V2: Read receipts and attachments
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        { id: '1', sender: 'client', text: 'Bonjour, êtes-vous en route ? La fuite s\'aggrave.', time: '14:02', status: 'read' },
        { id: '2', sender: 'me', text: 'Bonjour. Oui je suis parti. Temps estimé : 15 min.', time: '14:05', status: 'read' },
        { id: '3', sender: 'client', text: 'Voici une photo sous le robinet pour vous montrer.', time: '14:06', status: 'read', attachment: { type: 'image', url: 'https://images.unsplash.com/photo-1585728748176-455b52e18eac?w=300', name: 'fuite.jpg' } }
    ]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'me',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
        };

        setChatHistory([...chatHistory, newMsg]);
        setNewMessage('');

        // Simulate delivery and read receipts
        setTimeout(() => {
            setChatHistory(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
        }, 1500);

        setTimeout(() => {
            setChatHistory(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));

            // Simulate client reply
            setChatHistory(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                sender: 'client',
                text: 'Parfait, merci !',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'read'
            }]);
        }, 4000);
    };

    return (
        <div className="tech-page route-page">
            <div className="route-header">
                <button className="btn-back" onClick={() => navigate(`/technicien/mission/${id}`)}>
                    <FaArrowLeft /> Retour
                </button>
                <h2>En route vers Mission #{id?.split('-')[1] || '2684'}</h2>
            </div>

            {/* GPS Simulation Area */}
            <div className="gps-container">
                <div className="map-placeholder">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Douala.png" alt="Map" />
                    <div className="route-line"></div>
                    <div className="marker client-marker"><FaMapMarkerAlt /></div>
                    <div className="marker tech-marker"><FaLocationArrow /></div>
                </div>

                <div className="gps-info">
                    <div className="eta-box">
                        <span className="eta-time">12 min</span>
                        <span className="eta-distance">3.2 km</span>
                        <span className="eta-label">Temps d'arrivée estimé</span>
                    </div>
                    <div className="gps-actions">
                        <button className="btn-circle btn-call"><FaPhone /></button>
                        <button className="btn-primary" onClick={() => navigate(`/technicien/mission/${id}`)}>
                            Je suis sur place
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-container">
                <div className="chat-header">
                    <h3>Chat avec Client (Alice D.)</h3>
                </div>

                <div className="chat-messages">
                    {chatHistory.map(msg => (
                        <div key={msg.id} className={`chat-message ${msg.sender}`}>
                            <div className="message-bubble">
                                {msg.attachment && (
                                    <div className="message-attachment">
                                        {msg.attachment.type === 'image' ? (
                                            <img src={msg.attachment.url} alt="PJ" />
                                        ) : (
                                            <div className="file-attachment"><FaFileAlt /> {msg.attachment.name}</div>
                                        )}
                                    </div>
                                )}
                                <p>{msg.text}</p>
                                <span className="message-time">
                                    {msg.time}
                                    {msg.sender === 'me' && (
                                        <span className="read-receipt">
                                            {msg.status === 'sent' && <FaCheck className="sent" />}
                                            {msg.status === 'delivered' && <FaCheckDouble className="delivered" />}
                                            {msg.status === 'read' && <FaCheckDouble className="read" />}
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="chat-input-area">
                    <div className="attachment-wrapper">
                        <button className="btn-attach" onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}>
                            <FaPaperclip />
                        </button>
                        {showAttachmentMenu && (
                            <div className="attachment-menu">
                                <button><FaImage /> Photo</button>
                                <button><FaFileAlt /> Document</button>
                            </div>
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder="Votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        onFocus={() => setShowAttachmentMenu(false)}
                    />
                    <button className="btn-send" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissionRoute;
