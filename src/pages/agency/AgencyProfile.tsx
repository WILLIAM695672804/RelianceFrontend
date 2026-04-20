import React, { useState, useEffect } from 'react';
import { agencyService } from '../../services/agencyService';
import './Agency.css';

const AgencyProfile: React.FC = () => {
  const [agency, setAgency] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', contact_email: '', contact_phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await agencyService.getMyAgency();
        const ag = res.data?.data || res.data;
        setAgency(ag);
        if (ag) setForm({ name: ag.name || '', description: ag.description || '', contact_email: ag.contact_email || '', contact_phone: ag.contact_phone || '', address: ag.address || '' });
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agency?.id) return;
    setSaving(true);
    try {
      await agencyService.updateAgency(agency.id, form);
      setMessage('Profil mis à jour');
    } catch (err: any) { setMessage(err.response?.data?.message || 'Erreur'); }
    finally { setSaving(false); }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;
  if (!agency) return <div className="agency-page"><p>Aucune agence associée.</p></div>;

  return (
    <div className="agency-page">
      <h1>Profil de l'agence</h1>
      <form onSubmit={handleSave} className="agency-info-card" style={{ marginTop: '1rem' }}>
        <div className="agency-field"><label>Nom</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
        <div className="agency-field"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
        <div className="agency-field"><label>Email de contact</label><input type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} /></div>
        <div className="agency-field"><label>Téléphone</label><input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} /></div>
        <div className="agency-field"><label>Adresse</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
        {message && <p style={{ color: 'var(--tech-tertiary)', fontSize: '0.85rem' }}>{message}</p>}
        <button type="submit" disabled={saving} style={{ padding: '0.75rem 1.5rem', background: 'var(--tech-primary)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  );
};

export default AgencyProfile;
