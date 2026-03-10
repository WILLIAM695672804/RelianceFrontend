import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    FaTools,
    FaMapMarkedAlt,
    FaIdCard,
    FaWallet,
    FaUsers,
    FaBars,
    FaSignOutAlt,
    FaClipboardList,
    FaQuestionCircle,
    FaBell,
    FaSearch,
    FaPlus,
    FaBuilding
} from 'react-icons/fa';
import './TechnicianLayout.css';

const TechnicianLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // V3: B2B Affiliation Mock State (In a real app, this comes from Context/Redux)
    const isAgencyEmployee = true; // Change to false to test Independent mode
    const agencyName = "Tech Solutions S.A";

    const menuSections = [
        {
            title: "Tableau de Bord",
            links: [
                { to: "/technicien/dashboard", icon: <FaTools />, label: "Dashboard" }
            ]
        },
        {
            title: "Opérationnel",
            links: [
                { to: "/technicien/cockpit", icon: <FaMapMarkedAlt />, label: "Cockpit de Terrain" }
            ]
        },

        {
            // V3: Finance is locked or read-only for agency employees
            title: isAgencyEmployee ? "Finance (Géré par Agence)" : "Finance",
            links: [
                { to: "/technicien/wallet", icon: <FaWallet />, label: isAgencyEmployee ? "Portefeuille (Lecture Seule)" : "Portefeuille" }
            ]
        },
        {
            title: "Réputation & Audit",
            links: [
                { to: "/technicien/identite", icon: <FaIdCard />, label: "Mon Identité & Profil" },
                { to: "/technicien/audit-sla", icon: <FaClipboardList />, label: "Logs SLA & Audit" },
                { to: "/technicien/social", icon: <FaUsers />, label: "Mur Social" }
            ]
        }
    ];

    // Helper to extract a nice title from the URL for the header
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('planning')) return 'Agendas';
        if (path.includes('zone')) return 'Zones';
        if (path.includes('mission')) return 'Mission';
        if (path.includes('competences')) return 'Compétences';
        if (path.includes('verification')) return 'Vérification';
        if (path.includes('abonnement')) return 'Abonnement';
        if (path.includes('wallet')) return 'Finance';
        if (path.includes('profil')) return 'Profil Public';
        if (path.includes('avis')) return 'Avis';
        if (path.includes('social')) return 'Communauté';
        if (path.includes('trophees')) return 'Trophées';
        return 'Espace Technicien';
    };

    return (
        <div className="tech-layout-container">
            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`tech-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="tech-sidebar-header">
                    <div className="tech-logo">
                        <div className="tech-logo-icon">R</div>
                        Reliance Pro
                    </div>
                </div>

                <div className="tech-sidebar-content">
                    {menuSections.map((section, idx) => (
                        <div key={idx} className="tech-nav-section">
                            <h3 className="tech-nav-title">{section.title}</h3>
                            <ul className="tech-nav-menu">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx} className="tech-nav-item">
                                        <NavLink
                                            to={link.to}
                                            className={({ isActive }) =>
                                                `tech-nav-link ${isActive ? 'active marketive-style' : ''}`
                                            }
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="tech-nav-icon">{link.icon}</span>
                                            {link.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="tech-support-section">
                    <NavLink to="/support" className="tech-nav-link">
                        <span className="tech-nav-icon"><FaQuestionCircle /></span>
                        Centre d'Aide
                    </NavLink>
                    <button className="tech-nav-link" style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', marginTop: '10px', color: '#ef4444' }}>
                        <span className="tech-nav-icon"><FaSignOutAlt /></span>
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="tech-main-content">
                {/* Header */}
                <header className="tech-header">
                    <div className="header-left">
                        <button className="mobile-toggle" onClick={() => setSidebarOpen(true)}>
                            <FaBars />
                        </button>
                        <h1 className="view-title">
                            {getPageTitle()}
                            <span className="project-tag">Reliance Pro</span>
                        </h1>
                    </div>

                    <div className="header-search">
                        <FaSearch className="search-icon" />
                        <input type="text" className="search-input" placeholder="Search..." />
                    </div>

                    <div className="header-right">
                        <button className="icon-button">
                            <FaBell />
                        </button>
                        <button className="icon-button primary-solid">
                            <FaPlus />
                        </button>

                        {/* V3: Agency Badge */}
                        {isAgencyEmployee && (
                            <div className="agency-badge-top" style={{
                                background: '#f8fafc', 
                                border: '1px solid #e2e8f0', 
                                padding: '4px 12px', 
                                borderRadius: '20px', 
                                fontSize: '0.85rem', 
                                fontWeight: 600, 
                                color: '#475569',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <FaBuilding style={{color: '#94a3b8'}} />
                                {agencyName}
                            </div>
                        )}

                        <div className="tech-user-menu">
                            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="tech-avatar" />
                        </div>
                    </div>
                </header>

                <div className="tech-page-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default TechnicianLayout;
