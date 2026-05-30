import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const wrap: React.CSSProperties = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#f8fafc' };
const card: React.CSSProperties = { width: '100%', maxWidth: 420, background: '#fff', borderRadius: 20, padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' };
const input: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '1rem', marginTop: 6, marginBottom: 12 };
const btn: React.CSSProperties = { width: '100%', padding: '0.85rem', borderRadius: 999, border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: '0.75rem' };

const ResetPassword: React.FC = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get('token') || '';
    const email = params.get('email') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
    const [error, setError] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 8) { setError('Le mot de passe doit faire au moins 8 caractères.'); return; }
        if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
        setStatus('loading');
        try {
            await authService.resetPassword({ token, email, password, password_confirmation: confirm });
            setStatus('done');
            setTimeout(() => navigate('/connexion'), 1800);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Token invalide ou expiré.');
            setStatus('idle');
        }
    };

    if (!token || !email) {
        return (
            <div style={wrap}><div style={card}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Lien invalide</h1>
                <p style={{ color: '#64748b', marginTop: 8 }}>Ce lien de réinitialisation est incomplet ou expiré.</p>
                <Link to="/mot-de-passe-oublie" style={{ ...btn, display: 'block', textAlign: 'center', textDecoration: 'none' }}>Demander un nouveau lien</Link>
            </div></div>
        );
    }

    return (
        <div style={wrap}>
            <div style={card}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Nouveau mot de passe</h1>
                {status === 'done' ? (
                    <p style={{ color: '#16a34a', fontWeight: 600 }}>Mot de passe réinitialisé ! Redirection vers la connexion…</p>
                ) : (
                    <form onSubmit={submit}>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Pour le compte <strong>{email}</strong></p>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Nouveau mot de passe</label>
                        <input style={input} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 caractères" />
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Confirmer</label>
                        <input style={input} type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                        {error && <p style={{ color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}
                        <button style={btn} type="submit" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Réinitialisation…' : 'Réinitialiser'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
