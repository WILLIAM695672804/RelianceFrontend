import { useEffect } from 'react';
import { getEcho } from '../services/echo';
import { useAuth } from '../context/AuthContext';

interface NotificationEvent {
    id: string;
    title: string;
    body: string;
    payload: Record<string, any>;
    created_at: string;
}

interface UseNotificationChannelOptions {
    onNotificationCreated?: (data: NotificationEvent) => void;
}

export function useNotificationChannel(options: UseNotificationChannelOptions) {
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const echo = getEcho();
        const channel = echo.private(`notifications.${user.id}`);

        if (options.onNotificationCreated) {
            channel.listen('.NotificationCreated', options.onNotificationCreated);
        }

        return () => {
            echo.leave(`notifications.${user.id}`);
        };
    }, [user?.id]);
}
