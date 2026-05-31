import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer id="contact" className="footer">
            <div className="container">
                <div className="footer-grid">
                    {/* Column 1: Logo & Mission */}
                    <div className="footer-column">
                        <h3 className="footer-logo">Reliance</h3>
                        <p className="footer-mission">
                            Venir en aide aux clients en les connectant avec des techniciens qualifiés pour répondre à leurs besoins de dépannage et maintenance.
                        </p>
                        <div className="social-links">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                        </div>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="footer-column">
                        <h4 className="footer-title">Navigation</h4>
                        <ul className="footer-links">
                            <li><a href="#accueil">Accueil</a></li>
                            <li><a href="#mission">À propos</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li><Link to="/cgu">CGU</Link></li>
                            <li><Link to="/confidentialite">Confidentialité</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div className="footer-column">
                        <h4 className="footer-title">Contact</h4>
                        <ul className="footer-contact">
                            <li>
                                <FaMapMarkerAlt className="contact-icon" />
                                <span>Yaoundé, Cameroun</span>
                            </li>
                            <li>
                                <FaEnvelope className="contact-icon" />
                                <span>contact@reliance.cm</span>
                            </li>
                            <li>
                                <FaPhone className="contact-icon" />
                                <span>+237 XXX XXX XXX</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div className="footer-column">
                        <h4 className="footer-title">Newsletter</h4>
                        <p className="newsletter-text">
                            Restez informé des nouvelles fonctionnalités et actualités.
                        </p>
                        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); const i = (e.currentTarget.elements.namedItem('nl') as HTMLInputElement); if (i?.value) { alert('Merci ! Vous êtes abonné à la newsletter.'); i.value = ''; } }}>
                            <input
                                type="email"
                                name="nl"
                                required
                                placeholder="Votre email"
                                className="newsletter-input"
                            />
                            <button type="submit" className="btn btn-primary">
                                S'abonner
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Reliance Platform. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
