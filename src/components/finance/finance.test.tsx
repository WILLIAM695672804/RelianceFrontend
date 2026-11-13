import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fin = vi.hoisted(() => ({ getWallets: vi.fn(), convertCurrency: vi.fn(), getDiagnostic: vi.fn(), setDiagnostic: vi.fn(), payDiagnostic: vi.fn() }));
vi.mock('../../services/financeService', () => ({ financeService: fin }));

import CurrencyWallets from './CurrencyWallets';
import DiagnosticFee from './DiagnosticFee';

const plain = (s: string | null) => (s ?? '').replace(/[  ]/g, ' ');
const wrap = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);
const wallets = [
    { currency: 'EUR', balance: 10, available_balance: 10 }, { currency: 'USD', balance: 0, available_balance: 0 },
    { currency: 'XAF', balance: 50000, available_balance: 42000 },
];

describe('CurrencyWallets', () => {
    beforeEach(() => { vi.clearAllMocks(); fin.getWallets.mockResolvedValue({ data: { data: wallets } }); });

    it('affiche le solde disponible de chaque devise', async () => {
        wrap(<CurrencyWallets />);

        await waitFor(() => expect(plain(screen.getByTestId('wallet-XAF').textContent)).toContain('42 000'));
        expect(screen.getByTestId('wallet-EUR')).toHaveTextContent('10,00');
        expect(screen.getByTestId('wallet-USD')).toBeInTheDocument();
    });

    it('survit à un échec de chargement', async () => {
        fin.getWallets.mockRejectedValue(new Error('500'));
        wrap(<CurrencyWallets />);

        expect(await screen.findByText('Mes devises')).toBeInTheDocument();
    });

    it('refuse un montant nul ou deux devises identiques sans appeler le serveur', async () => {
        wrap(<CurrencyWallets />);
        await screen.findByText('Mes devises');

        fireEvent.click(screen.getByRole('button', { name: 'Convertir' }));
        expect(await screen.findByText('Saisissez un montant positif.')).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText('Montant à convertir'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Devise cible'), { target: { value: 'XAF' } });
        fireEvent.click(screen.getByRole('button', { name: 'Convertir' }));
        expect(await screen.findByText('Choisissez deux devises différentes.')).toBeInTheDocument();
        expect(fin.convertCurrency).not.toHaveBeenCalled();
    });

    it('convertit, confirme le résultat, vide le champ et recharge les soldes', async () => {
        fin.convertCurrency.mockResolvedValue({ data: { data: { debited: 65500, credited: 100, from: 'XAF', to: 'EUR' } } });
        wrap(<CurrencyWallets />);
        await screen.findByText('Mes devises');

        fireEvent.change(screen.getByPlaceholderText('Montant à convertir'), { target: { value: '65500' } });
        fireEvent.click(screen.getByRole('button', { name: 'Convertir' }));

        await waitFor(() => expect(fin.convertCurrency).toHaveBeenCalledWith({ amount: 65500, from_currency: 'XAF', to_currency: 'EUR' }));
        expect(await screen.findByRole('status')).toHaveTextContent(/converti en/);
        expect(screen.getByPlaceholderText('Montant à convertir')).toHaveValue(null);
        expect(fin.getWallets.mock.calls.length).toBeGreaterThan(1);
    });

    it("relaie le refus serveur et propose l'activation de la 2FA si elle est exigée", async () => {
        fin.convertCurrency.mockRejectedValue({ response: { status: 403, data: { message: 'Activez la double authentification (2FA).', requires_2fa_setup: true } } });
        wrap(<CurrencyWallets />);
        await screen.findByText('Mes devises');

        fireEvent.change(screen.getByPlaceholderText('Montant à convertir'), { target: { value: '10' } });
        fireEvent.click(screen.getByRole('button', { name: 'Convertir' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Activez la double authentification (2FA).');
        expect(screen.getByRole('link', { name: /activer la double authentification/i })).toHaveAttribute('href', '/espace-client/profil');
    });

    it('relaie un solde insuffisant (422)', async () => {
        fin.convertCurrency.mockRejectedValue({ response: { status: 422, data: { message: 'Solde insuffisant : XAF' } } });
        wrap(<CurrencyWallets />);
        await screen.findByText('Mes devises');

        fireEvent.change(screen.getByPlaceholderText('Montant à convertir'), { target: { value: '999999' } });
        fireEvent.click(screen.getByRole('button', { name: 'Convertir' }));

        expect(await screen.findByText('Solde insuffisant : XAF')).toBeInTheDocument();
    });
});

describe('DiagnosticFee', () => {
    const diag = (over = {}) => ({ id: 'd1', amount: 5000, platform_fee: 500, net_to_technician: 4500, paid: false, ...over });
    beforeEach(() => { vi.clearAllMocks(); fin.getDiagnostic.mockResolvedValue({ data: { data: null } }); });

    it("n'affiche rien au client tant que le technicien n'a pas fixé de frais", async () => {
        const { container } = wrap(<DiagnosticFee requestId="r1" role="client" />);

        await waitFor(() => expect(fin.getDiagnostic).toHaveBeenCalledWith('r1'));
        expect(container).toBeEmptyDOMElement();
    });

    it('le technicien fixe les frais (minimum 100 XAF) puis voit leur net', async () => {
        fin.setDiagnostic.mockResolvedValue({});
        wrap(<DiagnosticFee requestId="r1" role="technicien" />);
        const champ = await screen.findByPlaceholderText('Montant (XAF)');

        fireEvent.change(champ, { target: { value: '50' } });
        fireEvent.submit(champ.closest('form')!);
        expect(await screen.findByText('Montant minimum : 100 XAF.')).toBeInTheDocument();
        expect(fin.setDiagnostic).not.toHaveBeenCalled();

        fin.getDiagnostic.mockResolvedValue({ data: { data: diag() } });
        fireEvent.change(champ, { target: { value: '5000' } });
        fireEvent.submit(champ.closest('form')!);

        await waitFor(() => expect(fin.setDiagnostic).toHaveBeenCalledWith('r1', 5000));
        expect(await screen.findByText(/net après commission/i)).toBeInTheDocument();
        expect(screen.getByText('En attente de règlement par le client.')).toBeInTheDocument();
    });

    it('le client voit le montant et la commission, et règle les frais', async () => {
        fin.getDiagnostic.mockResolvedValueOnce({ data: { data: diag() } }).mockResolvedValue({ data: { data: diag({ paid: true }) } });
        fin.payDiagnostic.mockResolvedValue({});
        wrap(<DiagnosticFee requestId="r1" role="client" />);

        expect(await screen.findByText(/dont commission de la plateforme/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Payer les frais' }));

        await waitFor(() => expect(fin.payDiagnostic).toHaveBeenCalledWith('d1'));
        expect(await screen.findByRole('status')).toHaveTextContent('Réglés');
        expect(screen.queryByRole('button', { name: 'Payer les frais' })).not.toBeInTheDocument();
    });

    it('propose de recharger le portefeuille sur un solde insuffisant (402)', async () => {
        fin.getDiagnostic.mockResolvedValue({ data: { data: diag() } });
        fin.payDiagnostic.mockRejectedValue({ response: { status: 402, data: { message: 'Solde insuffisant : rechargez votre portefeuille.' } } });
        wrap(<DiagnosticFee requestId="r1" role="client" />);

        fireEvent.click(await screen.findByRole('button', { name: 'Payer les frais' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Solde insuffisant');
        expect(screen.getByRole('link', { name: /recharger mon portefeuille/i })).toHaveAttribute('href', '/espace-client/wallet');
    });

    it("propose d'activer la 2FA lorsqu'elle est exigée", async () => {
        fin.getDiagnostic.mockResolvedValue({ data: { data: diag() } });
        fin.payDiagnostic.mockRejectedValue({ response: { status: 403, data: { message: 'Activez la 2FA', requires_2fa_setup: true } } });
        wrap(<DiagnosticFee requestId="r1" role="client" />);

        fireEvent.click(await screen.findByRole('button', { name: 'Payer les frais' }));

        expect(await screen.findByRole('link', { name: /activer la double authentification/i })).toBeInTheDocument();
    });

    it('relaie le refus lorsque le technicien non mandaté tente de fixer les frais', async () => {
        fin.setDiagnostic.mockRejectedValue({ response: { status: 403, data: { message: 'Seul le technicien mandaté peut fixer les frais de diagnostic.' } } });
        wrap(<DiagnosticFee requestId="r1" role="technicien" />);
        const champ = await screen.findByPlaceholderText('Montant (XAF)');

        fireEvent.change(champ, { target: { value: '5000' } });
        fireEvent.submit(champ.closest('form')!);

        expect(await screen.findByText(/technicien mandaté/i)).toBeInTheDocument();
    });
});
