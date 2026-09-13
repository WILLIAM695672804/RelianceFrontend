import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

const api = axios.create({
    baseURL: `${API_BASE}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Send the Sanctum session cookie with every request
});

// Sanctum SPA : un cookie CSRF doit être posé avant toute requête stateful (POST/PUT/DELETE)
let csrfReady: Promise<void> | null = null;
const ensureCsrfCookie = () => {
    if (!csrfReady) {
        csrfReady = axios.get(`${API_BASE}/sanctum/csrf-cookie`, { withCredentials: true }).then(() => undefined);
    }
    return csrfReady;
};

api.interceptors.request.use(async (config) => {
    const method = config.method?.toLowerCase();
    if (method && method !== 'get') {
        await ensureCsrfCookie();
    }
    return config;
});

// Intercepteur: une session expirée/invalide renvoie 401 → déconnexion locale.
// On NE redirige PAS pour le check d'auth au démarrage (getMe), ni si on est déjà sur /connexion.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || '';
            const isAuthCheck = url.includes('/auth/me') || url.includes('/auth/login');
            if (!isAuthCheck && !window.location.pathname.startsWith('/connexion')) {
                window.location.href = '/connexion';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
