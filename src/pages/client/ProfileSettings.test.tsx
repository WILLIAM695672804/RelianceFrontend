import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({
    getLocations: vi.fn(), updateProfile: vi.fn(), updateAvatar: vi.fn(), generate2FA: vi.fn(), enable2FA: vi.fn(), disable2FA: vi.fn(),
}));
const requests = vi.hoisted(() => ({ list: vi.fn() }));
let currentUser: any;
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: currentUser }) }));
vi.mock('../../services/authService', () => ({ default: auth }));
vi.mock('../../services/requestService', () => ({ default: requests }));
vi.mock('../../components/common/RoleUpgradeModal', () => ({ default: ({ isOpen }: any) => (isOpen ? <div>modale-upgrade</div> : null) }));

import ProfileSettings from './ProfileSettings';

const renderPage = () =>
    render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
            <ProfileSettings />
        </QueryClientProvider>,
    );
const toggle2FA = () => document.querySelector('.ps-toggle')!;

describe('ProfileSettings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        currentUser = { id: 'u1', name: 'Alice Client', phone: '+237600000000', email: 'alice@test.local', email_verified_at: '2026-11-01', two_factor_enabled: false };
        auth.getLocations.mockResolvedValue([]);
        requests.list.mockResolvedValue({ data: [] });
    });

    // ── Affichage ──────────────────────────────────────────

    it("affiche l'identité, sans donnée fictive lorsque l'adresse est absente", async () => {
        renderPage();

        expect(await screen.findByRole('heading', { level: 1, name: 'Alice Client' })).toBeInTheDocument();
        expect(screen.getByText('alice@test.local')).toBeInTheDocument();
        expect(screen.getByText('Not provided')).toBeInTheDocument();
        expect(screen.queryByText(/Rue 1\.234/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Joined June 2023/)).not.toBeInTheDocument();
    });

    it("n'affiche « Verified Account » que si l'e-mail est vérifié", async () => {
        const { unmount } = renderPage();
        expect(await screen.findByText('Verified Account')).toBeInTheDocument();
        unmount();

        currentUser = { ...currentUser, email_verified_at: undefined };
        renderPage();
        await screen.findByRole('heading', { level: 1, name: 'Alice Client' });
        expect(screen.queryByText('Verified Account')).not.toBeInTheDocument();
    });

    it("affiche l'adresse par défaut et le décompte des demandes (total et actives)", async () => {
        auth.getLocations.mockResolvedValue([{ id: 'l1', is_default: true, address: 'Akwa, Douala' }]);
        requests.list.mockResolvedValue({ data: [{ status: 'analyzed' }, { status: 'completed' }, { status: 'cancelled' }, { status: 'assigned' }] });
        renderPage();

        expect(await screen.findByText('Akwa, Douala')).toBeInTheDocument();
        await waitFor(() => expect(document.querySelectorAll('.ps-stat-val')[0]).toHaveTextContent('4'));
        expect(document.querySelectorAll('.ps-stat-val')[1]).toHaveTextContent('2');
    });

    it('ouvre la demande de passage au rôle technicien', async () => {
        renderPage();

        fireEvent.click(await screen.findByText('Faire une demande'));

        expect(screen.getByText('modale-upgrade')).toBeInTheDocument();
    });

    // ── Édition du profil ──────────────────────────────────

    it("préremplit l'édition, garde l'e-mail en lecture seule et n'envoie que nom et téléphone", async () => {
        auth.updateProfile.mockResolvedValue({});
        const reload = vi.fn();
        Object.defineProperty(window, 'location', { value: { ...window.location, reload }, configurable: true });
        renderPage();
        fireEvent.click(await screen.findByText(/edit profile/i));

        expect(screen.getByDisplayValue('alice@test.local')).toBeDisabled();
        fireEvent.change(screen.getByDisplayValue('Alice Client'), { target: { value: 'Alice Durand' } });
        fireEvent.click(screen.getByText(/save/i, { selector: 'button[type="submit"]' }));

        await waitFor(() => expect(auth.updateProfile).toHaveBeenCalledWith({ name: 'Alice Durand', phone: '+237600000000' }));
        expect(auth.updateAvatar).not.toHaveBeenCalled();
    });

    it("envoie aussi l'avatar choisi", async () => {
        auth.updateProfile.mockResolvedValue({});
        auth.updateAvatar.mockResolvedValue({});
        Object.defineProperty(window, 'location', { value: { ...window.location, reload: vi.fn() }, configurable: true });
        renderPage();
        fireEvent.click(await screen.findByText(/edit profile/i));
        const fichier = new File(['x'], 'a.png', { type: 'image/png' });

        fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [fichier] } });
        fireEvent.click(screen.getByText(/save/i, { selector: 'button[type="submit"]' }));

        await waitFor(() => expect(auth.updateAvatar).toHaveBeenCalledWith(fichier));
    });

    it("alerte et conserve la fenêtre lorsque l'enregistrement échoue", async () => {
        auth.updateProfile.mockRejectedValue(new Error('422'));
        renderPage();
        fireEvent.click(await screen.findByText(/edit profile/i));

        fireEvent.click(screen.getByText(/save/i, { selector: 'button[type="submit"]' }));

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Could not update profile.'));
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    // ── Double authentification ────────────────────────────

    it("génère le secret, affiche le QR et la clé manuelle, puis active avec un code valide", async () => {
        auth.generate2FA.mockResolvedValue({ secret: 'SECRET123', qr_code_svg: '<svg data-testid="qr"></svg>' });
        auth.enable2FA.mockResolvedValue(undefined);
        renderPage();
        await screen.findByRole('heading', { level: 1, name: 'Alice Client' });

        fireEvent.click(toggle2FA());
        expect(await screen.findByText('SECRET123')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '12a34b56' } });
        expect(screen.getByPlaceholderText('123456')).toHaveValue('123456');
        fireEvent.click(screen.getByRole('button', { name: 'Activer' }));

        await waitFor(() => expect(auth.enable2FA).toHaveBeenCalledWith('123456'));
        await waitFor(() => expect(toggle2FA()).toHaveClass('active'));
    });

    it("exige 6 chiffres avant d'appeler le serveur", async () => {
        auth.generate2FA.mockResolvedValue({ secret: 'S', qr_code_svg: '<svg/>' });
        renderPage();
        await screen.findByRole('heading', { level: 1, name: 'Alice Client' });

        fireEvent.click(toggle2FA());
        await screen.findByRole('button', { name: 'Activer' });
        fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '123' } });
        fireEvent.click(screen.getByRole('button', { name: 'Activer' }));

        expect(await screen.findByText('Entrez le code à 6 chiffres.')).toBeInTheDocument();
        expect(auth.enable2FA).not.toHaveBeenCalled();
    });

    it("affiche le message serveur lorsque le code d'activation est refusé", async () => {
        auth.generate2FA.mockResolvedValue({ secret: 'S', qr_code_svg: '<svg/>' });
        auth.enable2FA.mockRejectedValue({ response: { data: { message: 'Code 2FA invalide' } } });
        renderPage();
        await screen.findByRole('heading', { level: 1, name: 'Alice Client' });

        fireEvent.click(toggle2FA());
        await screen.findByRole('button', { name: 'Activer' });
        fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '000000' } });
        fireEvent.click(screen.getByRole('button', { name: 'Activer' }));

        expect(await screen.findByText('Code 2FA invalide')).toBeInTheDocument();
        expect(toggle2FA()).not.toHaveClass('active');
    });

    it('signale une génération de secret impossible', async () => {
        auth.generate2FA.mockRejectedValue(new Error('500'));
        renderPage();
        await screen.findByRole('heading', { level: 1, name: 'Alice Client' });

        fireEvent.click(toggle2FA());

        expect(await screen.findByText(/impossible de générer le secret/i)).toBeInTheDocument();
    });

    it("désactive la 2FA avec un code valide", async () => {
        currentUser = { ...currentUser, two_factor_enabled: true };
        auth.disable2FA.mockResolvedValue(undefined);
        renderPage();
        await screen.findByRole('heading', { level: 1, name: 'Alice Client' });

        fireEvent.click(toggle2FA());
        fireEvent.change(await screen.findByPlaceholderText('123456'), { target: { value: '654321' } });
        fireEvent.click(screen.getByRole('button', { name: 'Désactiver' }));

        await waitFor(() => expect(auth.disable2FA).toHaveBeenCalledWith('654321'));
        await waitFor(() => expect(toggle2FA()).not.toHaveClass('active'));
    });
});
