import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const tech = vi.hoisted(() => ({ getTechProfile: vi.fn(), updateTechLocation: vi.fn() }));
vi.mock('../../services/technicianService', () => tech);

import ZoneIntervention from './ZoneIntervention';

const geoloc = (impl: any) => Object.defineProperty(navigator, 'geolocation', { value: impl, configurable: true });

describe('ZoneIntervention', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        geoloc(undefined);
        tech.getTechProfile.mockResolvedValue({ service_perimeter: { address: 'Akwa, Douala', latitude: 4.05, longitude: 9.77, radius: 30 } });
    });

    it("préremplit la zone existante (périmètre de service) : position, adresse et rayon", async () => {
        render(<ZoneIntervention />);

        expect(await screen.findByText('Rayon : 30 km')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Akwa, Douala')).toBeInTheDocument();
        expect(screen.getByText('4.0500, 9.7700')).toBeInTheDocument();
        expect(screen.getByText('30 km')).toHaveClass('active');
    });

    it("accepte l'ancien format « location » (coordonnées dans meta)", async () => {
        tech.getTechProfile.mockResolvedValue({ location: { address: 'Bali', meta: { latitude: 4.1, longitude: 9.7 }, radius_km: 10 } });
        render(<ZoneIntervention />);

        expect(await screen.findByText('Rayon : 10 km')).toBeInTheDocument();
    });

    it("affiche « Aucune position définie » sans zone ni profil", async () => {
        tech.getTechProfile.mockRejectedValue(new Error('500'));
        render(<ZoneIntervention />);

        expect(await screen.findByText('Aucune position définie')).toBeInTheDocument();
    });

    it("refuse d'enregistrer sans position", async () => {
        tech.getTechProfile.mockResolvedValue({});
        render(<ZoneIntervention />);

        fireEvent.click(await screen.findByText('Enregistrer la zone'));

        expect(await screen.findByText('Veuillez définir votre position')).toBeInTheDocument();
        expect(tech.updateTechLocation).not.toHaveBeenCalled();
    });

    it("conserve le rayon existant à l'enregistrement et envoie la zone au serveur", async () => {
        tech.updateTechLocation.mockResolvedValue({});
        render(<ZoneIntervention />);
        await screen.findByText('Rayon : 30 km');

        fireEvent.click(screen.getByText('Enregistrer la zone'));

        await waitFor(() => expect(tech.updateTechLocation).toHaveBeenCalledWith(4.05, 9.77, 'Akwa, Douala', 30));
        expect(await screen.findByText('Zone mise à jour avec succès')).toBeInTheDocument();
    });

    it("change le rayon et la position saisie à la main", async () => {
        tech.getTechProfile.mockResolvedValue({});
        tech.updateTechLocation.mockResolvedValue({});
        render(<ZoneIntervention />);
        await screen.findByText('Aucune position définie');

        fireEvent.change(screen.getByPlaceholderText('Latitude'), { target: { value: '3.85' } });
        fireEvent.change(screen.getByPlaceholderText('Longitude'), { target: { value: '11.50' } });
        fireEvent.click(screen.getByText('75 km'));
        fireEvent.click(screen.getByText('Enregistrer la zone'));

        await waitFor(() => expect(tech.updateTechLocation).toHaveBeenCalledWith(3.85, 11.5, '', 75));
    });

    it("relaie l'erreur de validation du serveur", async () => {
        tech.updateTechLocation.mockRejectedValue({ response: { data: { message: 'Latitude invalide' } } });
        render(<ZoneIntervention />);
        await screen.findByText('Rayon : 30 km');

        fireEvent.click(screen.getByText('Enregistrer la zone'));

        expect(await screen.findByText('Latitude invalide')).toBeInTheDocument();
    });

    it("se géolocalise ou signale le refus", async () => {
        tech.getTechProfile.mockResolvedValue({});
        geoloc({ getCurrentPosition: vi.fn((ok: PositionCallback) => ok({ coords: { latitude: 4.2, longitude: 9.9 } } as GeolocationPosition)) });
        const { unmount } = render(<ZoneIntervention />);
        await screen.findByText('Aucune position définie');
        fireEvent.click(screen.getByText(/géolocaliser/i));
        expect(await screen.findByText('4.2000, 9.9000')).toBeInTheDocument();
        unmount();

        geoloc({ getCurrentPosition: vi.fn((_ok: PositionCallback, ko: PositionErrorCallback) => ko({} as GeolocationPositionError)) });
        render(<ZoneIntervention />);
        fireEvent.click(await screen.findByText(/géolocaliser/i));
        expect(await screen.findByText('Géolocalisation refusée')).toBeInTheDocument();
    });
});
