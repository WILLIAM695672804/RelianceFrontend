import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const verifyEmail = vi.fn();
const refreshUser = vi.fn();
const navigate = vi.fn();
let user: any = null;

vi.mock('../../services/authService', () => ({ default: { verifyEmail: (u: string) => verifyEmail(u) } }));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user, refreshUser }) }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import VerifyEmail from './VerifyEmail';

const renderAt = (search: string) =>
    render(<MemoryRouter initialEntries={[`/verify${search}`]}><VerifyEmail /></MemoryRouter>);

describe('VerifyEmail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        user = { id: 'u1', roles: [{ name: 'client' }] };
        refreshUser.mockResolvedValue(undefined);
    });

    it('signale un lien invalide lorsque le paramètre url est absent', async () => {
        renderAt('');

        expect(await screen.findByText(/invalide ou manquant/i)).toBeInTheDocument();
        expect(verifyEmail).not.toHaveBeenCalled();
    });

    it("n'exécute la vérification qu'une seule fois malgré le changement d'utilisateur", async () => {
        verifyEmail.mockResolvedValue({ message: 'Vérifié' });
        const { rerender } = renderAt('?url=%2Fauth%2Femail%2Fverify%2F1%2Fabc');

        await waitFor(() => expect(refreshUser).toHaveBeenCalled());
        user = { id: 'u1', roles: [{ name: 'client' }], email_verified_at: 'now' };
        rerender(<MemoryRouter initialEntries={['/verify?url=%2Fauth%2Femail%2Fverify%2F1%2Fabc']}><VerifyEmail /></MemoryRouter>);

        expect(verifyEmail).toHaveBeenCalledTimes(1);
        expect(verifyEmail).toHaveBeenCalledWith('/auth/email/verify/1/abc');
        expect(await screen.findByText('Vérifié')).toBeInTheDocument();
    });

    it("affiche le message serveur lorsque la vérification échoue", async () => {
        verifyEmail.mockRejectedValue({ response: { data: { message: 'Lien expiré' } } });

        renderAt('?url=%2Fx');

        expect(await screen.findByText('Lien expiré')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /retour a la connexion/i })).toBeInTheDocument();
    });

    it("reconstitue l'appel de vérification à partir du lien direct", async () => {
        verifyEmail.mockResolvedValue({ message: 'Vérifié' });
        renderAt('?id=9e4867&hash=abc123&expires=1794734280&signature=f00d');

        await screen.findByText('Vérifié');
        expect(verifyEmail).toHaveBeenCalledWith('/auth/email/verify/9e4867/abc123?expires=1794734280&signature=f00d');
    });

    it("un lien direct incomplet est signalé comme invalide", async () => {
        renderAt('?id=9e4867&hash=abc123');

        expect(await screen.findByText(/invalide ou manquant/)).toBeInTheDocument();
        expect(verifyEmail).not.toHaveBeenCalled();
    });
});
