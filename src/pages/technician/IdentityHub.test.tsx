import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const tech = vi.hoisted(() => ({ getTechProfile: vi.fn(), updateTechLocation: vi.fn(), updateTechProfile: vi.fn() }));
const logout = vi.hoisted(() => vi.fn());
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/technicianService', () => tech);
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ logout }) }));
vi.mock('../../components/maps/TechServiceMap', () => ({
    default: (p: any) => <div data-testid="map">{`${p.city}|${p.radiusInKm}`}</div>,
}));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import IdentityHub from './IdentityHub';

const profil = (over: Record<string, unknown> = {}) => ({
    id: 'abcd1234-0000-0000-0000-000000000000', name: 'Paul Technicien', email: 'p@t.l', phone: '+237600000000',
    avatar_url: null, verified: true, rating: 4.5, num_reviews: 12, bio: 'Plombier', competences: ['Plomberie'],
    kyc_approved: true,
    service_perimeter: { city: 'Douala', address: 'Akwa', zones: ['Akwa', 'Bonapriso'], latitude: 4.05, longitude: 9.77, radius: 25 },
    badges: [{ code: 'b1', title: 'Fiable', icon_ref: 'verified', awarded_at: '2026-10-01T00:00:00Z' }],
    recent_reviews: [],
    ...over,
});

const renderPage = () => render(<MemoryRouter><IdentityHub /></MemoryRouter>);
const geoloc = (impl: Partial<Geolocation> | undefined) =>
    Object.defineProperty(navigator, 'geolocation', { value: impl, configurable: true });

describe('IdentityHub', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        tech.getTechProfile.mockResolvedValue(profil());
        geoloc(undefined);
    });

    // ── Affichage ──────────────────────────────────────────

    it('affiche le chargement puis le profil (identifiant court, note, badge, zones)', async () => {
        renderPage();

        expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
        expect(await screen.findByText('Professional Profile')).toBeInTheDocument();
        expect(screen.getAllByText('Paul Technicien').length).toBeGreaterThan(0);
        expect(screen.getByText('Tech ID: ABCD1234')).toBeInTheDocument();
        expect(screen.getByText('Verified Specialist')).toBeInTheDocument();
        expect(screen.getByText('4.5')).toBeInTheDocument();
        expect(screen.getByText('Fiable')).toBeInTheDocument();
        expect(screen.getByText('Bonapriso')).toBeInTheDocument();
        expect(screen.getByTestId('map')).toHaveTextContent('Douala|25');
    });

    it("affiche « New » sans note, l'état KYC en attente et l'absence d'avis", async () => {
        tech.getTechProfile.mockResolvedValue(profil({ rating: 0, verified: false, kyc_approved: false, badges: [] }));
        renderPage();

        expect(await screen.findByText('New')).toBeInTheDocument();
        expect(screen.getByText('Pending KYC')).toBeInTheDocument();
        expect(screen.queryByText('Verified Specialist')).not.toBeInTheDocument();
        expect(screen.getByText(/aucun avis pour le moment/i)).toBeInTheDocument();
        expect(screen.getByText(/debloquer des badges/i)).toBeInTheDocument();
    });

    it("sort du chargement et affiche l'état par défaut si le profil est indisponible", async () => {
        tech.getTechProfile.mockRejectedValue(new Error('500'));
        renderPage();

        expect(await screen.findByText('Professional')).toBeInTheDocument();
    });

    // ── Navigation ─────────────────────────────────────────

    it('ouvre le profil public et la vérification KYC', async () => {
        renderPage();
        await screen.findByText('Professional Profile');

        fireEvent.click(screen.getByText('Public View'));
        fireEvent.click(screen.getByText('View Credentials'));

        expect(navigate).toHaveBeenCalledWith('/artisan/abcd1234-0000-0000-0000-000000000000');
        expect(navigate).toHaveBeenCalledWith('/technicien/verification');
    });

    it('se déconnecte puis redirige vers la connexion', async () => {
        logout.mockResolvedValue(undefined);
        renderPage();
        await screen.findByText('Professional Profile');

        fireEvent.click(document.querySelector('.tech-btn-logout')!);

        await waitFor(() => expect(navigate).toHaveBeenCalledWith('/connexion'));
        expect(logout).toHaveBeenCalled();
    });

    // ── Zone d'intervention ────────────────────────────────

    it("préremplit le rayon courant dans la fenêtre « Service Perimeter »", async () => {
        renderPage();
        await screen.findByText('Professional Profile');

        fireEvent.click(screen.getByText(/update area/i));

        expect(await screen.findByText('25 km')).toHaveClass('active');
    });

    it('envoie position, ville et rayon choisi au serveur', async () => {
        geoloc({ getCurrentPosition: vi.fn((ok: PositionCallback) => ok({ coords: { latitude: 4.06, longitude: 9.78 } } as GeolocationPosition)) });
        tech.updateTechLocation.mockResolvedValue(profil({ service_perimeter: { city: 'Douala', address: 'x', zones: [], latitude: 4.06, longitude: 9.78, radius: 10 } }));
        renderPage();
        await screen.findByText('Professional Profile');

        fireEvent.click(screen.getByText(/update area/i));
        fireEvent.click(await screen.findByText('10 km'));
        fireEvent.click(screen.getByText(/update & localize/i));

        await waitFor(() => expect(tech.updateTechLocation).toHaveBeenCalledWith(4.06, 9.78, 'Douala', 10));
        await waitFor(() => expect(screen.getByTestId('map')).toHaveTextContent('Douala|10'));
    });

    it("informe l'utilisateur lorsque la géolocalisation n'est pas prise en charge", async () => {
        renderPage();
        await screen.findByText('Professional Profile');

        fireEvent.click(screen.getByText(/update area/i));
        fireEvent.click(await screen.findByText(/update & localize/i));

        expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/not supported/i));
        expect(tech.updateTechLocation).not.toHaveBeenCalled();
    });

    it('signale un refus de géolocalisation et un échec serveur', async () => {
        geoloc({ getCurrentPosition: vi.fn((_ok: PositionCallback, ko: PositionErrorCallback) => ko({} as GeolocationPositionError)) });
        renderPage();
        await screen.findByText('Professional Profile');

        fireEvent.click(screen.getByText(/update area/i));
        fireEvent.click(await screen.findByText(/update & localize/i));
        expect(window.alert).toHaveBeenCalledWith('Could not retrieve your location.');

        geoloc({ getCurrentPosition: vi.fn((ok: PositionCallback) => ok({ coords: { latitude: 1, longitude: 2 } } as GeolocationPosition)) });
        tech.updateTechLocation.mockRejectedValue(new Error('422'));
        fireEvent.click(screen.getByText(/update area/i));
        fireEvent.click(await screen.findByText(/update & localize/i));
        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Could not update location.'));
    });

    it('ferme la fenêtre de rayon sans appel serveur', async () => {
        renderPage();
        await screen.findByText('Professional Profile');

        fireEvent.click(screen.getByText(/update area/i));
        fireEvent.click(await screen.findByText('Cancel'));

        expect(screen.queryByText('Update & Localize')).not.toBeInTheDocument();
        expect(tech.updateTechLocation).not.toHaveBeenCalled();
    });

    // ── Édition du profil ──────────────────────────────────

    const ouvrirEdition = async () => {
        renderPage();
        await screen.findByText('Professional Profile');
        fireEvent.click(screen.getByText('Personal Information').closest('.tech-card-header')!.querySelector('button')!);
        await screen.findByText('Edit Professional Profile');
    };

    it('préremplit le formulaire et envoie un FormData en method spoofing PUT', async () => {
        tech.updateTechProfile.mockResolvedValue(profil({ name: 'Paul Modifié' }));
        await ouvrirEdition();

        expect(screen.getByDisplayValue('Paul Technicien')).toBeInTheDocument();
        fireEvent.change(screen.getByDisplayValue('Paul Technicien'), { target: { value: 'Paul Modifié' } });
        fireEvent.click(screen.getByRole('button', { name: 'Electricité'.replace('E', 'É') }));
        fireEvent.click(screen.getByText('Save Profile'));

        await waitFor(() => expect(tech.updateTechProfile).toHaveBeenCalled());
        const fd: FormData = tech.updateTechProfile.mock.calls[0][0];
        expect(fd.get('_method')).toBe('PUT');
        expect(fd.get('name')).toBe('Paul Modifié');
        expect(fd.getAll('competences[]')).toEqual(['Plomberie', 'Électricité']);
        expect((await screen.findAllByText('Paul Modifié')).length).toBeGreaterThan(0);
        expect(screen.queryByText('Edit Professional Profile')).not.toBeInTheDocument();
    });

    it('retire une spécialité déjà cochée', async () => {
        tech.updateTechProfile.mockResolvedValue(profil());
        await ouvrirEdition();

        fireEvent.click(screen.getByRole('button', { name: 'Plomberie' }));
        fireEvent.click(screen.getByText('Save Profile'));

        await waitFor(() => expect(tech.updateTechProfile).toHaveBeenCalled());
        expect((tech.updateTechProfile.mock.calls[0][0] as FormData).getAll('competences[]')).toEqual([]);
    });

    it("joint l'avatar choisi et affiche son aperçu", async () => {
        tech.updateTechProfile.mockResolvedValue(profil());
        await ouvrirEdition();
        const fichier = new File(['x'], 'avatar.png', { type: 'image/png' });

        fireEvent.change(document.querySelector('input[type="file"]')!, { target: { files: [fichier] } });
        await waitFor(() => expect(document.querySelector('.tech-modal-avatar, img[src^="data:"]')).not.toBeNull());
        fireEvent.click(screen.getByText('Save Profile'));

        await waitFor(() => expect(tech.updateTechProfile).toHaveBeenCalled());
        expect((tech.updateTechProfile.mock.calls[0][0] as FormData).get('avatar')).toBeInstanceOf(File);
    });

    it("conserve la fenêtre ouverte et alerte quand l'enregistrement échoue", async () => {
        tech.updateTechProfile.mockRejectedValue(new Error('422'));
        await ouvrirEdition();

        fireEvent.click(screen.getByText('Save Profile'));

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Could not update profile.'));
        expect(screen.getByText('Edit Professional Profile')).toBeInTheDocument();
    });
});
