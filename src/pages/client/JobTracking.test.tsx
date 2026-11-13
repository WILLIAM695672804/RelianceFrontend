import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ops = vi.hoisted(() => ({ getJobTracking: vi.fn(), getQuotesForRequest: vi.fn(), acceptQuote: vi.fn(), rejectQuote: vi.fn() }));
const channel = vi.hoisted(() => ({ opts: {} as any }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/operationsService', () => ops);
vi.mock('../../hooks/useJobChannel', () => ({ useJobChannel: (o: any) => { channel.opts = o; } }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import JobTracking from './JobTracking';

const suivi = (over = {}) => ({
    job_id: 'j1', request_id: 'r1', status: 'en_route', phases: [{ title: 'Diagnostic', status: 'completed' }, { title: 'Réparation', status: 'in_progress' }],
    route: null, estimated_travel_seconds: 600, started_at: null, completed_at: null, technician: { id: 't1', name: 'Paul' }, ...over,
});
const devis = (over = {}) => ({ id: 'q1', status: 'sent', total_amount: 12000, breakdown: [{ label: "Main d'oeuvre", amount: 12000 }], ...over });
const renderPage = () =>
    render(
        <MemoryRouter initialEntries={['/espace-client/suivi/j1']}>
            <Routes><Route path="/espace-client/suivi/:jobId" element={<JobTracking />} /></Routes>
        </MemoryRouter>,
    );

describe('JobTracking', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        ops.getJobTracking.mockResolvedValue(suivi());
        ops.getQuotesForRequest.mockResolvedValue([]);
    });

    it("affiche le chargement puis le suivi, avec l'arrivée estimée", async () => {
        renderPage();

        expect(screen.getByText(/chargement du suivi/i)).toBeInTheDocument();
        expect((await screen.findAllByText('En route vers vous')).length).toBeGreaterThan(0);
        expect(screen.getByText(/arrivee estimee: ~10 min/i)).toBeInTheDocument();
        expect(ops.getJobTracking).toHaveBeenCalledWith('j1');
    });

    it("signale un suivi indisponible et permet de revenir", async () => {
        ops.getJobTracking.mockRejectedValue({ response: { status: 403 } });
        renderPage();

        expect(await screen.findByText('Suivi non disponible.')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Retour'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });

    it("affiche les phases de travail", async () => {
        renderPage();

        expect(await screen.findByText('Diagnostic')).toBeInTheDocument();
        expect(screen.getByText('Réparation')).toBeInTheDocument();
    });

    it("affiche l'intervention terminée avec sa date", async () => {
        ops.getJobTracking.mockResolvedValue(suivi({ status: 'completed', completed_at: '2026-11-10T10:00:00Z', estimated_travel_seconds: null }));
        renderPage();

        expect(await screen.findByText('Intervention terminee !')).toBeInTheDocument();
        expect(screen.getByText(/termine l'intervention le 10\/11\/2026/)).toBeInTheDocument();
    });

    // ── Temps réel ─────────────────────────────────────────

    it("met à jour le statut et les phases à la réception d'événements", async () => {
        renderPage();
        await screen.findAllByText('En route vers vous');

        act(() => channel.opts.onStatusChanged({ status: 'in_progress', phases: [{ title: 'Essais', status: 'pending' }], started_at: 'x', completed_at: null, estimated_travel_seconds: null }));
        expect((await screen.findAllByText('Travaux en cours')).length).toBeGreaterThan(0);
        act(() => channel.opts.onPhasesUpdated({ phases: [{ title: 'Nettoyage', status: 'pending' }] }));
        expect(await screen.findByText('Nettoyage')).toBeInTheDocument();
        expect(channel.opts.jobId).toBe('j1');
    });

    // ── Devis ──────────────────────────────────────────────

    it("charge les devis de la demande liée au suivi et ne propose que ceux envoyés", async () => {
        ops.getQuotesForRequest.mockResolvedValue([devis(), devis({ id: 'q2', status: 'draft' }), devis({ id: 'q3', status: 'accepted' })]);
        renderPage();

        expect(await screen.findByText('Devis a valider')).toBeInTheDocument();
        expect(ops.getQuotesForRequest).toHaveBeenCalledWith('r1');
        expect(screen.getAllByText('Accepter le devis')).toHaveLength(1);
        expect(screen.getByText("Main d'oeuvre")).toBeInTheDocument();
    });

    it("ne charge aucun devis lorsque le suivi n'indique pas la demande", async () => {
        ops.getJobTracking.mockResolvedValue(suivi({ request_id: undefined }));
        renderPage();

        await screen.findAllByText('En route vers vous');
        expect(ops.getQuotesForRequest).not.toHaveBeenCalled();
    });

    it("conserve le suivi si le chargement des devis échoue", async () => {
        ops.getQuotesForRequest.mockRejectedValue(new Error('500'));
        renderPage();

        expect((await screen.findAllByText('En route vers vous')).length).toBeGreaterThan(0);
    });

    it("accepte un devis : séquestre confirmé puis liste rechargée", async () => {
        ops.getQuotesForRequest.mockResolvedValueOnce([devis()]).mockResolvedValue([devis({ status: 'accepted' })]);
        ops.acceptQuote.mockResolvedValue({ data: { invoice_id: 'f1', escrow: 'held' } });
        renderPage();

        fireEvent.click(await screen.findByText('Accepter le devis'));

        await waitFor(() => expect(ops.acceptQuote).toHaveBeenCalledWith('q1'));
        expect(await screen.findByText(/placé sous séquestre/i)).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByText('Devis a valider')).not.toBeInTheDocument());
    });

    it("signale un solde insuffisant pour le séquestre et propose de recharger le portefeuille", async () => {
        ops.getQuotesForRequest.mockResolvedValue([devis()]);
        ops.acceptQuote.mockResolvedValue({ data: { invoice_id: 'f1', escrow: 'insufficient_funds' } });
        renderPage();

        fireEvent.click(await screen.findByText('Accepter le devis'));

        expect(await screen.findByText(/solde ne permet pas le séquestre/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /recharger mon portefeuille/i })).toHaveAttribute('href', '/espace-client/wallet');
    });

    it("refuse un devis puis recharge la liste", async () => {
        ops.getQuotesForRequest.mockResolvedValueOnce([devis()]).mockResolvedValue([devis({ status: 'rejected' })]);
        ops.rejectQuote.mockResolvedValue({});
        renderPage();

        fireEvent.click(await screen.findByText('Refuser'));

        await waitFor(() => expect(ops.rejectQuote).toHaveBeenCalledWith('q1'));
        await waitFor(() => expect(screen.queryByText('Devis a valider')).not.toBeInTheDocument());
    });

    it("tolère un échec d'acceptation et réactive les boutons", async () => {
        ops.getQuotesForRequest.mockResolvedValue([devis()]);
        ops.acceptQuote.mockRejectedValue({ response: { status: 403 } });
        renderPage();

        fireEvent.click(await screen.findByText('Accepter le devis'));

        await waitFor(() => expect(screen.getByText('Accepter le devis')).toBeEnabled());
        expect(screen.queryByText(/séquestre/i)).not.toBeInTheDocument();
    });
});
