import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const ops = vi.hoisted(() => ({ updateJobPhases: vi.fn(), updateJobStatus: vi.fn() }));
const matching = vi.hoisted(() => ({ getActiveMission: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/operationsService', () => ops);
vi.mock('../../services/matchingService', () => ({ default: matching }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import MissionCompletion from './MissionCompletion';

const job = (over = {}) => ({
    id: 'j1', status: 'in_progress', completion_notes: 'RAS',
    phases: [{ title: 'Diagnostic', status: 'completed' }, { title: 'Réparation', status: 'pending' }], ...over,
});
const renderPage = () =>
    render(
        <MemoryRouter initialEntries={['/technicien/mission/r1/travaux']}>
            <Routes><Route path="/technicien/mission/:id/travaux" element={<MissionCompletion />} /></Routes>
        </MemoryRouter>,
    );
const phase = () => screen.getByPlaceholderText(/nouvelle phase/i);

describe('MissionCompletion', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        matching.getActiveMission.mockResolvedValue({ data: { job: job() } });
    });

    it("indique l'absence d'intervention active et permet de revenir", async () => {
        matching.getActiveMission.mockResolvedValue({ data: {} });
        renderPage();

        expect(await screen.findByText(/aucune intervention active/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText('Retour'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });

    it("tolère l'échec de chargement comme une absence d'intervention", async () => {
        matching.getActiveMission.mockRejectedValue(new Error('500'));
        renderPage();

        expect(await screen.findByText(/aucune intervention active/i)).toBeInTheDocument();
    });

    it("affiche les phases, les notes existantes et la progression", async () => {
        renderPage();

        expect(await screen.findByText('Diagnostic')).toBeInTheDocument();
        expect(screen.getByText('Réparation')).toBeInTheDocument();
        expect(screen.getByDisplayValue('RAS')).toBeInTheDocument();
        expect(document.querySelector('.mc-progress-percent')).toHaveTextContent('50%');
    });

    it('ajoute une phase (clic ou touche Entrée) et ignore un libellé vide', async () => {
        renderPage();
        await screen.findByText('Diagnostic');

        expect(document.querySelector('.mc-add-btn')).toBeDisabled();
        fireEvent.change(phase(), { target: { value: 'Essais' } });
        fireEvent.click(document.querySelector('.mc-add-btn')!);
        expect(screen.getByText('Essais')).toBeInTheDocument();

        fireEvent.change(phase(), { target: { value: 'Nettoyage' } });
        fireEvent.keyDown(phase(), { key: 'Enter' });
        expect(screen.getByText('Nettoyage')).toBeInTheDocument();
        expect(phase()).toHaveValue('');
        expect(document.querySelector('.mc-progress-percent')).toHaveTextContent('25%');
    });

    it('fait tourner le statut d’une phase : en attente → en cours → terminée → en attente', async () => {
        renderPage();
        await screen.findByText('Réparation');
        const bascule = () => document.querySelectorAll('.mc-phase-toggle')[1] as HTMLElement;
        const pct = () => document.querySelector('.mc-progress-percent')!.textContent;

        fireEvent.click(bascule());
        expect(pct()).toBe('50%');
        fireEvent.click(bascule());
        expect(pct()).toBe('100%');
        fireEvent.click(bascule());
        expect(pct()).toBe('50%');
    });

    it('supprime une phase', async () => {
        renderPage();
        await screen.findByText('Diagnostic');

        fireEvent.click(document.querySelectorAll('.mc-phase-remove')[0]);

        expect(screen.queryByText('Diagnostic')).not.toBeInTheDocument();
        expect(document.querySelector('.mc-progress-percent')).toHaveTextContent('0%');
    });

    it('enregistre les phases sans clôturer la mission', async () => {
        ops.updateJobPhases.mockResolvedValue(job());
        renderPage();
        await screen.findByText('Diagnostic');

        fireEvent.click(document.querySelector('.mc-btn-save')!);

        await waitFor(() => expect(ops.updateJobPhases).toHaveBeenCalledWith('j1', job().phases));
        expect(ops.updateJobStatus).not.toHaveBeenCalled();
    });

    it("clôture : enregistre les phases, passe le statut à « completed » avec les notes, puis revient au tableau de bord", async () => {
        ops.updateJobPhases.mockResolvedValue(job());
        ops.updateJobStatus.mockResolvedValue(job({ status: 'completed' }));
        renderPage();
        await screen.findByText('Diagnostic');

        fireEvent.change(screen.getByPlaceholderText(/notes finales/i), { target: { value: 'Joint remplacé' } });
        fireEvent.click(document.querySelector('.mc-btn-complete')!);

        await waitFor(() => expect(ops.updateJobStatus).toHaveBeenCalledWith('j1', { status: 'completed', completion_notes: 'Joint remplacé' }));
        expect(ops.updateJobPhases.mock.invocationCallOrder[0]).toBeLessThan(ops.updateJobStatus.mock.invocationCallOrder[0]);
        expect(navigate).toHaveBeenCalledWith('/technicien/dashboard');
    });

    it("ne clôture pas si la confirmation est refusée", async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(false);
        renderPage();
        await screen.findByText('Diagnostic');

        fireEvent.click(document.querySelector('.mc-btn-complete')!);

        expect(ops.updateJobPhases).not.toHaveBeenCalled();
        expect(ops.updateJobStatus).not.toHaveBeenCalled();
    });

    it("reste sur la page si la clôture échoue", async () => {
        ops.updateJobPhases.mockResolvedValue(job());
        ops.updateJobStatus.mockRejectedValue(new Error('422'));
        renderPage();
        await screen.findByText('Diagnostic');

        fireEvent.click(document.querySelector('.mc-btn-complete')!);

        await waitFor(() => expect(document.querySelector('.mc-btn-complete')).toBeEnabled());
        expect(navigate).not.toHaveBeenCalled();
    });
});
