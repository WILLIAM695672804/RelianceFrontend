import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import api from './api';
import { API_URL, REALTIME } from '../config';

(window as any).Pusher = Pusher;

let echoInstance: Echo<'pusher'> | null = null;

export function getEcho(): Echo<'pusher'> {
    if (!echoInstance) {
        echoInstance = new Echo({
            broadcaster: 'pusher',
            key: REALTIME.key,
            wsHost: REALTIME.host,
            wsPort: REALTIME.port,
            wssPort: REALTIME.port,
            forceTLS: REALTIME.tls,
            disableStats: true,
            cluster: 'mt1',
            enabledTransports: REALTIME.tls ? ['wss'] : ['ws'],
            // Authorizer custom : pusher-js n'applique PAS withCredentials nativement,
            // donc le cookie auth_token n'était pas envoyé (→ 401). On passe par axios
            // (api) qui envoie le cookie (withCredentials) et l'auth Sanctum fonctionne.
            authorizer: (channel: any) => ({
                authorize: (socketId: string, callback: (error: boolean, data: any) => void) => {
                    api.post(`${API_URL}/broadcasting/auth`, {
                        socket_id: socketId,
                        channel_name: channel.name,
                    })
                        .then((response) => callback(false, response.data))
                        .catch((error) => callback(true, error));
                },
            }),
        } as any);
    }
    return echoInstance;
}

export function destroyEcho(): void {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
}
