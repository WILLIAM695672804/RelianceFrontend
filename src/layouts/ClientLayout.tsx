import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaWrench,
    FaWallet,
    FaUserCircle,
    FaBars,
    FaBell,
    FaSignOutAlt,
    FaQuestionCircle,
    FaLifeRing
} from 'react-icons/fa';
import './ClientLayout.css';

const ClientLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const menuSections = [
        {
            title: "Général",
            links: [
                { to: "/client/dashboard", icon: <FaHome />, label: "Accueil" },
                { to: "/client/demande", icon: <FaWrench />, label: "Nouvelle Demande" }
            ]
        },
        {
            title: "Mes Activités",
            links: [
                { to: "/client/suivi", icon: <FaLifeRing />, label: "Suivi des Interventions" },
                { to: "/client/wallet", icon: <FaWallet />, label: "Portefeuille & Escrow" }
            ]
        },
        {
            title: "Mon Compte",
            links: [
                { to: "/client/profil", icon: <FaUserCircle />, label: "Mon Profil" }
            ]
        }
    ];

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Tableau de Bord';
        if (path.includes('demande')) return 'Demande d\'Intervention';
        if (path.includes('suivi')) return 'Suivi';
        if (path.includes('wallet')) return 'Mon Portefeuille';
        if (path.includes('profil')) return 'Profil Client';
        if (path.includes('2fa')) return 'Sécurité 2FA';
        return 'Espace Client';
    };

    return (
        <div className="client-layout-container">
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`client-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="client-sidebar-header">
                    <div className="client-logo">
                        <div className="client-logo-icon">R</div>
                        Reliance
                    </div>
                </div>

                <div className="client-sidebar-content">
                    {menuSections.map((section, idx) => (
                        <div key={idx} className="client-nav-section">
                            <h3 className="client-nav-title">{section.title}</h3>
                            <ul className="client-nav-menu">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx} className="client-nav-item">
                                        <NavLink
                                            to={link.to}
                                            className={({ isActive }) =>
                                                `client-nav-link ${isActive ? 'active' : ''}`
                                            }
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="client-nav-icon">{link.icon}</span>
                                            {link.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="client-support-section">
                     {/* Modern SOS / Help box */}
                    <div className="sos-box">
                        <h4>Besoin d'aide ?</h4>
                        <p>Appelez le <br/><strong>+237 600 00 00 00</strong></p>
                    </div>

                    <NavLink to="/support" className="client-nav-link" style={{ marginTop: '16px' }}>
                        <span className="client-nav-icon"><FaQuestionCircle /></span>
                        FAQ
                    </NavLink>
                    <button className="client-nav-link" style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', marginTop: '10px', color: '#ef4444', cursor: 'pointer' }}>
                        <span className="client-nav-icon"><FaSignOutAlt /></span>
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="client-main-content">
                {/* Header */}
                <header className="client-header">
                    <div className="header-left">
                        <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
                            <FaBars />
                        </button>
                        <h1 className="view-title">
                            {getPageTitle()}
                        </h1>
                    </div>

                    <div className="header-right">
                        <button className="icon-button">
                            <FaBell />
                        </button>

                        <div className="client-user-menu">
                            <div className="client-avatar-placeholder">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                <div className="client-page-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ClientLayout;
