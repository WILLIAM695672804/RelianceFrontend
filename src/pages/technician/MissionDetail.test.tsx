import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ops = vi.hoisted(() => ({ updateJobStatus: vi.fn(), getQuotesForRequest: vi.fn(), createJob: vi.fn() }));
const matching = vi.hoisted(() => ({ getActiveMission: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../components/finance/DiagnosticFee', () => ({ default: () => null }));
vi.mock('../../services/operationsService', () => ops);
vi.mock('../../services/matchingService', () => ({ default: matching }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import MissionDetail from './MissionDetail';

const donnees = (job: any = null) => ({
    data: {
        request: { id: 'r1', title: 'Fuite évier', description: 'Fuite importante', category: 'Plomberie', created_at: '2026-11-01T00:00:00Z' },
        client: { name: 'Alice' }, address: { address: 'Rue 1', city: 'Douala' }, job,
    },
});
const renderPage = () =>
    render(
        <MemoryRouter initialEntries={['/technicien/mission/r1']}>
            <Routes><Route path="/technicien/mission/:id" element={<MissionDetail />} /></Routes>
        </MemoryRouter>,
    );

describe('MissionDetail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        matching.getActiveMission.mockResolvedValue(donnees());
        ops.getQuotesForRequest.mockResolvedValue([]);
    });

    it('affiche la demande, le client et l’adresse, et « Aucun devis »', async () => {
        renderPage();

        expect(await screen.findByText('Fuite évier')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Rue 1, Douala')).toBeInTheDocument();
        expect(screen.getByText('Aucun devis')).toBeInTheDocument();
        expect(ops.getQuotesForRequest).toHaveBeenCalledWith('r1');
    });

    it('affiche les valeurs de repli lorsque la mission est indisponible', async () => {
        matching.getActiveMission.mockRejectedValue(new Error('404'));
        renderPage();

        expect(await screen.findByText('Detail Mission')).toBeInTheDocument();
        expect(screen.getByText('Aucune description')).toBeInTheDocument();
    });

    it('liste les devis de la demande avec leur statut', async () => {
        ops.getQuotesForRequest.mockResolvedValue([{ id: 'q1', status: 'accepted' }, { id: 'q2', status: 'draft' }]);
        renderPage();

        expect(await screen.findByText('Devis (2)')).toBeInTheDocument();
        expect(screen.getByText('accepted')).toBeInTheDocument();
    });

    it("crée le job à la demande lorsqu'il n'existe pas", async () => {
        ops.createJob.mockResolvedValue({ id: 'j1', status: 'pending', phases: null });
        renderPage();

        await screen.findByText(/aucun job cree/i);
        fireEvent.click(document.querySelector('.md-btn-primary')!);

        await waitFor(() => expect(ops.createJob).toHaveBeenCalledWith({ request_id: 'r1' }));
        await waitFor(() => expect(document.querySelector('.md-status-pill')).toHaveTextContent('En attente'));
    });

    it('tolère un échec de création de job (technicien non mandaté)', async () => {
        ops.createJob.mockRejectedValue({ response: { status: 403 } });
        renderPage();

        await screen.findByText(/aucun job cree/i);
        fireEvent.click(document.querySelector('.md-btn-primary')!);

        await waitFor(() => expect(ops.createJob).toHaveBeenCalled());
        expect(screen.getByText(/aucun job cree/i)).toBeInTheDocument();
    });

    // ── Machine à états de l'intervention ──────────────────

    it.each([
        ['pending', 'Demarrer le trajet', 'en_route', 'En route'],
        ['en_route', 'Je suis arrive', 'arrived', 'Sur place'],
        ['arrived', 'Commencer les travaux', 'in_progress', 'En cours'],
        ['in_progress', 'Terminer la mission', 'completed', 'Terminee'],
    ])("depuis « %s », l'action « %s » demande le statut « %s »", async (depart, action, suivant, libelle) => {
        matching.getActiveMission.mockResolvedValue(donnees({ id: 'j1', status: depart, phases: null }));
        ops.updateJobStatus.mockResolvedValue({ id: 'j1', status: suivant, phases: null });
        renderPage();

        fireEvent.click(await screen.findByText(action));

        await waitFor(() => expect(ops.updateJobStatus).toHaveBeenCalledWith('j1', { status: suivant }));
        await waitFor(() => expect(document.querySelector('.md-status-pill')).toHaveTextContent(libelle));
    });

    it("n'offre plus d'action une fois la mission terminée", async () => {
        matching.getActiveMission.mockResolvedValue(donnees({ id: 'j1', status: 'completed', phases: null }));
        renderPage();

        await waitFor(() => expect(document.querySelector('.md-status-pill')).toHaveTextContent('Terminee'));
        expect(screen.queryByText('Terminer la mission')).not.toBeInTheDocument();
        expect(document.querySelector('.md-btn-primary')).toBeNull();
    });

    it("propose l'accès aux travaux uniquement pendant l'intervention", async () => {
        matching.getActiveMission.mockResolvedValue(donnees({ id: 'j1', status: 'in_progress', phases: [{ title: 'Diagnostic', status: 'completed' }, { title: 'Réparation', status: 'in_progress' }] }));
        renderPage();

        await screen.findByText('Diagnostic');
        expect(document.querySelector('a[href="/technicien/mission/r1/travaux"]')).not.toBeNull();
    });

    it("conserve l'état en cas d'échec de transition", async () => {
        matching.getActiveMission.mockResolvedValue(donnees({ id: 'j1', status: 'pending', phases: null }));
        ops.updateJobStatus.mockRejectedValue(new Error('422'));
        renderPage();

        fireEvent.click(await screen.findByText('Demarrer le trajet'));

        await waitFor(() => expect(screen.getByText('Demarrer le trajet')).toBeEnabled());
        expect(document.querySelector('.md-status-pill')).toHaveTextContent('En attente');
    });

    it('revient au tableau de bord', async () => {
        renderPage();

        fireEvent.click((await screen.findByText('Fuite évier')).closest('.md-header')!.querySelector('.md-back-btn')!);

        expect(navigate).toHaveBeenCalledWith('/technicien/dashboard');
    });
});
