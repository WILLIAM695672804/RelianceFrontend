import React, { useState } from 'react';
import {
    FaArrowLeft,
    FaCamera,
    FaCheck,
    FaSignature,
    FaCheckDouble
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MissionCompletion.css';

const MissionCompletion: React.FC = () => {
    const navigate = useNavigate();

    // State
    const [photos, setPhotos] = useState<{ before: string | null, after: string | null }>({
        before: null,
        after: null
    });

    const [checklist, setChecklist] = useState([
        { id: 1, title: "Lieu nettoyé", desc: "Aucun débris ou saleté laissé sur place", checked: false },
        { id: 2, title: "Matériel récupéré", desc: "Tous les outils et pièces non utilisés sont rangés", checked: false },
        { id: 3, title: "Test fonctionnel", desc: "Le client a validé le bon fonctionnement", checked: false }
    ]);

    const [signature, setSignature] = useState(false);

    // Simulation Upload
    const handleUpload = (type: 'before' | 'after') => {
        // Simulate file selection
        const mockUrl = type === 'before'
            ? 'https://via.placeholder.com/300x200/e2e8f0/94a3b8?text=AVANT'
            : 'https://via.placeholder.com/300x200/dcfce7/166534?text=APRÈS';

        setPhotos(prev => ({ ...prev, [type]: mockUrl }));
    };

    const toggleCheck = (id: number) => {
        setChecklist(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const isReadyToValidate =
        photos.before &&
        photos.after &&
        checklist.every(i => i.checked) &&
        signature;

    const handleValidation = () => {
        if (!isReadyToValidate) return;
        // Logic to close mission and redirect
        navigate('/technicien/dashboard');
    };

    return (
        <div className="tech-page completion-page">
            <button className="back-btn" onClick={() => navigate('/technicien/mission/M-2684')} style={{ marginBottom: '20px' }}>
                <FaArrowLeft /> Retour mission
            </button>

            <h1 className="page-title">Fin de Mission</h1>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
                Complétez ces étapes pour valider la mission M-2684 et déclencher le paiement.
            </p>

            {/* 1. Photos */}
            <div className="section-title">
                <span>1</span> Preuves du travail
            </div>
            <div className="photo-upload-grid">
                <div
                    className={`upload-zone ${photos.before ? 'has-image' : ''}`}
                    onClick={() => handleUpload('before')}
                >
                    <span className="zone-label">AVANT</span>
                    {photos.before ? (
                        <img src={photos.before} alt="Avant" />
                    ) : (
                        <>
                            <FaCamera className="upload-icon" />
                            <span className="upload-text">Ajouter photo</span>
                        </>
                    )}
                </div>
                <div
                    className={`upload-zone ${photos.after ? 'has-image' : ''}`}
                    onClick={() => handleUpload('after')}
                >
                    <span className="zone-label">APRÈS</span>
                    {photos.after ? (
                        <img src={photos.after} alt="Après" />
                    ) : (
                        <>
                            <FaCamera className="upload-icon" />
                            <span className="upload-text">Ajouter photo</span>
                        </>
                    )}
                </div>
            </div>

            {/* 2. Checklist */}
            <div className="section-title">
                <span>2</span> Contrôle Qualité
            </div>
            <div className="completion-checklist">
                {checklist.map(item => (
                    <div
                        key={item.id}
                        className={`final-check-item ${item.checked ? 'checked' : ''}`}
                        onClick={() => toggleCheck(item.id)}
                    >
                        <div className="check-circle">
                            {item.checked && <FaCheck />}
                        </div>
                        <div className="check-content">
                            <h4>{item.title}</h4>
                            <p>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Signature */}
            <div className="section-title">
                <span>3</span> Validation Client
            </div>
            <div className="client-signature" onClick={() => setSignature(true)}>
                <p>Le client confirme que les travaux ont été réalisés conformément au devis.</p>
                <div className="signature-pad" style={{
                    background: signature ? '#f0fdf4' : '#f8fafc',
                    color: signature ? '#166534' : '#94a3b8',
                    cursor: 'pointer'
                }}>
                    {signature ? (
                        <span style={{ fontFamily: 'cursive', fontSize: '1.5rem' }}>Lu et approuvé - Sophie M.</span>
                    ) : (
                        <span><FaSignature /> Cliquer pour signer (Simulation)</span>
                    )}
                </div>
            </div>

            {/* Bottom Actions */}
            <button
                className="validate-mission-btn"
                disabled={!isReadyToValidate}
                onClick={handleValidation}
            >
                <FaCheckDouble /> Clôturer la mission
            </button>
        </div>
    );
};

export default MissionCompletion;
