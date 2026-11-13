import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getInvoices = vi.fn();
const payInvoice = vi.fn();
vi.mock('../../services/operationsService', () => ({
    getInvoices: (...a: unknown[]) => getInvoices(...a),
    payInvoice: (...a: unknown[]) => payInvoice(...a),
}));

import Invoices from './Invoices';

const renderPage = () =>
    render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
            <MemoryRouter><Invoices /></MemoryRouter>
        </QueryClientProvider>,
    );

const facture = { id: 'f1', amount: 12000, status: 'unpaid', created_at: '2026-11-01T10:00:00Z', number: 'F-1' };

describe('Invoices', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        getInvoices.mockResolvedValue({ data: [facture], meta: { last_page: 1 } });
    });

    it('affiche un état vide sans facture', async () => {
        getInvoices.mockResolvedValue({ data: [], meta: { last_page: 1 } });
        renderPage();
        expect(await screen.findByText(/aucune facture/i)).toBeInTheDocument();
    });

    it('propose de recharger le portefeuille lorsque le paiement renvoie 402', async () => {
        payInvoice.mockRejectedValue({ response: { status: 402, data: { message: 'Solde insuffisant' } } });
        renderPage();

        fireEvent.click(await screen.findByRole('button', { name: /payer/i }));

        expect(await screen.findByText(/solde insuffisant/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /recharger mon portefeuille/i })).toHaveAttribute('href', '/espace-client/wallet');
    });

    it("n'affiche pas le lien de rechargement pour une autre erreur", async () => {
        payInvoice.mockRejectedValue({ response: { status: 500, data: { message: 'Erreur interne' } } });
        renderPage();

        fireEvent.click(await screen.findByRole('button', { name: /payer/i }));

        expect(await screen.findByText(/erreur interne/i)).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /recharger/i })).not.toBeInTheDocument();
    });

    it("n'appelle pas l'API si l'utilisateur refuse la confirmation", async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false);
        renderPage();

        fireEvent.click(await screen.findByRole('button', { name: /payer/i }));

        await waitFor(() => expect(payInvoice).not.toHaveBeenCalled());
    });

    it('recharge la liste après un paiement réussi', async () => {
        payInvoice.mockResolvedValue({});
        renderPage();

        fireEvent.click(await screen.findByRole('button', { name: /payer/i }));

        await waitFor(() => expect(getInvoices.mock.calls.length).toBeGreaterThan(1));
    });
});
