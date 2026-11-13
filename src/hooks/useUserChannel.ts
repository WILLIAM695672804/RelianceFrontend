import { useEffect } from 'react';
import { getEcho } from '../services/echo';
import { useAuth } from '../context/AuthContext';

interface KycEvent {
    status: string;
    rejection_reason: string | null;
    type: 'kyc_status';
}

interface RoleUpgradeEvent {
    decision: string;
    reason: string | null;
    type: 'role_upgrade';
}

interface UseUserChannelOptions {
    onKycStatusChanged?: (data: KycEvent) => void;
    onRoleUpgradeDecision?: (data: RoleUpgradeEvent) => void;
}

export function useUserChannel(options: UseUserChannelOptions) {
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const echo = getEcho();
        const channel = echo.private(`user.${user.id}`);

        if (options.onKycStatusChanged) {
            channel.listen('KycStatusChanged', options.onKycStatusChanged);
        }
        if (options.onRoleUpgradeDecision) {
            channel.listen('RoleUpgradeDecision', options.onRoleUpgradeDecision);
        }

        return () => {
            echo.leave(`user.${user.id}`);
        };
    }, [user?.id]);
}
