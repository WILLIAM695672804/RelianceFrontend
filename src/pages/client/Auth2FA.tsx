import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import './Auth2FA.css';

const Auth2FA: React.FC = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if current field is filled
        if (value !== '' && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current field is empty
        if (e.key === 'Backspace' && otp[index] === '' && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length === 6) {
            // Simulate verification success
            navigate('/client/dashboard');
        } else {
            alert('Veuillez entrer les 6 chiffres du code OTP.');
        }
    };

    return (
        <div className="auth-2fa-container">
            <div className="auth-2fa-card">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Retour
                </button>

                <div className="auth-2fa-header">
                    <div className="shield-icon-wrapper">
                        <FaShieldAlt />
                    </div>
                    <h2>Vérification en 2 étapes</h2>
                    <p>Un code à 6 chiffres a été envoyé au <strong>+237 6** ** ** 12</strong>.</p>
                </div>

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

                    <button type="submit" className="verify-button">
                        Vérifier & Se connecter
                    </button>
                </form>

                <div className="auth-2fa-footer">
                    <p>Vous n'avez pas reçu de code ?</p>
                    <button className="resend-button">Renvoyer par SMS (0:59)</button>
                </div>
            </div>
        </div>
    );
};

export default Auth2FA;
