import { useEffect } from 'react';
import { getEcho } from '../services/echo';
import { useAuth } from '../context/AuthContext';

interface QuoteEvent {
    quote_id: string;
    total_amount: number;
    status: string;
    breakdown: { label: string; amount: number }[];
}

interface InvoiceEvent {
    invoice_id: string;
    amount: number;
    status: string;
}

interface UseQuoteChannelOptions {
    onQuoteSubmitted?: (data: QuoteEvent) => void;
    onInvoiceCreated?: (data: InvoiceEvent) => void;
}

export function useQuoteChannel(options: UseQuoteChannelOptions) {
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const echo = getEcho();
        const channel = echo.private(`quotes.${user.id}`);

        if (options.onQuoteSubmitted) {
            channel.listen('.QuoteSubmitted', options.onQuoteSubmitted);
        }
        if (options.onInvoiceCreated) {
            channel.listen('.InvoiceCreated', options.onInvoiceCreated);
        }

        return () => {
            echo.leave(`quotes.${user.id}`);
        };
    }, [user?.id]);
}
