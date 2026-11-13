import { render } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const track = vi.hoisted(() => vi.fn());
let session: any;
vi.mock('../../services/analyticsService', () => ({ default: { track } }));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => session }));

import RouteTracker from './RouteTracker';

let aller: (p: string) => void;
const Nav = () => { const n = useNavigate(); aller = (p) => n(p); return null; };
const monter = () => render(<MemoryRouter initialEntries={['/espace-client/dashboard']}><RouteTracker /><Nav /></MemoryRouter>);

describe('RouteTracker', () => {
    beforeEach(() => { vi.clearAllMocks(); session = { isAuthenticated: true }; });

    it("enregistre la page courante puis chaque changement de page, sans doublon", () => {
        monter();
        expect(track).toHaveBeenCalledWith('page_view', { path: '/espace-client/dashboard' });

        act(() => aller('/espace-client/wallet'));
        act(() => aller('/espace-client/wallet'));

        expect(track.mock.calls.map((c) => c[1].path)).toEqual(['/espace-client/dashboard', '/espace-client/wallet']);
    });

    it("n'enregistre rien pour un visiteur non connecté", () => {
        session = { isAuthenticated: false };
        monter();

        expect(track).not.toHaveBeenCalled();
    });
});
