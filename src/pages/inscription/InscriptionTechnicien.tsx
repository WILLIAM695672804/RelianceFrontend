import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaTools, FaFileAlt, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/layout/Footer';
import '../../styles/variables.css';
import './InscriptionTechnicien.css';

const competencesOptions = [
    'Électricité',
    'Plomberie',
    'Climatisation / Froid',
    'Vidéosurveillance (CCTV)',
    'Alarme & Sécurité',
    'Contrôle d\'accès',
    'Réseau & Câblage',
    'GPS & Tracking',
    'Maintenance générale',
    'Installation solaire',
];

const InscriptionTechnicien: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirmation: '',
        bio: '',
        competences: [] as string[],
        acceptTerms: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const target = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: target.type === 'checkbox' ? target.checked : value,
        });
    };

    const handleCompetenceToggle = (comp: string) => {
        setFormData(prev => ({
            ...prev,
            competences: prev.competences.includes(comp)
                ? prev.competences.filter(c => c !== comp)
                : [...prev.competences, comp],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.passwordConfirmation) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        if (formData.competences.length === 0) {
            setError('Veuillez sélectionner au moins une compétence');
            return;
        }

        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                password_confirmation: formData.passwordConfirmation,
                role: 'technicien',
                bio: formData.bio,
                competences: formData.competences,
            });
            navigate('/technicien/dashboard');
        } catch (err: any) {
            const data = err.response?.data;
            if (data?.errors) {
                const firstError = Object.values(data.errors).flat()[0] as string;
                setError(firstError);
            } else {
                setError(data?.message || 'Une erreur est survenue');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-inscription-technicien">

            <section className="it-section">
                <div className="container">
                    <h1 className="it-page-title">Inscription Technicien</h1>
                    <p className="it-subtitle">
                        Rejoignez notre réseau de professionnels et trouvez des missions près de chez vous
                    </p>

                    <div className="it-card">
                        {error && (
                            <div style={{
                                background: 'rgba(220,38,38,0.1)',
                                color: '#dc2626',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                fontSize: '0.9rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="it-row">
                                <div className="it-field">
                                    <label className="it-label">
                                        <FaUser className="it-label-icon" />
                                        Nom complet
                                    </label>
                                    <input type="text" name="name" className="it-input" placeholder="Votre nom complet"
                                        value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="it-field">
                                    <label className="it-label">
                                        <FaEnvelope className="it-label-icon" />
                                        Adresse email
                                    </label>
                                    <input type="email" name="email" className="it-input" placeholder="Votre adresse email"
                                        value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="it-row">
                                <div className="it-field">
                                    <label className="it-label">
                                        <FaPhone className="it-label-icon" />
                                        Téléphone
                                    </label>
                                    <input type="tel" name="phone" className="it-input" placeholder="+237 6XX XXX XXX"
                                        value={formData.phone} onChange={handleChange} required />
                                </div>
                                <div className="it-field">
                                    <label className="it-label">
                                        <FaFileAlt className="it-label-icon" />
                                        Présentation
                                    </label>
                                    <textarea name="bio" className="it-input it-textarea" placeholder="Décrivez brièvement votre expérience"
                                        value={formData.bio} onChange={handleChange} rows={2} />
                                </div>
                            </div>

                            <div className="it-field">
                                <label className="it-label">
                                    <FaTools className="it-label-icon" />
                                    Compétences <span className="it-required">*</span>
                                </label>
                                <div className="it-competences-grid">
                                    {competencesOptions.map(comp => (
                                        <button key={comp} type="button"
                                            className={`it-comp-tag ${formData.competences.includes(comp) ? 'active' : ''}`}
                                            onClick={() => handleCompetenceToggle(comp)}>
                                            {comp}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="it-row">
                                <div className="it-field">
                                    <label className="it-label">
                                        <FaLock className="it-label-icon" />
                                        Mot de passe
                                    </label>
                                    <input type="password" name="password" className="it-input" placeholder="Minimum 8 caractères"
                                        value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="it-field">
                                    <label className="it-label">
                                        <FaLock className="it-label-icon" />
                                        Confirmer
                                    </label>
                                    <input type="password" name="passwordConfirmation" className="it-input" placeholder="Confirmez le mot de passe"
                                        value={formData.passwordConfirmation} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="it-terms">
                                <label className="it-checkbox-label">
                                    <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms}
                                        onChange={handleChange} required />
                                    J'accepte les <a href="#">conditions d'utilisation</a> et la{' '}
                                    <a href="#">politique de confidentialité</a>
                                </label>
                            </div>

                            <button type="submit" className="it-submit-btn" disabled={loading}>
                                {loading ? <><FaSpinner className="spin-icon" /> Création...</> : 'Créer mon compte technicien'}
                            </button>
                        </form>
                    </div>

                    <p className="it-login-text">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/connexion" className="it-login-link">
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default InscriptionTechnicien;
