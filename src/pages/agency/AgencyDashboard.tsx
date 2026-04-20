import React, { useState, useEffect } from 'react';
import { agencyService } from '../../services/agencyService';
import './Agency.css';

const AgencyDashboard: React.FC = () => {
  const [agency, setAgency] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const agencyRes = await agencyService.getMyAgency();
        const ag = agencyRes.data?.data || agencyRes.data;
        setAgency(ag);
        if (ag?.id) {
          const membersRes = await agencyService.getMembers(ag.id);
          setMembers(membersRes.data?.data || []);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  if (!agency) return <div className="agency-page"><p>Aucune agence associée à votre compte.</p></div>;

  return (
    <div className="agency-page">
      <h1>{agency.name}</h1>
      <p className="subtitle">{agency.description || 'Tableau de bord de votre agence'}</p>
      <div className="agency-stats-row">
        <div className="agency-stat-card"><span className="stat-value">{members.length}</span><span className="stat-label">Techniciens</span></div>
        <div className="agency-stat-card"><span className="stat-value">—</span><span className="stat-label">Missions actives</span></div>
        <div className="agency-stat-card"><span className="stat-value">—</span><span className="stat-label">Revenus du mois</span></div>
      </div>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Équipe</h2>
      {members.map((m: any) => (
        <div key={m.user_id || m.id} className="agency-member-card">
          <div className="agency-member-avatar">{m.user?.name?.charAt(0) || '?'}</div>
          <div className="agency-member-info">
            <div className="agency-member-name">{m.user?.name || 'Membre'}</div>
            <div className="agency-member-role">{m.role || 'Technicien'}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgencyDashboard;
