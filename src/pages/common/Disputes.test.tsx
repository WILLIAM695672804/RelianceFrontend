import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const disputes = vi.hoisted(() => ({ getDisputes: vi.fn(), openDispute: vi.fn() }));
const requests = vi.hoisted(() => ({ list: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/disputeService', () => ({ disputeService: disputes }));
vi.mock('../../services/requestService', () => ({ default: requests }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import Disputes from './Disputes';

const renderPage = () => render(<MemoryRouter><Disputes /></MemoryRouter>);
const avecTech = { id: 'r1', title: 'Fuite', category: { name: 'Plomberie' }, counterpart: { id: 't1', name: 'Paul' } };
const sansTech = { id: 'r2', title: 'Panne', counterpart: null };

describe('Disputes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        disputes.getDisputes.mockResolvedValue({ data: { data: [] } });
        requests.list.mockResolvedValue({ data: [avecTech, sansTech] });
    });

    it('affiche un état vide sans litige', async () => {
        renderPage();
        expect(await screen.findByText(/aucun litige en cours/i)).toBeInTheDocument();
    });

    it('liste les litiges et ouvre le détail au clic', async () => {
        disputes.getDisputes.mockResolvedValue({ data: { data: [{ id: 'd1', reason: 'Retard', description: 'x', status: 'open', resolution: null, created_at: '2026-11-01T00:00:00Z' }] } });
        renderPage();

        fireEvent.click(await screen.findByText('Retard'));

        expect(navigate).toHaveBeenCalledWith('litiges/d1');
    });

    it("dérive la partie adverse de la demande choisie et bloque l'envoi sans technicien retenu", async () => {
        renderPage();
        fireEvent.click(await screen.findByText(/ouvrir un litige/i));
        const select = await screen.findByRole('combobox');
        await screen.findByText(/Fuite — Plomberie/);

        fireEvent.change(select, { target: { value: 'r2' } });
        expect(await screen.findByText(/aucun technicien n'a encore été retenu/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /soumettre le litige/i })).toBeDisabled();

        fireEvent.change(select, { target: { value: 'r1' } });
        expect(await screen.findByText('Paul')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /soumettre le litige/i })).toBeEnabled();
    });

    it('soumet le litige avec la partie adverse dérivée puis recharge la liste', async () => {
        disputes.openDispute.mockResolvedValue({});
        renderPage();
        fireEvent.click(await screen.findByText(/ouvrir un litige/i));
        await screen.findByText(/Fuite — Plomberie/);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'r1' } });
        fireEvent.change(screen.getByPlaceholderText('Motif'), { target: { value: 'Retard' } });
        fireEvent.change(screen.getByPlaceholderText(/description détaillée/i), { target: { value: 'Intervention tardive' } });
        fireEvent.click(screen.getByRole('button', { name: /soumettre le litige/i }));

        await waitFor(() => expect(disputes.openDispute).toHaveBeenCalledWith({ request_id: 'r1', against: 't1', reason: 'Retard', description: 'Intervention tardive' }));
        await waitFor(() => expect(disputes.getDisputes).toHaveBeenCalledTimes(2));
    });

    it('relaie le refus du serveur (403) sans fermer le formulaire', async () => {
        disputes.openDispute.mockRejectedValue({ response: { status: 403, data: { message: 'Un litige ne peut opposer que les deux parties de la mission.' } } });
        renderPage();
        fireEvent.click(await screen.findByText(/ouvrir un litige/i));
        await screen.findByText(/Fuite — Plomberie/);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'r1' } });
        fireEvent.change(screen.getByPlaceholderText('Motif'), { target: { value: 'x' } });
        fireEvent.change(screen.getByPlaceholderText(/description détaillée/i), { target: { value: 'y' } });
        fireEvent.click(screen.getByRole('button', { name: /soumettre le litige/i }));

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/deux parties/)));
        expect(screen.getByPlaceholderText('Motif')).toBeInTheDocument();
    });
});
