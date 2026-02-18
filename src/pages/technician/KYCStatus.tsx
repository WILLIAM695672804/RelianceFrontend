import React, { useState } from 'react';
import {
    FaIdCard,
    FaFileContract,
    FaUserGraduate,
    FaCamera,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaCloudUploadAlt,
    FaEye,
    FaTrash,
    FaExclamationTriangle
} from 'react-icons/fa';
import './KYCStatus.css';

interface Document {
    id: string;
    type: 'ID' | 'CRIMINAL_RECORD' | 'DIPLOMA' | 'PHOTO';
    title: string;
    description: string;
    status: 'MISSING' | 'PENDING' | 'VALID' | 'REJECTED';
    fileName?: string;
    rejectionReason?: string;
}

const initialDocuments: Document[] = [
    {
        id: '1',
        type: 'ID',
        title: 'Pièce d\'identité (CNI / Passeport)',
        description: 'Recto-verso lisible. En cours de validité.',
        status: 'VALID',
        fileName: 'cni_william_recto_verso.pdf'
    },
    {
        id: '2',
        type: 'CRIMINAL_RECORD',
        title: 'Extrait de Casier Judiciaire',
        description: 'Bulletin n°3 datant de moins de 3 mois.',
        status: 'PENDING',
        fileName: 'casier_judiciaire_2026.pdf'
    },
    {
        id: '3',
        type: 'DIPLOMA',
        title: 'Diplômes & Certifications',
        description: 'Preuves de qualification pour vos compétences.',
        status: 'REJECTED',
        fileName: 'certificat_plomberie.jpg',
        rejectionReason: 'Le document est flou et la date n\'est pas visible. Merci de scanner à nouveau.'
    },
    {
        id: '4',
        type: 'PHOTO',
        title: 'Photo de profil',
        description: 'Photo professionnelle, fond neutre, visage dégagé.',
        status: 'MISSING'
    }
];

const KYCStatus: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'VALID': return <FaCheckCircle />;
            case 'REJECTED': return <FaTimesCircle />;
            case 'PENDING': return <FaClock />;
            default: return <FaExclamationTriangle />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'VALID': return 'Validé';
            case 'REJECTED': return 'Rejeté';
            case 'PENDING': return 'En cours';
            default: return 'Manquant';
        }
    };

    const handleUpload = (id: string) => {
        // Mock upload functionality
        alert(`Upload simulé pour le document : ${id}`);
        setDocuments(prev => prev.map(doc =>
            doc.id === id ? { ...doc, status: 'PENDING', fileName: 'nouveau_document.pdf', rejectionReason: undefined } : doc
        ));
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce document ?')) {
            setDocuments(prev => prev.map(doc =>
                doc.id === id ? { ...doc, status: 'MISSING', fileName: undefined, rejectionReason: undefined } : doc
            ));
        }
    };

    return (
        <div className="tech-page kyc-page">
            <h1 className="page-title">Centre de Vérification (KYC)</h1>

            {/* Global Status Header */}
            <div className="kyc-header-card">
                <div className="kyc-title-group">
                    <h2>Statut de votre dossier</h2>
                    <p>Votre profil est en cours d'examen. Complétez les éléments manquants pour activer votre compte.</p>
                </div>
                <div className="global-status pending">
                    <FaClock /> Analyse en cours
                </div>
            </div>

            {/* Documents Grid */}
            <div className="documents-grid">
                {documents.map(doc => (
                    <div key={doc.id} className={`doc-card border-${doc.status.toLowerCase()}`}>
                        <div className="doc-header">
                            <div className="doc-icon">
                                {doc.type === 'ID' && <FaIdCard />}
                                {doc.type === 'CRIMINAL_RECORD' && <FaFileContract />}
                                {doc.type === 'DIPLOMA' && <FaUserGraduate />}
                                {doc.type === 'PHOTO' && <FaCamera />}
                            </div>
                            <span className={`doc-status status-${doc.status.toLowerCase()}`}>
                                {getStatusIcon(doc.status)} {getStatusLabel(doc.status)}
                            </span>
                        </div>

                        <h3 className="doc-title">{doc.title}</h3>
                        <p className="doc-desc">{doc.description}</p>

                        {/* File Preview or Upload Zone */}
                        {doc.fileName ? (
                            <div className="file-preview-container">
                                <div className="file-preview">
                                    <div className="file-info">
                                        <FaFileContract />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                            {doc.fileName}
                                        </span>
                                    </div>
                                    <div className="file-actions">
                                        <button className="action-btn view-btn" title="Voir">
                                            <FaEye />
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            title="Supprimer"
                                            onClick={() => handleDelete(doc.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                {doc.status === 'REJECTED' && (
                                    <div className="admin-feedback">
                                        <div className="feedback-title">
                                            <FaExclamationTriangle /> Motif du rejet :
                                        </div>
                                        <p className="feedback-text">{doc.rejectionReason}</p>
                                        <button
                                            style={{ width: '100%', marginTop: '10px', fontSize: '0.8rem' }}
                                            className="btn btn-outline-danger"
                                            onClick={() => handleUpload(doc.id)}
                                        >
                                            Renvoyer un document valide
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="upload-zone" onClick={() => handleUpload(doc.id)}>
                                <div className="upload-icon">
                                    <FaCloudUploadAlt />
                                </div>
                                <p className="upload-text">
                                    <strong>Cliquez pour envoyer</strong><br />
                                    ou glissez votre fichier ici
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KYCStatus;
