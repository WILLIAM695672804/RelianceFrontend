import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    FaTools,
    FaMapMarkedAlt,
    FaUserCheck,
    FaFileInvoiceDollar,
    FaTachometerAlt,
    FaCalendarAlt,
    FaWallet,
    FaUserCircle,
    FaBars,
    FaTimes,
    FaSignOutAlt
} from 'react-icons/fa';
import '../styles/variables.css';
import './TechnicianLayout.css';

const TechnicianLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const menuItems = [
        {
            category: 'Administration',
            items: [
                { label: 'Compétences', path: '/technicien/competences', icon: <FaTools /> },
                { label: 'Zone d\'intervention', path: '/technicien/zone', icon: <FaMapMarkedAlt /> },
                { label: 'Vérification (KYC)', path: '/technicien/verification', icon: <FaUserCheck /> },
                { label: 'Abonnement', path: '/technicien/abonnement', icon: <FaFileInvoiceDollar /> },
            ]
        },
        {
            category: 'Opérationnel',
            items: [
                { label: 'Dashboard', path: '/technicien/dashboard', icon: <FaTachometerAlt /> },
                { label: 'Planning', path: '/technicien/planning', icon: <FaCalendarAlt /> },
            ]
        },
        {
            category: 'Finance',
            items: [
                { label: 'Portefeuille', path: '/technicien/wallet', icon: <FaWallet /> },
            ]
        },
        {
            category: 'Social',
            items: [
                { label: 'Mon Profil', path: '/technicien/profil', icon: <FaUserCircle /> },
            ]
        }
    ];

    return (
        <div className="technician-layout">
            {/* Sidebar */}
            <aside className={`tech-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2 className="brand-title">Reliance <span>Pro</span></h2>
                    <button className="close-sidebar-btn" onClick={toggleSidebar}>
                        <FaTimes />
                    </button>
                </div>

                <div className="sidebar-content">
                    {menuItems.map((group, index) => (
                        <div key={index} className="menu-group">
                            <h3 className="group-title">{group.category}</h3>
                            <ul className="menu-list">
                                {group.items.map((item) => (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`menu-link ${isActive(item.path) ? 'active' : ''}`}
                                        >
                                            <span className="menu-icon">{item.icon}</span>
                                            <span className="menu-label">{item.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <button className="logout-btn">
                        <FaSignOutAlt />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="tech-main-content">
                <header className="tech-header">
                    <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                    <div className="header-status">
                        <span className="status-badge online">En Ligne</span>
                        <span className="user-name">Technicien Test</span>
                    </div>
                </header>

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default TechnicianLayout;
