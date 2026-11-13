import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const matching = vi.hoisted(() => ({ getClientActiveMission: vi.fn(), getTechnicianPosition: vi.fn() }));
const openChat = vi.hoisted(() => vi.fn());
const navigate = vi.hoisted(() => vi.fn());
const channels = vi.hoisted(() => ({ proposal: {} as any, tracking: {} as any }));
vi.mock('../../services/matchingService', () => ({ default: matching }));
vi.mock('../../context/ChatContext', () => ({ useChat: () => ({ openChat }) }));
vi.mock('../../hooks/useProposalChannel', () => ({ useProposalChannel: (o: any) => { channels.proposal = o; } }));
vi.mock('../../hooks/useTrackingChannel', () => ({ useTrackingChannel: (o: any) => { channels.tracking = o; } }));
vi.mock('../../components/maps/RouteMap', () => ({ default: (p: any) => <div data-testid="route">{p.destination ? `${p.destination.latitude},${p.destination.longitude}` : 'aucune'}</div> }));
vi.mock('../../components/reviews/ReviewModal', () => ({
    default: (p: any) => <div data-testid="review">{`${p.stage}|${p.requestId}`}<button onClick={p.onSubmitted}>soumettre</button><button onClick={p.onClose}>fermer</button></div>,
}));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import MissionTracking from './MissionTracking';

const mission = (over: any = {}) => ({
    job_id: 'j1',
    request: { id: 'r1', title: 'Fuite', description: 'd', status: 'assigned', category: 'Plomberie', created_at: '2026-11-01T00:00:00Z', ...over.request },
    address: { label: 'Bonapriso', city: 'Douala', address: 'Rue 1', latitude: 4.05, longitude: 9.77 },
    proposal: { id: 'p1', price: 9000, status: 'accepted', ...over.proposal },
    technician: over.technician === null ? null : { id: 't1', name: 'Paul', phone: '+237600000000', avatar: null, rating: 4.5, num_reviews: 3 },
});
const renderPage = () => render(<MemoryRouter><MissionTracking /></MemoryRouter>);

describe('MissionTracking', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        matching.getClientActiveMission.mockResolvedValue({ data: mission() });
        matching.getTechnicianPosition.mockResolvedValue({ data: null });
        Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true });
    });

    it('affiche le chargement puis un message sans mission active', async () => {
        matching.getClientActiveMission.mockRejectedValue(new Error('404'));
        renderPage();

        expect(screen.getByText(/chargement de votre mission/i)).toBeInTheDocument();
        expect(await screen.findByText(/aucune mission active/i)).toBeInTheDocument();
    });

    it("affiche le statut « assigné » avec le prix de la proposition acceptée", async () => {
        renderPage();

        expect(await screen.findByText('ASSIGNÉ')).toBeInTheDocument();
        expect(screen.getAllByText(/9.000/).length).toBeGreaterThan(0);
        expect(screen.getByText('Paul')).toBeInTheDocument();
    });

    it("affiche « en attente » tant que la proposition n'est pas acceptée", async () => {
        matching.getClientActiveMission.mockResolvedValue({ data: mission({ request: { status: 'quoted' }, proposal: { status: 'pending' } }) });
        renderPage();

        expect(await screen.findByText('EN ATTENTE')).toBeInTheDocument();
    });

    it('ouvre la messagerie et propose un appel téléphonique', async () => {
        renderPage();
        await screen.findByText('Paul');

        fireEvent.click(screen.getByTitle('Chat'));

        expect(openChat).toHaveBeenCalled();
        expect(screen.getByTitle('Appeler')).toHaveAttribute('href', 'tel:+237600000000');
    });

    it("recharge la mission lorsqu'une proposition est acceptée ou refusée en temps réel", async () => {
        renderPage();
        await screen.findByText('Paul');
        matching.getClientActiveMission.mockClear();

        await act(async () => { channels.proposal.onProposalAccepted(); });
        await act(async () => { channels.proposal.onProposalRefused(); });

        expect(matching.getClientActiveMission).toHaveBeenCalledTimes(2);
    });

    // ── Suivi de position ──────────────────────────────────

    it('affiche la position initiale du technicien puis ses mises à jour en direct', async () => {
        matching.getTechnicianPosition.mockResolvedValue({ data: { latitude: 4.01, longitude: 9.71 } });
        renderPage();
        await waitFor(() => expect(screen.getByTestId('route')).toHaveTextContent('4.01,9.71'));

        await act(async () => { channels.tracking.onPositionUpdated({ latitude: 4.02, longitude: 9.72 }); });

        expect(screen.getByTestId('route')).toHaveTextContent('4.02,9.72');
        expect(channels.tracking.jobId).toBe('j1');
        expect(screen.getByText('Position en direct')).toBeInTheDocument();
    });

    // ── Avis avant / après ─────────────────────────────────

    it("propose l'avis « avant l'intervention » tant que la mission est assignée, puis le masque après envoi", async () => {
        renderPage();

        fireEvent.click(await screen.findByText(/avant l'intervention/i));
        expect(screen.getByTestId('review')).toHaveTextContent('pre|r1');
        fireEvent.click(screen.getByText('soumettre'));

        expect(screen.queryByTestId('review')).not.toBeInTheDocument();
        expect(screen.queryByText(/avant l'intervention/i)).not.toBeInTheDocument();
    });

    it("propose l'avis « après » seulement une fois la mission terminée", async () => {
        matching.getClientActiveMission.mockResolvedValue({ data: mission({ request: { status: 'completed' } }) });
        renderPage();

        await screen.findByText('Paul');
        expect(screen.queryByText(/avant l'intervention/i)).not.toBeInTheDocument();
        fireEvent.click(document.querySelector('.mt-btn-review')!);

        expect(screen.getByTestId('review')).toHaveTextContent('post|r1');
    });

    it("ferme la fenêtre d'avis sans le considérer comme envoyé", async () => {
        renderPage();
        fireEvent.click(await screen.findByText(/avant l'intervention/i));

        fireEvent.click(screen.getByText('fermer'));

        expect(screen.queryByTestId('review')).not.toBeInTheDocument();
        expect(screen.getByText(/avant l'intervention/i)).toBeInTheDocument();
    });

    // ── Litige et assistance ───────────────────────────────

    it("mène vers l'ouverture d'un litige et vers le support", async () => {
        renderPage();
        await screen.findByText('Paul');

        fireEvent.click(document.querySelector('.mt-btn-danger')!);
        fireEvent.click(document.querySelector('.mt-btn-outline')!);

        expect(navigate).toHaveBeenCalledWith('/espace-client/litiges');
        expect(navigate).toHaveBeenCalledWith('/contact');
    });
});
