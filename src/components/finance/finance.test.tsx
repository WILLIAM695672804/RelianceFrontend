import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fin = vi.hoisted(() => ({ getDiagnostic: vi.fn(), setDiagnostic: vi.fn(), payDiagnostic: vi.fn() }));
vi.mock('../../services/financeService', () => ({ financeService: fin }));

import DiagnosticFee from './DiagnosticFee';

const wrap = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

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
