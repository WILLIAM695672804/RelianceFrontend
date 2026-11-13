import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const req = vi.hoisted(() => ({ match: vi.fn(), selectTechnician: vi.fn() }));
const ops = vi.hoisted(() => ({ createAppointment: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/requestService', () => ({ default: req }));
vi.mock('../../services/operationsService', () => ops);
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import MatchingResults from './MatchingResults';

const tech = (over = {}) => ({
    id: 't1', name: 'Paul', avatar_url: null, verified: true, match_score: 92, distance_km: 3.2, rating: 4.5, num_reviews: 12,
    skills: [{ name: 'Plomberie', hourly_rate: 5000 }], badges: [], ...over,
});
const renderPage = (entry: any = { pathname: '/matching', state: { matchResult: { technicians: [tech()] }, requestId: 'r1' } }) =>
    render(<MemoryRouter initialEntries={[entry]}><MatchingResults /></MemoryRouter>);

describe('MatchingResults', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    // ── Chargement des résultats ───────────────────────────

    it("affiche directement les résultats transmis par l'assistant, sans nouvel appel", async () => {
        renderPage();

        expect(await screen.findByText('Paul')).toBeInTheDocument();
        expect(screen.getByText('92% Match')).toBeInTheDocument();
        expect(screen.getByText(/5.000 XAF\/h/)).toBeInTheDocument();
        expect(screen.getByText(/3.2 km away/)).toBeInTheDocument();
        expect(screen.getByText('Techniciens trouvés')).toBeInTheDocument();
        expect(req.match).not.toHaveBeenCalled();
    });

    it("relance le rapprochement depuis le paramètre d'URL en l'absence d'état de navigation", async () => {
        req.match.mockResolvedValue({ data: { technicians: [tech({ name: 'Marie' })] } });
        renderPage({ pathname: '/matching', search: '?request_id=r9' });

        expect(screen.getByText(/recherche des meilleurs experts/i)).toBeInTheDocument();
        expect(await screen.findByText('Marie')).toBeInTheDocument();
        expect(req.match).toHaveBeenCalledWith('r9');
    });

    it('affiche « Aucun technicien trouvé » sans demande identifiable ou si le rapprochement échoue', async () => {
        const { unmount } = renderPage({ pathname: '/matching' });
        expect(await screen.findByText('Aucun technicien trouvé')).toBeInTheDocument();
        unmount();

        req.match.mockRejectedValue(new Error('500'));
        renderPage({ pathname: '/matching', search: '?request_id=r9' });
        expect(await screen.findByText('Aucun technicien trouvé')).toBeInTheDocument();
    });

    it("indique « Sur devis » lorsqu'aucun tarif horaire n'est connu", async () => {
        renderPage({ pathname: '/m', state: { matchResult: { technicians: [tech({ skills: [{ name: 'Plomberie' }] })] }, requestId: 'r1' } });

        expect(await screen.findByText('Sur devis')).toBeInTheDocument();
    });

    // ── Sélection d'un technicien ──────────────────────────

    it('réserve avec le tarif horaire puis redirige vers le suivi', async () => {
        req.selectTechnician.mockResolvedValue({});
        renderPage();

        fireEvent.click(await screen.findByText('Réserver'));

        await waitFor(() => expect(req.selectTechnician).toHaveBeenCalledWith('r1', 't1', 5000));
        expect(navigate).toHaveBeenCalledWith('/espace-client/suivi');
    });

    it("réserve un technicien « Sur devis » avec un prix nul (accepté par l'API)", async () => {
        req.selectTechnician.mockResolvedValue({});
        renderPage({ pathname: '/m', state: { matchResult: { technicians: [tech({ skills: [{ name: 'X' }] })] }, requestId: 'r1' } });

        fireEvent.click(await screen.findByText('Réserver'));

        await waitFor(() => expect(req.selectTechnician).toHaveBeenCalledWith('r1', 't1', 0));
    });

    it("alerte sans rediriger lorsque la sélection est refusée", async () => {
        req.selectTechnician.mockRejectedValue({ response: { status: 422 } });
        renderPage();

        fireEvent.click(await screen.findByText('Réserver'));

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/sélection du technicien/i)));
        expect(navigate).not.toHaveBeenCalled();
    });

    it("ne réserve rien sans identifiant de demande", async () => {
        renderPage({ pathname: '/m', state: { matchResult: { technicians: [tech()] } } });

        fireEvent.click(await screen.findByText('Réserver'));

        expect(req.selectTechnician).not.toHaveBeenCalled();
    });

    it('ouvre le profil public du technicien', async () => {
        renderPage();

        fireEvent.click(await screen.findByText('Voir le profil'));

        expect(navigate).toHaveBeenCalledWith('/artisan/t1');
    });

    // ── Rendez-vous ────────────────────────────────────────

    const ouvrirPlanning = async () => {
        renderPage();
        fireEvent.click(await screen.findByText('Planifier'));
        await screen.findByText(/planifier avec paul/i);
    };

    it("exige une date avant d'envoyer la demande de rendez-vous", async () => {
        await ouvrirPlanning();

        expect(screen.getByText('Confirmer la demande')).toBeDisabled();
    });

    it('enregistre le rendez-vous (date ISO, notes) puis propose de consulter ses rendez-vous', async () => {
        ops.createAppointment.mockResolvedValue({});
        await ouvrirPlanning();

        fireEvent.change(document.querySelector('input[type="datetime-local"]')!, { target: { value: '2026-12-01T10:00' } });
        fireEvent.change(screen.getByPlaceholderText(/portail d'entrée/i), { target: { value: 'Étage 2' } });
        fireEvent.click(screen.getByText('Confirmer la demande'));

        await waitFor(() => expect(ops.createAppointment).toHaveBeenCalledWith({
            request_id: 'r1', technician_id: 't1', scheduled_start: new Date('2026-12-01T10:00').toISOString(), notes: 'Étage 2',
        }));
        fireEvent.click(await screen.findByText('Fermer'));
        expect(screen.queryByText(/planifier avec paul/i)).not.toBeInTheDocument();
    });

    it("signale l'échec de l'enregistrement du rendez-vous", async () => {
        ops.createAppointment.mockRejectedValue(new Error('500'));
        await ouvrirPlanning();

        fireEvent.change(document.querySelector('input[type="datetime-local"]')!, { target: { value: '2026-12-01T10:00' } });
        fireEvent.click(screen.getByText('Confirmer la demande'));

        expect(await screen.findByText(/impossible d'enregistrer la demande de rendez-vous/i)).toBeInTheDocument();
    });

    it("signale une demande introuvable pour un rendez-vous sans identifiant de demande", async () => {
        renderPage({ pathname: '/m', state: { matchResult: { technicians: [tech()] } } });
        fireEvent.click(await screen.findByText('Planifier'));

        fireEvent.change(document.querySelector('input[type="datetime-local"]')!, { target: { value: '2026-12-01T10:00' } });
        fireEvent.click(screen.getByText('Confirmer la demande'));

        expect(await screen.findByText(/demande introuvable/i)).toBeInTheDocument();
        expect(ops.createAppointment).not.toHaveBeenCalled();
    });
});
