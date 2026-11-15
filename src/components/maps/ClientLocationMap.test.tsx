import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-map-gl/maplibre', () => ({
    default: ({ children }: any) => <div data-testid="carte">{children}</div>,
    Marker: ({ latitude, longitude }: any) => <div data-testid="marqueur">{`${latitude},${longitude}`}</div>,
    NavigationControl: () => null,
}));
vi.mock('./maplibreWorker', () => ({}));

import ClientLocationMap from './ClientLocationMap';

const ERREURS = { PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 };

/** Simule watchPosition et rend la main sur ses deux rappels. */
function geolocalisation() {
    const rappels: { ok?: PositionCallback; ko?: PositionErrorCallback } = {};
    Object.defineProperty(navigator, 'geolocation', {
        configurable: true,
        value: { watchPosition: (ok: PositionCallback, ko: PositionErrorCallback) => { Object.assign(rappels, { ok, ko }); return 1; }, clearWatch: vi.fn() },
    });
    return {
        position: (lat: number, lng: number) => act(() => rappels.ok!({ coords: { latitude: lat, longitude: lng } } as GeolocationPosition)),
        erreur: (code: number) => act(() => rappels.ko!({ code, ...ERREURS } as unknown as GeolocationPositionError)),
    };
}

describe('ClientLocationMap', () => {
    it("un délai dépassé ne retire pas la dernière position connue", () => {
        const geo = geolocalisation();
        render(<ClientLocationMap />);
        geo.position(4.05, 9.76);

        geo.erreur(ERREURS.TIMEOUT);
        geo.erreur(ERREURS.POSITION_UNAVAILABLE);

        expect(screen.getByTestId('marqueur')).toHaveTextContent('4.05,9.76');
        expect(screen.queryByText(/Impossible de récupérer|indisponible/)).toBeNull();
    });

    it("sans aucune position obtenue, l'erreur est affichée", () => {
        const geo = geolocalisation();
        render(<ClientLocationMap />);

        geo.erreur(ERREURS.TIMEOUT);

        expect(screen.getByText('Impossible de récupérer votre position')).toBeInTheDocument();
        expect(screen.queryByTestId('carte')).toBeNull();
    });

    it("un refus d'autorisation retire la position", () => {
        const geo = geolocalisation();
        render(<ClientLocationMap />);
        geo.position(4.05, 9.76);

        geo.erreur(ERREURS.PERMISSION_DENIED);

        expect(screen.getByText('Activez la localisation pour voir votre position')).toBeInTheDocument();
        expect(screen.queryByTestId('marqueur')).toBeNull();
    });
});
