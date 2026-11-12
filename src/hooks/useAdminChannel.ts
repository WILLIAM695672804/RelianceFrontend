import { useEffect } from 'react';
import { getEcho } from '../services/echo';
import { useAuth } from '../context/AuthContext';

interface UserRegisteredEvent {
    user_id: string;
    name: string;
    role: string;
    created_at: string;
}

interface RequestCreatedEvent {
    request_id: string;
    title: string;
    status: string;
    created_at: string;
}

interface DisputeOpenedEvent {
    dispute_id: string;
    reason: string;
    opened_by: string;
    created_at: string;
}

interface UseAdminChannelOptions {
    onUserRegistered?: (data: UserRegisteredEvent) => void;
    onRequestCreated?: (data: RequestCreatedEvent) => void;
    onDisputeOpened?: (data: DisputeOpenedEvent) => void;
}

export function useAdminChannel(options: UseAdminChannelOptions) {
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id || !user.roles?.some((r) => r.name === 'admin')) return;

        const echo = getEcho();
        const channel = echo.private('admin.dashboard');

        if (options.onUserRegistered) {
            channel.listen('.Admin\\NewUserRegistered', options.onUserRegistered);
        }
        if (options.onRequestCreated) {
            channel.listen('.Admin\\NewRequestCreated', options.onRequestCreated);
        }
        if (options.onDisputeOpened) {
            channel.listen('.Admin\\DisputeOpened', options.onDisputeOpened);
        }

        return () => {
            echo.leave('admin.dashboard');
        };
    }, [user?.id, user?.roles]);
}
