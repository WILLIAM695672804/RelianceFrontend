import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Send httpOnly cookies with every request
});

// Flag pour éviter les boucles de refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });
    failedQueue = [];
};

// Intercepteur: gère les erreurs 401 avec tentative de refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si 401 et que ce n'est pas déjà un retry
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/login') &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            if (isRefreshing) {
                // Si un refresh est déjà en cours, mettre en file d'attente
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await api.post('/auth/refresh');
                // Cookie is automatically updated by the server response
                processQueue(null);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                // Refresh échoué → déconnexion
                window.location.href = '/connexion';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Pas authentifié → redirection
        if (error.response?.status === 401) {
            window.location.href = '/connexion';
        }

        return Promise.reject(error);
    }
);

export default api;
