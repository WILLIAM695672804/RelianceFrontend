import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const svc = vi.hoisted(() => ({ getMe: vi.fn(), login: vi.fn(), register: vi.fn(), logout: vi.fn() }));
vi.mock('../services/authService', () => ({ default: svc }));

import { AuthProvider, useAuth } from './AuthContext';

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;
const admin = { id: 'u1', name: 'A', email: 'a@t.l', roles: [{ name: 'admin' }] };

describe('AuthContext', () => {
    beforeEach(() => { vi.clearAllMocks(); svc.getMe.mockRejectedValue(new Error('401')); });

    it("lève une erreur si useAuth est utilisé hors fournisseur", () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(() => renderHook(() => useAuth())).toThrow(/AuthProvider/);
        spy.mockRestore();
    });

    it("restaure la session au montage (utilisateur et rôle)", async () => {
        svc.getMe.mockResolvedValue({ user: admin });
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.role).toBe('admin');
    });

    it("reste invité sans session valide", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.role).toBe('guest');
    });

    it('login établit la session et ferme la fenêtre de connexion', async () => {
        svc.login.mockResolvedValue({ user: admin });
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => result.current.openAuthModal());
        expect(result.current.isAuthModalOpen).toBe(true);
        let out: any;
        await act(async () => { out = await result.current.login({ email: 'a', password: 'b' } as never); });

        expect(out.user).toEqual(admin);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isAuthModalOpen).toBe(false);
    });

    it("login signale la double authentification requise sans lever d'erreur", async () => {
        svc.login.mockRejectedValue({ response: { status: 403, data: { requires_2fa: true } } });
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        let out: any;
        await act(async () => { out = await result.current.login({} as never); });

        expect(out).toEqual({ requires_2fa: true });
        expect(result.current.isAuthenticated).toBe(false);
    });

    it("login relaie les autres erreurs, dont l'e-mail non vérifié", async () => {
        const erreur = { response: { status: 403, data: { requires_email_verification: true } } };
        svc.login.mockRejectedValue(erreur);
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await expect(result.current.login({} as never)).rejects.toBe(erreur);
    });

    it("register ouvre la session de l'utilisateur créé", async () => {
        svc.register.mockResolvedValue({ user: { ...admin, roles: [{ name: 'client' }] } });
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        await act(async () => { await result.current.register({} as never); });

        expect(result.current.role).toBe('client');
    });

    it("logout efface la session localement même si le serveur échoue", async () => {
        svc.getMe.mockResolvedValue({ user: admin });
        svc.logout.mockRejectedValue(new Error('réseau'));
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

        await act(async () => { await result.current.logout(); });

        expect(result.current.isAuthenticated).toBe(false);
    });

    it("refreshUser met à jour l'utilisateur et ignore silencieusement une erreur", async () => {
        svc.getMe.mockResolvedValueOnce({ user: admin });
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

        svc.getMe.mockResolvedValueOnce({ user: { ...admin, name: 'Nouveau' } });
        await act(async () => { await result.current.refreshUser(); });
        expect(result.current.user?.name).toBe('Nouveau');

        svc.getMe.mockRejectedValueOnce(new Error('x'));
        await act(async () => { await result.current.refreshUser(); });
        expect(result.current.user?.name).toBe('Nouveau');
    });

    it('gère la confirmation de déconnexion', async () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => result.current.openLogoutConfirm());
        expect(result.current.isLogoutConfirmOpen).toBe(true);
        act(() => result.current.closeLogoutConfirm());
        expect(result.current.isLogoutConfirmOpen).toBe(false);
    });

    it("rend ses enfants", async () => {
        render(<AuthProvider><p>contenu</p></AuthProvider>);
        expect(await screen.findByText('contenu')).toBeInTheDocument();
    });

    it("mémorise l'exigence de 2FA fournie à la restauration de session et à la connexion, et l'efface à la déconnexion", async () => {
        svc.getMe.mockResolvedValue({ user: admin, requires_2fa_setup: true });
        svc.logout.mockResolvedValue(undefined);
        const { result } = renderHook(() => useAuth(), { wrapper });
        await waitFor(() => expect(result.current.requires2faSetup).toBe(true));

        await act(async () => { await result.current.logout(); });
        expect(result.current.requires2faSetup).toBe(false);

        svc.login.mockResolvedValue({ user: admin, requires_2fa_setup: true });
        await act(async () => { await result.current.login({} as never); });
        expect(result.current.requires2faSetup).toBe(true);
    });

    it("considère l'exigence de 2FA absente par défaut", async () => {
        svc.getMe.mockResolvedValue({ user: admin });
        const { result } = renderHook(() => useAuth(), { wrapper });

        await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
        expect(result.current.requires2faSetup).toBe(false);
    });
});
