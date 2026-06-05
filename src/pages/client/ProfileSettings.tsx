import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import requestService from '../../services/requestService';
import { EmptyState } from '../../components/common/AsyncStates';
import RoleUpgradeModal from '../../components/common/RoleUpgradeModal';
import './ProfileSettings.css';

const ProfileSettings: React.FC = () => {
    const { user } = useAuth();
    const [twoFactor, setTwoFactor] = useState(user?.two_factor_enabled || false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || ''
    });
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Enrôlement 2FA ────────────────────────────────────────
    const [twoFAModal, setTwoFAModal] = useState<'setup' | 'disable' | null>(null);
    const [twoFAData, setTwoFAData] = useState<{ secret: string; qr_code_svg: string } | null>(null);
    const [twoFACode, setTwoFACode] = useState('');
    const [twoFAError, setTwoFAError] = useState('');
    const [twoFALoading, setTwoFALoading] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const data = await authService.getLocations();
            setLocations(data);
        } catch (error) {
            console.error('Failed to fetch locations', error);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Update profile info
            await authService.updateProfile({
                name: editForm.name,
                phone: editForm.phone
            });

            // Update avatar if a new file was selected
            if (avatarFile) {
                await authService.updateAvatar(avatarFile);
            }

            setIsEditModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Profile update failed', error);
            alert('Could not update profile.');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = () => {
        setEditForm({
            name: user?.name || '',
            phone: user?.phone || '',
            email: user?.email || ''
        });
        setAvatarPreview(null);
        setAvatarFile(null);
        setIsEditModalOpen(true);
    };

    // Clic sur le toggle 2FA : ouvre l'activation (avec QR) ou la désactivation.
    const handleToggle2FA = async () => {
        setTwoFAError('');
        setTwoFACode('');
        if (twoFactor) {
            setTwoFAModal('disable');
            return;
        }
        setTwoFAModal('setup');
        setTwoFALoading(true);
        try {
            const data = await authService.generate2FA();
            setTwoFAData(data);
        } catch {
            setTwoFAError('Impossible de générer le secret 2FA.');
        } finally {
            setTwoFALoading(false);
        }
    };

    const confirmEnable2FA = async () => {
        if (twoFACode.trim().length < 6) { setTwoFAError('Entrez le code à 6 chiffres.'); return; }
        setTwoFALoading(true);
        setTwoFAError('');
        try {
            await authService.enable2FA(twoFACode.trim());
            setTwoFactor(true);
            closeTwoFAModal();
        } catch (err: any) {
            setTwoFAError(err?.response?.data?.message || 'Code invalide.');
        } finally {
            setTwoFALoading(false);
        }
    };

    const confirmDisable2FA = async () => {
        if (twoFACode.trim().length < 6) { setTwoFAError('Entrez le code à 6 chiffres.'); return; }
        setTwoFALoading(true);
        setTwoFAError('');
        try {
            await authService.disable2FA(twoFACode.trim());
            setTwoFactor(false);
            closeTwoFAModal();
        } catch (err: any) {
            setTwoFAError(err?.response?.data?.message || 'Code invalide.');
        } finally {
            setTwoFALoading(false);
        }
    };

    const closeTwoFAModal = () => {
        setTwoFAModal(null);
        setTwoFAData(null);
        setTwoFACode('');
        setTwoFAError('');
        setTwoFALoading(false);
    };

    const { data: reqRes } = useQuery({ queryKey: ['client-requests'], queryFn: () => requestService.list() });
    const myRequests: any[] = reqRes?.data ?? reqRes ?? [];
    const activeCount = myRequests.filter((r: any) => !['completed', 'cancelled', 'closed', 'done'].includes(String(r.status))).length;
    const stats = {
        totalRequests: myRequests.length,
        activeRequests: activeCount,
    };

    // Pas d'endpoint « favoris » côté backend pour l'instant.
    const favorites: any[] = [];

    return (
        <div className="ps-page">
            <main className="ps-main">
                {/* Hero Profile Section */}
                <section className="ps-hero">
                    <div 
                        className="ps-hero-bg" 
                        style={{ backgroundImage: "url('https://api.dicebear.com/7.x/avataaars/svg?seed=Reliance')" }}
                    />
                    <div className="ps-hero-content">
                        <div className="ps-avatar-wrap">
                            <img 
                                className="ps-avatar" 
                                src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reliance'} 
                                alt={user?.name || 'Profile'} 
                            />
                            <div className="ps-verified-badge">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                            </div>
                        </div>
                        <div className="ps-hero-text">
                            <h1 className="ps-user-name">{user?.name || 'Client Name'}</h1>
                            <div className="ps-hero-meta">
                                <span className="ps-badge-outline">Verified Account</span>
                                <span className="text-xs">Joined June 2023</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="ps-grid">
                    {/* Left Column: Personal Info & Security */}
                    <div className="ps-col-left ps-section-stack">
                        {/* Personal Information */}
                        <div className="glass-card">
                            <div className="ps-section-header">
                                <h2 className="ps-section-title">
                                    <span className="material-symbols-outlined">person</span>
                                    Personal Information
                                </h2>
                                <button className="ps-edit-btn" onClick={openEditModal}>
                                    <span className="material-symbols-outlined text-sm">edit</span> Edit Profile
                                </button>
                            </div>
                            <div className="ps-info-grid">
                                <div className="ps-info-item">
                                    <label>Full Name</label>
                                    <p>{user?.name || 'Not provided'}</p>
                                </div>
                                <div className="ps-info-item">
                                    <label>Phone Number</label>
                                    <p>{user?.phone || 'Not provided'}</p>
                                </div>
                                <div className="ps-info-item">
                                    <label>Email Address</label>
                                    <p className="opacity-60">{user?.email || 'Not provided'}</p>
                                </div>
                                <div className="ps-info-item ps-info-full">
                                    <label>Primary Address</label>
                                    <div className="flex items-start gap-2 mt-1">
                                        <span className="material-symbols-outlined text-slate-400">location_on</span>
                                        <p>{locations.find(l => l.is_default)?.address || 'Rue 1.234, Akwa, Douala, Cameroon'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security & Trust */}
                        <div className="glass-card">
                            <h2 className="ps-section-title mb-6">
                                <span className="material-symbols-outlined">shield_lock</span>
                                Security & Trust
                            </h2>
                            <div className="ps-security-list">
                                <div className="ps-security-item">
                                    <div className="ps-sec-left">
                                        <div className="ps-sec-icon-circle">
                                            <span className="material-symbols-outlined">vibration</span>
                                        </div>
                                        <div>
                                            <p className="ps-sec-title">Two-Factor Authentication</p>
                                            <p className="ps-sec-desc">Secure your account with SMS codes</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`ps-toggle ${twoFactor ? 'active' : ''}`}
                                        onClick={handleToggle2FA}
                                        style={{ backgroundColor: twoFactor ? 'var(--ds-tertiary-container)' : '#cbd5e1' }}
                                    >
                                        <div 
                                            className="ps-toggle-dot"
                                            style={{ right: twoFactor ? '0.25rem' : 'auto', left: twoFactor ? 'auto' : '0.25rem' }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="ps-security-item">
                                    <div className="ps-sec-left">
                                        <div className="ps-sec-icon-circle">
                                            <span className="material-symbols-outlined">password</span>
                                        </div>
                                        <div>
                                            <p className="ps-sec-title">Password Management</p>
                                            <p className="ps-sec-desc">Last changed 3 months ago</p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 border border-outline rounded-full text-xs font-bold hover:bg-white transition-all" onClick={openEditModal}>Update</button>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="glass-card">
                            <div className="ps-section-header">
                                <h2 className="ps-section-title">
                                    <span className="material-symbols-outlined">payments</span>
                                    Payment Methods
                                </h2>
                                <button className="bg-primary text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-secondary transition-all" onClick={openEditModal}>
                                    + Add New
                                </button>
                            </div>
                            
                            <div className="ps-payments-wrap">
                                <div className="ps-card-visa">
                                    <div className="flex justify-between items-start">
                                        <span className="material-symbols-outlined">contactless</span>
                                        <span className="font-bold italic">VISA</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] opacity-80">Card Number</p>
                                        <p className="tracking-widest font-mono">•••• •••• •••• 4242</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] uppercase opacity-60">Expires</p>
                                            <p className="text-sm">12/26</p>
                                        </div>
                                        <div className="bg-white/20 px-2 py-1 rounded text-[10px]">Primary</div>
                                    </div>
                                </div>
                                <div className="ps-card-add">
                                    <span className="material-symbols-outlined text-4xl">add_card</span>
                                    <p className="text-xs font-bold">Add MTN/Orange Money</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Service History Bento */}
                    <div className="ps-col-right ps-section-stack">
                        {/* Service Stats Card */}
                        <div className="ps-stats-card">
                            <div className="relative z-10">
                                <h2 className="ps-stats-header">Service Summary</h2>
                                <div className="ps-stats-grid">
                                    <div className="ps-stat-box">
                                        <p className="ps-stat-val">{stats.totalRequests}</p>
                                        <p className="ps-stat-label">Demandes totales</p>
                                    </div>
                                    <div className="ps-stat-box">
                                        <p className="ps-stat-val">{stats.activeRequests}</p>
                                        <p className="ps-stat-label">Demandes actives</p>
                                    </div>
                                </div>
                            </div>
                            <span className="material-symbols-outlined ps-stats-bg-icon text-9xl">analytics</span>
                        </div>

                        {/* Favorite Technicians */}
                        <div className="glass-card ps-fav-card">
                            <h3 className="ps-stats-header text-primary-container" style={{ fontSize: '1rem' }}>Favorite Technicians</h3>
                            <div className="ps-fav-list">
                                {favorites.length === 0 ? (
                                    <EmptyState icon="favorite" title="Aucun favori" message="Ajoutez des techniciens à vos favoris depuis leur profil." />
                                ) : (
                                    favorites.map((tech: any) => (
                                        <div key={tech.id} className="ps-fav-item group">
                                            <div className="ps-fav-info">
                                                <img className="ps-fav-avatar" src={tech.avatar} alt={tech.name} />
                                                <div>
                                                    <p className="ps-fav-name">{tech.name}</p>
                                                    <p className="ps-fav-role">{tech.role}</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined ps-fav-heart" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Help Banner */}
                        <div className="ps-help-banner">
                            <div className="ps-help-icon-box">
                                <span className="material-symbols-outlined text-primary">help</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">Need help?</p>
                                <p className="text-xs text-slate-500">Contact our 24/7 support team</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="ps-modal-overlay">
                    <div className="ps-modal glass-card">
                        <div className="ps-modal-header">
                            <h3 className="ps-modal-title">Edit Profile</h3>
                            <button className="ps-modal-close" onClick={() => setIsEditModalOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveProfile} className="ps-modal-form">
                            <div className="ps-modal-avatar-section">
                                <div className="ps-modal-avatar-preview">
                                    <img 
                                        src={avatarPreview || user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Reliance'} 
                                        alt="Avatar preview" 
                                    />
                                    <label className="ps-modal-avatar-upload">
                                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" hidden />
                                        <span className="material-symbols-outlined">photo_camera</span>
                                    </label>
                                </div>
                                <p className="ps-modal-avatar-hint">Click the camera to change photo</p>
                            </div>

                            <div className="ps-modal-fields">
                                <div className="ps-modal-field">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        className="ps-input"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="ps-modal-field">
                                    <label>Phone Number</label>
                                    <input 
                                        type="text" 
                                        className="ps-input"
                                        value={editForm.phone}
                                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    />
                                </div>
                                <div className="ps-modal-field">
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        className="ps-input opacity-60"
                                        value={editForm.email}
                                        disabled
                                    />
                                    <p className="text-[10px] mt-1 text-slate-400">Email cannot be changed here</p>
                                </div>
                            </div>

                            <div className="ps-modal-footer">
                                <button type="button" className="ps-modal-btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="ps-modal-btn-save" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CTA Devenir Technicien */}
            <div className="ps-card" style={{ background: 'linear-gradient(135deg, var(--color-primary-blue), var(--color-bg-gradient-start))', color: '#fff', textAlign: 'center', padding: '2rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>engineering</span>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Devenir Technicien</h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1rem' }}>Rejoignez notre réseau de professionnels et proposez vos services.</p>
                <button
                    onClick={() => setShowUpgradeModal(true)}
                    style={{ padding: '0.7rem 1.5rem', background: '#fff', color: 'var(--color-primary-blue)', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                    Faire une demande
                </button>
            </div>

            <RoleUpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

            {/* Modale 2FA — activation (QR + code) / désactivation (code) */}
            {twoFAModal && (
                <div className="ps-2fa-backdrop" onClick={closeTwoFAModal}>
                    <div className="ps-2fa-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="ps-2fa-close" onClick={closeTwoFAModal}>
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        {twoFAModal === 'setup' ? (
                            <>
                                <h2 className="ps-2fa-title">Activer la double authentification</h2>
                                <p className="ps-2fa-desc">Scannez ce QR code avec Google Authenticator, puis entrez le code à 6 chiffres généré.</p>
                                {twoFALoading && !twoFAData ? (
                                    <div className="ps-2fa-loading">
                                        <span className="material-symbols-outlined ps-2fa-spin">progress_activity</span>
                                        <p>Génération du secret…</p>
                                    </div>
                                ) : twoFAData ? (
                                    <>
                                        <div className="ps-2fa-qr" dangerouslySetInnerHTML={{ __html: twoFAData.qr_code_svg }} />
                                        <p className="ps-2fa-secret">Clé manuelle : <code>{twoFAData.secret}</code></p>
                                    </>
                                ) : null}
                            </>
                        ) : (
                            <>
                                <h2 className="ps-2fa-title">Désactiver la double authentification</h2>
                                <p className="ps-2fa-desc">Entrez un code de votre application d'authentification pour confirmer la désactivation.</p>
                            </>
                        )}

                        {(twoFAModal === 'disable' || twoFAData) && (
                            <input
                                className="ps-2fa-input"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="123456"
                                value={twoFACode}
                                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
                            />
                        )}

                        {twoFAError && <p className="ps-2fa-error">{twoFAError}</p>}

                        {(twoFAModal === 'disable' || twoFAData) && (
                            <button
                                className="ps-2fa-submit"
                                disabled={twoFALoading}
                                onClick={twoFAModal === 'setup' ? confirmEnable2FA : confirmDisable2FA}
                            >
                                {twoFALoading ? 'Veuillez patienter…' : twoFAModal === 'setup' ? 'Activer' : 'Désactiver'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSettings;
