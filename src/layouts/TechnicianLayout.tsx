import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import UserAccountMenu from '../components/layout/UserAccountMenu';
import ProposalNotifier from '../components/notifications/ProposalNotifier';
import './TechnicianLayout.css';

const TechnicianLayout: React.FC = () => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('planning')) return 'Planning';
        if (path.includes('cockpit') || path.includes('radar')) return 'Opérations en Direct';
        if (path.includes('wallet') || path.includes('retrait')) return 'Finance & Portefeuille';
        if (path.includes('identite')) return 'Profil Professionnel';
        if (path.includes('audit-sla')) return 'Audit SLA';
        if (path.includes('competences')) return 'Matrice de Compétences';
        return 'Espace Technicien';
    };

    const navLinks = [
        { to: "/technicien/dashboard", icon: "dashboard", label: "Home" },
        { to: "/technicien/radar", icon: "explore", label: "Radar" },
        { to: "/technicien/planning", icon: "event_note", label: "Planning" },
        { to: "/technicien/wallet", icon: "account_balance_wallet", label: "Funds" },
        { to: "/technicien/identite", icon: "person", label: "Profile" }
    ];

    return (
        <div className="tech-layout-root">
            
            {/* Top App Bar */}
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

            {/* Global proposal notifications for technician */}
            <ProposalNotifier />

            {/* Floating Horizontal NavBar — Centered at bottom */}
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

export default TechnicianLayout;
