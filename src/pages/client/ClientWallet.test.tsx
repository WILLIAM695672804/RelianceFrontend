import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const fin = vi.hoisted(() => ({
    getWallet: vi.fn(), getTransactions: vi.fn(), getExchangeRates: vi.fn(),
    rechargeWallet: vi.fn(), getPayment: vi.fn(), confirmPayment: vi.fn(),
}));
const getInvoices = vi.hoisted(() => vi.fn());
vi.mock('../../components/finance/CurrencyWallets', () => ({ default: () => null }));
vi.mock('../../services/financeService', () => ({ financeService: fin }));
vi.mock('../../services/operationsService', () => ({ getInvoices }));

import ClientWallet from './ClientWallet';

const renderPage = () =>
    render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
            <MemoryRouter><ClientWallet /></MemoryRouter>
        </QueryClientProvider>,
    );

const ouvrirRecharge = async () => {
    fireEvent.click((await screen.findAllByText(/add funds/i))[0]);
    await screen.findByText(/recharger mon compte/i);
};
const choisir = (carte: RegExp | string, montant?: string, tel?: string) => {
    fireEvent.click(screen.getByText(carte));
    if (montant) fireEvent.change(screen.getByPlaceholderText(/50000/), { target: { value: montant } });
    if (tel) fireEvent.change(screen.getByPlaceholderText(/\+237/), { target: { value: tel } });
};

describe('ClientWallet', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        fin.getWallet.mockResolvedValue({ data: { data: { available_balance: 25000 } } });
        fin.getTransactions.mockResolvedValue({ data: { data: [] } });
        fin.getExchangeRates.mockResolvedValue({ data: { data: [{ from_currency: 'EUR', to_currency: 'XAF', rate: 655 }] } });
        getInvoices.mockResolvedValue({ data: [] });
    });
    afterEach(() => vi.useRealTimers());

    it('affiche le solde disponible et les équivalents en devises', async () => {
        renderPage();

        expect(await screen.findByText(/25.000/)).toBeInTheDocument();
        expect(await screen.findByText(/Équivalent EUR/)).toBeInTheDocument();
    });

    it('refuse un montant inférieur au minimum sans appeler la passerelle', async () => {
        renderPage();
        await ouvrirRecharge();

        choisir('Carte', '50');
        fireEvent.click(screen.getByText(/continuer vers le paiement/i));

        expect(await screen.findByText(/montant minimum : 100/i)).toBeInTheDocument();
        expect(fin.rechargeWallet).not.toHaveBeenCalled();
    });

    it('exige un numéro de téléphone pour le Mobile Money', async () => {
        renderPage();
        await ouvrirRecharge();

        choisir('MTN MoMo', '5000');
        fireEvent.click(screen.getByText(/continuer vers le paiement/i));

        expect(await screen.findByText(/numéro de téléphone requis/i)).toBeInTheDocument();
        expect(fin.rechargeWallet).not.toHaveBeenCalled();
    });

    it("affiche l'erreur serveur lorsque l'initiation échoue", async () => {
        fin.rechargeWallet.mockRejectedValue({ response: { data: { message: 'Échec de l\'initiation du paiement' } } });
        renderPage();
        await ouvrirRecharge();

        choisir('Carte', '5000');
        fireEvent.click(screen.getByText(/continuer vers le paiement/i));

        expect(await screen.findByText(/échec de l'initiation/i)).toBeInTheDocument();
    });

    it('initie la recharge puis passe à la validation mobile', async () => {
        fin.rechargeWallet.mockResolvedValue({ data: { payment_id: 'p1' } });
        fin.getPayment.mockResolvedValue({ data: { data: { status: 'pending' } } });
        renderPage();
        await ouvrirRecharge();

        choisir('MTN MoMo', '5000', '+237600000000');
        fireEvent.click(screen.getByText(/continuer vers le paiement/i));

        expect(await screen.findByText(/validation mobile/i)).toBeInTheDocument();
        expect(fin.rechargeWallet).toHaveBeenCalledWith({ amount: 5000, method: 'momo', phone_number: '+237600000000' });
    });

    it("crédite l'écran de succès dès que le sondage observe le statut « settled »", async () => {
        fin.rechargeWallet.mockResolvedValue({ data: { payment_id: 'p1' } });
        fin.getPayment.mockResolvedValue({ data: { data: { status: 'settled' } } });
        vi.useFakeTimers({ shouldAdvanceTime: true });
        renderPage();
        await ouvrirRecharge();

        choisir('Carte', '5000');
        fireEvent.click(screen.getByText(/continuer vers le paiement/i));
        await screen.findByText(/paiement par carte/i);
        await act(async () => { await vi.advanceTimersByTimeAsync(3100); });

        expect(await screen.findByText(/paiement réussi/i)).toBeInTheDocument();
        expect(fin.getWallet.mock.calls.length).toBeGreaterThan(1);
    });

    it("revient à l'étape 1 avec un message lorsque la passerelle déclare l'échec", async () => {
        fin.rechargeWallet.mockResolvedValue({ data: { payment_id: 'p1' } });
        fin.getPayment.mockResolvedValue({ data: { data: { status: 'failed' } } });
        vi.useFakeTimers({ shouldAdvanceTime: true });
        renderPage();
        await ouvrirRecharge();

        choisir('Carte', '5000');
        fireEvent.click(screen.getByText(/continuer vers le paiement/i));
        await screen.findByText(/paiement par carte/i);
        await act(async () => { await vi.advanceTimersByTimeAsync(3100); });

        expect(await screen.findByText(/le paiement a échoué/i)).toBeInTheDocument();
    });

    it('abandonne le sondage après le délai maximal', async () => {
        fin.rechargeWallet.mockResolvedValue({ data: { payment_id: 'p1' } });
        fin.getPayment.mockResolvedValue({ data: { data: { status: 'pending' } } });
        vi.useFakeTimers({ shouldAdvanceTime: true });
        renderPage();
        await ouvrirRecharge();

        choisir('Carte', '5000');
        fireEvent.click(screen.getByText(/continuer vers le paiement/i));
        await screen.findByText(/paiement par carte/i);
        await act(async () => { await vi.advanceTimersByTimeAsync(96_000); });

        expect(await screen.findByText(/délai dépassé/i)).toBeInTheDocument();
    });

    it('la simulation de confirmation (DEV) relaie le refus du serveur', async () => {
        fin.rechargeWallet.mockResolvedValue({ data: { payment_id: 'p1' } });
        fin.getPayment.mockResolvedValue({ data: { data: { status: 'pending' } } });
        fin.confirmPayment.mockRejectedValue({ response: { data: { message: 'Paiement non encore confirmé par la passerelle.' } } });
        renderPage();
        await ouvrirRecharge();

        choisir('Carte', '5000');
        fireEvent.click(screen.getByText(/continuer vers le paiement/i));
        fireEvent.click(await screen.findByText(/simuler la confirmation/i));

        await waitFor(() => expect(fin.confirmPayment).toHaveBeenCalledWith('p1'));
    });
});
