import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaUser } from 'react-icons/fa';
import './Header.css';

interface DropdownItem {
    label: string;
    href: string;
    isRoute?: boolean;
}

interface NavItem {
    label: string;
    href: string;
    isRoute?: boolean;
    dropdown?: DropdownItem[];
}

const navItems: NavItem[] = [
    { label: 'Accueil', href: '/', isRoute: true },
    { label: 'Actualités', href: '/actualites', isRoute: true },
    {
        label: 'A propos',
        href: '#mission',
        dropdown: [
            { label: 'Qui sommes nous', href: '/qui-sommes-nous', isRoute: true },
            { label: 'Equipe', href: '/equipe', isRoute: true },
            { label: 'Partenaires', href: '#partenaires' },
        ],
    },
    { label: 'Entreprises', href: '/entreprises', isRoute: true },
    { label: 'Candidats', href: '/candidats', isRoute: true },
    {
        label: 'Services',
        href: '#services',
        dropdown: [
            { label: 'Dépannage & Maintenance', href: '/depannage-maintenance', isRoute: true },
            { label: 'Installation & Sécurité', href: '/installation-securite', isRoute: true },
        ],
    },
    { label: 'Contact', href: '/contact', isRoute: true },
];

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleDropdownEnter = (label: string) => {
        setOpenDropdown(label);
    };

    const handleDropdownLeave = () => {
        setOpenDropdown(null);
    };

    const isActive = (href: string) => {
        if (href === '/') return location.pathname === '/';
        return location.pathname.startsWith(href);
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <h2 className="logo-text">Reliance</h2>
                        <span className="logo-subtitle">Plateforme de Services<br />Techniques</span>
                    </Link>

                    {/* Navigation Menu */}
                    <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                        {navItems.map((item) => (
                            <li
                                key={item.label}
                                className={`nav-item ${item.dropdown ? 'has-dropdown' : ''}`}
                                onMouseEnter={() => item.dropdown && handleDropdownEnter(item.label)}
                                onMouseLeave={handleDropdownLeave}
                            >
                                {item.isRoute ? (
                                    <Link
                                        to={item.href}
                                        className={`nav-link ${isActive(item.href) ? 'active-link' : ''}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                        {item.dropdown && <FaChevronDown className="dropdown-icon" />}
                                    </Link>
                                ) : (
                                    <a
                                        href={item.href}
                                        className={`nav-link`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                        {item.dropdown && <FaChevronDown className="dropdown-icon" />}
                                    </a>
                                )}

                                {item.dropdown && openDropdown === item.label && (
                                    <ul className="dropdown-menu">
                                        {item.dropdown.map((sub) => (
                                            <li key={sub.label}>
                                                {sub.isRoute ? (
                                                    <Link to={sub.href} onClick={() => { setIsMobileMenuOpen(false); setOpenDropdown(null); }}>
                                                        {sub.label}
                                                    </Link>
                                                ) : (
                                                    <a href={sub.href} onClick={() => { setIsMobileMenuOpen(false); setOpenDropdown(null); }}>
                                                        {sub.label}
                                                    </a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Connexion Button */}
                    <Link to="/connexion" className="btn-connexion">
                        <FaUser className="connexion-icon" />
                        Connexion
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
