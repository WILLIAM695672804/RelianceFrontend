import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getMap = vi.fn();
vi.mock('../../services/adminService', () => ({ default: { getMap: () => getMap() } }));
vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));
vi.mock('react-map-gl/maplibre', () => ({
    default: ({ children }: any) => <div data-testid="map">{children}</div>,
    Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
    Popup: ({ children }: any) => <div>{children}</div>,
    NavigationControl: () => null,
}));

import AdminMap from './AdminMap';

describe('AdminMap', () => {
    beforeEach(() => vi.clearAllMocks());

    it("affiche l'état de chargement puis les compteurs et un marqueur par entité", async () => {
        getMap.mockResolvedValue({
            data: {
                technicians: [{ id: 't1', name: 'Paul', verified: true, rating: 4.5, latitude: 4.05, longitude: 9.77, radius_km: 20, skills: ['Plomberie'] }],
                requests: [{ id: 'r1', title: 'Fuite', status: 'analyzed', latitude: 4.06, longitude: 9.76 }, { id: 'r2', title: 'Panne', status: 'quoted', latitude: 4.07, longitude: 9.75 }],
            },
        });

        render(<AdminMap />);

        expect(screen.getByText(/chargement de la carte/i)).toBeInTheDocument();
        expect(await screen.findByText(/1 technicien\(s\) · 2 demande\(s\) active\(s\)/)).toBeInTheDocument();
        expect(screen.getAllByTestId('marker')).toHaveLength(3);
    });

    it("signale l'impossibilité de charger la cartographie", async () => {
        getMap.mockRejectedValue(new Error('500'));

        render(<AdminMap />);

        expect(await screen.findByText(/impossible de charger la cartographie/i)).toBeInTheDocument();
    });

    it('tolère une réponse sans données', async () => {
        getMap.mockResolvedValue({});

        render(<AdminMap />);

        expect(await screen.findByText(/0 technicien\(s\) · 0 demande\(s\)/)).toBeInTheDocument();
    });
});
