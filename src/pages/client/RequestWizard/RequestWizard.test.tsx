import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const req = vi.hoisted(() => ({ create: vi.fn(), match: vi.fn() }));
const skills = vi.hoisted(() => ({ list: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../../services/requestService', () => ({ default: req }));
vi.mock('../../../services/skillService', () => ({ default: skills }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import RequestWizard from './RequestWizard';

const catalogue = [
    { id: 's1', slug: 'plomberie-generale', name: 'Plomberie générale', category: 'Plomberie' },
    { id: 's2', slug: 'depannage-fuite', name: 'Dépannage fuite', category: 'Plomberie' },
    { id: 's3', slug: 'electricite-generale', name: 'Électricité générale', category: 'Électricité' },
    { id: 's4', slug: 'divers', name: 'Divers', category: null },
];

const renderPage = () => render(<MemoryRouter><RequestWizard /></MemoryRouter>);

/** Parcourt les étapes 1 et 2 jusqu'à l'étape 3 (photos et adresse). */
const jusquEtape3 = async () => {
    fireEvent.click(await screen.findByText('Plomberie'));
    fireEvent.click(screen.getByText(/next step/i));
    fireEvent.change(await screen.findByLabelText(/titre du problème/i), { target: { value: 'Fuite sous évier' } });
    fireEvent.change(screen.getByLabelText(/description détaillée/i), { target: { value: "Fuite importante sous l'évier." } });
    fireEvent.click(screen.getByRole('button', { name: /enregistrer & continuer/i }));
    await screen.findByText(/fichiers téléversés/i);
};

describe('RequestWizard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        skills.list.mockResolvedValue(catalogue);
        req.create.mockResolvedValue({ data: { id: 'req-1' } });
        req.match.mockResolvedValue({ data: { technicians: [] } });
    });
    afterEach(() => {
        vi.useRealTimers();
        Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true });
    });

    // ── Étape 1 : catégories ───────────────────────────────

    it('regroupe les compétences par catégorie et range les sans-catégorie sous « Autres »', async () => {
        renderPage();

        expect(await screen.findByText('Plomberie')).toBeInTheDocument();
        expect(screen.getByText('Électricité')).toBeInTheDocument();
        expect(screen.getByText('Autres')).toBeInTheDocument();
    });

    it("désactive « Next Step » tant qu'aucune catégorie n'est choisie", async () => {
        renderPage();
        await screen.findByText('Plomberie');

        expect(screen.getByText(/next step/i).closest('button')).toBeDisabled();
        fireEvent.click(screen.getByText('Plomberie'));
        expect(screen.getByText(/next step/i).closest('button')).toBeEnabled();
    });

    it('propose de préciser la spécialité du groupe retenu', async () => {
        renderPage();
        fireEvent.click(await screen.findByText('Plomberie'));

        expect(await screen.findByText(/préciser la spécialité/i)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Dépannage fuite' }));
        expect(screen.getByRole('button', { name: 'Dépannage fuite' })).toHaveClass('is-active');
    });

    it("affiche l'attente puis reste utilisable si le catalogue est indisponible", async () => {
        skills.list.mockRejectedValue(new Error('500'));
        renderPage();

        expect(screen.getByText(/chargement des catégories/i)).toBeInTheDocument();
        expect(screen.getByText(/next step/i).closest('button')).toBeDisabled();
    });

    // ── Étape 2 : détails ──────────────────────────────────

    it('exige un titre non vide et permet de revenir à l’étape précédente', async () => {
        renderPage();
        fireEvent.click(await screen.findByText('Plomberie'));
        fireEvent.click(screen.getByText(/next step/i));

        const suivant = await screen.findByRole('button', { name: /enregistrer & continuer/i });
        expect(suivant).toBeDisabled();
        fireEvent.change(screen.getByLabelText(/titre du problème/i), { target: { value: '   ' } });
        expect(suivant).toBeDisabled();

        fireEvent.click(screen.getByRole('button', { name: /étape précédente/i }));
        expect(await screen.findByText(/what do you need help with/i)).toBeInTheDocument();
    });

    it('compte les caractères de la description', async () => {
        renderPage();
        fireEvent.click(await screen.findByText('Plomberie'));
        fireEvent.click(screen.getByText(/next step/i));

        fireEvent.change(await screen.findByLabelText(/description détaillée/i), { target: { value: 'abcde' } });

        expect(screen.getByText('5 / 500 caractères')).toBeInTheDocument();
    });

    // ── Étape 3 : photos et adresse ────────────────────────

    it('ajoute puis retire des photos', async () => {
        // jsdom n'implémente pas createObjectURL (aperçu des miniatures).
        URL.createObjectURL = vi.fn(() => 'blob:apercu');
        renderPage();
        await jusquEtape3();

        const input = document.querySelector('input[type="file"]')!;
        fireEvent.change(input, { target: { files: [new File(['a'], 'a.png', { type: 'image/png' }), new File(['b'], 'b.png', { type: 'image/png' })] } });
        expect(await screen.findByText('Fichiers téléversés (2)')).toBeInTheDocument();

        fireEvent.click(document.querySelectorAll('.rw-thumb-action-delete')[0]);
        expect(screen.getByText('Fichiers téléversés (1)')).toBeInTheDocument();
    });

    // ── Soumission et analyse ──────────────────────────────

    it("crée la demande puis lance le rapprochement et redirige vers les résultats", async () => {
        const technicians = [{ id: 't1', name: 'Paul' }];
        req.match.mockResolvedValue({ data: { technicians } });
        renderPage();
        await jusquEtape3();
        fireEvent.change(screen.getByPlaceholderText(/adresse \(quartier/i), { target: { value: 'Bonapriso' } });
        fireEvent.change(screen.getByPlaceholderText('Ville'), { target: { value: 'Douala' } });

        vi.useFakeTimers({ shouldAdvanceTime: true });
        fireEvent.click(screen.getByRole('button', { name: /continuer/i }));
        await act(async () => { await vi.advanceTimersByTimeAsync(20_000); });

        expect(req.create).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Fuite sous évier',
            description: "Fuite importante sous l'évier.",
            category_slug: 'plomberie-generale',
            address_label: 'Bonapriso',
            city: 'Douala',
            photos: undefined,
        }));
        expect(req.match).toHaveBeenCalledWith('req-1');
        expect(navigate).toHaveBeenCalledWith('/espace-client/matching', { state: { matchResult: { technicians }, requestId: 'req-1' } });
    });

    it("redirige aussi lorsqu'aucun technicien n'est trouvé", async () => {
        renderPage();
        await jusquEtape3();

        vi.useFakeTimers({ shouldAdvanceTime: true });
        fireEvent.click(screen.getByRole('button', { name: /continuer/i }));
        await act(async () => { await vi.advanceTimersByTimeAsync(25_000); });

        expect(navigate).toHaveBeenCalledWith('/espace-client/matching', { state: { matchResult: { technicians: [] }, requestId: 'req-1' } });
    });

    it("signale l'échec de création et ramène à l'étape des détails", async () => {
        req.create.mockRejectedValue({ response: { status: 422 } });
        renderPage();
        await jusquEtape3();

        vi.useFakeTimers({ shouldAdvanceTime: true });
        fireEvent.click(screen.getByRole('button', { name: /continuer/i }));
        await act(async () => { await vi.advanceTimersByTimeAsync(4_000); });

        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/erreur est survenue/i));
        expect(await screen.findByText(/détails du problème/i)).toBeInTheDocument();
        expect(req.match).not.toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
    });

    // ── Géolocalisation ────────────────────────────────────

    it("préremplit l'adresse par géocodage inverse sans écraser une saisie", async () => {
        const getCurrentPosition = vi.fn((ok: PositionCallback) => ok({ coords: { latitude: 4.05, longitude: 9.77 } } as GeolocationPosition));
        Object.defineProperty(navigator, 'geolocation', { value: { getCurrentPosition }, configurable: true });
        const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ display_name: 'Akwa, Douala', address: { city: 'Douala' } }) });
        vi.stubGlobal('fetch', fetchMock);
        renderPage();
        await jusquEtape3();

        await waitFor(() => expect(screen.getByPlaceholderText(/adresse \(quartier/i)).toHaveValue('Akwa, Douala'));
        expect(screen.getByPlaceholderText('Ville')).toHaveValue('Douala');
        expect(fetchMock.mock.calls[0][0]).toContain('lat=4.05&lon=9.77');
        vi.unstubAllGlobals();
    });

    it('retombe sur Yaoundé si la géolocalisation est refusée et tolère un géocodage indisponible', async () => {
        const getCurrentPosition = vi.fn((_ok: PositionCallback, ko: PositionErrorCallback) => ko({} as GeolocationPositionError));
        Object.defineProperty(navigator, 'geolocation', { value: { getCurrentPosition }, configurable: true });
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('hors ligne')));
        renderPage();
        await jusquEtape3();

        vi.useFakeTimers({ shouldAdvanceTime: true });
        fireEvent.click(screen.getByRole('button', { name: /continuer/i }));
        await act(async () => { await vi.advanceTimersByTimeAsync(3_000); });

        expect(req.create).toHaveBeenCalledWith(expect.objectContaining({ latitude: 3.848, longitude: 11.5021 }));
        vi.unstubAllGlobals();
    });
});
