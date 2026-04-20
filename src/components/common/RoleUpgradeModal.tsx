import React, { useState } from 'react';
import api from '../../services/api';
import './RoleUpgradeModal.css';

const AVAILABLE_SKILLS = ['Électricité', 'Plomberie', 'Caméra / CCTV', 'GPS / Tracking', 'Informatique', 'Climatisation', 'Menuiserie', 'Peinture', 'Sécurité', 'Réseau / Fibre'];

interface Props { isOpen: boolean; onClose: () => void; }

const RoleUpgradeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [bio, setBio] = useState('');
  const [motivation, setMotivation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/auth/request-upgrade', { bio, motivation, skills: selectedSkills });
      setSuccess(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la soumission');
    } finally { setSubmitting(false); }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="upgrade-overlay" onClick={onClose}>
        <div className="upgrade-modal" onClick={e => e.stopPropagation()}>
          <h2>Demande envoyée !</h2>
          <p className="subtitle">Votre demande de promotion vers le rôle technicien a été soumise. Un administrateur l'examinera sous peu.</p>
          <button className="upgrade-btn-submit" style={{ width: '100%', marginTop: '1rem' }} onClick={onClose}>Fermer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="upgrade-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={e => e.stopPropagation()}>
        <h2>Devenir Technicien</h2>
        <p className="subtitle">Remplissez ce formulaire pour demander la promotion de votre compte client vers un compte technicien professionnel.</p>
        <form onSubmit={handleSubmit}>
          <div className="upgrade-field">
            <label>Bio professionnelle</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Décrivez votre expérience professionnelle..." rows={3} required />
          </div>
          <div className="upgrade-field">
            <label>Compétences</label>
            <div className="upgrade-skills">
              {AVAILABLE_SKILLS.map(s => (
                <button type="button" key={s} className={`upgrade-skill-chip ${selectedSkills.includes(s) ? 'selected' : ''}`} onClick={() => toggleSkill(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div className="upgrade-field">
            <label>Motivation</label>
            <textarea value={motivation} onChange={e => setMotivation(e.target.value)} placeholder="Pourquoi souhaitez-vous devenir technicien ?" rows={2} required />
          </div>
          <div className="upgrade-actions">
            <button type="button" className="upgrade-btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="upgrade-btn-submit" disabled={submitting || selectedSkills.length === 0}>{submitting ? 'Envoi...' : 'Soumettre'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleUpgradeModal;
