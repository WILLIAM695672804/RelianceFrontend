import { useEffect } from 'react';
import { getEcho } from '../services/echo';
import { useAuth } from '../context/AuthContext';

interface BalanceEvent {
    balance: number;
    reason: string;
    updated_at: string;
}

interface PaymentEvent {
    payment_id: string;
    amount: number;
    method: string;
    status: string;
}

interface HoldEvent {
    amount: number;
    net_amount?: number;
    type: string;
}

interface UseWalletChannelOptions {
    onBalanceUpdated?: (data: BalanceEvent) => void;
    onPaymentSettled?: (data: PaymentEvent) => void;
    onHoldCaptured?: (data: HoldEvent) => void;
    onHoldReleased?: (data: HoldEvent) => void;
}

export function useWalletChannel(options: UseWalletChannelOptions) {
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const echo = getEcho();
        const channel = echo.private(`wallet.${user.id}`);

        if (options.onBalanceUpdated) {
            channel.listen('BalanceUpdated', options.onBalanceUpdated);
        }
        if (options.onPaymentSettled) {
            channel.listen('PaymentSettled', options.onPaymentSettled);
        }
        if (options.onHoldCaptured) {
            channel.listen('HoldCaptured', options.onHoldCaptured);
        }
        if (options.onHoldReleased) {
            channel.listen('HoldReleased', options.onHoldReleased);
        }

        return () => {
            echo.leave(`wallet.${user.id}`);
        };
    }, [user?.id]);
}
