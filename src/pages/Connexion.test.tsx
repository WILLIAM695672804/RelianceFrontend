import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const login = vi.fn();
const resend = vi.fn();
const navigate = vi.fn();

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ login, isAuthenticated: false, role: 'guest' }) }));
vi.mock('../services/authService', () => ({ default: { resendVerificationEmailFor: (e: string) => resend(e) } }));
vi.mock('../components/layout/Footer', () => ({ default: () => null }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import Connexion from './Connexion';

const remplir = () => {
    fireEvent.change(document.querySelector('input[type="email"]')!, { target: { value: 'a@test.local' } });
    fireEvent.change(document.querySelector('input[type="password"]')!, { target: { value: 'Passw0rd!123' } });
    fireEvent.submit(document.querySelector('form')!);
};

const renderPage = () => render(<MemoryRouter><Connexion /></MemoryRouter>);

describe('Connexion', () => {
    beforeEach(() => vi.clearAllMocks());

    it("redirige vers le tableau de bord du rôle après une connexion réussie", async () => {
        login.mockResolvedValue({ user: { roles: [{ name: 'technicien' }] } });
        renderPage();

        remplir();

        await waitFor(() => expect(navigate).toHaveBeenCalledWith('/technicien/dashboard', { replace: true }));
    });

    it('bascule vers la double authentification lorsque le serveur la réclame', async () => {
        login.mockResolvedValue({ requires_2fa: true });
        renderPage();

        remplir();

        await waitFor(() => expect(navigate).toHaveBeenCalledWith('/auth/2fa', expect.objectContaining({ state: expect.objectContaining({ email: 'a@test.local' }) })));
    });

    it("affiche l'erreur sans proposer de renvoi pour des identifiants invalides", async () => {
        login.mockRejectedValue({ response: { status: 401, data: { message: 'Identifiants invalides' } } });
        renderPage();

        remplir();

        expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument();
        expect(screen.queryByText(/renvoyer le lien/i)).not.toBeInTheDocument();
    });

    it("propose le renvoi du lien lorsque l'e-mail n'est pas vérifié, puis confirme l'envoi", async () => {
        login.mockRejectedValue({ response: { status: 403, data: { message: 'E-mail non vérifié', requires_email_verification: true } } });
        resend.mockResolvedValue({ message: 'Lien renvoyé' });
        renderPage();

        remplir();
        fireEvent.click(await screen.findByText(/renvoyer le lien de vérification/i));

        expect(await screen.findByText('Lien renvoyé')).toBeInTheDocument();
        expect(resend).toHaveBeenCalledWith('a@test.local');
    });

    it("signale l'échec du renvoi (limite d'envoi) sans casser la page", async () => {
        login.mockRejectedValue({ response: { status: 403, data: { message: 'E-mail non vérifié', requires_email_verification: true } } });
        resend.mockRejectedValue({ response: { status: 503 } });
        renderPage();

        remplir();
        fireEvent.click(await screen.findByText(/renvoyer le lien de vérification/i));

        expect(await screen.findByText(/envoi impossible/i)).toBeInTheDocument();
    });
});
