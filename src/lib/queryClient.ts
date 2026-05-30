import { QueryClient } from '@tanstack/react-query';

/**
 * Client TanStack Query partagé par toute l'application.
 * Valeurs par défaut adaptées à une API REST authentifiée par cookie.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 30_000,          // 30 s : évite les refetch en rafale
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});
