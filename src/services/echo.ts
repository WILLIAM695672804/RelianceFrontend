import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

let echoInstance: Echo<'pusher'> | null = null;

export function getEcho(): Echo<'pusher'> {
    if (!echoInstance) {
        echoInstance = new Echo({
            broadcaster: 'pusher',
            key: 'reliance-key',
            wsHost: '127.0.0.1',
            wsPort: 6001,
            forceTLS: false,
            disableStats: true,
            cluster: 'mt1',
            enabledTransports: ['ws'],
            authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
            },
        });
    }
    return echoInstance;
}

export function destroyEcho(): void {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
}
