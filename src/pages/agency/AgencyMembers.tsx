import React, { useState, useEffect } from 'react';
import { agencyService } from '../../services/agencyService';
import './Agency.css';

const AgencyMembers: React.FC = () => {
  const [agency, setAgency] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState('member');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const agRes = await agencyService.getMyAgency();
      const ag = agRes.data?.data || agRes.data;
      setAgency(ag);
      if (ag?.id) { const mRes = await agencyService.getMembers(ag.id); setMembers(mRes.data?.data || []); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!newUserId.trim() || !agency?.id) return;
    try { await agencyService.addMember(agency.id, newUserId.trim(), newRole); setShowAdd(false); setNewUserId(''); await loadData(); }
    catch (err: any) { alert(err.response?.data?.message || 'Erreur'); }
  };

  const handleRemove = async (userId: string) => {
    if (!agency?.id || !confirm('Retirer ce membre ?')) return;
    try { await agencyService.removeMember(agency.id, userId); await loadData(); }
    catch (err: any) { alert(err.response?.data?.message || 'Erreur'); }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  if (!agency) return <div className="agency-page"><p>Aucune agence associée.</p></div>;

  return (
    <div className="agency-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Membres de l'agence</h1>
        <button style={{ padding: '0.5rem 1rem', background: 'var(--tech-primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={() => setShowAdd(!showAdd)}>+ Ajouter</button>
      </div>

      {showAdd && (
        <div style={{ background: 'var(--tech-surface-container-lowest)', border: '1px solid var(--tech-surface-variant)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}><label style={{ fontSize: '0.8rem', fontWeight: 600 }}>ID Technicien</label><input value={newUserId} onChange={e => setNewUserId(e.target.value)} placeholder="UUID du technicien" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--tech-outline-variant)', borderRadius: '6px', boxSizing: 'border-box' }} /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Rôle</label><select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ padding: '0.5rem', border: '1px solid var(--tech-outline-variant)', borderRadius: '6px' }}><option value="member">Membre</option><option value="manager">Manager</option></select></div>
          <button onClick={handleAdd} style={{ padding: '0.5rem 1rem', background: 'var(--tech-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Ajouter</button>
        </div>
      )}

      {members.length === 0 ? <p style={{ color: 'var(--color-text-gray)' }}>Aucun membre.</p> : members.map((m: any) => (
        <div key={m.user_id || m.id} className="agency-member-card">
          <div className="agency-member-avatar">{m.user?.name?.charAt(0) || '?'}</div>
          <div className="agency-member-info"><div className="agency-member-name">{m.user?.name || 'Membre'}</div><div className="agency-member-role">{m.role || 'Membre'} — Depuis le {new Date(m.joined_at).toLocaleDateString('fr-FR')}</div></div>
          <div className="agency-member-actions"><button onClick={() => handleRemove(m.user_id)}>Retirer</button></div>
        </div>
      ))}
    </div>
  );
};

export default AgencyMembers;
