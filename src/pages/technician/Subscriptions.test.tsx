import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const fin = vi.hoisted(() => ({ getPlans: vi.fn(), getMySubscription: vi.fn(), subscribe: vi.fn(), cancelSubscription: vi.fn() }));
vi.mock('../../services/financeService', () => ({ financeService: fin }));

import Subscriptions from './Subscriptions';

const plan = { id: 'p1', name: 'Pro', slug: 'pro', description: 'Référencement', price_monthly: 5000, price_yearly: 50000, currency: 'XAF', features: ['Visibilité'], active: true };
const abonnement = { id: 's1', plan_name: 'pro', status: 'active', start_date: '2026-11-01', end_date: '2026-12-01', is_active: true };

describe('Subscriptions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        fin.getPlans.mockResolvedValue({ data: { data: [plan] } });
        fin.getMySubscription.mockResolvedValue({ data: { data: null } });
    });

    it('liste les plans et bascule le tarif mensuel/annuel', async () => {
        render(<Subscriptions />);

        expect(await screen.findByText('Pro')).toBeInTheDocument();
        expect(screen.getByText(/\/mois/)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/^Annuel/));
        expect(screen.getByText(/\/an/)).toBeInTheDocument();
    });

    it('souscrit avec le cycle de facturation choisi puis recharge les données', async () => {
        fin.subscribe.mockResolvedValue({});
        render(<Subscriptions />);

        fireEvent.click(await screen.findByText(/^Annuel/));
        fireEvent.click(screen.getByRole('button', { name: 'Souscrire' }));

        await waitFor(() => expect(fin.subscribe).toHaveBeenCalledWith('p1', 'yearly'));
        await waitFor(() => expect(fin.getPlans).toHaveBeenCalledTimes(2));
    });

    it('relaie le message « solde insuffisant » du serveur (402)', async () => {
        fin.subscribe.mockRejectedValue({ response: { status: 402, data: { message: 'Solde insuffisant : rechargez votre portefeuille.' } } });
        render(<Subscriptions />);

        fireEvent.click(await screen.findByRole('button', { name: 'Souscrire' }));

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Solde insuffisant : rechargez votre portefeuille.'));
    });

    it("désactive le plan courant et affiche l'abonnement actif", async () => {
        fin.getMySubscription.mockResolvedValue({ data: { data: abonnement } });
        render(<Subscriptions />);

        expect(await screen.findByText(/abonnement actif/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Plan actuel' })).toBeDisabled();
    });

    it("annule l'abonnement après confirmation", async () => {
        fin.getMySubscription.mockResolvedValue({ data: { data: abonnement } });
        fin.cancelSubscription.mockResolvedValue({ data: { message: 'Abonnement annulé' } });
        render(<Subscriptions />);

        fireEvent.click(await screen.findByRole('button', { name: 'Annuler' }));

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Abonnement annulé'));
    });

    it("n'annule pas si l'utilisateur refuse la confirmation", async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false);
        fin.getMySubscription.mockResolvedValue({ data: { data: abonnement } });
        render(<Subscriptions />);

        fireEvent.click(await screen.findByRole('button', { name: 'Annuler' }));

        expect(fin.cancelSubscription).not.toHaveBeenCalled();
    });

    it('survit à un échec de chargement', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        fin.getPlans.mockRejectedValue(new Error('500'));
        render(<Subscriptions />);

        expect(await screen.findByText('Abonnements')).toBeInTheDocument();
    });
});
