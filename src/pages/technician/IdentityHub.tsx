import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTechProfile, updateTechLocation, updateTechProfile } from '../../services/technicianService';
import TechServiceMap from '../../components/maps/TechServiceMap';
import './IdentityHub.css';

const competencesOptions = [
    'Électricité',
    'Plomberie',
    'Climatisation / Froid',
    'Vidéosurveillance (CCTV)',
    'Alarme & Sécurité',
    'Contrôle d\'accès',
    'Réseau & Câblage',
    'GPS & Tracking',
    'Maintenance générale',
    'Installation solaire',
];

interface ProfileData {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar_url: string | null;
    verified: boolean;
    rating: number;
    num_reviews: number;
    bio: string;
    competences: string[];
    kyc_approved: boolean;
    service_perimeter: {
        city: string | null;
        address: string | null;
        zones: string[];
        latitude: number | null;
        longitude: number | null;
        radius: number;
    };
}

const IdentityHub: React.FC = () => {
    const [isFabOpen, setIsFabOpen] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
    const [isRadiusModalOpen, setIsRadiusModalOpen] = useState(false);
    const [tempRadius, setTempRadius] = useState(50);
    
    // Edit Profile Logic
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        bio: '',
        competences: [] as string[]
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getTechProfile();
                setProfile(data);
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const confirmUpdateArea = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsRadiusModalOpen(false);
        setIsUpdatingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    // Mocking city retrieval from coordinates for now
                    const city = profile?.service_perimeter?.city || "Cameroon Sector"; 
                    const updatedProfile = await updateTechLocation(latitude, longitude, city, tempRadius);
                    setProfile(updatedProfile);
                } catch (error) {
                    console.error("Error updating location", error);
                    alert('Could not update location.');
                } finally {
                    setIsUpdatingLocation(false);
                }
            },
            (error) => {
                console.error("Geolocation error", error);
                alert('Could not retrieve your location.');
                setIsUpdatingLocation(false);
            }
        );
    };

    const handleUpdateArea = () => {
        setTempRadius(profile?.service_perimeter?.radius || 50);
        setIsRadiusModalOpen(true);
    };

    const openEditModal = () => {
        setEditForm({
            name: profile?.name || '',
            phone: profile?.phone || '',
            bio: profile?.bio || '',
            competences: profile?.competences || []
        });
        setAvatarPreview(null);
        setAvatarFile(null);
        setIsEditModalOpen(true);
    };

    const handleCompetenceToggle = (comp: string) => {
        setEditForm(prev => ({
            ...prev,
            competences: prev.competences.includes(comp)
                ? prev.competences.filter(c => c !== comp)
                : [...prev.competences, comp],
        }));
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

    const handleEditProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append('_method', 'PUT'); // Laravel Spoofing
            formData.append('name', editForm.name);
            formData.append('phone', editForm.phone);
            formData.append('bio', editForm.bio);
            editForm.competences.forEach(comp => formData.append('competences[]', comp));
            
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const updatedProfile = await updateTechProfile(formData);
            setProfile(updatedProfile);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating profile", error);
            alert('Could not update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="tech-profile-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading Profile...</div>;
    }

    return (
        <div className="tech-profile-page">
            <div className="tech-profile-header-wrap">
                <h1 className="tech-profile-title">Professional Profile</h1>
            </div>

            {/* Profile Header Section */}
            <section className="tech-profile-card tech-profile-hero">
                {/* Decorative Background Shape */}
                <div className="tech-profile-bg-shape"></div>
                
                <div className="tech-profile-avatar-wrapper">
                    <img 
                        className="tech-profile-avatar" 
                        src={profile?.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                        alt="Professional headshot" 
                    />
                    <div className="tech-profile-verified-badge">
                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                    </div>
                </div>

                <div className="tech-profile-info">
                    <div className="tech-profile-name-row">
                        <h2>{profile?.name || "Professional"}</h2>
                        {profile?.verified && <span className="tech-badge-verified">Verified Specialist</span>}
                    </div>
                    <p className="tech-profile-id">Tech ID: {profile?.id.split('-')[0].toUpperCase()}</p>
                    
                    <div className="tech-profile-stats">
                        <div className="tech-stat-item">
                            <span className="material-symbols-outlined text-yellow-500" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                            <span className="tech-stat-bold">{(profile?.rating ?? 0) > 0 ? profile?.rating : 'New'}</span>
                            <span className="tech-stat-muted">({profile?.num_reviews ?? 0} Reviews)</span>
                        </div>
                        <div className="tech-stat-divider"></div>
                        <div className="tech-stat-item text-muted">
                            <span className="material-symbols-outlined">task_alt</span>
                            <span>248 Missions Completed</span>
                        </div>
                    </div>
                </div>

                <div className="tech-profile-actions">
                    <button className="tech-btn-public">Public View</button>
                    <button className="tech-btn-share">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </section>

            {/* Bento Grid Layout */}
            <div className="tech-profile-grid">
                
                {/* Personal Information (Main Column) */}
                <div className="tech-profile-main">
                    
                    {/* Personal Info */}
                    <div className="tech-profile-card">
                        <div className="tech-card-header">
                            <h3>Personal Information</h3>
                            <button className="tech-btn-text" onClick={openEditModal}>
                                <span className="material-symbols-outlined text-sm">edit</span> Edit
                            </button>
                        </div>
                        <div className="tech-info-grid">
                            <div className="tech-info-item">
                                <label>Full Name</label>
                                <p>{profile?.name}</p>
                            </div>
                            <div className="tech-info-item">
                                <label>Email Address</label>
                                <p>{profile?.email}</p>
                            </div>
                            <div className="tech-info-item">
                                <label>Phone Number</label>
                                <p>{profile?.phone || "Not provided"}</p>
                            </div>
                            <div className="tech-info-item">
                                <label>Specialties</label>
                                <div className="tech-lang-tags">
                                    {profile?.competences && profile.competences.length > 0 ? (
                                        profile.competences.map((comp, idx) => <span key={idx}>{comp}</span>)
                                    ) : (
                                        <span>General Maintenance</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="tech-info-bio">
                            <label>Professional Bio</label>
                            <p>{profile?.bio || "No professional bio provided yet. Add one to increase your match rate!"}</p>
                        </div>
                    </div>

                    {/* Service Perimeter */}
                    <div className="tech-profile-card">
                        <div className="tech-card-header">
                            <h3>Service Perimeter</h3>
                            <button className="tech-btn-text" onClick={handleUpdateArea} disabled={isUpdatingLocation}>
                                <span className="material-symbols-outlined text-sm">map</span> 
                                {isUpdatingLocation ? 'Locating...' : 'Update Area'}
                            </button>
                        </div>
                        
                        <div className="tech-map-container" style={{ height: '300px' }}>
                            <TechServiceMap 
                                latitude={profile?.service_perimeter?.latitude || 4.0511} 
                                longitude={profile?.service_perimeter?.longitude || 9.7679} 
                                city={profile?.service_perimeter?.city || 'Cameroon Hub'}
                                radiusInKm={profile?.service_perimeter?.radius || 50}
                            />
                        </div>

                        {/* Radius Selection Modal */}
                        {isRadiusModalOpen && (
                            <div className="tech-radius-modal-overlay">
                                <div className="tech-radius-modal">
                                    <div className="tech-radius-modal-header">
                                        <h3>Service Perimeter</h3>
                                        <button onClick={() => setIsRadiusModalOpen(false)}>×</button>
                                    </div>
                                    <div className="tech-radius-modal-body">
                                        <p>Select your intervention radius to update your service area.</p>
                                        <div className="tech-radius-options">
                                            {[5, 10, 25, 50, 100].map((r) => (
                                                <button 
                                                    key={r} 
                                                    className={`tech-radius-opt ${tempRadius === r ? 'active' : ''}`}
                                                    onClick={() => setTempRadius(r)}
                                                >
                                                    {r} km
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="tech-radius-modal-footer">
                                        <button className="tech-btn-cancel" onClick={() => setIsRadiusModalOpen(false)}>Cancel</button>
                                        <button className="tech-btn-confirm" onClick={confirmUpdateArea}>
                                            {isUpdatingLocation ? 'Updating...' : 'Update & Localize'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="tech-zone-tags">
                            {profile?.service_perimeter?.zones && profile.service_perimeter.zones.length > 0 ? (
                                profile.service_perimeter.zones.map((zone, idx) => (
                                    <span className="tech-zone-tag" key={idx}>
                                        <span className="material-symbols-outlined">check_circle</span> {zone}
                                    </span>
                                ))
                            ) : (
                                <span className="tech-zone-tag tech-zone-empty">Updating coordinates allows for {profile?.service_perimeter?.radius || 50}km radius matching.</span>
                            )}
                        </div>
                    </div>

                    {/* Edit Profile Modal */}
                    {isEditModalOpen && (
                        <div className="tech-radius-modal-overlay">
                            <div className="tech-radius-modal tech-edit-modal">
                                <div className="tech-radius-modal-header">
                                    <h3>Edit Professional Profile</h3>
                                    <button onClick={() => setIsEditModalOpen(false)}>×</button>
                                </div>
                                <form onSubmit={handleEditProfileSubmit} className="tech-edit-form">
                                    <div className="tech-avatar-edit-zone">
                                        <div className="tech-avatar-edit-preview">
                                            <img 
                                                src={avatarPreview || profile?.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                                                alt="Avatar preview" 
                                            />
                                            <label className="tech-avatar-upload-btn">
                                                <input type="file" onChange={handleAvatarChange} accept="image/*" hidden />
                                                <span className="material-symbols-outlined">photo_camera</span>
                                            </label>
                                        </div>
                                        <p>Click the camera to upload a professional photo</p>
                                    </div>

                                    <div className="tech-form-grid">
                                        <div className="tech-form-item">
                                            <label>Full Name</label>
                                            <input 
                                                type="text" 
                                                value={editForm.name} 
                                                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                required
                                            />
                                        </div>
                                        <div className="tech-form-item">
                                            <label>Phone Number</label>
                                            <input 
                                                type="text" 
                                                value={editForm.phone} 
                                                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="tech-form-item">
                                        <label>Professional Bio</label>
                                        <textarea 
                                            value={editForm.bio} 
                                            onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                            rows={2}
                                            placeholder="Write a brief professional introduction..."
                                        />
                                    </div>

                                    <div className="tech-form-item">
                                        <label>Professional Specialties</label>
                                        <div className="tech-form-competences-grid">
                                            {competencesOptions.map(comp => (
                                                <button 
                                                    key={comp} 
                                                    type="button"
                                                    className={`tech-form-comp-tag ${editForm.competences.includes(comp) ? 'active' : ''}`}
                                                    onClick={() => handleCompetenceToggle(comp)}
                                                >
                                                    {comp}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="tech-radius-modal-footer">
                                        <button type="button" className="tech-btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                        <button type="submit" className="tech-btn-confirm" disabled={isSaving}>
                                            {isSaving ? 'Saving...' : 'Save Profile'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings & Status (Side Column) */}
                <div className="tech-profile-sidebar">
                    
                    {/* Trust/KYC Status Card */}
                    <div className="tech-kyc-card">
                        <div className="tech-kyc-bg-icon">
                            <span className="material-symbols-outlined">verified_user</span>
                        </div>
                        <div className="z-10 relative">
                            <h4>KYC Status</h4>
                            <p>{profile?.kyc_approved ? 'Your identity documents are fully verified.' : 'Your identity documents are pending reflection.'}</p>
                            <div className="tech-kyc-status">
                                <span className={`tech-kyc-dot ${!profile?.kyc_approved ? 'pending' : ''}`}></span>
                                <span className="tech-kyc-label">{profile?.kyc_approved ? 'Fully Compliant' : 'Pending KYC'}</span>
                            </div>
                            <button className="tech-btn-kyc">View Credentials</button>
                        </div>
                    </div>

                    {/* Account Settings Links */}
                    <div className="tech-profile-card">
                        <h3 className="tech-settings-title">Account Settings</h3>
                        <div className="tech-settings-list">
                            <a href="#" className="tech-settings-item">
                                <div className="tech-settings-item-main">
                                    <span className="material-symbols-outlined">security</span>
                                    <span>Login &amp; Security</span>
                                </div>
                                <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                            </a>
                            <a href="#" className="tech-settings-item">
                                <div className="tech-settings-item-main">
                                    <span className="material-symbols-outlined">notifications_active</span>
                                    <span>Notification Preferences</span>
                                </div>
                                <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                            </a>
                            <a href="#" className="tech-settings-item">
                                <div className="tech-settings-item-main">
                                    <span className="material-symbols-outlined">payments</span>
                                    <span>Payout Settings</span>
                                </div>
                                <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                            </a>
                            <a href="#" className="tech-settings-item">
                                <div className="tech-settings-item-main">
                                    <span className="material-symbols-outlined">privacy_tip</span>
                                    <span>Data &amp; Privacy</span>
                                </div>
                                <span className="material-symbols-outlined text-outline text-sm">chevron_right</span>
                            </a>
                        </div>
                        <div className="tech-settings-footer">
                            <button className="tech-btn-logout">
                                <span className="material-symbols-outlined">logout</span> Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Help Widget */}
                    <div className="tech-help-card">
                        <span className="material-symbols-outlined tech-help-icon">contact_support</span>
                        <h4>Need assistance?</h4>
                        <p>Our dedicated technician support team is available 24/7.</p>
                        <button className="tech-btn-text">Contact Support</button>
                    </div>

                </div>
            </div>
            {/* Backdrop pour l'effet de flou et fermer en cliquant à côté */}
            <div 
                className={`tech-fab-backdrop ${isFabOpen ? 'open' : ''}`}
                onClick={() => setIsFabOpen(false)}
            ></div>

            {/* Floating Action Button (FAB) */}
            <div className="tech-fab-container">
                <div className={`tech-fab-menu ${isFabOpen ? 'open' : ''}`}>
                    <button 
                        className="tech-fab-item"
                        onClick={() => navigate('/technicien/verification')}
                    >
                        <span className="material-symbols-outlined">folder_shared</span>
                        Documents KYC
                    </button>
                    <button 
                        className="tech-fab-item"
                        onClick={() => navigate('/technicien/audit-sla')}
                    >
                        <span className="material-symbols-outlined">gavel</span>
                        Compliance
                    </button>
                </div>
                <button 
                    className={`tech-fab-main ${isFabOpen ? 'open' : ''}`}
                    onClick={() => setIsFabOpen(!isFabOpen)}
                    aria-label="Menu d'actions"
                >
                    <span className="material-symbols-outlined">
                        {isFabOpen ? 'close' : 'add'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default IdentityHub;
