import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sched = vi.hoisted(() => ({ getTechCalendar: vi.fn(), removeScheduleException: vi.fn(), addScheduleException: vi.fn() }));
const ops = vi.hoisted(() => ({ getUpcomingAppointments: vi.fn(), getAppointments: vi.fn(), updateAppointmentStatus: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/scheduleService', () => sched);
vi.mock('../../services/operationsService', () => ops);
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import Planning from './Planning';

const rdv = (over = {}) => ({
    id: 'a1', request_id: 'r1', status: 'scheduled', scheduled_start: '2026-11-16T09:00:00Z',
    request: { title: 'Fuite évier' }, location: { address: 'Akwa', city: 'Douala' }, notes: 'Sonner deux fois', ...over,
});
const calendrier = (over = {}) => ({
    exceptions: [], recurring_slots: [], appointments: [], insights: { capacity_percent: 40, booked_hours: 18, total_hours: 45 }, ...over,
});
const renderPage = () => render(<MemoryRouter><Planning /></MemoryRouter>);

describe('Planning', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        sched.getTechCalendar.mockResolvedValue(calendrier());
        ops.getUpcomingAppointments.mockResolvedValue([]);
        ops.getAppointments.mockResolvedValue({ data: [] });
    });

    it("affiche le chargement puis la capacité réservée et les heures libres", async () => {
        renderPage();

        expect(screen.getByText(/chargement du calendrier/i)).toBeInTheDocument();
        expect(await screen.findByText('40% réservé')).toBeInTheDocument();
        expect(screen.getByText('18 / 45 h')).toBeInTheDocument();
        expect(screen.getByText(/il vous reste 27 heures libres/i)).toBeInTheDocument();
    });

    it('sort du chargement même si le calendrier est indisponible', async () => {
        sched.getTechCalendar.mockRejectedValue(new Error('500'));
        renderPage();

        expect(await screen.findByText('Absences')).toBeInTheDocument();
        expect(screen.getByText(/aucune absence à venir/i)).toBeInTheDocument();
    });

    it('bascule entre les vues semaine et mois', async () => {
        renderPage();
        await screen.findByText('Absences');

        fireEvent.click(screen.getByText('Mois'));
        expect(screen.getByText('Mois')).toHaveClass('tech-btn-active');
        fireEvent.click(screen.getByText('Semaine'));
        expect(screen.getByText('Semaine')).toHaveClass('tech-btn-active');
    });

    it("signale l'absence de créneau récurrent et renvoie vers la zone", async () => {
        renderPage();

        expect(await screen.findByText(/aucun créneau récurrent/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText('+ Ajouter un créneau'));
        expect(navigate).toHaveBeenCalledWith('/technicien/zone');
    });

    // ── Demandes de rendez-vous ────────────────────────────

    it("ne liste que les rendez-vous « scheduled » comme demandes en attente", async () => {
        ops.getAppointments.mockResolvedValue({ data: [rdv(), rdv({ id: 'a2', status: 'confirmed', request: { title: 'Panne' } })] });
        renderPage();

        expect(await screen.findByText('Demandes de rendez-vous (1)')).toBeInTheDocument();
        expect(screen.getByText('Fuite évier')).toBeInTheDocument();
        expect(screen.getByText('Akwa, Douala')).toBeInTheDocument();
        expect(screen.getByText('Sonner deux fois')).toBeInTheDocument();
        expect(screen.queryByText('Panne')).not.toBeInTheDocument();
    });

    it('accepte une demande : statut confirmé puis rechargement des trois sources', async () => {
        ops.getAppointments.mockResolvedValue({ data: [rdv()] });
        ops.updateAppointmentStatus.mockResolvedValue({});
        renderPage();

        fireEvent.click(await screen.findByText('Accepter'));

        await waitFor(() => expect(ops.updateAppointmentStatus).toHaveBeenCalledWith('a1', 'confirmed'));
        await waitFor(() => expect(sched.getTechCalendar.mock.calls.length).toBeGreaterThan(1));
        expect(ops.getUpcomingAppointments.mock.calls.length).toBeGreaterThan(1);
    });

    it("refuse une demande : statut annulé et liste d'attente rechargée", async () => {
        ops.getAppointments.mockResolvedValue({ data: [rdv()] });
        ops.updateAppointmentStatus.mockResolvedValue({});
        renderPage();

        fireEvent.click(await screen.findByText('Refuser'));

        await waitFor(() => expect(ops.updateAppointmentStatus).toHaveBeenCalledWith('a1', 'cancelled'));
        await waitFor(() => expect(ops.getAppointments).toHaveBeenCalledTimes(2));
    });

    it("tolère l'échec d'une mise à jour de rendez-vous", async () => {
        ops.getAppointments.mockResolvedValue({ data: [rdv()] });
        ops.updateAppointmentStatus.mockRejectedValue(new Error('403'));
        renderPage();

        fireEvent.click(await screen.findByText('Accepter'));

        await waitFor(() => expect(screen.getByText('Accepter')).toBeEnabled());
    });

    // ── Interventions à venir ──────────────────────────────

    it('liste les interventions à venir et ouvre la mission au clic', async () => {
        ops.getUpcomingAppointments.mockResolvedValue([rdv({ status: 'confirmed', location: null })]);
        renderPage();

        expect(await screen.findByText('Adresse a confirmer')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Fuite évier'));
        expect(navigate).toHaveBeenCalledWith('/technicien/mission/r1');
    });

    it("affiche un état vide sans intervention et mène au cockpit", async () => {
        renderPage();

        expect(await screen.findByText(/aucune intervention à venir/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText('Voir le cockpit'));
        expect(navigate).toHaveBeenCalledWith('/technicien/cockpit');
    });

    // ── Absences ───────────────────────────────────────────

    it('liste les absences avec leur motif, repli « Exception » sans motif', async () => {
        sched.getTechCalendar.mockResolvedValue(calendrier({ exceptions: [
            { id: 'e1', reason: 'Congés', start_ts: '2026-12-01T00:00:00Z', end_ts: '2026-12-10T00:00:00Z' },
            { id: 'e2', reason: null, start_ts: '2026-12-20T00:00:00Z', end_ts: '2026-12-21T00:00:00Z' },
        ] }));
        renderPage();

        expect(await screen.findByText('Congés')).toBeInTheDocument();
        expect(screen.getByText('Exception')).toBeInTheDocument();
    });

    it("supprime une absence après confirmation seulement", async () => {
        sched.getTechCalendar.mockResolvedValue(calendrier({ exceptions: [{ id: 'e1', reason: 'Congés', start_ts: '2026-12-01T00:00:00Z', end_ts: '2026-12-10T00:00:00Z' }] }));
        sched.removeScheduleException.mockResolvedValue({});
        renderPage();
        await screen.findByText('Congés');
        const corbeille = () => screen.getByText('delete').closest('button')!;

        vi.spyOn(window, 'confirm').mockReturnValueOnce(false);
        fireEvent.click(corbeille());
        expect(sched.removeScheduleException).not.toHaveBeenCalled();

        fireEvent.click(corbeille());
        await waitFor(() => expect(sched.removeScheduleException).toHaveBeenCalledWith('e1'));
    });

    it("déclare une absence : bouton inactif sans dates, puis envoi ISO et rechargement", async () => {
        sched.addScheduleException.mockResolvedValue({});
        renderPage();
        fireEvent.click(await screen.findByText(/demander|déclarer/i, { selector: '.tech-btn-request-time' }));

        const envoyer = await screen.findByText("Enregistrer l'absence");
        expect(envoyer).toBeDisabled();
        const [debut, fin] = Array.from(document.querySelectorAll('input[type="datetime-local"]'));
        fireEvent.change(debut, { target: { value: '2026-12-01T08:00' } });
        fireEvent.change(fin, { target: { value: '2026-12-03T18:00' } });
        fireEvent.change(screen.getByPlaceholderText(/congés, formation/i), { target: { value: 'Formation' } });
        fireEvent.click(envoyer);

        await waitFor(() => expect(sched.addScheduleException).toHaveBeenCalledWith({
            start_ts: new Date('2026-12-01T08:00').toISOString(),
            end_ts: new Date('2026-12-03T18:00').toISOString(),
            reason: 'Formation',
        }));
        await waitFor(() => expect(screen.queryByText("Enregistrer l'absence")).not.toBeInTheDocument());
        expect(sched.getTechCalendar.mock.calls.length).toBeGreaterThan(1);
    });
});
