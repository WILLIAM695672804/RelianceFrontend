import React from 'react';
import { useChat } from '../../context/ChatContext';

const FloatingChatButton: React.FC = () => {
    const { conversation, unreadCount, openChat, isChatOpen } = useChat();

    if (!conversation || isChatOpen) return null;

    return (
        <button className="chat-floating-btn" onClick={openChat} title="Ouvrir le chat">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            {unreadCount > 0 && (
                <span className="chat-floating-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
        </button>
    );
};

export default FloatingChatButton;
