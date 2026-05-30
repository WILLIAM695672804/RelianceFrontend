import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';

const wrap: React.CSSProperties = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f8fafc' };
const card: React.CSSProperties = { width: '100%', maxWidth: 420, background: '#fff', borderRadius: 20, padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' };
const input: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '1rem', marginTop: 6 };
const btn: React.CSSProperties = { width: '100%', padding: '0.85rem', borderRadius: 999, border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '1.25rem' };

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');
    const [error, setError] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatus('loading');
        try {
            await authService.forgotPassword(email);
            setStatus('sent');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Impossible d\'envoyer le lien. Vérifiez l\'adresse.');
            setStatus('idle');
        }
    };

    return (
        <div style={wrap}>
            <div style={card}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Mot de passe oublié</h1>
                {status === 'sent' ? (
                    <>
                        <p style={{ color: '#16a34a', fontWeight: 600 }}>
                            Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé par e-mail.
                        </p>
                        <Link to="/connexion" style={{ ...btn, display: 'block', textAlign: 'center', textDecoration: 'none' }}>Retour à la connexion</Link>
                    </>
                ) : (
                    <form onSubmit={submit}>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                            Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation.
                        </p>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>E-mail</label>
                        <input style={input} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.cm" />
                        {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: 10 }}>{error}</p>}
                        <button style={btn} type="submit" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Envoi…' : 'Envoyer le lien'}
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
                            <Link to="/connexion" style={{ color: '#6366f1' }}>Retour à la connexion</Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
