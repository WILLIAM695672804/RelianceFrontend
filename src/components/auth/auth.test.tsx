import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let session: any;
const logout = vi.hoisted(() => vi.fn());
const closeLogoutConfirm = vi.hoisted(() => vi.fn());
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ ...session, logout, closeLogoutConfirm }) }));

import LogoutConfirmModal from './LogoutConfirmModal';
import ProtectedRoute from './ProtectedRoute';

/** Monte la route protégée et des pages repères pour observer la redirection. */
const monter = (roles: any[], url = '/prive') =>
    render(
        <MemoryRouter initialEntries={[url]}>
            <Routes>
                <Route path="/prive" element={<ProtectedRoute allowedRoles={roles}><p>contenu protégé</p></ProtectedRoute>} />
                <Route path="/connexion" element={<p>page connexion</p>} />
                <Route path="/espace-client/dashboard" element={<p>dashboard client</p>} />
                <Route path="/technicien/dashboard" element={<p>dashboard technicien</p>} />
                <Route path="/agence/dashboard" element={<p>dashboard agence</p>} />
                <Route path="/admin/dashboard" element={<p>dashboard admin</p>} />
            </Routes>
        </MemoryRouter>,
    );

describe('ProtectedRoute', () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it('affiche un indicateur pendant la restauration de la session, sans révéler le contenu', () => {
        session = { isAuthenticated: false, isLoading: true, role: 'guest' };
        monter(['client']);

        expect(screen.getByText('Chargement...')).toBeInTheDocument();
        expect(screen.queryByText('contenu protégé')).not.toBeInTheDocument();
    });

    it('renvoie un visiteur vers la connexion', () => {
        session = { isAuthenticated: false, isLoading: false, role: 'guest' };
        monter(['client']);

        expect(screen.getByText('page connexion')).toBeInTheDocument();
        expect(screen.queryByText('contenu protégé')).not.toBeInTheDocument();
    });

    it('laisse entrer un rôle autorisé', () => {
        session = { isAuthenticated: true, isLoading: false, role: 'client' };
        monter(['client']);

        expect(screen.getByText('contenu protégé')).toBeInTheDocument();
    });

    it.each([
        ['technicien', 'dashboard technicien'],
        ['agence', 'dashboard agence'],
        ['admin', 'dashboard admin'],
        ['client', 'dashboard client'],
    ])("renvoie un %s non autorisé vers son propre tableau de bord", (role, page) => {
        session = { isAuthenticated: true, isLoading: false, role };
        monter(role === 'client' ? ['admin'] : ['client']);

        expect(screen.getByText(page)).toBeInTheDocument();
        expect(screen.queryByText('contenu protégé')).not.toBeInTheDocument();
    });

    it('accepte plusieurs rôles autorisés', () => {
        session = { isAuthenticated: true, isLoading: false, role: 'technicien' };
        monter(['client', 'technicien']);

        expect(screen.getByText('contenu protégé')).toBeInTheDocument();
    });
});

describe('LogoutConfirmModal', () => {
    const rendre = () => render(<MemoryRouter initialEntries={['/x']}><Routes><Route path="/x" element={<LogoutConfirmModal />} /><Route path="/" element={<p>accueil</p>} /></Routes></MemoryRouter>);

    beforeEach(() => { vi.clearAllMocks(); session = { isLogoutConfirmOpen: true, user: { name: 'Alice' } }; });

    it("ne rend rien lorsque la confirmation n'est pas demandée", () => {
        session = { isLogoutConfirmOpen: false };
        const { container } = rendre();

        expect(container).toBeEmptyDOMElement();
    });

    it("s'adresse à l'utilisateur par son nom, ou de façon neutre", () => {
        const { unmount } = rendre();
        expect(screen.getByText(/Alice, êtes-vous sûr/)).toBeInTheDocument();
        unmount();

        session = { isLogoutConfirmOpen: true, user: null };
        rendre();
        expect(screen.getByText(/^Êtes-vous sûr de vouloir/)).toBeInTheDocument();
    });

    it("déconnecte, ferme la fenêtre puis retourne à l'accueil", async () => {
        logout.mockResolvedValue(undefined);
        rendre();

        fireEvent.click(screen.getByText('Se déconnecter', { selector: 'button' }));

        await waitFor(() => expect(logout).toHaveBeenCalled());
        expect(closeLogoutConfirm).toHaveBeenCalled();
        expect(await screen.findByText('accueil')).toBeInTheDocument();
    });

    it('annule sans se déconnecter', () => {
        rendre();

        fireEvent.click(screen.getByText('Annuler'));

        expect(closeLogoutConfirm).toHaveBeenCalled();
        expect(logout).not.toHaveBeenCalled();
    });
});
