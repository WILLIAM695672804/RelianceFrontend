import { useEffect } from 'react';
import { getEcho } from '../services/echo';

interface PositionEvent {
    latitude: number;
    longitude: number;
    timestamp: string;
}

interface UseTrackingChannelOptions {
    jobId: string | undefined;
    onPositionUpdated?: (data: PositionEvent) => void;
}

export function useTrackingChannel({ jobId, onPositionUpdated }: UseTrackingChannelOptions) {
    useEffect(() => {
        if (!jobId) return;

        const echo = getEcho();
        const channel = echo.private(`tracking.${jobId}`);

        if (onPositionUpdated) {
            channel.listen('TechnicianPositionUpdated', onPositionUpdated);
        }

        return () => {
            echo.leave(`tracking.${jobId}`);
        };
    }, [jobId]);
}
