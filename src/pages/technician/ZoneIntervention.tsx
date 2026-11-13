import React, { useState, useEffect } from 'react';
import { getTechProfile, updateTechLocation } from '../../services/technicianService';
import './ZoneIntervention.css';

const RADIUS_OPTIONS = [5, 10, 15, 20, 30, 50, 75, 100];

const ZoneIntervention: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState(20);
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await getTechProfile();
        // GET /technician/profile expose la zone sous « service_perimeter » (IdentityHubResource).
        const zone = profile?.service_perimeter ?? profile?.location;
        if (zone) {
          setLatitude(zone.latitude ?? zone.meta?.latitude ?? null);
          setLongitude(zone.longitude ?? zone.meta?.longitude ?? null);
          setAddress(zone.address || '');
          setRadius(zone.radius_km || zone.radius || 20);
        }
      } catch { /* silent */ }
    };
    load();
  }, []);

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLatitude(pos.coords.latitude); setLongitude(pos.coords.longitude); },
      () => { setMessage('Géolocalisation refusée'); }
    );
  };

  const handleSave = async () => {
    if (!latitude || !longitude) { setMessage('Veuillez définir votre position'); return; }
    setSaving(true);
    try {
      await updateTechLocation(latitude, longitude, address, radius);
      setMessage('Zone mise à jour avec succès');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Erreur');
    } finally { setSaving(false); }
  };

  return (
    <div className="zone-page">
      <h1 className="zone-title">Zone d'Intervention</h1>
      <p className="zone-subtitle">Définissez votre périmètre de service pour recevoir les demandes pertinentes.</p>

      <div className="zone-grid">
        <div className="zone-map-card">
          <div className="zone-map-placeholder">
            {latitude && longitude ? (
              <div className="zone-map-info">
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--tech-primary)' }}>location_on</span>
                <p>{latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
                <p className="zone-radius-display">Rayon : {radius} km</p>
              </div>
            ) : (
              <div className="zone-map-info">
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--tech-outline-variant)' }}>map</span>
                <p>Aucune position définie</p>
              </div>
            )}
          </div>
        </div>

        <div className="zone-controls-card">
          <div className="zone-field">
            <label>Adresse</label>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Douala, Cameroun" />
          </div>

          <div className="zone-field">
            <label>Coordonnées</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="number" step="0.0001" placeholder="Latitude" value={latitude ?? ''} onChange={e => setLatitude(parseFloat(e.target.value))} />
              <input type="number" step="0.0001" placeholder="Longitude" value={longitude ?? ''} onChange={e => setLongitude(parseFloat(e.target.value))} />
            </div>
            <button className="zone-geolocate-btn" onClick={handleGeolocate}>
              <span className="material-symbols-outlined">my_location</span> Géolocaliser
            </button>
          </div>

          <div className="zone-field">
            <label>Rayon d'intervention</label>
            <div className="zone-radius-grid">
              {RADIUS_OPTIONS.map(r => (
                <button key={r} className={`zone-radius-chip ${radius === r ? 'active' : ''}`} onClick={() => setRadius(r)}>{r} km</button>
              ))}
            </div>
          </div>

          {message && <p className="zone-message">{message}</p>}

          <button className="zone-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer la zone'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoneIntervention;
