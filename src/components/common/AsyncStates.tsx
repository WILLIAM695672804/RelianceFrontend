import React from 'react';

/**
 * États asynchrones réutilisables (chargement / vide / erreur).
 * À utiliser partout pour remplacer les `isLoading` réinventés page par page.
 */

export const Loading: React.FC<{ label?: string }> = ({ label = 'Chargement…' }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '2rem', color: '#64748b' }}>
        <span
            style={{
                width: 22, height: 22, display: 'inline-block',
                border: '3px solid rgba(99,102,241,.25)', borderTopColor: '#6366f1',
                borderRadius: '50%', animation: 'rl-spin .8s linear infinite',
            }}
        />
        {label}
        <style>{`@keyframes rl-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
);

export const EmptyState: React.FC<{ icon?: string; title?: string; message?: string; action?: React.ReactNode }> = ({
    icon = 'inbox', title = 'Aucune donnée', message, action,
}) => (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', opacity: 0.5 }}>{icon}</span>
        <p style={{ fontWeight: 700, marginTop: 8, color: '#475569' }}>{title}</p>
        {message && <p style={{ fontSize: '.9rem', marginTop: 4 }}>{message}</p>}
        {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
);

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({
    message = 'Une erreur est survenue.', onRetry,
}) => (
    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#b91c1c' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '2.25rem' }}>error</span>
        <p style={{ fontWeight: 600, marginTop: 8 }}>{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                style={{ marginTop: 12, padding: '.5rem 1rem', borderRadius: 999, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
            >
                Réessayer
            </button>
        )}
    </div>
);
