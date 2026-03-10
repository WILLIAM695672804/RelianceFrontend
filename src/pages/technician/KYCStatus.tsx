import React, { useState, useRef } from 'react';
import {
    FaIdCard,
    FaFileInvoiceDollar,
    FaShieldAlt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaUpload,
    FaFileContract,
    FaTrash,
    FaUserTie,
    FaBuilding
} from 'react-icons/fa';
import './KYCStatus.css';

interface KYCDocument {
    id: string;
    name: string;
    status: 'verified' | 'pending' | 'missing' | 'rejected';
    note: string;
    icon: React.ReactNode;
    fileUrl?: string;
}

const KYCStatus: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeDocId, setActiveDocId] = useState<string | null>(null);

    // V3: B2B Affiliation State
    const [affiliationType, setAffiliationType] = useState<'independent' | 'agency' | null>(null);
    const [agencyCode, setAgencyCode] = useState('');

    const [documents, setDocuments] = useState<KYCDocument[]>([
        { id: 'id_card', name: 'Pièce d\'identité (CNI / Passeport)', status: 'verified', note: 'Vérifiée le 10 Fév 2026', icon: <FaIdCard />, fileUrl: 'cni-recto-verso.pdf' },
        { id: 'kbis', name: 'Registre du Commerce / NIU', status: 'verified', note: 'Vérifié le 10 Fév 2026', icon: <FaFileInvoiceDollar />, fileUrl: 'kbis-2025.pdf' },
        { id: 'rcp', name: 'Assurance Responsabilité Civile Pro', status: 'pending', note: 'En cours de vérification par l\'administrateur', icon: <FaShieldAlt />, fileUrl: 'attestation-rcp.pdf' },
        { id: 'casier', name: 'Extrait de Casier Judiciaire (Optionnel)', status: 'missing', note: 'Requis pour les missions haute sécurité', icon: <FaFileContract /> },
        { id: 'diploma', name: 'Diplôme ou Certification (Spécialité)', status: 'rejected', note: 'Document illisible, merci de renvoyer une version claire.', icon: <FaFileContract /> }
    ]);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'verified': return { label: 'Validé', class: 'verified', icon: <FaCheckCircle /> };
            case 'pending': return { label: 'En attente de validation', class: 'pending', icon: <FaClock /> };
            case 'rejected': return { label: 'Rejeté par l\'Admin', class: 'rejected', icon: <FaTimesCircle /> };
            default: return { label: 'Non fourni', class: 'missing', icon: null };
        }
    };

    const overallStatus = documents.some(d => d.id !== 'casier' && d.status === 'missing') ? 'warning'
        : documents.some(d => d.status === 'rejected') ? 'danger'
            : documents.some(d => d.status === 'pending') ? 'warning'
                : 'success';

    const triggerFileSelect = (id: string) => {
        setActiveDocId(id);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeDocId) {
            setDocuments(prev => prev.map(doc => {
                if (doc.id === activeDocId) {
                    return {
                        ...doc,
                        status: 'pending',
                        note: 'Nouveau document envoyé, en cours de vérification...',
                        fileUrl: file.name
                    };
                }
                return doc;
            }));
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
        setActiveDocId(null);
    };

    const handleRemoveFile = (id: string) => {
        setDocuments(prev => prev.map(doc => {
            if (doc.id === id) {
                return {
                    ...doc,
                    status: 'missing',
                    note: 'Document retiré.',
                    fileUrl: undefined
                };
            }
            return doc;
        }));
    };

    return (
        <div className="tech-page kyc-page" style={{ paddingTop: 0, marginTop: 0, boxShadow: 'none' }}>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
                Soumettez vos documents légaux pour valider votre profil sur la plateforme Reliance.
            </p>

            {/* V3: B2B Affiliation Selector */}
            <div className="affiliation-section">
                <h2>1. Statut d'Affiliation (Rôle)</h2>
                <div className="affiliation-cards">
                    <div 
                        className={`affiliation-card ${affiliationType === 'independent' ? 'active' : ''}`}
                        onClick={() => setAffiliationType('independent')}
                    >
                        <FaUserTie className="affil-icon" />
                        <h3>Technicien Indépendant</h3>
                        <p>Vous gérez vos propres missions, votre planning et votre portefeuille Reliance.</p>
                    </div>
                    <div 
                        className={`affiliation-card ${affiliationType === 'agency' ? 'active' : ''}`}
                        onClick={() => setAffiliationType('agency')}
                    >
                        <FaBuilding className="affil-icon" />
                        <h3>Employé d'Agence</h3>
                        <p>Vos flux financiers et certaines missions sont gérés par un superviseur d'agence.</p>
                    </div>
                </div>

                {affiliationType === 'agency' && (
                    <div className="agency-code-input">
                        <label>Code de rattachement Agence :</label>
                        <div className="input-with-button">
                            <input 
                                type="text" 
                                placeholder="Ex: AGN-X789-2026" 
                                value={agencyCode}
                                onChange={(e) => setAgencyCode(e.target.value)}
                            />
                            <button className="btn-primary" onClick={() => alert("Simulation : Rattachement à l'Agence 'Tech Solutions S.A' validé.")}>
                                Rattacher
                            </button>
                        </div>
                        <small>Demandez ce code à votre employeur pour que votre Wallet soit lié aux comptes de l'agence.</small>
                    </div>
                )}
            </div>

            <hr className="divider" />

            <h2>2. Documents de Vérification (KYC)</h2>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
            />

            {/* Summary Widget */}
            <div className={`kyc-summary border-${overallStatus}`}>
                <div className="kyc-icon-large">
                    <FaShieldAlt />
                </div>
                <div className="kyc-text">
                    <h2>Statut de Vérification</h2>
                    <p>
                        {overallStatus === 'success' ? 'Tous vos documents requis sont validés.'
                            : overallStatus === 'danger' ? 'Attention : Certains documents ont été rejetés.'
                                : 'Vos documents sont incomplets ou en cours de vérification.'}
                    </p>
                </div>
                <div className={`status-badge-lg ${overallStatus}`}>
                    {overallStatus === 'success' ? <FaCheckCircle /> : overallStatus === 'danger' ? <FaTimesCircle /> : <FaClock />}
                    {overallStatus === 'success' ? 'Profil Vérifié' : overallStatus === 'danger' ? 'Action Requise' : 'Vérification en cours'}
                </div>
            </div>

            {/* Documents Grid */}
            <div className="kyc-grid">
                {documents.map(doc => {
                    const statusInfo = getStatusInfo(doc.status);
                    const isRequired = doc.id !== 'casier';

                    return (
                        <div key={doc.id} className={`doc-card border-${doc.status}`}>
                            <div className="doc-info">
                                <h3>
                                    {doc.icon} {doc.name}
                                    {isRequired && <span style={{ color: '#ef4444', fontSize: '1.2rem', marginLeft: '4px' }}>*</span>}
                                </h3>
                                <p className={doc.status === 'rejected' ? 'text-danger' : ''}>{doc.note}</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                    <span className={`doc-status ${statusInfo.class}`}>
                                        {statusInfo.icon} {statusInfo.label}
                                    </span>
                                    {doc.fileUrl && (
                                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            📄 {doc.fileUrl}
                                            {doc.status !== 'verified' && (
                                                <button
                                                    onClick={() => handleRemoveFile(doc.id)}
                                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                                                    title="Supprimer"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="doc-action">
                                {doc.status === 'verified' ? (
                                    <FaCheckCircle className="doc-icon verified" />
                                ) : (
                                    <button
                                        className={`btn-upload-kyc ${doc.status === 'rejected' ? 'btn-upload-danger' : ''}`}
                                        onClick={() => triggerFileSelect(doc.id)}
                                    >
                                        <FaUpload /> {doc.fileUrl ? 'Remplacer' : 'Uploader'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KYCStatus;
