import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import FilePreview from './FilePreview';
import AttachmentsTab from './AttachmentsTab';
import './ChatModal.css';

const ChatModal: React.FC = () => {
    const {
        conversation, messages, isChatOpen, isTyping, typingUserName,
        activeTab, uploadProgress, otherUser,
        closeChat, sendMessage, sendTypingEvent, loadMoreMessages, setActiveTab,
    } = useChat();
    const { user } = useAuth();

    const [inputText, setInputText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (isChatOpen) scrollToBottom();
    }, [messages, isChatOpen, scrollToBottom]);

    const handleScroll = useCallback(async () => {
        const container = messagesContainerRef.current;
        if (!container || container.scrollTop > 50) return;

        const prevHeight = container.scrollHeight;
        const loaded = await loadMoreMessages();
        if (loaded) {
            requestAnimationFrame(() => {
                container.scrollTop = container.scrollHeight - prevHeight;
            });
        }
    }, [loadMoreMessages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);

        if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
        typingDebounceRef.current = setTimeout(() => {
            sendTypingEvent();
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!inputText.trim() && selectedFiles.length === 0) || sending) return;

        setSending(true);
        await sendMessage(inputText.trim(), selectedFiles.length > 0 ? selectedFiles : undefined);
        setInputText('');
        setSelectedFiles([]);
        setSending(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files).slice(0, 5 - selectedFiles.length);
        setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 5));
        e.target.value = '';
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    if (!isChatOpen || !conversation || !otherUser) return null;

    return (
        <div className="chat-modal">
            {/* Header */}
            <div className="chat-modal-header">
                <div className="chat-modal-header-info">
                    <img
                        src={otherUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=1a365d&color=fff&size=40`}
                        alt={otherUser.name}
                        className="chat-modal-avatar"
                    />
                    <div>
                        <h3 className="chat-modal-name">{otherUser.name}</h3>
                        {isTyping && <span className="chat-modal-typing-hint">ecrit...</span>}
                    </div>
                </div>
                <button className="chat-modal-close" onClick={closeChat}>
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="chat-modal-tabs">
                <button
                    className={`chat-tab ${activeTab === 'messages' ? 'active' : ''}`}
                    onClick={() => setActiveTab('messages')}
                >
                    Messages
                </button>
                <button
                    className={`chat-tab ${activeTab === 'files' ? 'active' : ''}`}
                    onClick={() => setActiveTab('files')}
                >
                    Fichiers
                </button>
            </div>

            {/* Messages Tab */}
            {activeTab === 'messages' && (
                <>
                    <div
                        className="chat-modal-messages"
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                    >
                        {messages.length === 0 && (
                            <div className="chat-modal-empty">
                                <span className="material-symbols-outlined">chat_bubble_outline</span>
                                <p>Commencez la conversation</p>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isMine={msg.sender_id === user?.id}
                                otherAvatar={otherUser.avatar_url}
                                otherName={otherUser.name}
                            />
                        ))}
                        {isTyping && <TypingIndicator name={typingUserName} />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Upload progress */}
                    {uploadProgress !== null && (
                        <div className="chat-upload-progress">
                            <div className="chat-upload-bar" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    )}

                    {/* File preview */}
                    <FilePreview files={selectedFiles} onRemove={removeFile} />

                    {/* Input */}
                    <form className="chat-modal-input" onSubmit={handleSubmit}>
                        <button
                            type="button"
                            className="chat-input-attach"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={selectedFiles.length >= 5}
                        >
                            <span className="material-symbols-outlined">attach_file</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.gif,.mp4,.pdf,.doc,.docx"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <input
                            type="text"
                            placeholder="Ecrivez votre message..."
                            value={inputText}
                            onChange={handleInputChange}
                        />
                        <button
                            type="submit"
                            className="chat-input-send"
                            disabled={(!inputText.trim() && selectedFiles.length === 0) || sending}
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                        </button>
                    </form>
                </>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
                <AttachmentsTab conversationId={conversation.id} />
            )}
        </div>
    );
};

export default ChatModal;
