import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import authService from '../services/authService';
import type { RegisterData, LoginData } from '../services/authService';

export type UserRole = 'guest' | 'client' | 'technicien' | 'agence' | 'admin';

interface AuthUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
    roles: { name: string }[];
    email_verified_at?: string;
    technician_profile?: any;
    agency_profile?: any;
    two_factor_enabled?: boolean;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: AuthUser | null;
    role: UserRole;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    isLogoutConfirmOpen: boolean;
    openLogoutConfirm: () => void;
    closeLogoutConfirm: () => void;
    login: (data: LoginData) => Promise<{ requires_2fa?: boolean; user?: AuthUser }>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUserRole(user: AuthUser | null): UserRole {
    if (!user || !user.roles || user.roles.length === 0) return 'guest';
    return user.roles[0].name as UserRole;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState<boolean>(false);

    const isAuthenticated = !!user;
    const role = getUserRole(user);

    // Restaurer la session au montage — le cookie httpOnly est envoyé automatiquement
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await authService.getMe();
                setUser(data.user);
            } catch {
                // No valid session cookie — user is not authenticated
                setUser(null);
            }
            setIsLoading(false);
        };
        restoreSession();
    }, []);

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const openLogoutConfirm = () => setIsLogoutConfirmOpen(true);
    const closeLogoutConfirm = () => setIsLogoutConfirmOpen(false);

    const login = useCallback(async (data: LoginData): Promise<{ requires_2fa?: boolean; user?: AuthUser }> => {
        try {
            const response = await authService.login(data);
            // Session Sanctum établie côté serveur (cookie de session httpOnly)
            setUser(response.user);
            setIsAuthModalOpen(false);
            return { user: response.user };
        } catch (error: any) {
            if (error.response?.status === 403 && error.response?.data?.requires_2fa) {
                return { requires_2fa: true };
            }
            throw error;
        }
    }, []);

    const register = useCallback(async (data: RegisterData): Promise<void> => {
        const response = await authService.register(data);
        // Session Sanctum établie côté serveur (cookie de session httpOnly)
        setUser(response.user);
        setIsAuthModalOpen(false);
    }, []);

    const refreshUser = useCallback(async (): Promise<void> => {
        try {
            const data = await authService.getMe();
            setUser(data.user);
        } catch {
            // silently fail
        }
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await authService.logout();
        } catch {
            // Ignore error, we logout locally anyway
        }
        // Le serveur invalide la session et efface le cookie
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            user,
            role,
            isAuthModalOpen,
            openAuthModal,
            closeAuthModal,
            isLogoutConfirmOpen,
            openLogoutConfirm,
            closeLogoutConfirm,
            login,
            register,
            logout,
            refreshUser,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
