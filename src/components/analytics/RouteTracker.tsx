import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import analyticsService from '../../services/analyticsService';

/** Enregistre un événement « page_view » à chaque changement de page d'un utilisateur connecté. */
const RouteTracker: React.FC = () => {
    const { pathname } = useLocation();
    const { isAuthenticated } = useAuth();
    const derniere = useRef<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || derniere.current === pathname) return;
        derniere.current = pathname;
        void analyticsService.track('page_view', { path: pathname });
    }, [pathname, isAuthenticated]);

    return null;
};

export default RouteTracker;
