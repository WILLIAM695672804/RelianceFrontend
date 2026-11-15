import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const matching = vi.hoisted(() => ({ getActiveMission: vi.fn(), updatePosition: vi.fn() }));
const ops = vi.hoisted(() => ({ createJob: vi.fn(), updateJobStatus: vi.fn() }));
const chat = vi.hoisted(() => ({ openChat: vi.fn(), conversation: { id: 'c1' } as any }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/matchingService', () => ({ default: matching }));
vi.mock('../../services/operationsService', () => ops);
vi.mock('../../context/ChatContext', () => ({ useChat: () => ({ openChat: chat.openChat, conversation: chat.conversation }) }));
vi.mock('../../components/maps/RouteMap', () => ({ default: (p: any) => <div data-testid="route">{p.origin ? `${p.origin.latitude},${p.origin.longitude}` : 'sans-position'}</div> }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import Cockpit from './Cockpit';

const mission = (job: any = null) => ({
    data: {
        proposal_id: 'p1', price: 9000, accepted_at: '2026-11-01T00:00:00Z', job,
        request: { id: 'r1', title: 'Fuite évier', description: 'Fuite', status: 'assigned', photos: null, category: 'Plomberie' },
        client: { id: 'c', name: 'Alice', phone: '+237600000000', avatar: null },
        address: { label: 'Bonapriso', city: 'Douala', address: 'Rue 1', latitude: 4.05, longitude: 9.77 },
    },
});
const renderPage = () => render(<MemoryRouter><Cockpit /></MemoryRouter>);
const geoloc = (impl: any) => Object.defineProperty(navigator, 'geolocation', { value: impl, configurable: true });

describe('Cockpit', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        chat.conversation = { id: 'c1' };
        geoloc(undefined);
        matching.getActiveMission.mockResolvedValue(mission());
        matching.updatePosition.mockResolvedValue({});
    });

    it('invite à ouvrir le radar lorsqu’aucune mission n’est active', async () => {
        matching.getActiveMission.mockRejectedValue(new Error('404'));
        renderPage();

        expect(await screen.findByText('Aucune mission active')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(navigate).toHaveBeenCalledWith('/technicien/radar');
    });

    it('affiche la mission, le client et le prix', async () => {
        renderPage();

        expect((await screen.findAllByText('Fuite évier')).length).toBeGreaterThan(0);
        expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
        expect(document.body.textContent).toMatch(/9.000/);
    });

    it('ouvre la messagerie si une conversation existe, sinon désactive le bouton', async () => {
        const { unmount } = renderPage();
        const bouton = await screen.findByTitle('Ouvrir la messagerie');
        fireEvent.click(bouton);
        expect(chat.openChat).toHaveBeenCalled();
        unmount();

        chat.conversation = null;
        renderPage();
        expect(await screen.findByTitle(/en cours de préparation/i)).toBeDisabled();
    });

    it('propose un appel au client', async () => {
        renderPage();

        await screen.findByText('Alice');
        expect(document.querySelector('a[href="tel:+237600000000"]')).not.toBeNull();
    });

    // ── Suivi d'intervention ───────────────────────────────

    it("démarre l'intervention : crée le job puis propose l'étape suivante", async () => {
        ops.createJob.mockResolvedValue({ id: 'j1', status: 'pending', phases: null, started_at: null });
        renderPage();

        fireEvent.click(await screen.findByText("Démarrer l'intervention"));

        await waitFor(() => expect(ops.createJob).toHaveBeenCalledWith({ request_id: 'r1' }));
        expect(await screen.findByText('Démarrer le trajet')).toBeInTheDocument();
    });

    it("tolère l'échec de création du job (technicien non mandaté)", async () => {
        ops.createJob.mockRejectedValue({ response: { status: 403 } });
        renderPage();

        fireEvent.click(await screen.findByText("Démarrer l'intervention"));

        await waitFor(() => expect(ops.createJob).toHaveBeenCalled());
        expect(screen.getByText("Démarrer l'intervention")).toBeEnabled();
    });

    it.each([
        ['pending', 'Démarrer le trajet', 'en_route'],
        ['en_route', 'Je suis arrivé', 'arrived'],
        ['arrived', 'Commencer les travaux', 'in_progress'],
        ['in_progress', 'Terminer la mission', 'completed'],
    ])("depuis « %s », « %s » demande le statut « %s »", async (depart, action, suivant) => {
        matching.getActiveMission.mockResolvedValue(mission({ id: 'j1', status: depart, phases: null, started_at: null }));
        ops.updateJobStatus.mockResolvedValue({ status: suivant, phases: null, started_at: null });
        renderPage();

        fireEvent.click(await screen.findByText(action));

        await waitFor(() => expect(ops.updateJobStatus).toHaveBeenCalledWith('j1', { status: suivant }));
    });

    it("conserve l'état courant lorsque la transition est refusée", async () => {
        matching.getActiveMission.mockResolvedValue(mission({ id: 'j1', status: 'pending', phases: null, started_at: null }));
        ops.updateJobStatus.mockRejectedValue(new Error('422'));
        renderPage();

        fireEvent.click(await screen.findByText('Démarrer le trajet'));

        await waitFor(() => expect(ops.updateJobStatus).toHaveBeenCalled());
        expect(await screen.findByText('Démarrer le trajet')).toBeInTheDocument();
    });

    it("propose les travaux et le signalement d'un problème pendant la mission", async () => {
        matching.getActiveMission.mockResolvedValue(mission({ id: 'j1', status: 'in_progress', phases: null, started_at: null }));
        renderPage();

        fireEvent.click(await screen.findByText(/signaler un problème/i));
        expect(navigate).toHaveBeenCalledWith('/technicien/litiges');
        const travaux = Array.from(document.querySelectorAll('.tech-btn-delay')).find((b) => b.textContent !== 'Signaler un problème')!;
        fireEvent.click(travaux);
        expect(navigate).toHaveBeenCalledWith('/technicien/mission/r1/travaux');
    });

    // ── Position ───────────────────────────────────────────

    it("envoie la position du technicien au serveur et la transmet à la carte", async () => {
        const watchPosition = vi.fn((ok: PositionCallback) => { ok({ coords: { latitude: 4.01, longitude: 9.71 } } as GeolocationPosition); return 7; });
        const clearWatch = vi.fn();
        geoloc({ watchPosition, clearWatch });
        const { unmount } = renderPage();

        await waitFor(() => expect(matching.updatePosition).toHaveBeenCalledWith(4.01, 9.71));
        expect(await screen.findByTestId('route')).toHaveTextContent('4.01,9.71');
        unmount();
        expect(clearWatch).toHaveBeenCalledWith(7);
    });

    it("renvoie la dernière position toutes les 30 s, même à l'arrêt", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        try {
            const watchPosition = vi.fn((ok: PositionCallback) => { ok({ coords: { latitude: 4.01, longitude: 9.71 } } as GeolocationPosition); return 7; });
            geoloc({ watchPosition, clearWatch: vi.fn() });
            const { unmount } = renderPage();
            await waitFor(() => expect(matching.updatePosition).toHaveBeenCalledTimes(1));

            await vi.advanceTimersByTimeAsync(30_000);
            expect(matching.updatePosition).toHaveBeenCalledTimes(2);
            await vi.advanceTimersByTimeAsync(30_000);
            expect(matching.updatePosition).toHaveBeenCalledTimes(3);
            expect(matching.updatePosition).toHaveBeenLastCalledWith(4.01, 9.71);

            unmount();
            await vi.advanceTimersByTimeAsync(60_000);
            expect(matching.updatePosition).toHaveBeenCalledTimes(3); // plus d'envoi une fois la page quittée
        } finally {
            vi.useRealTimers();
        }
    });
});
