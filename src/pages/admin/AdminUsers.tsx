import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import type { AdminUser } from '../../services/adminService';
import './Admin.css';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const params: any = { page };
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.status = statusFilter;
            const data = await adminService.getUsers(params);
            setUsers(data.data);
            setLastPage(data.last_page);
            setTotal(data.total);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, search, roleFilter, statusFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Debounce search
    const [searchInput, setSearchInput] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleViewUser = async (userId: string) => {
        setDetailLoading(true);
        try {
            const data = await adminService.getUser(userId);
            setSelectedUser(data.data);
        } catch (error) {
            console.error('Failed to load user detail', error);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleToggleActive = async (userId: string) => {
        setActionLoading(userId);
        try {
            await adminService.toggleActive(userId);
            await fetchUsers();
            if (selectedUser?.id === userId) {
                const data = await adminService.getUser(userId);
                setSelectedUser(data.data);
            }
        } catch (error) {
            console.error('Failed to toggle user', error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="adm-dashboard">
            {/* Header + Filters */}
            <div className="adm-page-header">
                <h2>Gestion des Utilisateurs ({total})</h2>
                <div className="adm-filters">
                    <input
                        type="text"
                        className="adm-search-input"
                        placeholder="Rechercher par nom, email, tel..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <select
                        className="adm-select"
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">Tous les roles</option>
                        <option value="client">Client</option>
                        <option value="technicien">Technicien</option>
                        <option value="agence">Agence</option>
                        <option value="admin">Admin</option>
                    </select>
                    <select
                        className="adm-select"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">Tous les statuts</option>
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="adm-glass adm-table-card">
                {isLoading ? (
                    <div className="adm-loading" style={{ minHeight: '30vh' }}><div className="adm-spinner"></div></div>
                ) : users.length === 0 ? (
                    <div className="adm-empty">
                        <span className="material-symbols-outlined">search_off</span>
                        <p>Aucun utilisateur trouve</p>
                    </div>
                ) : (
                    <>
                        <table className="adm-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Statut</th>
                                    <th>Inscrit le</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => {
                                    const role = u.roles?.[0]?.name || 'N/A';
                                    return (
                                        <tr key={u.id}>
                                            <td style={{ fontWeight: 600 }}>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td><span className={`adm-role-badge ${role}`}>{role}</span></td>
                                            <td><span className={`adm-badge ${u.is_active ? 'active' : 'inactive'}`}>{u.is_active ? 'Actif' : 'Inactif'}</span></td>
                                            <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => handleViewUser(u.id)}>
                                                        <span className="material-symbols-outlined">visibility</span>
                                                    </button>
                                                    <button
                                                        className={`adm-btn adm-btn-sm ${u.is_active ? 'adm-btn-danger' : 'adm-btn-success'}`}
                                                        onClick={() => handleToggleActive(u.id)}
                                                        disabled={actionLoading === u.id}
                                                    >
                                                        <span className="material-symbols-outlined">{u.is_active ? 'block' : 'check_circle'}</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="adm-pagination">
                            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Precedent</button>
                            <span>Page {page} / {lastPage}</span>
                            <button disabled={page >= lastPage} onClick={() => setPage(page + 1)}>Suivant</button>
                        </div>
                    </>
                )}
            </div>

            {/* User Detail Modal */}
            {(selectedUser || detailLoading) && (
                <div className="adm-modal-overlay" onClick={() => !detailLoading && setSelectedUser(null)}>
                    <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
                        {detailLoading ? (
                            <div className="adm-loading" style={{ minHeight: '200px' }}><div className="adm-spinner"></div></div>
                        ) : selectedUser && (
                            <>
                                <div className="adm-modal-header">
                                    <h3>Detail Utilisateur</h3>
                                    <button className="adm-modal-close" onClick={() => setSelectedUser(null)}>
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="adm-modal-body">
                                    <div className="adm-detail-row">
                                        <span className="adm-detail-label">Nom</span>
                                        <span className="adm-detail-value">{selectedUser.name}</span>
                                    </div>
                                    <div className="adm-detail-row">
                                        <span className="adm-detail-label">Email</span>
                                        <span className="adm-detail-value">{selectedUser.email}</span>
                                    </div>
                                    <div className="adm-detail-row">
                                        <span className="adm-detail-label">Telephone</span>
                                        <span className="adm-detail-value">{selectedUser.phone || '-'}</span>
                                    </div>
                                    <div className="adm-detail-row">
                                        <span className="adm-detail-label">Role</span>
                                        <span className="adm-detail-value">
                                            {selectedUser.roles?.map(r => (
                                                <span key={r.name} className={`adm-role-badge ${r.name}`} style={{ marginLeft: 4 }}>{r.name}</span>
                                            ))}
                                        </span>
                                    </div>
                                    <div className="adm-detail-row">
                                        <span className="adm-detail-label">Statut</span>
                                        <span className="adm-detail-value">
                                            <span className={`adm-badge ${selectedUser.is_active ? 'active' : 'inactive'}`}>
                                                {selectedUser.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="adm-detail-row">
                                        <span className="adm-detail-label">Email verifie</span>
                                        <span className="adm-detail-value">
                                            {selectedUser.email_verified_at
                                                ? <span className="adm-badge approved">Oui</span>
                                                : <span className="adm-badge pending">Non</span>
                                            }
                                        </span>
                                    </div>
                                    <div className="adm-detail-row">
                                        <span className="adm-detail-label">Verifie (tech)</span>
                                        <span className="adm-detail-value">
                                            {selectedUser.verified
                                                ? <span className="adm-badge approved">Oui</span>
                                                : <span className="adm-badge pending">Non</span>
                                            }
                                        </span>
                                    </div>
                                    <div className="adm-detail-row">
                                        <span className="adm-detail-label">Inscrit le</span>
                                        <span className="adm-detail-value">{new Date(selectedUser.created_at).toLocaleString('fr-FR')}</span>
                                    </div>

                                    {selectedUser.wallet && (
                                        <div className="adm-detail-row">
                                            <span className="adm-detail-label">Solde portefeuille</span>
                                            <span className="adm-detail-value">
                                                {Number(selectedUser.wallet.balance).toLocaleString()} {selectedUser.wallet.currency}
                                            </span>
                                        </div>
                                    )}

                                    {selectedUser.kyc_documents && selectedUser.kyc_documents.length > 0 && (
                                        <>
                                            <h4 style={{ margin: '1.25rem 0 0.5rem', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                                                Documents KYC ({selectedUser.kyc_documents.length})
                                            </h4>
                                            {selectedUser.kyc_documents.map((doc: any) => (
                                                <div key={doc.id} className="adm-detail-row">
                                                    <span className="adm-detail-label">{doc.type}</span>
                                                    <span className="adm-detail-value">
                                                        <span className={`adm-badge ${doc.status}`}>{doc.status}</span>
                                                    </span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                                <div className="adm-modal-footer">
                                    <button className="adm-btn adm-btn-outline" onClick={() => setSelectedUser(null)}>Fermer</button>
                                    <button
                                        className={`adm-btn ${selectedUser.is_active ? 'adm-btn-danger' : 'adm-btn-success'}`}
                                        onClick={() => handleToggleActive(selectedUser.id)}
                                        disabled={actionLoading === selectedUser.id}
                                    >
                                        <span className="material-symbols-outlined">{selectedUser.is_active ? 'block' : 'check_circle'}</span>
                                        {selectedUser.is_active ? 'Desactiver' : 'Activer'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
