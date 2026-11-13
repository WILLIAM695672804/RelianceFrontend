import api from './api';

/** Mesure d'usage (analytics_events) : n'interrompt jamais l'interface en cas d'échec. */
export const analyticsService = {
    async track(eventName: string, props: Record<string, unknown> = {}): Promise<void> {
        try {
            await api.post('/analytics/track', { event_name: eventName, event_props: props });
        } catch {
            /* mesure d'usage : sans effet sur le parcours utilisateur */
        }
    },
};

export default analyticsService;
