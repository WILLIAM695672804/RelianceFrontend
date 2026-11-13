import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fin = vi.hoisted(() => ({ getWallet: vi.fn(), getTransactions: vi.fn(), withdraw: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../components/finance/CurrencyWallets', () => ({ default: () => null }));
vi.mock('../../services/financeService', () => ({ financeService: fin }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import Wallet from './Wallet';

const plain = (s: string | null) => (s ?? '').replace(/[  ]/g, ' ');
const renderPage = () =>
    render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
            <MemoryRouter><Wallet /></MemoryRouter>
        </QueryClientProvider>,
    );
const maintenant = new Date().toISOString();
const tx = (over = {}) => ({ id: 't1', amount: 12000, type: 'credit', created_at: maintenant, meta: { source: 'invoice_paid' }, ...over });

const ouvrir = async () => {
    renderPage();
    fireEvent.click(await screen.findByText('Withdraw'));
};
const montant = () => screen.getByPlaceholderText('0.00');
const confirmer = () => screen.getByText('Confirm Withdrawal').closest('button')!;

describe('Wallet technicien', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        fin.getWallet.mockResolvedValue({ data: { data: { balance: 50000, available_balance: 42000, held_amount: 8000 } } });
        fin.getTransactions.mockResolvedValue({ data: { data: [] } });
    });

    // ── Solde et transactions ──────────────────────────────

    it('distingue solde disponible, solde total et fonds réservés', async () => {
        renderPage();

        await waitFor(() => expect(plain(document.querySelector('.tech-balance-total')!.textContent)).toContain('42 000'));
        expect(screen.getByText(/50.000 XAF/)).toBeInTheDocument();
        expect(screen.getByText(/8.000 XAF/)).toBeInTheDocument();
    });

    it('affiche un état vide sans transaction', async () => {
        renderPage();
        expect(await screen.findByText('Aucune transaction')).toBeInTheDocument();
    });

    it("propose de réessayer quand les transactions ne se chargent pas", async () => {
        fin.getTransactions.mockRejectedValueOnce(new Error('500')).mockResolvedValue({ data: { data: [tx()] } });
        renderPage();

        fireEvent.click(await screen.findByRole('button', { name: 'Réessayer' }));

        expect(await screen.findByText('invoice paid')).toBeInTheDocument();
    });

    it('distingue crédits et débits et totalise les crédits du mois courant', async () => {
        fin.getTransactions.mockResolvedValue({ data: { data: [tx(), tx({ id: 't2', amount: -3000, meta: { source: 'withdrawal_approved' } })] } });
        renderPage();

        expect(await screen.findByText('withdrawal approved')).toBeInTheDocument();
        expect(screen.getByText(/- 3.000 XAF/)).toBeInTheDocument();
        expect(plain(document.querySelector('.tech-chart-badge')!.textContent)).toContain('12 000');
        expect(screen.getByText("Voir tout l'historique")).toBeInTheDocument();
    });

    it("mène à l'historique complet", async () => {
        renderPage();

        fireEvent.click(await screen.findByText('Statement'));

        expect(navigate).toHaveBeenCalledWith('/technicien/wallet/historique');
    });

    // ── Retrait ────────────────────────────────────────────

    it('propose des montants rapides calculés sur le solde disponible', async () => {
        await ouvrir();

        fireEvent.click(screen.getByText('25%'));
        expect(montant()).toHaveValue(10500);
        fireEvent.click(screen.getByText('100%'));
        expect(montant()).toHaveValue(42000);
    });

    it('refuse un montant inférieur à 500 FCFA', async () => {
        await ouvrir();

        fireEvent.change(montant(), { target: { value: '200' } });
        fireEvent.click(screen.getByText('Bank Transfer'));
        fireEvent.click(confirmer());

        expect(await screen.findByText('Montant minimum : 500 FCFA')).toBeInTheDocument();
        expect(fin.withdraw).not.toHaveBeenCalled();
    });

    it("exige un moyen de paiement puis un numéro pour le Mobile Money", async () => {
        await ouvrir();
        fireEvent.change(montant(), { target: { value: '5000' } });
        expect(confirmer()).toBeDisabled(); // sans méthode, le bouton reste inactif

        fireEvent.click(screen.getByText('MTN Mobile Money'));
        fireEvent.click(confirmer());

        expect(await screen.findByText(/numéro de téléphone requis/i)).toBeInTheDocument();
        expect(fin.withdraw).not.toHaveBeenCalled();
    });

    it('envoie la demande Mobile Money avec le numéro puis affiche le succès', async () => {
        fin.withdraw.mockResolvedValue({});
        await ouvrir();

        fireEvent.change(montant(), { target: { value: '5000' } });
        fireEvent.click(screen.getByText('Orange Money'));
        fireEvent.change(screen.getByPlaceholderText(/\+237/), { target: { value: '+237699000000' } });
        fireEvent.click(confirmer());

        await waitFor(() => expect(fin.withdraw).toHaveBeenCalledWith({ amount: 5000, method: 'om', phone_number: '+237699000000' }));
        expect(await screen.findByText('Fermer')).toBeInTheDocument();
        await waitFor(() => expect(fin.getWallet.mock.calls.length).toBeGreaterThan(1)); // cache invalidé
    });

    it("envoie un virement sans numéro de téléphone", async () => {
        fin.withdraw.mockResolvedValue({});
        await ouvrir();

        fireEvent.change(montant(), { target: { value: '10000' } });
        fireEvent.click(screen.getByText('Bank Transfer'));
        fireEvent.click(confirmer());

        await waitFor(() => expect(fin.withdraw).toHaveBeenCalledWith({ amount: 10000, method: 'bank_transfer', phone_number: undefined }));
    });

    it('relaie le refus serveur (solde insuffisant) sans afficher le succès', async () => {
        fin.withdraw.mockRejectedValue({ response: { data: { message: 'Solde insuffisant' } } });
        await ouvrir();

        fireEvent.change(montant(), { target: { value: '90000' } });
        fireEvent.click(screen.getByText('Bank Transfer'));
        fireEvent.click(confirmer());

        expect(await screen.findByText('Solde insuffisant')).toBeInTheDocument();
        expect(screen.queryByText('Fermer')).not.toBeInTheDocument();
    });

    it('réinitialise le formulaire à la fermeture', async () => {
        await ouvrir();
        fireEvent.change(montant(), { target: { value: '5000' } });

        fireEvent.click(document.querySelector('.tech-withdraw-backdrop')!);

        expect(montant()).toHaveValue(null);
        expect(document.querySelector('.tech-withdraw-sheet')).not.toHaveClass('open');
    });
});
