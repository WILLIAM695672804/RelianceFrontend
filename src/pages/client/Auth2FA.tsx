import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getRoleDashboard } from '../../utils/roleDashboard';
import './Auth2FA.css';

const Auth2FA: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Récupérer email/password passés depuis la page de connexion
    const credentials = location.state as { email?: string; password?: string } | null;

    useEffect(() => {
        if (!credentials?.email) {
            navigate('/connexion');
            return;
        }
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [credentials, navigate]);

    const handleChange = (index: number, value: string) => {
        // Un seul chiffre par case : ni espace, ni lettre, ni collage de plusieurs caractères.
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const code = otp.join('');

        if (code.length !== 6) {
            setError('Veuillez entrer les 6 chiffres du code OTP.');
            return;
        }

        if (!credentials?.email || !credentials?.password) {
            setError('Session expirée. Veuillez vous reconnecter.');
            return;
        }

        setLoading(true);
        try {
            const result = await login({
                email: credentials.email,
                password: credentials.password,
                code: code,
            });
            // Redirection selon le rôle réel (un technicien ou un admin n'arrive pas sur l'espace client).
            navigate(getRoleDashboard(result.user?.roles?.[0]?.name ?? 'client'));
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Code invalide';
            setError(msg);
            setOtp(['', '', '', '', '', '']);
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-2fa-container">
            <div className="auth-2fa-card">
                <button className="back-button" onClick={() => navigate('/connexion')}>
                    <FaArrowLeft /> Retour
                </button>

                <div className="auth-2fa-header">
                    <div className="shield-icon-wrapper">
                        <FaShieldAlt />
                    </div>
                    <h2>Vérification en 2 étapes</h2>
                    <p>Entrez le code à 6 chiffres de votre application d'authentification.</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(220,38,38,0.1)',
                        color: '#dc2626',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="auth-2fa-form">
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                className="otp-digit-input"
                            />
                        ))}
                    </div>

                    <button type="submit" className="verify-button" disabled={loading}>
                        {loading ? <><FaSpinner className="spin-icon" /> Vérification...</> : 'Vérifier & Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth2FA;
