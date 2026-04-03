import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import UserAccountMenu from '../components/layout/UserAccountMenu';
import './ClientModernLayout.css';

const ClientModernLayout: React.FC = () => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Tableau de Bord';
        if (path.includes('demande')) return 'Nouvelle Demande';
        if (path.includes('suivi')) return 'Suivi Live';
        if (path.includes('wallet')) return 'Portefeuille';
        if (path.includes('profil')) return 'Mon Profil';
        return 'Espace Client';
    };

    const navLinks = [
        { to: "/espace-client/dashboard", icon: "space_dashboard", label: "Home" },
        { to: "/espace-client/demande", icon: "build_circle", label: "Demande" },
        { to: "/espace-client/suivi", icon: "radar", label: "Suivi" },
        { to: "/espace-client/wallet", icon: "account_balance_wallet", label: "Wallet" },
        { to: "/espace-client/profil", icon: "person", label: "Profil" },
    ];

    return (
        <div className="tech-layout-root">
            
            {/* Top App Bar — Same as Technician */}
            <header className="tech-topbar">
                <div className="tech-topbar-inner">
                    <h1 className="tech-topbar-title">{getPageTitle()}</h1>
                    <div className="tech-topbar-actions">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="material-symbols-outlined">settings</span>
                        <UserAccountMenu />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="tech-layout-main">
                <Outlet />
            </main>

            {/* Floating Horizontal NavBar — Same as Technician */}
            <nav className="tech-floating-nav">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => 
                            `tech-dock-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span 
                            className="material-symbols-outlined"
                            style={{
                                fontVariationSettings: location.pathname.includes(link.to) 
                                    ? "'FILL' 1" 
                                    : "'FILL' 0"
                            }}
                        >
                            {link.icon}
                        </span>
                        <span className="tech-dock-label">{link.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default ClientModernLayout;
