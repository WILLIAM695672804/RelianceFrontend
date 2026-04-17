import React from 'react';
import type { MessageData, Attachment } from '../../services/chatService';

interface Props {
    message: MessageData;
    isMine: boolean;
    otherAvatar: string | null;
    otherName: string;
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const AttachmentItem: React.FC<{ attachment: Attachment }> = ({ attachment }) => {
    if (attachment.file_type.startsWith('image/')) {
        return (
            <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="chat-attachment-image">
                <img src={attachment.url} alt={attachment.file_name} />
            </a>
        );
    }

    return (
        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="chat-attachment-file">
            <span className="material-symbols-outlined">
                {attachment.file_type.startsWith('video/') ? 'movie' : 'description'}
            </span>
            <div className="chat-attachment-info">
                <span className="chat-attachment-name">{attachment.file_name}</span>
                <span className="chat-attachment-size">{formatFileSize(attachment.file_size)}</span>
            </div>
            <span className="material-symbols-outlined">download</span>
        </a>
    );
};

const MessageBubble: React.FC<Props> = ({ message, isMine, otherAvatar, otherName }) => {
    const isOptimistic = message.id.startsWith('temp-');

    return (
        <div className={`chat-bubble-wrapper ${isMine ? 'mine' : 'theirs'}`}>
            {!isMine && (
                <img
                    src={otherAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherName)}&size=32`}
                    alt={otherName}
                    className="chat-bubble-avatar"
                />
            )}
            <div className="chat-bubble">
                {message.attachments && message.attachments.length > 0 && (
                    <div className="chat-bubble-attachments">
                        {message.attachments.map((att) => (
                            <AttachmentItem key={att.id} attachment={att} />
                        ))}
                    </div>
                )}
                {message.body && <p className="chat-bubble-text">{message.body}</p>}
                <div className="chat-bubble-meta">
                    <span className="chat-bubble-time">{formatTime(message.created_at)}</span>
                    {isMine && (
                        <span className="chat-bubble-status">
                            {isOptimistic ? (
                                <span className="material-symbols-outlined chat-icon-sending">schedule</span>
                            ) : message.read_at ? (
                                <span className="material-symbols-outlined chat-icon-read">done_all</span>
                            ) : (
                                <span className="material-symbols-outlined chat-icon-sent">done</span>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
