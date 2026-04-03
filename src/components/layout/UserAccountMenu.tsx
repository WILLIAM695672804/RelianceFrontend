import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';
import './UserAccountMenu.css';

const UserAccountMenu: React.FC = () => {
    const { user, role, openLogoutConfirm } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        openLogoutConfirm();
    };

    // Fermer le dropdown lors d'un clic extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format du rôle pour l'affichage
    const displayRole = role === 'client' ? 'Client' : role === 'technicien' ? 'Technicien' : role === 'agence' ? 'Agence' : 'Utilisateur';

    return (
        <div className="user-account-menu-container" ref={dropdownRef}>
            {/* Avatar Button */}
            <div className="tech-topbar-avatar" onClick={toggleDropdown}>
                <span className="material-symbols-outlined">account_circle</span>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="user-account-dropdown">
                    <div className="dropdown-header">
                        <span className="dropdown-name">{user?.name || 'Utilisateur'}</span>
                        <span className="dropdown-role">{displayRole}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={handleLogoutClick}>
                        <FaSignOutAlt className="dropdown-icon" />
                        Se déconnecter
                    </button>
                </div>
            )}

        </div>
    );
};

export default UserAccountMenu;
