/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Origine de l'API Laravel, sans /api/v1 (ex. https://api.reliance.cm). Obligatoire en production. */
    readonly VITE_API_URL?: string;
    readonly VITE_PUSHER_APP_KEY?: string;
    readonly VITE_PUSHER_HOST?: string;
    readonly VITE_PUSHER_PORT?: string;
    readonly VITE_PUSHER_SCHEME?: 'http' | 'https';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
