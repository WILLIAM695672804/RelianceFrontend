import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const chat = vi.hoisted(() => ({
    createOrFindConversation: vi.fn(), getMessages: vi.fn(), getUnreadCount: vi.fn(), sendMessage: vi.fn(), markAsRead: vi.fn(), onUploadProgress: vi.fn(),
}));
const matching = vi.hoisted(() => ({ getClientActiveMission: vi.fn(), getActiveMission: vi.fn() }));
const handlers = vi.hoisted(() => ({ listen: {} as Record<string, (e: any) => void>, whisper: {} as Record<string, (e: any) => void> }));
const channel = vi.hoisted(() => ({
    listen: vi.fn((evt: string, cb: any) => { handlers.listen[evt] = cb; return channel; }),
    listenForWhisper: vi.fn((evt: string, cb: any) => { handlers.whisper[evt] = cb; return channel; }),
    stopListening: vi.fn(), whisper: vi.fn(),
}));
const echo = vi.hoisted(() => ({ private: vi.fn(() => channel), leave: vi.fn() }));
const destroyEcho = vi.hoisted(() => vi.fn());
let session: any;
vi.mock('./AuthContext', () => ({ useAuth: () => session }));
vi.mock('../services/chatService', () => ({ default: chat }));
vi.mock('../services/matchingService', () => ({ default: matching }));
vi.mock('../services/echo', () => ({ getEcho: () => echo, destroyEcho }));

import { ChatProvider, useChat } from './ChatContext';

const wrapper = ({ children }: { children: ReactNode }) => <ChatProvider>{children}</ChatProvider>;
const moi = { id: 'me', name: 'Moi', avatar_url: null };
const msg = (id: string, sender = 'other', over = {}) => ({ id, conversation_id: 'c1', sender_id: sender, body: id, attachments: [], read_at: null, created_at: '2026-11-01T00:00:00Z', ...over });

describe('ChatContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        handlers.listen = {}; handlers.whisper = {};
        session = { user: moi, role: 'client', isAuthenticated: true };
        matching.getClientActiveMission.mockResolvedValue({ data: { technician: { id: 't1', name: 'Paul', avatar: 'a.png' } } });
        matching.getActiveMission.mockResolvedValue({ data: { client: { id: 'c9', name: 'Alice', avatar: null } } });
        chat.createOrFindConversation.mockResolvedValue({ id: 'c1' });
        chat.getMessages.mockResolvedValue({ data: [msg('m2'), msg('m1')], links: { next: 'page2' } });
        chat.getUnreadCount.mockResolvedValue(3);
    });

    it("lève une erreur hors fournisseur", () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(() => useChat())).toThrow(/ChatProvider/);
    });

    it("initialise la conversation d'un client avec le technicien de sa mission, messages en ordre chronologique", async () => {
        const { result } = renderHook(() => useChat(), { wrapper });

        await waitFor(() => expect(result.current.conversation?.id).toBe('c1'));
        expect(chat.createOrFindConversation).toHaveBeenCalledWith('t1');
        expect(result.current.otherUser).toEqual({ id: 't1', name: 'Paul', avatar_url: 'a.png' });
        expect(result.current.messages.map((m) => m.id)).toEqual(['m1', 'm2']);
        await waitFor(() => expect(result.current.unreadCount).toBe(3));
    });

    it("utilise le client de la mission active pour un technicien", async () => {
        session = { ...session, role: 'technicien' };
        const { result } = renderHook(() => useChat(), { wrapper });

        await waitFor(() => expect(result.current.otherUser?.name).toBe('Alice'));
        expect(chat.createOrFindConversation).toHaveBeenCalledWith('c9');
    });

    it.each([
        ['un rôle sans messagerie de mission', { role: 'admin', isAuthenticated: true }],
        ['un visiteur non connecté', { role: 'guest', isAuthenticated: false }],
    ])("n'ouvre aucune conversation pour %s", async (_l, over) => {
        session = { ...session, ...over };
        const { result } = renderHook(() => useChat(), { wrapper });

        await new Promise((r) => setTimeout(r, 20));
        expect(result.current.conversation).toBeNull();
        expect(chat.createOrFindConversation).not.toHaveBeenCalled();
    });

    it("reste masquée sans mission active ou sans interlocuteur", async () => {
        matching.getClientActiveMission.mockResolvedValue({ data: { technician: null } });
        const { result } = renderHook(() => useChat(), { wrapper });

        await new Promise((r) => setTimeout(r, 20));
        expect(result.current.conversation).toBeNull();

        matching.getClientActiveMission.mockRejectedValue(new Error('404'));
        const second = renderHook(() => useChat(), { wrapper });
        await new Promise((r) => setTimeout(r, 20));
        expect(second.result.current.conversation).toBeNull();
    });

    // ── Temps réel ─────────────────────────────────────────

    const pret = async () => {
        const hook = renderHook(() => useChat(), { wrapper });
        await waitFor(() => expect(hook.result.current.conversation).not.toBeNull());
        await waitFor(() => expect(handlers.listen['.MessageSent']).toBeDefined());
        return hook;
    };

    it("incrémente le compteur de non-lus pour un message reçu fenêtre fermée, pas pour ses propres messages", async () => {
        const { result } = await pret();
        await waitFor(() => expect(result.current.unreadCount).toBe(3));

        act(() => handlers.listen['.MessageSent']({ message: msg('m3', 't1') }));
        expect(result.current.unreadCount).toBe(4);
        act(() => handlers.listen['.MessageSent']({ message: msg('m4', 'me') }));
        expect(result.current.unreadCount).toBe(4);
        expect(result.current.messages.map((m) => m.id)).toEqual(['m1', 'm2', 'm3', 'm4']);
    });

    it("marque lu un message reçu fenêtre ouverte", async () => {
        const { result } = await pret();
        act(() => result.current.openChat());
        await waitFor(() => expect(handlers.listen['.MessageSent']).toBeDefined());
        chat.markAsRead.mockClear();

        act(() => handlers.listen['.MessageSent']({ message: msg('m3', 't1') }));

        expect(chat.markAsRead).toHaveBeenCalledWith('c1');
    });

    it("ouvrir la messagerie remet les non-lus à zéro et les signale au serveur", async () => {
        const { result } = await pret();
        await waitFor(() => expect(result.current.unreadCount).toBe(3));

        act(() => result.current.openChat());

        expect(result.current.isChatOpen).toBe(true);
        expect(result.current.unreadCount).toBe(0);
        expect(chat.markAsRead).toHaveBeenCalledWith('c1');
        act(() => result.current.closeChat());
        expect(result.current.isChatOpen).toBe(false);
    });

    it("accuse la lecture de mes messages lorsque l'autre partie les a lus", async () => {
        chat.getMessages.mockResolvedValue({ data: [msg('m1', 'me')], links: {} });
        const { result } = await pret();

        act(() => handlers.listen['.MessageRead']({ user_id: 't1', read_at: '2026-11-02T00:00:00Z' }));

        expect(result.current.messages[0].read_at).toBe('2026-11-02T00:00:00Z');
    });

    it("ignore l'accusé de lecture émis par moi-même", async () => {
        chat.getMessages.mockResolvedValue({ data: [msg('m1', 'me')], links: {} });
        const { result } = await pret();

        act(() => handlers.listen['.MessageRead']({ user_id: 'me', read_at: '2026-11-02T00:00:00Z' }));

        expect(result.current.messages[0].read_at).toBeNull();
    });

    it("affiche l'indicateur de saisie de l'autre partie puis l'efface après 3 s", async () => {
        const { result } = await pret();
        vi.useFakeTimers();

        act(() => handlers.whisper['typing']({ user_id: 't1', name: 'Paul' }));
        expect(result.current.isTyping).toBe(true);
        expect(result.current.typingUserName).toBe('Paul');
        act(() => { vi.advanceTimersByTime(3100); });
        expect(result.current.isTyping).toBe(false);

        act(() => handlers.whisper['typing']({ user_id: 'me', name: 'Moi' }));
        expect(result.current.isTyping).toBe(false);
        vi.useRealTimers();
    });

    it("émet un événement de saisie (whisper) avec l'identité de l'utilisateur", async () => {
        const { result } = await pret();

        act(() => result.current.sendTypingEvent());

        expect(channel.whisper).toHaveBeenCalledWith('typing', { user_id: 'me', name: 'Moi' });
    });

    // ── Envoi et pagination ────────────────────────────────

    it("remplace le message optimiste par le message confirmé par le serveur", async () => {
        chat.sendMessage.mockResolvedValue(msg('srv-1', 'me', { body: 'Bonjour' }));
        const { result } = await pret();

        await act(async () => { await result.current.sendMessage('Bonjour'); });

        expect(chat.sendMessage).toHaveBeenCalledWith('c1', 'Bonjour', undefined);
        const ids = result.current.messages.map((m) => m.id);
        expect(ids).toContain('srv-1');
        expect(ids.some((i) => i.startsWith('temp-'))).toBe(false);
        expect(result.current.uploadProgress).toBeNull();
    });

    it("retire le message optimiste lorsque l'envoi échoue", async () => {
        chat.sendMessage.mockRejectedValue(new Error('500'));
        const { result } = await pret();
        const avant = result.current.messages.length;

        await act(async () => { await result.current.sendMessage('Perdu'); });

        expect(result.current.messages).toHaveLength(avant);
    });

    it("charge les messages plus anciens en tête puis s'arrête sans page suivante", async () => {
        const { result } = await pret();
        chat.getMessages.mockResolvedValueOnce({ data: [msg('m0')], links: {} });

        let suite = false;
        await act(async () => { suite = await result.current.loadMoreMessages(); });

        expect(suite).toBe(true);
        expect(chat.getMessages).toHaveBeenLastCalledWith('c1', 2);
        expect(result.current.messages[0].id).toBe('m0');
        await act(async () => { suite = await result.current.loadMoreMessages(); });
        expect(suite).toBe(false);
    });

    it("signale la fin de l'historique lorsqu'une page est vide", async () => {
        const { result } = await pret();
        chat.getMessages.mockResolvedValueOnce({ data: [], links: {} });

        let suite = true;
        await act(async () => { suite = await result.current.loadMoreMessages(); });

        expect(suite).toBe(false);
    });

    it("marque comme lu à la demande et change d'onglet", async () => {
        const { result } = await pret();
        await waitFor(() => expect(result.current.unreadCount).toBe(3));

        act(() => result.current.markAsRead());
        act(() => result.current.setActiveTab('files'));

        expect(result.current.unreadCount).toBe(0);
        expect(result.current.activeTab).toBe('files');
    });

    it("ferme le canal et détruit la connexion temps réel au démontage", async () => {
        const { unmount } = await pret();

        unmount();

        expect(echo.leave).toHaveBeenCalledWith('conversation.c1');
        expect(destroyEcho).toHaveBeenCalled();
    });
});
