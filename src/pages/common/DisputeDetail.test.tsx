import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const svc = vi.hoisted(() => ({ getDispute: vi.fn(), addMessage: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { id: 'me' } }) }));
vi.mock('../../services/disputeService', () => ({ disputeService: svc }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import DisputeDetail from './DisputeDetail';

const litige = (over = {}) => ({
    id: 'abcdef12-0000', reason: 'Retard', description: 'Intervention tardive', status: 'open', resolution: null, created_at: '2026-11-01T00:00:00Z',
    opener: { id: 'me', name: 'Alice' }, defendant: { id: 't1', name: 'Paul' }, request: { id: 'r1', title: 'Fuite' },
    messages: [
        { id: 'm1', sender_id: 'me', message: 'Il est arrivé en retard', created_at: '2026-11-01T10:00:00Z', sender: { name: 'Alice' } },
        { id: 'm2', sender_id: 't1', message: 'Trafic dense', created_at: '2026-11-01T11:00:00Z', sender: undefined },
    ], ...over,
});
const renderPage = () =>
    render(
        <MemoryRouter initialEntries={['/espace-client/litiges/abcdef12-0000']}>
            <Routes><Route path="/espace-client/litiges/:id" element={<DisputeDetail />} /></Routes>
        </MemoryRouter>,
    );

describe('DisputeDetail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        svc.getDispute.mockResolvedValue({ data: { data: litige() } });
    });

    it("affiche le litige : identifiant court, statut et motif", async () => {
        renderPage();

        expect(await screen.findByText('Litige #abcdef12')).toBeInTheDocument();
        expect(screen.getByText('Ouvert')).toBeInTheDocument();
        expect(screen.getByText('Retard')).toBeInTheDocument();
        expect(svc.getDispute).toHaveBeenCalledWith('abcdef12-0000');
    });

    it("signale un litige introuvable ou non autorisé (404)", async () => {
        svc.getDispute.mockRejectedValue({ response: { status: 404 } });
        renderPage();

        expect(await screen.findByText('Litige introuvable')).toBeInTheDocument();
    });

    it("distingue mes messages de ceux de l'autre partie, avec un nom par défaut", async () => {
        renderPage();

        await screen.findByText('Il est arrivé en retard');
        expect(screen.getByText('Il est arrivé en retard').closest('.dispute-msg')).toHaveClass('mine');
        expect(screen.getByText('Trafic dense').closest('.dispute-msg')).toHaveClass('other');
        expect(screen.getByText('Utilisateur')).toBeInTheDocument();
    });

    it('envoie un message, vide la saisie et recharge le litige', async () => {
        svc.addMessage.mockResolvedValue({});
        renderPage();
        const zone = await screen.findByPlaceholderText(/écrire un message/i);
        expect(screen.getByRole('button', { name: 'Envoyer' })).toBeDisabled();

        fireEvent.change(zone, { target: { value: '  Ma version  ' } });
        fireEvent.click(screen.getByRole('button', { name: 'Envoyer' }));

        await waitFor(() => expect(svc.addMessage).toHaveBeenCalledWith('abcdef12-0000', 'Ma version'));
        await waitFor(() => expect(svc.getDispute).toHaveBeenCalledTimes(2));
        expect(zone).toHaveValue('');
    });

    it("relaie le refus du serveur lorsque le litige est résolu entre-temps (422)", async () => {
        svc.addMessage.mockRejectedValue({ response: { status: 422, data: { message: 'Ce litige est déjà résolu' } } });
        renderPage();

        fireEvent.change(await screen.findByPlaceholderText(/écrire un message/i), { target: { value: 'Trop tard' } });
        fireEvent.click(screen.getByRole('button', { name: 'Envoyer' }));

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Ce litige est déjà résolu'));
    });

    it.each([['resolved', 'Résolu'], ['closed', 'Fermé']])("masque la saisie d'un litige %s et affiche sa résolution", async (statut, libelle) => {
        svc.getDispute.mockResolvedValue({ data: { data: litige({ status: statut, resolution: 'Accord amiable' }) } });
        renderPage();

        expect(await screen.findByText(libelle)).toBeInTheDocument();
        expect(screen.getByText('Accord amiable')).toBeInTheDocument();
        expect(screen.queryByPlaceholderText(/écrire un message/i)).not.toBeInTheDocument();
    });

    it('revient à la liste', async () => {
        renderPage();

        fireEvent.click(await screen.findByText('Retour'));

        expect(navigate).toHaveBeenCalledWith(-1);
    });
});
