import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const listen = vi.fn();
const channel = { listen };
const echo = { private: vi.fn(() => channel), leave: vi.fn() };
let currentUser: any = null;

vi.mock('../services/echo', () => ({ getEcho: () => echo }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: currentUser }) }));

import { useAdminChannel } from './useAdminChannel';

describe('useAdminChannel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        listen.mockReturnValue(channel);
    });

    it("s'abonne au canal admin pour un utilisateur disposant du rôle admin", () => {
        currentUser = { id: 'u1', roles: [{ name: 'admin' }] };
        const onUserRegistered = vi.fn();

        renderHook(() => useAdminChannel({ onUserRegistered }));

        expect(echo.private).toHaveBeenCalledWith('admin.dashboard');
        expect(listen).toHaveBeenCalledWith('Admin\\NewUserRegistered', onUserRegistered);
    });

    it("n'écoute que les événements pour lesquels un gestionnaire est fourni", () => {
        currentUser = { id: 'u1', roles: [{ name: 'admin' }] };

        renderHook(() => useAdminChannel({ onDisputeOpened: vi.fn() }));

        expect(listen).toHaveBeenCalledTimes(1);
        expect(listen.mock.calls[0][0]).toBe('Admin\\DisputeOpened');
    });

    it.each([
        ['client', { id: 'u2', roles: [{ name: 'client' }] }],
        ['sans rôle', { id: 'u3', roles: [] }],
        ['anonyme', null],
    ])("ne s'abonne pas pour un utilisateur %s", (_label, user) => {
        currentUser = user;

        renderHook(() => useAdminChannel({ onUserRegistered: vi.fn() }));

        expect(echo.private).not.toHaveBeenCalled();
    });

    it('quitte le canal au démontage', () => {
        currentUser = { id: 'u1', roles: [{ name: 'admin' }] };

        const { unmount } = renderHook(() => useAdminChannel({ onUserRegistered: vi.fn() }));
        unmount();

        expect(echo.leave).toHaveBeenCalledWith('admin.dashboard');
    });
});
