import React from 'react';
import Footer from '../components/layout/Footer';

const sectionStyle: React.CSSProperties = { maxWidth: 820, margin: '0 auto', padding: '3rem 1.5rem', lineHeight: 1.7, color: '#334155' };

const CGU_CONTENT = {
    title: 'Conditions Générales d\'Utilisation',
    intro: 'Les présentes conditions régissent l\'utilisation de la plateforme Reliance, mettant en relation des clients et des techniciens certifiés.',
    sections: [
        ['1. Objet', 'Reliance fournit une plateforme de mise en relation et de gestion d\'interventions techniques. L\'inscription vaut acceptation des présentes conditions.'],
        ['2. Compte utilisateur', 'Chaque utilisateur est responsable de l\'exactitude des informations fournies et de la confidentialité de ses identifiants.'],
        ['3. Paiements', 'Les paiements et recharges de portefeuille sont opérés via des prestataires sécurisés. Les fonds en escrow sont libérés à la validation de l\'intervention.'],
        ['4. Responsabilités', 'Reliance agit en qualité d\'intermédiaire. La qualité des prestations relève des techniciens, soumis à un processus de vérification (KYC).'],
        ['5. Résiliation', 'Tout compte peut être suspendu en cas de non-respect des présentes conditions.'],
    ],
};

const PRIVACY_CONTENT = {
    title: 'Politique de Confidentialité',
    intro: 'Reliance accorde une importance primordiale à la protection de vos données personnelles.',
    sections: [
        ['1. Données collectées', 'Nous collectons les informations de compte (nom, e-mail, téléphone), de localisation (pour le matching) et de transaction (pour le portefeuille).'],
        ['2. Utilisation', 'Vos données servent à fournir le service : mise en relation, paiements, notifications et amélioration de la plateforme.'],
        ['3. Partage', 'Vos données ne sont jamais vendues. Elles peuvent être partagées avec les techniciens concernés par une intervention et nos prestataires de paiement.'],
        ['4. Sécurité', 'Les mots de passe sont chiffrés et l\'authentification peut être renforcée par la 2FA.'],
        ['5. Vos droits', 'Vous pouvez accéder, rectifier ou supprimer vos données en nous contactant via la page Contact.'],
    ],
};

const Legal: React.FC<{ type: 'cgu' | 'privacy' }> = ({ type }) => {
    const c = type === 'cgu' ? CGU_CONTENT : PRIVACY_CONTENT;
    return (
        <div>
            <div style={sectionStyle}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>{c.title}</h1>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>{c.intro}</p>
                {c.sections.map(([h, body]) => (
                    <div key={h} style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 6, color: '#1e293b' }}>{h}</h2>
                        <p>{body}</p>
                    </div>
                ))}
                <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#94a3b8' }}>Dernière mise à jour : mai 2026.</p>
            </div>
            <Footer />
        </div>
    );
};

export default Legal;
