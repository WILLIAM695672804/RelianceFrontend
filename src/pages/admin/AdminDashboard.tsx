import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import type { AdminStats } from '../../services/adminService';
import './Admin.css';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to load admin stats', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading || !stats) {
        return <div className="adm-loading"><div className="adm-spinner"></div></div>;
    }

    return (
        <div className="adm-dashboard">

            {/* KPI Cards */}
            <div className="adm-kpi-grid">
                <div className="adm-glass adm-kpi-card">
                    <div className="adm-kpi-header">
                        <div className="adm-kpi-icon indigo">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                        <span className="adm-kpi-badge green">+{stats.new_users_this_month} ce mois</span>
                    </div>
                    <p className="adm-kpi-label">Utilisateurs totaux</p>
                    <p className="adm-kpi-value">{stats.total_users.toLocaleString()}</p>
                </div>

                <div className="adm-glass adm-kpi-card">
                    <div className="adm-kpi-header">
                        <div className="adm-kpi-icon sky">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                    </div>
                    <p className="adm-kpi-label">Clients</p>
                    <p className="adm-kpi-value">{stats.total_clients.toLocaleString()}</p>
                </div>

                <div className="adm-glass adm-kpi-card">
                    <div className="adm-kpi-header">
                        <div className="adm-kpi-icon emerald">
                            <span className="material-symbols-outlined">engineering</span>
                        </div>
                    </div>
                    <p className="adm-kpi-label">Techniciens</p>
                    <p className="adm-kpi-value">{stats.total_technicians.toLocaleString()}</p>
                </div>

                <div className="adm-glass adm-kpi-card">
                    <div className="adm-kpi-header">
                        <div className="adm-kpi-icon amber">
                            <span className="material-symbols-outlined">business</span>
                        </div>
                    </div>
                    <p className="adm-kpi-label">Agences</p>
                    <p className="adm-kpi-value">{stats.total_agencies.toLocaleString()}</p>
                </div>
            </div>

            {/* Quick Action Cards */}
            <div className="adm-actions-row">
                <div className="adm-glass adm-action-card" onClick={() => navigate('/admin/technicians')}>
                    <div className="adm-action-icon amber">
                        <span className="material-symbols-outlined">pending_actions</span>
                    </div>
                    <div className="adm-action-text">
                        <h4>Techniciens en attente</h4>
                        <p>Approbation requise</p>
                    </div>
                    <span className="adm-action-count">{stats.pending_technicians}</span>
                </div>

                <div className="adm-glass adm-action-card" onClick={() => navigate('/admin/kyc')}>
                    <div className="adm-action-icon indigo">
                        <span className="material-symbols-outlined">fact_check</span>
                    </div>
                    <div className="adm-action-text">
                        <h4>Documents KYC</h4>
                        <p>En attente de validation</p>
                    </div>
                    <span className="adm-action-count">{stats.pending_kyc}</span>
                </div>

                <div className="adm-glass adm-action-card" onClick={() => navigate('/admin/users')}>
                    <div className="adm-action-icon emerald">
                        <span className="material-symbols-outlined">manage_accounts</span>
                    </div>
                    <div className="adm-action-text">
                        <h4>Gestion utilisateurs</h4>
                        <p>{stats.active_users} actifs, {stats.inactive_users} inactifs</p>
                    </div>
                    <span className="adm-action-count">{stats.total_users}</span>
                </div>
            </div>

            {/* Second KPI row */}
            <div className="adm-kpi-grid">
                <div className="adm-glass adm-kpi-card">
                    <div className="adm-kpi-header">
                        <div className="adm-kpi-icon emerald">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                    </div>
                    <p className="adm-kpi-label">Comptes actifs</p>
                    <p className="adm-kpi-value">{stats.active_users}</p>
                </div>

                <div className="adm-glass adm-kpi-card">
                    <div className="adm-kpi-header">
                        <div className="adm-kpi-icon rose">
                            <span className="material-symbols-outlined">block</span>
                        </div>
                    </div>
                    <p className="adm-kpi-label">Comptes inactifs</p>
                    <p className="adm-kpi-value">{stats.inactive_users}</p>
                </div>

                <div className="adm-glass adm-kpi-card">
                    <div className="adm-kpi-header">
                        <div className="adm-kpi-icon indigo">
                            <span className="material-symbols-outlined">assignment</span>
                        </div>
                    </div>
                    <p className="adm-kpi-label">Demandes totales</p>
                    <p className="adm-kpi-value">{stats.total_requests}</p>
                </div>

                <div className="adm-glass adm-kpi-card">
                    <div className="adm-kpi-header">
                        <div className="adm-kpi-icon amber">
                            <span className="material-symbols-outlined">hourglass_top</span>
                        </div>
                    </div>
                    <p className="adm-kpi-label">Demandes en cours</p>
                    <p className="adm-kpi-value">{stats.pending_requests}</p>
                </div>
            </div>

            {/* Recent Users */}
            <div className="adm-glass adm-table-card">
                <h3 className="adm-section-title">
                    <span className="material-symbols-outlined" style={{ color: '#6366f1' }}>schedule</span>
                    Derniers inscrits
                </h3>
                <table className="adm-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Statut</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recent_users.map((u) => (
                            <tr key={u.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/users')}>
                                <td style={{ fontWeight: 600 }}>{u.name}</td>
                                <td>{u.email}</td>
                                <td><span className={`adm-role-badge ${u.role}`}>{u.role}</span></td>
                                <td><span className={`adm-badge ${u.is_active ? 'active' : 'inactive'}`}>{u.is_active ? 'Actif' : 'Inactif'}</span></td>
                                <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
