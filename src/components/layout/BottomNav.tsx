import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserCircle, FaWrench, FaCommentDots, FaWallet } from 'react-icons/fa';
import './BottomNav.css';

const BottomNav: React.FC = () => {
    const { isAuthenticated, openAuthModal } = useAuth();
    const location = useLocation();

    // Check if the route is active
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="bottom-nav-container">
            <nav className="bottom-nav">
                {/* Découverte (Social Feed) - Accessible à tous */}
                <Link to="/actualites" className={`nav-item ${isActive('/actualites') ? 'active' : ''}`}>
                    <FaHome className="nav-icon" />
                    <span>Découverte</span>
                </Link>

                {isAuthenticated ? (
                    /* --- CONNECTED STATE --- */
                    <>
                        <Link to="/client/dashboard" className={`nav-item ${isActive('/client/dashboard') ? 'active' : ''}`}>
                            <FaWrench className="nav-icon" />
                            <span>Demandes</span>
                        </Link>
                        
                        <Link to="/client/suivi" className={`nav-item ${isActive('/client/suivi') ? 'active' : ''}`}>
                            <FaCommentDots className="nav-icon" />
                            <span>Messages</span>
                        </Link>

                        <Link to="/client/wallet" className={`nav-item ${isActive('/client/wallet') ? 'active' : ''}`}>
                            <FaWallet className="nav-icon" />
                            <span>Wallet</span>
                        </Link>

                        <Link to="/client/profil" className={`nav-item ${isActive('/client/profil') ? 'active' : ''}`}>
                            <FaUserCircle className="nav-icon" />
                            <span>Profil</span>
                        </Link>
                    </>
                ) : (
                    /* --- GUEST STATE --- */
                    <>
                        <div className="nav-item" onClick={openAuthModal}>
                            <FaUserCircle className="nav-icon" />
                            <span>Se Connecter</span>
                        </div>
                    </>
                )}
            </nav>
        </div>
    );
};

export default BottomNav;
