import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import type { KycDocument } from '../../services/adminService';
import './Admin.css';

const AdminKyc: React.FC = () => {
    const [documents, setDocuments] = useState<KycDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [selectedDoc, setSelectedDoc] = useState<KycDocument | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);

    const fetchDocs = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: any = { page };
            if (statusFilter) params.status = statusFilter;
            if (search) params.search = search;
            const data = await adminService.getKycDocuments(params);
            setDocuments(data.data);
            setLastPage(data.last_page);
            setTotal(data.total);
        } catch (error) {
            console.error('Failed to load KYC documents', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, statusFilter, search]);

    useEffect(() => {
        fetchDocs();
    }, [fetchDocs]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleApprove = async (docId: string) => {
        setActionLoading(docId);
        try {
            await adminService.validateKyc(docId, 'approved');
            setSelectedDoc(null);
            await fetchDocs();
        } catch (error) {
            console.error('Failed to approve KYC', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (docId: string) => {
        if (!rejectReason.trim()) return;
        setActionLoading(docId);
        try {
            await adminService.validateKyc(docId, 'rejected', rejectReason);
            setSelectedDoc(null);
            setRejectReason('');
            setShowRejectInput(false);
            await fetchDocs();
        } catch (error) {
            console.error('Failed to reject KYC', error);
        } finally {
            setActionLoading(null);
        }
    };

    const openDoc = (doc: KycDocument) => {
        setSelectedDoc(doc);
        setShowRejectInput(false);
        setRejectReason('');
    };

    const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)/i.test(url);

    return (
        <div className="adm-dashboard">
            {/* Header + Filters */}
            <div className="adm-page-header">
                <h2>Validation KYC ({total})</h2>
                <div className="adm-filters">
                    <input
                        type="text"
                        className="adm-search-input"
                        placeholder="Rechercher par nom ou email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <select
                        className="adm-select"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="approved">Approuve</option>
                        <option value="rejected">Rejete</option>
                    </select>
                </div>
            </div>

            {/* Documents Table */}
            <div className="adm-glass adm-table-card">
                {isLoading ? (
                    <div className="adm-loading" style={{ minHeight: '30vh' }}><div className="adm-spinner"></div></div>
                ) : documents.length === 0 ? (
                    <div className="adm-empty">
                        <span className="material-symbols-outlined">fact_check</span>
                        <p>Aucun document KYC {statusFilter === 'pending' ? 'en attente' : 'trouve'}</p>
                    </div>
                ) : (
                    <>
                        <table className="adm-table">
                            <thead>
                                <tr>
                                    <th>Utilisateur</th>
                                    <th>Type</th>
                                    <th>Statut</th>
                                    <th>Soumis le</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((doc) => (
                                    <tr key={doc.id}>
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{doc.user?.name || '-'}</div>
                                                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{doc.user?.email || '-'}</div>
                                            </div>
                                        </td>
                                        <td style={{ textTransform: 'capitalize' }}>{doc.type.replace(/_/g, ' ')}</td>
                                        <td><span className={`adm-badge ${doc.status}`}>{doc.status}</span></td>
                                        <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openDoc(doc)}>
                                                    <span className="material-symbols-outlined">visibility</span>
                                                    Voir
                                                </button>
                                                {doc.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className="adm-btn adm-btn-success adm-btn-sm"
                                                            onClick={() => handleApprove(doc.id)}
                                                            disabled={actionLoading === doc.id}
                                                        >
                                                            <span className="material-symbols-outlined">check</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {lastPage > 1 && (
                            <div className="adm-pagination">
                                <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Precedent</button>
                                <span>Page {page} / {lastPage}</span>
                                <button disabled={page >= lastPage} onClick={() => setPage(page + 1)}>Suivant</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Document Preview Modal */}
            {selectedDoc && (
                <div className="adm-modal-overlay" onClick={() => setSelectedDoc(null)}>
                    <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="adm-modal-header">
                            <h3>Document KYC — {selectedDoc.type.replace(/_/g, ' ')}</h3>
                            <button className="adm-modal-close" onClick={() => setSelectedDoc(null)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="adm-modal-body">
                            {/* Document preview */}
                            {isImage(selectedDoc.url) ? (
                                <img src={selectedDoc.url} alt="KYC Document" className="adm-kyc-doc-preview" />
                            ) : (
                                <div style={{
                                    padding: '2rem', textAlign: 'center', background: '#f8fafc',
                                    borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e2e8f0'
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#94a3b8' }}>description</span>
                                    <p style={{ margin: '0.5rem 0 1rem', color: '#64748b', fontSize: '0.85rem' }}>Fichier PDF</p>
                                    <a href={selectedDoc.url} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-primary">
                                        <span className="material-symbols-outlined">open_in_new</span>
                                        Ouvrir le document
                                    </a>
                                </div>
                            )}

                            {/* Details */}
                            <div className="adm-detail-row">
                                <span className="adm-detail-label">Utilisateur</span>
                                <span className="adm-detail-value">{selectedDoc.user?.name}</span>
                            </div>
                            <div className="adm-detail-row">
                                <span className="adm-detail-label">Email</span>
                                <span className="adm-detail-value">{selectedDoc.user?.email}</span>
                            </div>
                            <div className="adm-detail-row">
                                <span className="adm-detail-label">Type</span>
                                <span className="adm-detail-value" style={{ textTransform: 'capitalize' }}>{selectedDoc.type.replace(/_/g, ' ')}</span>
                            </div>
                            <div className="adm-detail-row">
                                <span className="adm-detail-label">Statut</span>
                                <span className="adm-detail-value">
                                    <span className={`adm-badge ${selectedDoc.status}`}>{selectedDoc.status}</span>
                                </span>
                            </div>
                            <div className="adm-detail-row">
                                <span className="adm-detail-label">Soumis le</span>
                                <span className="adm-detail-value">{new Date(selectedDoc.created_at).toLocaleString('fr-FR')}</span>
                            </div>

                            {selectedDoc.rejection_reason && (
                                <div className="adm-detail-row">
                                    <span className="adm-detail-label">Raison du rejet</span>
                                    <span className="adm-detail-value" style={{ color: '#e11d48' }}>{selectedDoc.rejection_reason}</span>
                                </div>
                            )}

                            {/* Reject reason input */}
                            {showRejectInput && (
                                <div style={{ marginTop: '1rem' }}>
                                    <textarea
                                        className="adm-textarea"
                                        placeholder="Raison du rejet..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {selectedDoc.status === 'pending' && (
                            <div className="adm-modal-footer">
                                {showRejectInput ? (
                                    <>
                                        <button className="adm-btn adm-btn-outline" onClick={() => setShowRejectInput(false)}>Annuler</button>
                                        <button
                                            className="adm-btn adm-btn-danger"
                                            onClick={() => handleReject(selectedDoc.id)}
                                            disabled={!rejectReason.trim() || actionLoading === selectedDoc.id}
                                        >
                                            Confirmer le rejet
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="adm-btn adm-btn-outline" onClick={() => setSelectedDoc(null)}>Fermer</button>
                                        <button
                                            className="adm-btn adm-btn-danger"
                                            onClick={() => setShowRejectInput(true)}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                            Rejeter
                                        </button>
                                        <button
                                            className="adm-btn adm-btn-success"
                                            onClick={() => handleApprove(selectedDoc.id)}
                                            disabled={actionLoading === selectedDoc.id}
                                        >
                                            <span className="material-symbols-outlined">check</span>
                                            Approuver
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminKyc;
