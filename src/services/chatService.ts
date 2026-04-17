import api from './api';

export interface Attachment {
    id: string;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    url: string;
    created_at: string;
}

export interface MessageData {
    id: string;
    conversation_id: string;
    sender_id: string;
    sender: {
        id: string;
        name: string;
        avatar_url: string | null;
    };
    body: string;
    attachments: Attachment[];
    delivered: boolean;
    read_at: string | null;
    created_at: string;
}

export interface ConversationData {
    id: string;
    subject: string | null;
    members: {
        user_id: string;
        user: {
            id: string;
            name: string;
            avatar_url: string | null;
        };
        unread_count: number;
    }[];
    last_message: MessageData | null;
    unread_count: number;
    created_at: string;
}

const chatService = {
    async createOrFindConversation(memberId: string) {
        const response = await api.post('/conversations', {
            members: [memberId],
        });
        return response.data.data as ConversationData;
    },

    async getMessages(conversationId: string, page = 1) {
        const response = await api.get(`/conversations/${conversationId}/messages`, {
            params: { page, per_page: 30 },
        });
        return response.data;
    },

    async sendMessage(conversationId: string, body: string, attachments?: File[]) {
        if (attachments && attachments.length > 0) {
            const formData = new FormData();
            if (body) formData.append('body', body);
            attachments.forEach((file) => {
                formData.append('attachments[]', file);
            });
            const response = await api.post(
                `/conversations/${conversationId}/messages`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const percent = progressEvent.total
                            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            : 0;
                        chatService._uploadProgressCallback?.(percent);
                    },
                }
            );
            return response.data.data as MessageData;
        }

        const response = await api.post(`/conversations/${conversationId}/messages`, { body });
        return response.data.data as MessageData;
    },

    async markAsRead(conversationId: string) {
        await api.post(`/conversations/${conversationId}/messages/read`);
    },

    async getAttachments(conversationId: string, type?: string, page = 1) {
        const response = await api.get(`/conversations/${conversationId}/messages/attachments`, {
            params: { type, page, per_page: 20 },
        });
        return response.data;
    },

    async getUnreadCount() {
        const response = await api.get('/conversations/unread-count');
        return response.data.data as number;
    },

    _uploadProgressCallback: null as ((percent: number) => void) | null,

    onUploadProgress(callback: (percent: number) => void) {
        chatService._uploadProgressCallback = callback;
    },
};

export default chatService;
