import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const svc = vi.hoisted(() => ({ getUsers: vi.fn(), getUser: vi.fn(), toggleActive: vi.fn() }));
vi.mock('../../services/adminService', () => ({ default: svc }));

import AdminUsers from './AdminUsers';

const user = (over = {}) => ({ id: 'u1', name: 'Alice', email: 'alice@test.local', is_active: true, created_at: '2026-11-01T00:00:00Z', roles: [{ name: 'client' }], ...over });
const page = (data: unknown[], extra = {}) => ({ data, last_page: 1, total: data.length, ...extra });

describe('AdminUsers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        svc.getUsers.mockResolvedValue(page([user()]));
    });
    afterEach(() => vi.useRealTimers());

    it('liste les utilisateurs avec leur total et leur statut', async () => {
        render(<AdminUsers />);

        expect(await screen.findByText('Alice')).toBeInTheDocument();
        expect(screen.getByText(/Gestion des Utilisateurs \(1\)/)).toBeInTheDocument();
        expect(document.querySelector('td .adm-badge')).toHaveTextContent('Actif');
    });

    it('affiche un état vide', async () => {
        svc.getUsers.mockResolvedValue(page([]));
        render(<AdminUsers />);

        expect(await screen.findByText(/aucun utilisateur trouve/i)).toBeInTheDocument();
    });

    it('filtre par rôle et par statut en repartant de la première page', async () => {
        render(<AdminUsers />);
        await screen.findByText('Alice');

        const [role, statut] = screen.getAllByRole('combobox');
        fireEvent.change(role, { target: { value: 'technicien' } });
        fireEvent.change(statut, { target: { value: 'inactive' } });

        await waitFor(() => expect(svc.getUsers).toHaveBeenLastCalledWith({ page: 1, role: 'technicien', status: 'inactive' }));
    });

    it('temporise la recherche (400 ms) avant de requêter', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        render(<AdminUsers />);
        await screen.findByText('Alice');
        svc.getUsers.mockClear();

        fireEvent.change(screen.getByPlaceholderText(/rechercher/i), { target: { value: 'ali' } });
        await act(async () => { await vi.advanceTimersByTimeAsync(200); });
        expect(svc.getUsers).not.toHaveBeenCalled();

        await act(async () => { await vi.advanceTimersByTimeAsync(300); });
        await waitFor(() => expect(svc.getUsers).toHaveBeenCalledWith({ page: 1, search: 'ali' }));
    });

    it('pagine : « Suivant » demande la page 2, « Précédent » est désactivé en page 1', async () => {
        svc.getUsers.mockResolvedValue(page([user()], { last_page: 2, total: 20 }));
        render(<AdminUsers />);
        await screen.findByText('Alice');

        expect(screen.getByText('Precedent')).toBeDisabled();
        fireEvent.click(screen.getByText('Suivant'));

        await waitFor(() => expect(svc.getUsers).toHaveBeenLastCalledWith({ page: 2 }));
    });

    it("ouvre la fiche détaillée d'un utilisateur", async () => {
        svc.getUser.mockResolvedValue({ data: user({ phone: '+237600000000' }) });
        render(<AdminUsers />);
        await screen.findByText('Alice');

        fireEvent.click(document.querySelector('.adm-btn-outline')!);

        await waitFor(() => expect(svc.getUser).toHaveBeenCalledWith('u1'));
        expect(await screen.findAllByText('alice@test.local')).not.toHaveLength(0);
    });

    it('bascule le statut actif puis recharge la liste', async () => {
        svc.toggleActive.mockResolvedValue({ is_active: false });
        render(<AdminUsers />);
        await screen.findByText('Alice');
        svc.getUsers.mockResolvedValue(page([user({ is_active: false })]));

        const boutons = document.querySelectorAll('td .adm-btn');
        fireEvent.click(boutons[boutons.length - 1]);

        await waitFor(() => expect(svc.toggleActive).toHaveBeenCalledWith('u1'));
        await waitFor(() => expect(document.querySelector('td .adm-badge')).toHaveTextContent('Inactif'));
    });

    it('survit à une erreur de chargement', async () => {
        svc.getUsers.mockRejectedValue(new Error('500'));
        render(<AdminUsers />);

        expect(await screen.findByText(/Gestion des Utilisateurs/)).toBeInTheDocument();
    });
});
