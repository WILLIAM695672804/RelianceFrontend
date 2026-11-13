// Configuration lue à la compilation (variables VITE_*, voir .env.example).
// Les valeurs de repli ne valent que pour le développement local : la compilation de production
// échoue si VITE_API_URL est absente (vite.config.ts).

const env = import.meta.env;

/** Origine de l'API, sans barre oblique finale. */
export const API_URL = (env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

/** Serveur WebSocket (Laravel Reverb, protocole Pusher). */
export const REALTIME = {
    key: env.VITE_PUSHER_APP_KEY || 'reliance-key',
    host: env.VITE_PUSHER_HOST || '127.0.0.1',
    port: Number(env.VITE_PUSHER_PORT || 6001),
    // https impose wss : un WebSocket en clair est bloqué depuis une page servie en https.
    tls: (env.VITE_PUSHER_SCHEME || 'http') === 'https',
};
