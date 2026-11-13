import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const svc = vi.hoisted(() => ({ getStats: vi.fn(), getRevenue: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/adminService', () => ({ default: svc }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import AdminDashboard from './AdminDashboard';

const stats = (over = {}) => ({
    total_users: 120, total_clients: 80, total_technicians: 30, total_agencies: 10, pending_technicians: 4, pending_kyc: 7,
    active_users: 110, inactive_users: 10, new_users_this_month: 12, total_requests: 55, pending_requests: 6,
    recent_users: [{ id: 'u1', name: 'Alice Client', email: 'alice@test.local', role: 'client', is_active: true, created_at: '2026-11-01T00:00:00Z' }],
    ...over,
});

describe('AdminDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        svc.getStats.mockResolvedValue(stats());
        svc.getRevenue.mockResolvedValue({ data: { total: 6500, by_source: [{ source: 'job_commission', total: 1500 }, { source: 'subscription', total: 5000 }] } });
    });

    it('affiche les indicateurs clés', async () => {
        render(<AdminDashboard />);

        expect(await screen.findByText('+12 ce mois')).toBeInTheDocument();
        const valeurs = Array.from(document.querySelectorAll('.adm-kpi-value')).map((e) => e.textContent);
        expect(valeurs).toEqual(expect.arrayContaining(['120', '80', '30', '10', '110', '55', '6']));
    });

    it("signale les files de travail : techniciens à approuver et documents KYC", async () => {
        render(<AdminDashboard />);

        await screen.findByText('Techniciens en attente');
        const compteurs = Array.from(document.querySelectorAll('.adm-action-count')).map((e) => e.textContent);
        expect(compteurs).toEqual(expect.arrayContaining(['4', '7', '120']));
    });

    it('mène aux écrans de gestion depuis les cartes d’action et les utilisateurs récents', async () => {
        render(<AdminDashboard />);

        fireEvent.click(await screen.findByText('Techniciens en attente'));
        fireEvent.click(screen.getByText('Documents KYC'));
        fireEvent.click(screen.getByText('Alice Client'));

        expect(navigate).toHaveBeenCalledWith('/admin/technicians');
        expect(navigate).toHaveBeenCalledWith('/admin/kyc');
        expect(navigate).toHaveBeenCalledWith('/admin/users');
    });

    it('distingue un utilisateur actif d’un inactif', async () => {
        svc.getStats.mockResolvedValue(stats({ recent_users: [{ id: 'u2', name: 'Bob', email: 'b@t.l', role: 'technicien', is_active: false, created_at: '2026-11-02T00:00:00Z' }] }));
        render(<AdminDashboard />);

        await screen.findByText('Bob');
        expect(document.querySelector('tbody .adm-badge')).toHaveTextContent('Inactif');
    });

    it("affiche l'indicateur de chargement tant que les statistiques manquent (et en cas d'échec)", async () => {
        svc.getStats.mockRejectedValue(new Error('500'));
        render(<AdminDashboard />);

        await waitFor(() => expect(svc.getStats).toHaveBeenCalled());
        expect(document.querySelector('.adm-spinner')).not.toBeNull();
    });

    it("affiche les revenus de la plateforme par source, et reste utilisable sans eux", async () => {
        render(<AdminDashboard />);

        expect(await screen.findByText('Revenus de la plateforme')).toBeInTheDocument();
        expect(screen.getByText(/job commission : 1.500 · subscription : 5.000/)).toBeInTheDocument();
    });

    it("n'affiche pas la carte de revenus si le serveur la refuse", async () => {
        svc.getRevenue.mockRejectedValue(new Error('500'));
        render(<AdminDashboard />);

        await screen.findByText('Techniciens en attente');
        expect(screen.queryByText('Revenus de la plateforme')).not.toBeInTheDocument();
    });
});
