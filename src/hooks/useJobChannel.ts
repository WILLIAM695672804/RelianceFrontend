import { useEffect } from 'react';
import { getEcho } from '../services/echo';

interface JobStatusEvent {
    job_id: string;
    status: string;
    phases: { title: string; status: string; notes?: string }[] | null;
    started_at: string | null;
    completed_at: string | null;
    estimated_travel_seconds: number | null;
}

interface PhasesEvent {
    job_id: string;
    phases: { title: string; status: string; notes?: string }[];
}

interface UseJobChannelOptions {
    jobId: string | undefined;
    onStatusChanged?: (data: JobStatusEvent) => void;
    onPhasesUpdated?: (data: PhasesEvent) => void;
}

export function useJobChannel({ jobId, onStatusChanged, onPhasesUpdated }: UseJobChannelOptions) {
    useEffect(() => {
        if (!jobId) return;

        const echo = getEcho();
        const channel = echo.private(`jobs.${jobId}`);

        if (onStatusChanged) {
            channel.listen('JobStatusChanged', onStatusChanged);
        }
        if (onPhasesUpdated) {
            channel.listen('PhasesUpdated', onPhasesUpdated);
        }

        return () => {
            echo.leave(`jobs.${jobId}`);
        };
    }, [jobId]);
}
