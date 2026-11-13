import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import './Admin.css';

interface Fee { id: string; name: string; fee_type: string; value: number; applies_to: string; active: boolean; }

const AdminFees: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', fee_type: 'percentage', value: '', applies_to: 'job' });

  useEffect(() => { loadFees(); }, []);

  const loadFees = async () => {
    try { const res = await adminService.getFees(); setFees(res.data || res || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Un pourcentage est saisi en % (10) et stocké en fraction (0,10) ; un montant fixe reste en XAF.
      const saisie = parseFloat(form.value);
      const value = form.fee_type === 'percentage' ? saisie / 100 : saisie;
      await adminService.createFee({ ...form, value });
      setShowModal(false);
      setForm({ name: '', fee_type: 'percentage', value: '', applies_to: 'job' });
      await loadFees();
    } catch (err: any) { alert(err.response?.data?.message || 'Erreur'); }
  };

  const handleToggle = async (id: string) => {
    try { await adminService.toggleFee(id); await loadFees(); }
    catch (err: any) { alert(err.response?.data?.message || 'Erreur'); }
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="admin-title">Frais & Commissions</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Ajouter un frais</button>
      </div>

      <table className="admin-table">
        <thead><tr><th>Nom</th><th>Type</th><th>Valeur</th><th>Appliqué à</th><th>Actif</th><th>Action</th></tr></thead>
        <tbody>
          {fees.map(f => (
            <tr key={f.id}>
              <td>{f.name}</td>
              <td>{f.fee_type === 'percentage' ? 'Pourcentage' : 'Fixe'}</td>
              <td>{f.fee_type === 'percentage' ? `${(f.value * 100).toFixed(1)}%` : `${f.value} XAF`}</td>
              <td>{f.applies_to}</td>
              <td><span className={`status-badge ${f.active ? 'status-active' : 'status-cancelled'}`}>{f.active ? 'Actif' : 'Inactif'}</span></td>
              <td><button className="btn-action" onClick={() => handleToggle(f.id)}>{f.active ? 'Désactiver' : 'Activer'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Nouveau frais</h3>
            <form onSubmit={handleCreate}>
              <input placeholder="Nom du frais" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <select value={form.fee_type} onChange={e => setForm({ ...form, fee_type: e.target.value })}>
                <option value="percentage">Pourcentage</option>
                <option value="fixed">Montant fixe</option>
              </select>
              <input type="number" step="0.01" min="0" max={form.fee_type === 'percentage' ? 100 : undefined} placeholder={form.fee_type === 'percentage' ? 'Valeur (%)' : 'Valeur (XAF)'} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required />
              <select value={form.applies_to} onChange={e => setForm({ ...form, applies_to: e.target.value })}>
                <option value="job">Job / Mission</option>
                <option value="withdrawal">Retrait</option>
                <option value="recharge">Recharge</option>
              </select>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFees;
