import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const svc = vi.hoisted(() => ({ getPendingTechnicians: vi.fn(), approveTechnician: vi.fn(), rejectTechnician: vi.fn() }));
vi.mock('../../services/adminService', () => ({ default: svc }));

import AdminTechnicians from './AdminTechnicians';

const tech = (over = {}) => ({
    id: 't1', name: 'Paul Technicien', email: 'paul@test.local', phone: '+237600000000', created_at: '2026-11-01T00:00:00Z',
    kyc_documents: [{ status: 'pending' }, { status: 'approved' }], ...over,
});
const page = (data: unknown[], extra = {}) => ({ data, last_page: 1, total: data.length, ...extra });

describe('AdminTechnicians', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        svc.getPendingTechnicians.mockResolvedValue(page([tech()]));
    });

    it("liste les techniciens en attente avec leur total", async () => {
        render(<AdminTechnicians />);

        expect(await screen.findByText('Paul Technicien')).toBeInTheDocument();
        expect(screen.getByText(/en attente d'approbation \(1\)/i)).toBeInTheDocument();
        expect(svc.getPendingTechnicians).toHaveBeenCalledWith(1);
    });

    it('affiche un état vide', async () => {
        svc.getPendingTechnicians.mockResolvedValue(page([]));
        render(<AdminTechnicians />);

        expect(await screen.findByText(/aucun technicien en attente/i)).toBeInTheDocument();
    });

    it('survit à une erreur de chargement', async () => {
        svc.getPendingTechnicians.mockRejectedValue(new Error('500'));
        render(<AdminTechnicians />);

        expect(await screen.findByText(/en attente d'approbation/i)).toBeInTheDocument();
    });

    it('approuve puis recharge la file', async () => {
        svc.approveTechnician.mockResolvedValue({});
        render(<AdminTechnicians />);
        svc.getPendingTechnicians.mockResolvedValue(page([]));

        fireEvent.click(await screen.findByText(/approuver/i));

        await waitFor(() => expect(svc.approveTechnician).toHaveBeenCalledWith('t1'));
        expect(await screen.findByText(/aucun technicien en attente/i)).toBeInTheDocument();
    });

    it('tolère un échec d’approbation', async () => {
        svc.approveTechnician.mockRejectedValue(new Error('404'));
        render(<AdminTechnicians />);

        fireEvent.click(await screen.findByText(/approuver/i));

        await waitFor(() => expect(svc.approveTechnician).toHaveBeenCalled());
        expect(screen.getByText('Paul Technicien')).toBeInTheDocument();
    });

    it('exige un motif avant de rejeter, puis le transmet et recharge la file', async () => {
        svc.rejectTechnician.mockResolvedValue({});
        render(<AdminTechnicians />);

        fireEvent.click(await screen.findByText(/rejeter/i));
        const modale = within(document.querySelector('.adm-modal') as HTMLElement);
        expect(modale.getByText('Rejeter Paul Technicien')).toBeInTheDocument();
        const confirmer = modale.getAllByRole('button').find((b) => /rejeter/i.test(b.textContent ?? '') && b.classList.contains('adm-btn-danger'))
            ?? modale.getAllByRole('button').at(-1)!;
        expect(confirmer).toBeDisabled();

        fireEvent.change(modale.getByPlaceholderText(/raison du rejet/i), { target: { value: 'Pièces non conformes' } });
        fireEvent.click(confirmer);

        await waitFor(() => expect(svc.rejectTechnician).toHaveBeenCalledWith('t1', 'Pièces non conformes'));
        await waitFor(() => expect(document.querySelector('.adm-modal')).toBeNull());
        expect(svc.getPendingTechnicians.mock.calls.length).toBeGreaterThan(1);
    });

    it('annule le rejet sans appel serveur', async () => {
        render(<AdminTechnicians />);

        fireEvent.click(await screen.findByText(/rejeter/i));
        fireEvent.click(within(document.querySelector('.adm-modal') as HTMLElement).getByText('Annuler'));

        expect(document.querySelector('.adm-modal')).toBeNull();
        expect(svc.rejectTechnician).not.toHaveBeenCalled();
    });

    it('pagine', async () => {
        svc.getPendingTechnicians.mockResolvedValue(page([tech()], { last_page: 2, total: 25 }));
        render(<AdminTechnicians />);
        await screen.findByText('Paul Technicien');

        expect(screen.getByText('Precedent')).toBeDisabled();
        fireEvent.click(screen.getByText('Suivant'));

        await waitFor(() => expect(svc.getPendingTechnicians).toHaveBeenLastCalledWith(2));
    });
});
