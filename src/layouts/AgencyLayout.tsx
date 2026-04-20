import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import UserAccountMenu from '../components/layout/UserAccountMenu';
import NotificationBell from '../components/notifications/NotificationBell';
import './AgencyLayout.css';

const AgencyLayout: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard Agence';
    if (path.includes('membres')) return 'Gestion des Membres';
    if (path.includes('profil')) return 'Profil Agence';
    if (path.includes('notifications')) return 'Notifications';
    return 'Espace Agence';
  };

  const navLinks = [
    { to: '/agence/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/agence/membres', icon: 'groups', label: 'Membres' },
    { to: '/agence/profil', icon: 'business', label: 'Profil' },
  ];

  return (
    <div className="tech-layout-root">
      <header className="tech-topbar">
        <div className="tech-topbar-inner">
          <h1 className="tech-topbar-title">{getPageTitle()}</h1>
          <div className="tech-topbar-actions">
            <NotificationBell basePath="/agence" />
            <UserAccountMenu />
          </div>
        </div>
      </header>
      <main className="tech-layout-main"><Outlet /></main>
      <nav className="tech-floating-nav">
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `tech-dock-link ${isActive ? 'active' : ''}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: location.pathname.includes(link.to) ? "'FILL' 1" : "'FILL' 0" }}>{link.icon}</span>
            <span className="tech-dock-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AgencyLayout;
