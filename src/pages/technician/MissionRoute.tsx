import React, { useState, useEffect, useRef } from 'react';
import {
    FaArrowLeft,
    FaPaperPlane,
    FaPhone,
    FaCamera,
    FaMapMarkedAlt,
    FaCar
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MissionRoute.css';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'technician';
    time: string;
}

const MissionRoute: React.FC = () => {
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock Data
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Bonjour, je suis en route. J'arriverai dans environ 15 minutes.", sender: 'technician', time: '09:45' },
        { id: 2, text: "D'accord, le code du portail est 1234. Merci !", sender: 'user', time: '09:48' }
    ]);
    const [input, setInput] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMsg: Message = {
            id: Date.now(),
            text: input,
            sender: 'technician',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMsg]);
        setInput('');

        // Simulate auto-reply
        setTimeout(() => {
            const reply: Message = {
                id: Date.now() + 1,
                text: "Ok, c'est noté.",
                sender: 'user',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 3000);
    };

    return (
        <div className="tech-page route-page">
            <button className="back-btn" onClick={() => navigate('/technicien/mission/M-2684')} style={{ marginBottom: '15px' }}>
                <FaArrowLeft /> Retour mission
            </button>

            {/* Map & GPS Header */}
            <div className="route-map-container">
                <div className="mock-map-view">
                    {/* Simulated Map */}
                </div>
                <div className="map-overlay-info">
                    <div className="dist-time">
                        <h3>12 min</h3>
                        <p>4.2 km • Trafic fluide</p>
                    </div>
                    <div className="gps-buttons">
                        <button className="btn-gps btn-waze" title="Waze"><FaCar /></button>
                        <button className="btn-gps btn-google" title="Google Maps"><FaMapMarkedAlt /></button>
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="chat-interface">
                <div className="chat-header">
                    <div className="client-avatar-chat">SM</div>
                    <div className="client-status">
                        <h4>Sophie M.</h4>
                        <span><span className="status-dot"></span>En ligne</span>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                        <button className="btn-quick-action" title="Appeler"><FaPhone /></button>
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message-bubble ${msg.sender === 'user' ? 'received' : 'sent'}`}>
                            {msg.text}
                            <span className="msg-time">{msg.time}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <button className="btn-quick-action"><FaCamera /></button>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Écrivez un message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="btn-send-msg" onClick={handleSend}>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissionRoute;
