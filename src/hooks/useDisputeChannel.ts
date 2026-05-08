import { useEffect } from 'react';
import { getEcho } from '../services/echo';

interface DisputeMessageEvent {
    id: string;
    dispute_id: string;
    message: string;
    attachments: any[] | null;
    sender: { id: string; name: string; avatar_url: string | null };
    created_at: string;
}

interface DisputeStatusEvent {
    dispute_id: string;
    status: string;
    resolution: string | null;
    resolved_at: string | null;
}

interface UseDisputeChannelOptions {
    disputeId: string | undefined;
    onMessageCreated?: (data: DisputeMessageEvent) => void;
    onStatusChanged?: (data: DisputeStatusEvent) => void;
}

export function useDisputeChannel({ disputeId, onMessageCreated, onStatusChanged }: UseDisputeChannelOptions) {
    useEffect(() => {
        if (!disputeId) return;

        const echo = getEcho();
        const channel = echo.private(`disputes.${disputeId}`);

        if (onMessageCreated) {
            channel.listen('.DisputeMessageCreated', onMessageCreated);
        }
        if (onStatusChanged) {
            channel.listen('.DisputeStatusChanged', onStatusChanged);
        }

        return () => {
            echo.leave(`disputes.${disputeId}`);
        };
    }, [disputeId]);
}
