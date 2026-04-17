import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import chatService from '../services/chatService';
import type { MessageData, ConversationData } from '../services/chatService';
import { getEcho, destroyEcho } from '../services/echo';
import matchingService from '../services/matchingService';

interface ChatContextType {
    conversation: ConversationData | null;
    messages: MessageData[];
    unreadCount: number;
    isTyping: boolean;
    typingUserName: string;
    isChatOpen: boolean;
    activeTab: 'messages' | 'files';
    uploadProgress: number | null;
    otherUser: { id: string; name: string; avatar_url: string | null } | null;
    openChat: () => void;
    closeChat: () => void;
    sendMessage: (body: string, attachments?: File[]) => Promise<void>;
    markAsRead: () => void;
    sendTypingEvent: () => void;
    loadMoreMessages: () => Promise<boolean>;
    setActiveTab: (tab: 'messages' | 'files') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, role, isAuthenticated } = useAuth();
    const [conversation, setConversation] = useState<ConversationData | null>(null);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUserName, setTypingUserName] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'messages' | 'files'>('messages');
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [otherUser, setOtherUser] = useState<{ id: string; name: string; avatar_url: string | null } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);

    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const channelRef = useRef<any>(null);

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const initChat = async () => {
            try {
                let missionData: any;
                if (role === 'client') {
                    const res = await matchingService.getClientActiveMission();
                    missionData = res.data;
                } else if (role === 'technicien') {
                    const res = await matchingService.getActiveMission();
                    missionData = res.data;
                } else {
                    return;
                }

                if (!missionData) return;

                const otherPartyId = role === 'client'
                    ? missionData.technician?.id
                    : missionData.client?.id;
                const otherPartyName = role === 'client'
                    ? missionData.technician?.name
                    : missionData.client?.name;
                const otherPartyAvatar = role === 'client'
                    ? missionData.technician?.avatar
                    : missionData.client?.avatar;

                if (!otherPartyId) return;

                setOtherUser({
                    id: otherPartyId,
                    name: otherPartyName ?? 'Utilisateur',
                    avatar_url: otherPartyAvatar ?? null,
                });

                const conv = await chatService.createOrFindConversation(otherPartyId);
                setConversation(conv);

                const msgResponse = await chatService.getMessages(conv.id);
                const fetchedMessages: MessageData[] = msgResponse.data ?? [];
                setMessages(fetchedMessages.reverse());
                setHasMoreMessages(!!msgResponse.links?.next);

                const countRes = await chatService.getUnreadCount();
                setUnreadCount(typeof countRes === 'number' ? countRes : 0);
            } catch {
                // No active mission or error — chat stays hidden
            }
        };

        initChat();

        return () => {
            destroyEcho();
            channelRef.current = null;
        };
    }, [isAuthenticated, user, role]);

    useEffect(() => {
        if (!conversation || !user) return;

        const echo = getEcho();
        const channel = echo.private(`conversation.${conversation.id}`);
        channelRef.current = channel;

        channel.listen('.MessageSent', (event: { message: MessageData }) => {
            setMessages((prev) => [...prev, event.message]);
            if (event.message.sender_id !== user.id) {
                if (isChatOpen) {
                    chatService.markAsRead(conversation.id);
                } else {
                    setUnreadCount((prev) => prev + 1);
                }
            }
        });

        channel.listen('.MessageRead', (event: { user_id: string; read_at: string }) => {
            if (event.user_id !== user.id) {
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.sender_id === user.id && !msg.read_at
                            ? { ...msg, read_at: event.read_at, delivered: true }
                            : msg
                    )
                );
            }
        });

        channel.listenForWhisper('typing', (event: { user_id: string; name: string }) => {
            if (event.user_id !== user.id) {
                setIsTyping(true);
                setTypingUserName(event.name);

                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => {
                    setIsTyping(false);
                    setTypingUserName('');
                }, 3000);
            }
        });

        return () => {
            channel.stopListening('.MessageSent');
            channel.stopListening('.MessageRead');
            echo.leave(`conversation.${conversation.id}`);
            channelRef.current = null;
        };
    }, [conversation, user, isChatOpen]);

    const openChat = useCallback(() => {
        setIsChatOpen(true);
        if (conversation && unreadCount > 0) {
            chatService.markAsRead(conversation.id);
            setUnreadCount(0);
        }
    }, [conversation, unreadCount]);

    const closeChat = useCallback(() => {
        setIsChatOpen(false);
    }, []);

    const sendMessage = useCallback(async (body: string, attachments?: File[]) => {
        if (!conversation) return;

        chatService.onUploadProgress((percent) => setUploadProgress(percent));

        const optimisticId = `temp-${Date.now()}`;
        const optimistic: MessageData = {
            id: optimisticId,
            conversation_id: conversation.id,
            sender_id: user!.id,
            sender: { id: user!.id, name: user!.name, avatar_url: user!.avatar_url ?? null },
            body,
            attachments: [],
            delivered: false,
            read_at: null,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimistic]);

        try {
            const sent = await chatService.sendMessage(conversation.id, body, attachments);
            setMessages((prev) => prev.map((m) => (m.id === optimisticId ? sent : m)));
        } catch {
            setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        } finally {
            setUploadProgress(null);
            chatService.onUploadProgress(() => {});
        }
    }, [conversation, user]);

    const markAsRead = useCallback(() => {
        if (!conversation) return;
        chatService.markAsRead(conversation.id);
        setUnreadCount(0);
    }, [conversation]);

    const sendTypingEvent = useCallback(() => {
        if (!channelRef.current || !user) return;
        channelRef.current.whisper('typing', {
            user_id: user.id,
            name: user.name,
        });
    }, [user]);

    const loadMoreMessages = useCallback(async (): Promise<boolean> => {
        if (!conversation || !hasMoreMessages) return false;

        const nextPage = currentPage + 1;
        const response = await chatService.getMessages(conversation.id, nextPage);
        const olderMessages: MessageData[] = response.data ?? [];

        if (olderMessages.length === 0) {
            setHasMoreMessages(false);
            return false;
        }

        setMessages((prev) => [...olderMessages.reverse(), ...prev]);
        setCurrentPage(nextPage);
        setHasMoreMessages(!!response.links?.next);
        return true;
    }, [conversation, currentPage, hasMoreMessages]);

    return (
        <ChatContext.Provider
            value={{
                conversation, messages, unreadCount, isTyping, typingUserName,
                isChatOpen, activeTab, uploadProgress, otherUser,
                openChat, closeChat, sendMessage, markAsRead, sendTypingEvent,
                loadMoreMessages, setActiveTab,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
