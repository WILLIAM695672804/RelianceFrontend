import React from 'react';
import Footer from '../components/layout/Footer';
import HeroCarousel from '../components/common/HeroCarousel';
import '../styles/variables.css';
import './Candidats.css';

interface JobListing {
    title: string;
    positions: number;
}

interface ExpertiseCategory {
    category: string;
    jobs: JobListing[];
}

const expertiseData: ExpertiseCategory[] = [
    {
        category: 'PLOMBERIE',
        jobs: [
            { title: 'Plombier résidentiel', positions: 12 },
            { title: 'Plombier industriel', positions: 8 },
            { title: 'Installateur sanitaire', positions: 6 },
            { title: 'Technicien en chauffage', positions: 5 },
            { title: 'Spécialiste tuyauterie', positions: 4 },
        ],
    },
    {
        category: 'ÉLECTRICITÉ',
        jobs: [
            { title: 'Électricien bâtiment', positions: 15 },
            { title: 'Électricien industriel', positions: 9 },
            { title: 'Technicien câblage réseau', positions: 7 },
            { title: 'Installateur solaire', positions: 6 },
            { title: 'Technicien haute tension', positions: 3 },
        ],
    },
    {
        category: 'SÉCURITÉ & SURVEILLANCE',
        jobs: [
            { title: 'Installateur caméras CCTV', positions: 10 },
            { title: 'Technicien alarme', positions: 8 },
            { title: 'Spécialiste contrôle d\'accès', positions: 5 },
            { title: 'Technicien vidéosurveillance IP', positions: 6 },
        ],
    },
    {
        category: 'GPS & TRACKING',
        jobs: [
            { title: 'Installateur GPS véhicule', positions: 7 },
            { title: 'Technicien géolocalisation', positions: 5 },
            { title: 'Spécialiste fleet management', positions: 4 },
            { title: 'Technicien télématique', positions: 3 },
        ],
    },
    {
        category: 'INFORMATIQUE',
        jobs: [
            { title: 'Technicien maintenance PC', positions: 11 },
            { title: 'Administrateur réseau', positions: 6 },
            { title: 'Technicien support IT', positions: 8 },
            { title: 'Installateur fibre optique', positions: 5 },
            { title: 'Réparateur smartphones', positions: 9 },
        ],
    },
    {
        category: 'MAINTENANCE GÉNÉRALE',
        jobs: [
            { title: 'Technicien polyvalent', positions: 14 },
            { title: 'Agent de maintenance', positions: 10 },
            { title: 'Climaticien / Frigoriste', positions: 7 },
            { title: 'Peintre en bâtiment', positions: 6 },
            { title: 'Menuisier / Charpentier', positions: 5 },
        ],
    },
];

const candidatSlides = [
    {
        image: '/images/candidats-hero-bg.png',
        title: <>Devenir Technicien Reliance<br />Simple et sécuritaire</>,
        subtitle: (
            <ul className="cand-hero-list" style={{ listStyle: 'none', padding: 0 }}>
                <li>- Nous vérifions et certifions votre profil professionnel</li>
                <li>- Nous vous connectons avec des clients qualifiés</li>
                <li>- Nous garantissons le paiement de vos interventions</li>
                <li>- Nous vous accompagnons dans votre développement</li>
            </ul>
        )
    },
    {
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&h=900&fit=crop',
        title: <>REJOIGNEZ NOTRE RÉSEAU<br />D'EXPERTS CERTIFIÉS</>,
        subtitle: "Bénéficiez d'une visibilité accrue et de missions régulières."
    },
    {
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1600&h=900&fit=crop',
        title: <>VALORISEZ VOTRE SAVOIR-FAIRE<br />AUPRÈS DES MEILLEURS</>,
        subtitle: "Travaillez avec des clients sérieux et développez votre carrière."
    }
];

const Candidats: React.FC = () => {
    return (
        <div className="page-candidats">

            {/* Hero Carousel */}
            <HeroCarousel
                slides={candidatSlides}
                ctaLink="/devenir-membre"
                ctaText="Devenir membre"
                className="cand-hero-carousel"
            />

            {/* Section Domaines d'expertises */}
            <section className="cand-expertise section">
                <div className="container">
                    <h2 className="cand-section-title">Nos domaines d'expertises</h2>

                    <div className="cand-expertise-grid">
                        {expertiseData.map((category, idx) => (
                            <div key={idx} className="cand-expertise-card">
                                <h3 className="cand-category-title">{category.category}</h3>
                                <ul className="cand-job-list">
                                    {category.jobs.map((job, jIdx) => (
                                        <li key={jIdx} className="cand-job-item">
                                            <span className="cand-job-title">{job.title}</span>
                                            <span className="cand-job-dots"></span>
                                            <span className="cand-job-positions">{job.positions} postes</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className="btn btn-primary cand-apply-btn">
                                    Postuler maintenant
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Candidats;
