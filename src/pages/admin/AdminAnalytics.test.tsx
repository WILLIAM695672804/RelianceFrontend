import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const svc = vi.hoisted(() => ({ getStats: vi.fn(), getAnalyticsSummary: vi.fn(), getMlModels: vi.fn(), trainMlModel: vi.fn() }));
vi.mock('../../services/adminService', () => ({ default: svc }));

import AdminAnalytics from './AdminAnalytics';

const modele = (over = {}) => ({ id: 'm1', version: '20261113030000', deployed: true, metrics: { samples: 12, mae_model: 1800, mae_default: 5200 }, ...over });

describe('AdminAnalytics', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        svc.getStats.mockResolvedValue({ total_users: 120, total_requests: 55, pending_requests: 6, new_users_this_month: 12, total_clients: 80, total_technicians: 30, total_agencies: 10, active_users: 110 });
        svc.getAnalyticsSummary.mockResolvedValue({ page_view: 340, login: 25 });
        svc.getMlModels.mockResolvedValue({ data: [] });
    });

    it("affiche les indicateurs et les événements d'usage agrégés", async () => {
        render(<AdminAnalytics />);

        expect(await screen.findByText('Utilisateurs totaux')).toBeInTheDocument();
        expect(screen.getByText('120')).toBeInTheDocument();
        expect(screen.getByText('page_view')).toBeInTheDocument();
        expect(screen.getByText('340')).toBeInTheDocument();
    });

    it("tolère l'absence de synthèse d'usage", async () => {
        svc.getAnalyticsSummary.mockRejectedValue(new Error('500'));
        render(<AdminAnalytics />);

        expect(await screen.findByText('Analytics & KPIs')).toBeInTheDocument();
        expect(screen.queryByText('Événements récents')).not.toBeInTheDocument();
    });

    it("indique qu'aucun modèle de prix n'a encore été entraîné", async () => {
        render(<AdminAnalytics />);

        expect(await screen.findByText(/aucun modèle entraîné/i)).toBeInTheDocument();
    });

    it("liste les versions du modèle avec leurs erreurs moyennes (modèle vs défaut)", async () => {
        svc.getMlModels.mockResolvedValue({ data: [modele(), modele({ id: 'm0', version: '20261112030000', deployed: false, metrics: null })] });
        render(<AdminAnalytics />);

        expect(await screen.findByText('20261113030000')).toBeInTheDocument();
        expect(screen.getByText('Déployé')).toBeInTheDocument();
        expect(screen.getByText('Archivé')).toBeInTheDocument();
        expect(screen.getByText('1800')).toBeInTheDocument();
        expect(screen.getByText('5200')).toBeInTheDocument();
    });

    it("recalibre à la demande puis recharge les versions", async () => {
        svc.trainMlModel.mockResolvedValue({ message: 'Modèle déployé', version: 'v2' });
        render(<AdminAnalytics />);
        await screen.findByText(/aucun modèle entraîné/i);
        svc.getMlModels.mockResolvedValue({ data: [modele()] });

        fireEvent.click(screen.getByRole('button', { name: 'Recalibrer maintenant' }));

        expect(await screen.findByText('Modèle déployé')).toBeInTheDocument();
        await waitFor(() => expect(screen.getByText('20261113030000')).toBeInTheDocument());
    });

    it("affiche le message serveur si le calibrage échoue", async () => {
        svc.trainMlModel.mockRejectedValue({ response: { data: { message: 'Accès refusé' } } });
        render(<AdminAnalytics />);

        fireEvent.click(await screen.findByRole('button', { name: 'Recalibrer maintenant' }));

        expect(await screen.findByText('Accès refusé')).toBeInTheDocument();
    });
});
