import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const matching = vi.hoisted(() => ({ getProposals: vi.fn(), acceptProposal: vi.fn(), refuseProposal: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
const channel = vi.hoisted(() => ({ opts: {} as any }));
vi.mock('../../services/matchingService', () => ({ default: matching }));
vi.mock('../../hooks/useProposalChannel', () => ({ useProposalChannel: (o: any) => { channel.opts = o; } }));
vi.mock('../../components/maps/TechServiceMap', () => ({ default: () => <div data-testid="map" /> }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import LiveRadar from './LiveRadar';

const proposition = (over = {}) => ({
    id: 'p1', request_id: 'r1', technician_id: 't1', status: 'pending', price: 9000, expires_at: '',
    request: { id: 'r1', title: 'Fuite évier', description: 'Fuite importante sous évier' }, ...over,
});
const renderPage = () => render(<MemoryRouter><LiveRadar /></MemoryRouter>);

describe('LiveRadar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        matching.getProposals.mockResolvedValue({ data: { data: [proposition()] } });
    });

    it('affiche « Aucune mission en attente » sans proposition', async () => {
        matching.getProposals.mockResolvedValue({ data: { data: [] } });
        renderPage();

        expect(await screen.findByText('Aucune mission en attente')).toBeInTheDocument();
        expect(screen.getByText('0 missions disponibles')).toBeInTheDocument();
    });

    it('affiche la première proposition en attente avec son prix et un extrait', async () => {
        renderPage();

        expect(await screen.findByText('Fuite évier')).toBeInTheDocument();
        expect(screen.getByText(/9.000 XAF/)).toBeInTheDocument();
        expect(screen.getByText('1 mission disponible')).toBeInTheDocument();
    });

    it("ne retient que les propositions « pending » de la réponse paginée", async () => {
        matching.getProposals.mockResolvedValue({ data: { data: [
            proposition({ id: 'a', status: 'accepted', request: { title: 'Ancienne' } }),
            proposition({ id: 'b', status: 'pending', request: { title: 'Récente' } }),
        ] } });
        renderPage();

        expect(await screen.findByText('Récente')).toBeInTheDocument();
        expect(screen.queryByText('Ancienne')).not.toBeInTheDocument();
    });

    it("tolère une réponse sans paginateur et un échec de chargement", async () => {
        matching.getProposals.mockResolvedValue({ data: [proposition()] });
        const { unmount } = renderPage();
        expect(await screen.findByText('Fuite évier')).toBeInTheDocument();
        unmount();

        matching.getProposals.mockRejectedValue(new Error('500'));
        renderPage();
        expect(await screen.findByText('Aucune mission en attente')).toBeInTheDocument();
    });

    it('ajoute en tête une proposition reçue en temps réel', async () => {
        matching.getProposals.mockResolvedValue({ data: { data: [] } });
        renderPage();
        await screen.findByText('Aucune mission en attente');

        await act(async () => { channel.opts.onProposalCreated({ id: 'p9', request_id: 'r9', price: 5000, request: { id: 'r9', title: 'Panne électrique', description: 'Disjoncteur' } }); });

        expect(await screen.findByText('Panne électrique')).toBeInTheDocument();
    });

    it("accepte la proposition puis ouvre le cockpit", async () => {
        matching.acceptProposal.mockResolvedValue({});
        renderPage();

        fireEvent.click(await screen.findByText('ACCEPTER'));

        await waitFor(() => expect(matching.acceptProposal).toHaveBeenCalledWith('p1'));
        expect(navigate).toHaveBeenCalledWith('/technicien/cockpit');
    });

    it("reste sur le radar si l'acceptation échoue (proposition expirée)", async () => {
        matching.acceptProposal.mockRejectedValue({ response: { status: 410 } });
        renderPage();

        fireEvent.click(await screen.findByText('ACCEPTER'));

        await waitFor(() => expect(matching.acceptProposal).toHaveBeenCalled());
        expect(navigate).not.toHaveBeenCalled();
        expect(screen.getByText('Fuite évier')).toBeInTheDocument();
    });

    it("refuse la proposition et la retire sans naviguer", async () => {
        matching.refuseProposal.mockResolvedValue({});
        renderPage();
        await screen.findByText('Fuite évier');

        const refuser = Array.from(document.querySelectorAll('button')).find((b) => b.textContent && /refus|ignor|décliner/i.test(b.textContent))!;
        fireEvent.click(refuser);

        await waitFor(() => expect(matching.refuseProposal).toHaveBeenCalledWith('p1'));
        await waitFor(() => expect(screen.queryByText('Fuite évier')).not.toBeInTheDocument());
        expect(navigate).not.toHaveBeenCalled();
    });
});
