import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let chat: any;
vi.mock('../../context/ChatContext', () => ({ useChat: () => chat }));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'me' } }) }));
vi.mock('./MessageBubble', () => ({ default: (p: any) => <div data-testid="bulle" data-mine={String(p.isMine)}>{p.message.body}</div> }));
vi.mock('./TypingIndicator', () => ({ default: (p: any) => <div data-testid="saisie">{p.name}</div> }));
vi.mock('./FilePreview', () => ({ default: (p: any) => <div data-testid="fichiers">{p.files.map((f: File, i: number) => <button key={i} onClick={() => p.onRemove(i)}>{f.name}</button>)}</div> }));
vi.mock('./AttachmentsTab', () => ({ default: (p: any) => <div data-testid="pj">{p.conversationId}</div> }));

import ChatModal from './ChatModal';

const base = () => ({
    conversation: { id: 'c1' }, messages: [{ id: 'm1', sender_id: 'me', body: 'Salut' }, { id: 'm2', sender_id: 't1', body: 'Bonjour' }],
    isChatOpen: true, isTyping: false, typingUserName: '', activeTab: 'messages', uploadProgress: null,
    otherUser: { id: 't1', name: 'Paul', avatar_url: null },
    closeChat: vi.fn(), sendMessage: vi.fn().mockResolvedValue(undefined), sendTypingEvent: vi.fn(), loadMoreMessages: vi.fn().mockResolvedValue(false), setActiveTab: vi.fn(),
});
const fichier = (nom: string) => new File(['x'], nom, { type: 'image/png' });

describe('ChatModal', () => {
    beforeEach(() => { chat = base(); window.HTMLElement.prototype.scrollIntoView = vi.fn(); });
    afterEach(() => vi.useRealTimers());

    it.each([
        ['fermée', { isChatOpen: false }],
        ['sans conversation', { conversation: null }],
        ['sans interlocuteur', { otherUser: null }],
    ])("ne rend rien lorsque la messagerie est %s", (_l, over) => {
        chat = { ...base(), ...over };
        const { container } = render(<ChatModal />);

        expect(container).toBeEmptyDOMElement();
    });

    it("affiche l'interlocuteur, ses messages et distingue les miens", () => {
        render(<ChatModal />);

        expect(screen.getByText('Paul')).toBeInTheDocument();
        const bulles = screen.getAllByTestId('bulle');
        expect(bulles[0]).toHaveAttribute('data-mine', 'true');
        expect(bulles[1]).toHaveAttribute('data-mine', 'false');
        expect(screen.getByAltText('Paul').getAttribute('src')).toContain('ui-avatars.com');
    });

    it("invite à commencer la conversation lorsqu'elle est vide", () => {
        chat = { ...base(), messages: [] };
        render(<ChatModal />);

        expect(screen.getByText('Commencez la conversation')).toBeInTheDocument();
    });

    it("affiche l'indicateur de saisie et la progression d'envoi", () => {
        chat = { ...base(), isTyping: true, typingUserName: 'Paul', uploadProgress: 40 };
        render(<ChatModal />);

        expect(screen.getByTestId('saisie')).toHaveTextContent('Paul');
        expect(screen.getByText('ecrit...')).toBeInTheDocument();
        expect((document.querySelector('.chat-upload-bar') as HTMLElement).style.width).toBe('40%');
    });

    it("bascule vers l'onglet des fichiers", () => {
        render(<ChatModal />);
        fireEvent.click(screen.getByText('Fichiers'));
        expect(chat.setActiveTab).toHaveBeenCalledWith('files');

        chat = { ...base(), activeTab: 'files' };
        const { unmount } = render(<ChatModal />);
        expect(screen.getByTestId('pj')).toHaveTextContent('c1');
        unmount();
    });

    it('ferme la messagerie', () => {
        render(<ChatModal />);

        fireEvent.click(document.querySelector('.chat-modal-close')!);

        expect(chat.closeChat).toHaveBeenCalled();
    });

    // ── Saisie et envoi ────────────────────────────────────

    it("désactive l'envoi sans texte ni fichier", () => {
        render(<ChatModal />);

        expect(document.querySelector('.chat-input-send')).toBeDisabled();
        fireEvent.change(screen.getByPlaceholderText(/ecrivez votre message/i), { target: { value: '   ' } });
        expect(document.querySelector('.chat-input-send')).toBeDisabled();
    });

    it("envoie le message nettoyé puis vide la saisie", async () => {
        render(<ChatModal />);
        const champ = screen.getByPlaceholderText(/ecrivez votre message/i);

        fireEvent.change(champ, { target: { value: '  Bonjour Paul  ' } });
        fireEvent.submit(document.querySelector('form')!);

        await waitFor(() => expect(chat.sendMessage).toHaveBeenCalledWith('Bonjour Paul', undefined));
        await waitFor(() => expect(champ).toHaveValue(''));
    });

    it("temporise l'événement de saisie (300 ms)", async () => {
        vi.useFakeTimers();
        render(<ChatModal />);
        const champ = screen.getByPlaceholderText(/ecrivez votre message/i);

        fireEvent.change(champ, { target: { value: 'a' } });
        fireEvent.change(champ, { target: { value: 'ab' } });
        expect(chat.sendTypingEvent).not.toHaveBeenCalled();
        await act(async () => { vi.advanceTimersByTime(350); });

        expect(chat.sendTypingEvent).toHaveBeenCalledTimes(1);
    });

    it("joint au plus cinq fichiers, permet d'en retirer et les envoie", async () => {
        render(<ChatModal />);
        const input = document.querySelector('input[type="file"]')!;

        fireEvent.change(input, { target: { files: [1, 2, 3].map((n) => fichier(`f${n}.png`)) } });
        fireEvent.change(input, { target: { files: [4, 5, 6, 7].map((n) => fichier(`f${n}.png`)) } });

        expect(screen.getByTestId('fichiers').querySelectorAll('button')).toHaveLength(5);
        expect(document.querySelector('.chat-input-attach')).toBeDisabled();

        fireEvent.click(screen.getByText('f1.png'));
        expect(screen.getByTestId('fichiers').querySelectorAll('button')).toHaveLength(4);

        fireEvent.submit(document.querySelector('form')!);
        await waitFor(() => expect(chat.sendMessage).toHaveBeenCalled());
        expect(chat.sendMessage.mock.calls[0][0]).toBe('');
        expect(chat.sendMessage.mock.calls[0][1]).toHaveLength(4);
    });

    it("charge l'historique plus ancien quand on remonte en haut de la conversation", async () => {
        chat = { ...base(), loadMoreMessages: vi.fn().mockResolvedValue(true) };
        render(<ChatModal />);
        const zone = document.querySelector('.chat-modal-messages') as HTMLElement;

        Object.defineProperty(zone, 'scrollTop', { value: 10, writable: true });
        fireEvent.scroll(zone);
        await waitFor(() => expect(chat.loadMoreMessages).toHaveBeenCalledTimes(1));

        Object.defineProperty(zone, 'scrollTop', { value: 400, writable: true });
        fireEvent.scroll(zone);
        expect(chat.loadMoreMessages).toHaveBeenCalledTimes(1);
    });
});
