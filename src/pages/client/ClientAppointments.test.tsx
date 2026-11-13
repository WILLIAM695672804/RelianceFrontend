import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ops = vi.hoisted(() => ({ getAppointments: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/operationsService', () => ops);
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import ClientAppointments from './ClientAppointments';

const rdv = (over = {}) => ({
    id: 'a1', status: 'scheduled', scheduled_start: '2026-11-16T09:00:00Z', request: { title: 'Fuite évier' },
    technician: { name: 'Paul' }, notes: 'Sonner deux fois', ...over,
});

describe('ClientAppointments', () => {
    beforeEach(() => { vi.clearAllMocks(); ops.getAppointments.mockResolvedValue({ data: [rdv()] }); });

    it("affiche le chargement puis le rendez-vous avec technicien et notes", async () => {
        render(<ClientAppointments />);

        expect(screen.getByText('Chargement...')).toBeInTheDocument();
        expect(await screen.findByText('Fuite évier')).toBeInTheDocument();
        expect(screen.getByText('Paul')).toBeInTheDocument();
        expect(screen.getByText('Sonner deux fois')).toBeInTheDocument();
    });

    it.each([
        ['scheduled', 'En attente de confirmation'],
        ['confirmed', 'Confirmé'],
        ['in_progress', 'En cours'],
        ['completed', 'Terminé'],
        ['cancelled', 'Refusé / annulé'],
        ['no_show', 'Absence'],
        ['inconnu', 'En attente de confirmation'],
    ])("statut « %s » → %s", async (statut, libelle) => {
        ops.getAppointments.mockResolvedValue({ data: [rdv({ status: statut })] });
        render(<ClientAppointments />);

        expect(await screen.findByText(libelle)).toBeInTheDocument();
    });

    it("a des valeurs de repli sans demande, technicien ni notes", async () => {
        ops.getAppointments.mockResolvedValue({ data: [rdv({ request: null, technician: null, notes: null })] });
        render(<ClientAppointments />);

        expect(await screen.findByText('Intervention')).toBeInTheDocument();
        expect(document.querySelector('.ca-card-notes')).toBeNull();
    });

    it("affiche un état vide qui mène au rapprochement, y compris si le chargement échoue", async () => {
        ops.getAppointments.mockRejectedValue(new Error('500'));
        render(<ClientAppointments />);

        fireEvent.click(await screen.findByText('Trouver un technicien'));

        expect(screen.getByText(/aucun rendez-vous planifié/i)).toBeInTheDocument();
        expect(navigate).toHaveBeenCalledWith('/espace-client/matching');
    });

    it("ouvre une nouvelle demande", async () => {
        render(<ClientAppointments />);

        fireEvent.click(await screen.findByText('Nouvelle demande'));

        expect(navigate).toHaveBeenCalledWith('/espace-client/demande');
    });
});
