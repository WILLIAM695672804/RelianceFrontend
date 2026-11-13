import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ops = vi.hoisted(() => ({ createQuote: vi.fn(), sendQuote: vi.fn(), getQuotesForRequest: vi.fn() }));
const matching = vi.hoisted(() => ({ getActiveMission: vi.fn() }));
vi.mock('../../services/operationsService', () => ops);
vi.mock('../../services/matchingService', () => ({ default: matching }));

import QuoteEditor from './QuoteEditor';

const renderPage = () =>
    render(
        <MemoryRouter initialEntries={['/devis/req-1']}>
            <Routes><Route path="/devis/:id" element={<QuoteEditor />} /></Routes>
        </MemoryRouter>,
    );

const libelle = () => screen.getAllByPlaceholderText(/main d'oeuvre/i);
const montant = () => screen.getAllByPlaceholderText('0');

describe('QuoteEditor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        matching.getActiveMission.mockResolvedValue({ data: { id: 'req-1' } });
        ops.getQuotesForRequest.mockResolvedValue([]);
    });

    it('refuse un devis dont une ligne est sans libellé', async () => {
        renderPage();

        fireEvent.click(await screen.findByText(/creer et envoyer/i));

        expect(await screen.findByText(/remplir tous les libelles/i)).toBeInTheDocument();
        expect(ops.createQuote).not.toHaveBeenCalled();
    });

    it('refuse un montant total nul', async () => {
        renderPage();
        await screen.findByText(/creer et envoyer/i);

        fireEvent.change(libelle()[0], { target: { value: 'Main d\'oeuvre' } });
        fireEvent.click(screen.getByText(/creer et envoyer/i));

        expect(await screen.findByText(/superieur a 0/i)).toBeInTheDocument();
        expect(ops.createQuote).not.toHaveBeenCalled();
    });

    it('somme les lignes, crée puis envoie le devis', async () => {
        ops.createQuote.mockResolvedValue({ id: 'q1' });
        ops.sendQuote.mockResolvedValue({});
        renderPage();
        await screen.findByText(/creer et envoyer/i);

        fireEvent.change(libelle()[0], { target: { value: "Main d'oeuvre" } });
        fireEvent.change(montant()[0], { target: { value: '10000' } });
        fireEvent.click(screen.getByText(/ajouter une ligne/i));
        fireEvent.change(libelle()[1], { target: { value: 'Pièces' } });
        fireEvent.change(montant()[1], { target: { value: '2500' } });
        fireEvent.click(screen.getByText(/creer et envoyer/i));

        await waitFor(() => expect(ops.createQuote).toHaveBeenCalledWith({
            request_id: 'req-1',
            total_amount: 12500,
            breakdown: [{ label: "Main d'oeuvre", amount: 10000 }, { label: 'Pièces', amount: 2500 }],
            valid_until: undefined,
        }));
        expect(ops.sendQuote).toHaveBeenCalledWith('q1');
        expect(await screen.findByText(/cree et envoye au client/i)).toBeInTheDocument();
    });

    it("sauvegarde en brouillon sans l'envoyer", async () => {
        ops.createQuote.mockResolvedValue({ id: 'q1' });
        renderPage();
        await screen.findByText(/sauvegarder brouillon/i);

        fireEvent.change(libelle()[0], { target: { value: 'Diagnostic' } });
        fireEvent.change(montant()[0], { target: { value: '3000' } });
        fireEvent.click(screen.getByText(/sauvegarder brouillon/i));

        expect(await screen.findByText(/sauvegarde en brouillon/i)).toBeInTheDocument();
        expect(ops.sendQuote).not.toHaveBeenCalled();
    });

    it("affiche le refus du serveur (technicien non mandaté, 403)", async () => {
        ops.createQuote.mockRejectedValue({ response: { status: 403, data: { message: 'Seul le technicien mandaté peut établir un devis.' } } });
        renderPage();
        await screen.findByText(/creer et envoyer/i);

        fireEvent.change(libelle()[0], { target: { value: 'Diagnostic' } });
        fireEvent.change(montant()[0], { target: { value: '3000' } });
        fireEvent.click(screen.getByText(/creer et envoyer/i));

        expect(await screen.findByText(/technicien mandaté/i)).toBeInTheDocument();
    });

    it("ne permet pas de supprimer l'unique ligne, mais en supprime une parmi plusieurs", async () => {
        renderPage();
        await screen.findByText(/ajouter une ligne/i);
        expect(document.querySelector('.qe-remove-line')).toBeDisabled();

        fireEvent.click(screen.getByText(/ajouter une ligne/i));
        expect(libelle()).toHaveLength(2);
        fireEvent.click(document.querySelectorAll('.qe-remove-line')[0]);
        expect(libelle()).toHaveLength(1);
    });

    it("envoie un brouillon existant puis recharge la liste", async () => {
        ops.getQuotesForRequest.mockResolvedValue([{ id: 'q9', status: 'draft', total_amount: 5000, breakdown: [{ label: 'X', amount: 5000 }], created_at: '2026-11-01T00:00:00Z' }]);
        ops.sendQuote.mockResolvedValue({});
        renderPage();

        await screen.findByText('Brouillon');
        fireEvent.click(document.querySelector('.qe-send-btn')!);

        await waitFor(() => expect(ops.sendQuote).toHaveBeenCalledWith('q9'));
        await waitFor(() => expect(ops.getQuotesForRequest.mock.calls.length).toBeGreaterThan(1));
    });
});
