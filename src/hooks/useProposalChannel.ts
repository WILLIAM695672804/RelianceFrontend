import { useEffect } from 'react';
import { getEcho } from '../services/echo';
import { useAuth } from '../context/AuthContext';

interface ProposalEvent {
    id: string;
    request_id: string;
    price: number;
    message?: string;
    expires_at?: string;
    request?: { id: string; title: string; description: string };
}

interface ProposalAcceptedEvent {
    proposal_id: string;
    request_id: string;
    technician?: { id: string; name: string; avatar: string | null };
    price: number;
    status: string;
}

interface ProposalRefusedEvent {
    proposal_id: string;
    request_id: string;
    technician_id: string;
    status: string;
}

interface UseProposalChannelOptions {
    onProposalCreated?: (data: ProposalEvent) => void;
    onProposalAccepted?: (data: ProposalAcceptedEvent) => void;
    onProposalRefused?: (data: ProposalRefusedEvent) => void;
}

export function useProposalChannel(options: UseProposalChannelOptions) {
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const echo = getEcho();
        const channel = echo.private(`proposals.${user.id}`);

        if (options.onProposalCreated) {
            channel.listen('ProposalCreated', options.onProposalCreated);
        }
        if (options.onProposalAccepted) {
            channel.listen('ProposalAccepted', options.onProposalAccepted);
        }
        if (options.onProposalRefused) {
            channel.listen('ProposalRefused', options.onProposalRefused);
        }

        return () => {
            echo.leave(`proposals.${user.id}`);
        };
    }, [user?.id]);
}
