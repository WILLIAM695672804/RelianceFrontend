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
    token: string | null;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    isLogoutConfirmOpen: boolean;
    openLogoutConfirm: () => void;
    closeLogoutConfirm: () => void;
    login: (data: LoginData) => Promise<{ requires_2fa?: boolean; user?: AuthUser }>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getUserRole(user: AuthUser | null): UserRole {
    if (!user || !user.roles || user.roles.length === 0) return 'guest';
    return user.roles[0].name as UserRole;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState<boolean>(false);

    const isAuthenticated = !!user && !!token;
    const role = getUserRole(user);

    // Restaurer la session au montage
    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = localStorage.getItem('auth_token');
            if (storedToken) {
                try {
                    const data = await authService.getMe();
                    setUser(data.user);
                    setToken(storedToken);
                } catch {
                    localStorage.removeItem('auth_token');
                    setToken(null);
                    setUser(null);
                }
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
            localStorage.setItem('auth_token', response.token);
            setToken(response.token);
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
        localStorage.setItem('auth_token', response.token);
        setToken(response.token);
        setUser(response.user);
        setIsAuthModalOpen(false);
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await authService.logout();
        } catch {
            // Ignore error, we logout locally anyway
        }
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            user,
            role,
            token,
            isAuthModalOpen,
            openAuthModal,
            closeAuthModal,
            isLogoutConfirmOpen,
            openLogoutConfirm,
            closeLogoutConfirm,
            login,
            register,
            logout,
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
