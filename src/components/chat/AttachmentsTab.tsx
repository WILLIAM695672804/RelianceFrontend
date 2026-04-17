import React, { useState, useEffect, useCallback } from 'react';
import chatService from '../../services/chatService';
import type { Attachment } from '../../services/chatService';

interface Props {
    conversationId: string;
}

type FilterType = 'all' | 'image' | 'document' | 'video';

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const AttachmentsTab: React.FC<Props> = ({ conversationId }) => {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [filter, setFilter] = useState<FilterType>('all');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchAttachments = useCallback(async (pageNum: number, type: FilterType, reset: boolean) => {
        setLoading(true);
        try {
            const typeParam = type === 'all' ? undefined : type;
            const response = await chatService.getAttachments(conversationId, typeParam, pageNum);
            const data: Attachment[] = response.data ?? [];
            setAttachments((prev) => reset ? data : [...prev, ...data]);
            setHasMore(!!response.links?.next);
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, [conversationId]);

    useEffect(() => {
        setPage(1);
        fetchAttachments(1, filter, true);
    }, [filter, fetchAttachments]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAttachments(nextPage, filter, false);
    };

    const filters: { label: string; value: FilterType }[] = [
        { label: 'Tout', value: 'all' },
        { label: 'Images', value: 'image' },
        { label: 'Documents', value: 'document' },
        { label: 'Videos', value: 'video' },
    ];

    return (
        <div className="chat-attachments-tab">
            <div className="chat-attachments-filters">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        className={`chat-filter-btn ${filter === f.value ? 'active' : ''}`}
                        onClick={() => setFilter(f.value)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {attachments.length === 0 && !loading && (
                <div className="chat-attachments-empty">
                    <span className="material-symbols-outlined">folder_open</span>
                    <p>Aucun fichier partage</p>
                </div>
            )}

            <div className="chat-attachments-grid">
                {attachments.map((att) => (
                    <a
                        key={att.id}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chat-attachment-card"
                    >
                        {att.file_type.startsWith('image/') ? (
                            <img src={att.url} alt={att.file_name} className="chat-attachment-card-thumb" />
                        ) : (
                            <div className="chat-attachment-card-icon">
                                <span className="material-symbols-outlined">
                                    {att.file_type.startsWith('video/') ? 'movie' : 'description'}
                                </span>
                            </div>
                        )}
                        <div className="chat-attachment-card-info">
                            <span className="chat-attachment-card-name">{att.file_name}</span>
                            <span className="chat-attachment-card-size">{formatFileSize(att.file_size)}</span>
                        </div>
                    </a>
                ))}
            </div>

            {hasMore && !loading && (
                <button className="chat-load-more" onClick={loadMore}>Voir plus</button>
            )}

            {loading && (
                <div className="chat-attachments-loading">
                    <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>progress_activity</span>
                </div>
            )}
        </div>
    );
};

export default AttachmentsTab;
