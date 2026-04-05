import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import UserAccountMenu from '../components/layout/UserAccountMenu';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('users')) return 'Gestion des Utilisateurs';
        if (path.includes('technicians')) return 'Approbation Techniciens';
        if (path.includes('kyc')) return 'Validation KYC';
        return 'Administration';
    };

    const navLinks = [
        { to: "/admin/dashboard", icon: "dashboard", label: "Dashboard" },
        { to: "/admin/users", icon: "group", label: "Utilisateurs" },
        { to: "/admin/technicians", icon: "engineering", label: "Techniciens" },
        { to: "/admin/kyc", icon: "verified_user", label: "KYC" },
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
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="material-symbols-outlined">settings</span>
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
