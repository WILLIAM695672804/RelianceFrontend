import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'guest' | 'client' | 'technician';

interface AuthContextType {
    isAuthenticated: boolean;
    role: UserRole;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    loginAsClient: () => void;
    loginAsTechnician: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Par défaut, l'utilisateur est un visiteur (Guest)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [role, setRole] = useState<UserRole>('guest');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    const loginAsClient = () => {
        setIsAuthenticated(true);
        setRole('client');
        setIsAuthModalOpen(false);
    };

    const loginAsTechnician = () => {
        setIsAuthenticated(true);
        setRole('technician');
        setIsAuthModalOpen(false);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole('guest');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            role,
            isAuthModalOpen,
            openAuthModal,
            closeAuthModal,
            loginAsClient,
            loginAsTechnician,
            logout
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
