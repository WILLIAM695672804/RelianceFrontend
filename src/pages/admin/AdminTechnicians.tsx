import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import type { AdminUser } from '../../services/adminService';
import './Admin.css';

const AdminTechnicians: React.FC = () => {
    const [technicians, setTechnicians] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const fetchPending = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getPendingTechnicians(page);
            setTechnicians(data.data);
            setLastPage(data.last_page);
            setTotal(data.total);
        } catch (error) {
            console.error('Failed to load pending technicians', error);
        } finally {
            setIsLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    const handleApprove = async (id: string) => {
        setActionLoading(id);
        try {
            await adminService.approveTechnician(id);
            await fetchPending();
        } catch (error) {
            console.error('Failed to approve technician', error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async () => {
        if (!rejectModal || !rejectReason.trim()) return;
        setActionLoading(rejectModal.id);
        try {
            await adminService.rejectTechnician(rejectModal.id, rejectReason);
            setRejectModal(null);
            setRejectReason('');
            await fetchPending();
        } catch (error) {
            console.error('Failed to reject technician', error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="adm-dashboard">
            <div className="adm-page-header">
                <h2>Techniciens en attente d'approbation ({total})</h2>
            </div>

            {isLoading ? (
                <div className="adm-loading"><div className="adm-spinner"></div></div>
            ) : technicians.length === 0 ? (
                <div className="adm-glass" style={{ padding: '2rem' }}>
                    <div className="adm-empty">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p>Aucun technicien en attente d'approbation</p>
                    </div>
                </div>
            ) : (
                <>
                    {technicians.map((tech) => {
                        const kycCount = tech.kyc_documents?.length || 0;
                        const kycPending = tech.kyc_documents?.filter((d: any) => d.status === 'pending').length || 0;
                        return (
                            <div key={tech.id} className="adm-glass adm-tech-card">
                                <div className="adm-tech-info">
                                    <h4 className="adm-tech-name">{tech.name}</h4>
                                    <div className="adm-tech-meta">
                                        <span>
                                            <span className="material-symbols-outlined">mail</span>
                                            {tech.email}
                                        </span>
                                        {tech.phone && (
                                            <span>
                                                <span className="material-symbols-outlined">phone</span>
                                                {tech.phone}
                                            </span>
                                        )}
                                        <span>
                                            <span className="material-symbols-outlined">calendar_today</span>
                                            Inscrit le {new Date(tech.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                        <span>
                                            <span className="material-symbols-outlined">folder</span>
                                            {kycCount} doc(s) KYC {kycPending > 0 && `(${kycPending} en attente)`}
                                        </span>
                                    </div>
                                </div>
                                <div className="adm-tech-actions">
                                    <button
                                        className="adm-btn adm-btn-success"
                                        onClick={() => handleApprove(tech.id)}
                                        disabled={actionLoading === tech.id}
                                    >
                                        <span className="material-symbols-outlined">check</span>
                                        Approuver
                                    </button>
                                    <button
                                        className="adm-btn adm-btn-danger"
                                        onClick={() => setRejectModal({ id: tech.id, name: tech.name })}
                                        disabled={actionLoading === tech.id}
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                        Rejeter
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {lastPage > 1 && (
                        <div className="adm-pagination">
                            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Precedent</button>
                            <span>Page {page} / {lastPage}</span>
                            <button disabled={page >= lastPage} onClick={() => setPage(page + 1)}>Suivant</button>
                        </div>
                    )}
                </>
            )}

            {/* Reject Modal */}
            {rejectModal && (
                <div className="adm-modal-overlay" onClick={() => setRejectModal(null)}>
                    <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="adm-modal-header">
                            <h3>Rejeter {rejectModal.name}</h3>
                            <button className="adm-modal-close" onClick={() => setRejectModal(null)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="adm-modal-body">
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                                Veuillez indiquer la raison du rejet. Le technicien sera desactive.
                            </p>
                            <textarea
                                className="adm-textarea"
                                placeholder="Raison du rejet..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                        </div>
                        <div className="adm-modal-footer">
                            <button className="adm-btn adm-btn-outline" onClick={() => setRejectModal(null)}>Annuler</button>
                            <button
                                className="adm-btn adm-btn-danger"
                                onClick={handleReject}
                                disabled={!rejectReason.trim() || actionLoading === rejectModal.id}
                            >
                                Confirmer le rejet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTechnicians;
