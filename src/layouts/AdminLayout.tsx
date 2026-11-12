import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import UserAccountMenu from '../components/layout/UserAccountMenu';
import NotificationBell from '../components/notifications/NotificationBell';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('users')) return 'Gestion des Utilisateurs';
        if (path.includes('technicians')) return 'Approbation Techniciens';
        if (path.includes('kyc')) return 'Validation KYC';
        if (path.includes('fees')) return 'Frais & Commissions';
        if (path.includes('analytics')) return 'Analytics & KPIs';
        if (path.includes('demandes')) return 'Gestion des Demandes';
        if (path.includes('messagerie')) return 'Supervision Messagerie';
        if (path.includes('litiges')) return 'Gestion des Litiges';
        if (path.includes('abonnements')) return 'Abonnements';
        if (path.includes('promotions')) return 'Promotions de Rôle';
        return 'Administration';
    };

    const navLinks = [
        { to: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
        { to: "/admin/users", icon: "group", label: "Utilisateurs" },
        { to: "/admin/technicians", icon: "engineering", label: "Techniciens" },
        { to: "/admin/kyc", icon: "verified_user", label: "KYC" },
        { to: "/admin/demandes", icon: "assignment", label: "Demandes" },
        { to: "/admin/fees", icon: "paid", label: "Frais" },
        { to: "/admin/analytics", icon: "analytics", label: "Analytics" },
        { to: "/admin/carte", icon: "map", label: "Carte" },
        { to: "/admin/messagerie", icon: "forum", label: "Messages" },
    ];

    return (
        <div className="admin-layout-root">

            {/* Top App Bar */}
            <header className="admin-topbar">
                <div className="admin-topbar-inner">
                    <div className="admin-topbar-left">
                        <div className="admin-logo">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                            <span className="admin-logo-text">Reliance Admin</span>
                        </div>
                        <span className="admin-topbar-separator"></span>
                        <h1 className="admin-topbar-title">{getPageTitle()}</h1>
                    </div>
                    <div className="admin-topbar-actions">
                        <NotificationBell basePath="/admin" />
                        <UserAccountMenu />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="admin-layout-main">
                <Outlet />
            </main>

            {/* Floating Horizontal NavBar */}
            <nav className="admin-floating-nav">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `admin-dock-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{
                                fontVariationSettings: location.pathname.includes(link.to.split('/admin/')[1])
                                    ? "'FILL' 1"
                                    : "'FILL' 0"
                            }}
                        >
                            {link.icon}
                        </span>
                        <span className="admin-dock-label">{link.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminLayout;
