import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchKycDocuments, uploadKycDocument } from '../../services/technicianService';
import './KYCStatus.css';

interface KycDoc {
    id: string;
    title: string;
    desc: string;
    status: string;
    icon: string;
    url?: string | null;
}

const KYCStatus: React.FC = () => {
    const navigate = useNavigate();
    
    const baseDocs: KycDoc[] = [
        { id: 'cni', title: 'Carte d\'Identité Nationale', desc: 'Recto et Verso', status: 'missing', icon: 'badge', url: null },
        { id: 'casier', title: 'Casier Judiciaire (Extrait B3)', desc: 'Moins de 3 mois', status: 'missing', icon: 'gavel', url: null },
        { id: 'cert', title: 'Certificats Professionnels', desc: 'Diplômes ou attestations', status: 'missing', icon: 'workspace_premium', url: null },
        { id: 'photo', title: 'Photo Portrait', desc: 'Photo professionnelle claire', status: 'missing', icon: 'face', url: null },
    ];

    const [kycDocs, setKycDocs] = useState<KycDoc[]>(baseDocs);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const loadDocs = async () => {
            try {
                const fetchedDocs = await fetchKycDocuments();
                // Map the fetched docs back into the base structure
                setKycDocs(prev => prev.map(base => {
                    const found = fetchedDocs.find((d: any) => d.type === base.id);
                    if (found) {
                        return { ...base, status: found.status, url: found.url };
                    }
                    return base;
                }));
            } catch (error) {
                console.error("Failed to fetch KYC documents:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDocs();
    }, []);

    const handleUploadClick = (docId: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,application/pdf';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            // 5MB Limit check (5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                setUploadStatus('error');
                setStatusMessage('Le fichier est trop volumineux. La taille maximale autorisée est de 5Mo.');
                return;
            }

            try {
                setUploadingId(docId);
                setUploadStatus('uploading');
                setStatusMessage('Téléchargement du document en cours...');
                
                const res = await uploadKycDocument(docId, file);
                
                setKycDocs(prev => prev.map(doc => 
                    doc.id === docId ? { ...doc, status: res.document.status || 'pending', url: res.document.url } : doc
                ));
                
                setUploadStatus('success');
                setStatusMessage('Document téléversé avec succès ! Nos modérateurs vont l\'examiner.');
                
                // Auto-close success popup after 3 seconds
                setTimeout(() => setUploadStatus('idle'), 3000);
            } catch (error) {
                console.error("Upload failed", error);
                setUploadStatus('error');
                setStatusMessage('Une erreur est survenue lors de l\'envoi du document. Veuillez réessayer.');
            } finally {
                setUploadingId(null);
            }
        };
        input.click();
    };

    const handleViewClick = (url: string) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const getStatusTheme = (status: string) => {
        switch(status) {
            case 'approved':
            case 'verified': return { color: 'var(--primary)', bg: 'var(--primary-container)', text: 'Vérifié', icon: 'check_circle' };
            case 'pending': return { color: '#eab308', bg: '#fef9c3', text: 'En cours d\'analyse', icon: 'pending' };
            case 'rejected': return { color: 'var(--error)', bg: 'var(--error-container)', text: 'Rejeté', icon: 'cancel' };
            default: return { color: 'var(--outline)', bg: 'var(--surface-container-high)', text: 'À fournir', icon: 'upload_file' };
        }
    };

    const overallProgress = Math.round((kycDocs.filter(d => d.status === 'verified' || d.status === 'approved').length / kycDocs.length) * 100);

    if (isLoading) {
        return (
            <div className="tech-kyc-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--primary)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 1s linear infinite' }}>sync</span>
                    <p style={{ marginTop: '16px', fontWeight: 600 }}>Chargement de vos documents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tech-kyc-page">
            <header className="tech-kyc-header">
                <button className="tech-kyc-back" onClick={() => navigate(-1)}>
                    <span className="material-symbols-outlined">arrow_back</span> Retour
                </button>
                <h1>Vérification d'Identité (KYC)</h1>
                <p>Téléversez vos documents pour obtenir le badge de Technicien Vérifié et accéder aux demandes des clients.</p>
            </header>

            <div className="tech-kyc-grid">
                
                {/* Score Panel */}
                <div className="tech-kyc-score-panel">
                    <div className="tech-kyc-score-circle">
                        <div className="tech-score-progress" style={{background: `conic-gradient(var(--primary) ${overallProgress}%, var(--surface-container) ${overallProgress}%)`}}>
                            <div className="tech-score-inner">
                                <h2>{overallProgress}%</h2>
                            </div>
                        </div>
                    </div>
                    <h3>Profil Certifié</h3>
                    <p>Complétez votre dossier à 100% pour que les modérateurs puissent activer votre compte.</p>
                </div>

                {/* Documents List */}
                <div className="tech-kyc-docs-list">
                    <h2>Documents Requis</h2>
                    {kycDocs.map(doc => {
                        const theme = getStatusTheme(doc.status);
                        return (
                            <div key={doc.id} className="tech-kyc-doc-card">
                                <div className="tech-kyc-doc-icon">
                                    <span className="material-symbols-outlined text-3xl text-slate-500 font-variation-light">{doc.icon}</span>
                                </div>
                                <div className="tech-kyc-doc-info">
                                    <h4>{doc.title}</h4>
                                    <p>{doc.desc}</p>
                                    <div className="tech-kyc-status-badge mt-2" style={{ backgroundColor: theme.bg, color: theme.color }}>
                                        <span className="material-symbols-outlined text-sm mr-1">{theme.icon}</span>
                                        {theme.text}
                                    </div>
                                </div>
                                <div className="tech-kyc-doc-actions">
                                    {uploadingId === doc.id ? (
                                        <div className="flex items-center gap-2 text-primary font-bold">
                                            <span className="material-symbols-outlined animate-spin">sync</span>
                                        </div>
                                    ) : (doc.status === 'approved' || doc.status === 'verified' || doc.status === 'pending') ? (
                                        <button 
                                            className="tech-kyc-btn-view" 
                                            onClick={() => doc.url && handleViewClick(doc.url)}
                                            title="Voir le document"
                                        >
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>
                                    ) : (
                                        <button className="tech-kyc-btn-upload" onClick={() => handleUploadClick(doc.id)}>
                                            <span className="material-symbols-outlined">upload</span>
                                            Téléverser
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div className="tech-kyc-info-box">
                        <span className="material-symbols-outlined text-blue-500 text-3xl">shield</span>
                        <div>
                            <h4>Protection des Données</h4>
                            <p>Toutes vos informations sont cryptées de bout en bout et conservées en toute sécurité conformément à nos normes.</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Status Popup/Overlay */}
            {uploadStatus !== 'idle' && (
                <div className="tech-kyc-overlay">
                    <div className={`tech-kyc-popup ${uploadStatus}`}>
                        <div className="tech-kyc-popup-content">
                            {uploadStatus === 'uploading' && <span className="material-symbols-outlined animate-spin text-primary">sync</span>}
                            {uploadStatus === 'success' && <span className="material-symbols-outlined text-green-500 scale-in">check_circle</span>}
                            {uploadStatus === 'error' && <span className="material-symbols-outlined text-red-500 shake">error</span>}
                            
                            <div className="tech-kyc-popup-text">
                                <h4>
                                    {uploadStatus === 'uploading' && 'Téléversement...'}
                                    {uploadStatus === 'success' && 'Réussi !'}
                                    {uploadStatus === 'error' && 'Erreur'}
                                </h4>
                                <p>{statusMessage}</p>
                            </div>

                            {uploadStatus === 'error' && (
                                <button className="tech-kyc-popup-close" onClick={() => setUploadStatus('idle')}>
                                    Fermer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KYCStatus;
