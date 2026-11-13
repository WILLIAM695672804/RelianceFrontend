import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const svc = vi.hoisted(() => ({ getFees: vi.fn(), createFee: vi.fn(), toggleFee: vi.fn() }));
vi.mock('../../services/adminService', () => ({ default: svc }));

import AdminFees from './AdminFees';

const frais = (over = {}) => ({ id: 'f1', name: 'Commission', fee_type: 'percentage', value: 0.1, applies_to: 'job', active: true, ...over });
const ouvrir = async () => { render(<AdminFees />); fireEvent.click(await screen.findByText('+ Ajouter un frais')); await screen.findByText('Nouveau frais'); };

describe('AdminFees', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        svc.getFees.mockResolvedValue({ data: [frais(), frais({ id: 'f2', name: 'Forfait', fee_type: 'fixed', value: 500, active: false })] });
    });

    it("affiche un pourcentage (fraction × 100) et un montant fixe, avec leur état", async () => {
        render(<AdminFees />);

        expect(await screen.findByText('10.0%')).toBeInTheDocument();
        expect(screen.getByText('500 XAF')).toBeInTheDocument();
        const badges = Array.from(document.querySelectorAll('.status-badge')).map((b) => b.textContent);
        expect(badges).toEqual(['Actif', 'Inactif']);
    });

    it("tolère une réponse sans enveloppe et un échec de chargement", async () => {
        svc.getFees.mockResolvedValue([frais()]);
        const { unmount } = render(<AdminFees />);
        expect(await screen.findByText('Commission')).toBeInTheDocument();
        unmount();

        svc.getFees.mockRejectedValue(new Error('500'));
        render(<AdminFees />);
        expect(await screen.findByText('Frais & Commissions')).toBeInTheDocument();
    });

    it("convertit un pourcentage saisi en % en fraction avant l'envoi (10 → 0,10)", async () => {
        svc.createFee.mockResolvedValue({});
        await ouvrir();

        fireEvent.change(screen.getByPlaceholderText('Nom du frais'), { target: { value: 'Commission' } });
        fireEvent.change(screen.getByPlaceholderText('Valeur (%)'), { target: { value: '10' } });
        fireEvent.submit(document.querySelector('form')!);

        await waitFor(() => expect(svc.createFee).toHaveBeenCalledWith({ name: 'Commission', fee_type: 'percentage', value: 0.1, applies_to: 'job' }));
        await waitFor(() => expect(screen.queryByText('Nouveau frais')).not.toBeInTheDocument());
        expect(svc.getFees.mock.calls.length).toBeGreaterThan(1);
    });

    it("envoie un montant fixe tel quel, avec le libellé XAF", async () => {
        svc.createFee.mockResolvedValue({});
        await ouvrir();

        fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'fixed' } });
        fireEvent.change(screen.getByPlaceholderText('Nom du frais'), { target: { value: 'Forfait' } });
        fireEvent.change(screen.getByPlaceholderText('Valeur (XAF)'), { target: { value: '500' } });
        fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'withdrawal' } });
        fireEvent.submit(document.querySelector('form')!);

        await waitFor(() => expect(svc.createFee).toHaveBeenCalledWith({ name: 'Forfait', fee_type: 'fixed', value: 500, applies_to: 'withdrawal' }));
    });

    it("plafonne la saisie d'un pourcentage à 100 dans le formulaire", async () => {
        await ouvrir();

        expect(screen.getByPlaceholderText('Valeur (%)')).toHaveAttribute('max', '100');
    });

    it("relaie le refus du serveur sans fermer la fenêtre", async () => {
        svc.createFee.mockRejectedValue({ response: { data: { message: 'Valeur invalide' } } });
        await ouvrir();

        fireEvent.change(screen.getByPlaceholderText('Nom du frais'), { target: { value: 'X' } });
        fireEvent.change(screen.getByPlaceholderText('Valeur (%)'), { target: { value: '5' } });
        fireEvent.submit(document.querySelector('form')!);

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Valeur invalide'));
        expect(screen.getByText('Nouveau frais')).toBeInTheDocument();
    });

    it("active ou désactive un frais puis recharge", async () => {
        svc.toggleFee.mockResolvedValue({});
        render(<AdminFees />);

        fireEvent.click(await screen.findByText('Désactiver'));

        await waitFor(() => expect(svc.toggleFee).toHaveBeenCalledWith('f1'));
        await waitFor(() => expect(svc.getFees.mock.calls.length).toBeGreaterThan(1));
    });

    it("alerte si la bascule échoue et annule la création depuis la fenêtre", async () => {
        svc.toggleFee.mockRejectedValue({ response: { data: { message: 'Introuvable' } } });
        render(<AdminFees />);
        fireEvent.click(await screen.findByText('Activer'));
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Introuvable'));

        fireEvent.click(screen.getByText('+ Ajouter un frais'));
        fireEvent.click(await screen.findByText('Annuler'));
        expect(screen.queryByText('Nouveau frais')).not.toBeInTheDocument();
    });
});
