import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RequestWizard.css';

const RequestWizard: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [analysisPhase, setAnalysisPhase] = useState(0);
    const [showStepNav, setShowStepNav] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        description: '',
        latitude: 0,
        longitude: 0,
        files: [] as File[] // For UI simulation purposes
    });

    // Auto-detect location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                },
                () => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: 3.848,
                        longitude: 11.5021
                    }));
                }
            );
        }
    }, []);

    const updateForm = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const totalSteps = 3;

    const nextStep = () => {
        if (step === totalSteps) {
            startAiAnalysis();
        } else {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
        else navigate('/espace-client/dashboard');
    };

    const startAiAnalysis = () => {
        setStep(4); // AI Analysis triggers automatically
        setTimeout(() => setAnalysisPhase(1), 1500);
        setTimeout(() => setAnalysisPhase(2), 3000);
        setTimeout(() => setAnalysisPhase(3), 4500);
        setTimeout(() => setAnalysisPhase(4), 5500);
        setTimeout(() => {
            navigate('/espace-client/matching');
        }, 7000);
    };

    // Helper for sidebar items
    const renderSidebarItem = (itemStep: number, label: string, icon: string) => {
        const isActive = step === itemStep;
        const isPast = step > itemStep;
        
        let className = "rw-sidebar-item";
        if (isActive) className += " is-active";
        else className += " is-default";

        return (
            <div className={className} onClick={() => {
                if (isPast && step <= totalSteps) setStep(itemStep);
            }}>
                <span className="material-symbols-outlined rw-nav-icon" style={{ fontVariationSettings: isActive || isPast ? "'FILL' 1" : "'FILL' 0" }}>
                    {icon}
                </span>
                <span className="rw-nav-label">{label}</span>
            </div>
        );
    };

    return (
        <div className="rw-page">
            <div className="rw-body-layout">
                {/* Floating Step Nav Toggle Button */}
                <button className="rw-fab-step-toggle" onClick={() => setShowStepNav(!showStepNav)}>
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>route</span>
                    <span className="rw-fab-step-label">Step {Math.min(step, 4)}/4</span>
                </button>

                {/* Floating Modal - Step Progress */}
                {showStepNav && <div className="rw-step-modal-backdrop" onClick={() => setShowStepNav(false)} />}
                <aside className={`rw-step-modal ${showStepNav ? 'is-open' : ''}`}>
                    <div className="rw-step-modal-header">
                        <div>
                            <h2>Wizard Progress</h2>
                            <p>Step {Math.min(step, 4)} of 4</p>
                        </div>
                        <button className="rw-step-modal-close" onClick={() => setShowStepNav(false)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <nav className="rw-step-modal-nav">
                        {renderSidebarItem(1, "Categories", "category")}
                        {renderSidebarItem(2, "Details", "description")}
                        {renderSidebarItem(3, "Uploads", "cloud_upload")}
                        {renderSidebarItem(4, "Analysis", "biotech")}
                    </nav>
                    <div className="rw-step-modal-progress">
                        <div className="rw-step-modal-bar">
                            <div className="rw-step-modal-bar-fill" style={{width: `${(Math.min(step, 4) / 4) * 100}%`}}></div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="rw-main-content">
                    {/* STEP 1: CATEGORY SELECTION */}
                    {step === 1 && (
                        <div className="rw-step-container anim-fade-in">
                            <header className="rw-step-header">
                                <span className="rw-step-tag">REQUESTWIZARD</span>
                                <h1 className="rw-step-title">What do you need help with?</h1>
                                <p className="rw-step-desc">Select a category that best describes your technical request. We'll match you with the right specialist for the job.</p>
                            </header>

                            {/* Categories Grid (Asymmetric Bento Inspired Layout) */}
                            <div className="rw-categories-grid">
                                
                                <div 
                                    className={`rw-cat-card ${formData.category === 'plomberie' ? 'is-selected' : 'is-default'}`}
                                    onClick={() => updateForm('category', 'plomberie')}
                                >
                                    {formData.category === 'plomberie' && (
                                        <div className="rw-cat-check text-sm"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>done</span></div>
                                    )}
                                    <div className="rw-cat-icon-wrap bg-blue-tint">
                                        <span className="material-symbols-outlined rw-icon-primary">plumbing</span>
                                    </div>
                                    <h3 className="rw-cat-title text-primary-color">Plumbing</h3>
                                    <p className="rw-cat-desc">Fix leaks, install new fixtures, or resolve complex drainage and piping issues in residential or commercial settings.</p>
                                </div>

                                <div 
                                    className={`rw-cat-card ${formData.category === 'electricite' ? 'is-selected' : 'is-default'}`}
                                    onClick={() => updateForm('category', 'electricite')}
                                >
                                    {formData.category === 'electricite' && (
                                        <div className="rw-cat-check text-sm"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>done</span></div>
                                    )}
                                    <div className="rw-cat-icon-wrap bg-yellow-tint">
                                        <span className="material-symbols-outlined rw-icon-yellow">electrical_services</span>
                                    </div>
                                    <h3 className="rw-cat-title text-on-surface-color">Electricity</h3>
                                    <p className="rw-cat-desc">Wiring repairs, lighting installation, fuse box upgrades, and comprehensive electrical safety inspections.</p>
                                </div>

                                <div 
                                    className={`rw-cat-card ${formData.category === 'mecanique' ? 'is-selected' : 'is-default'}`}
                                    onClick={() => updateForm('category', 'mecanique')}
                                >
                                    {formData.category === 'mecanique' && (
                                        <div className="rw-cat-check text-sm"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>done</span></div>
                                    )}
                                    <div className="rw-cat-icon-wrap bg-red-tint">
                                        <span className="material-symbols-outlined rw-icon-red">car_repair</span>
                                    </div>
                                    <h3 className="rw-cat-title text-on-surface-color">Car Mechanics</h3>
                                    <p className="rw-cat-desc">Engine diagnostics, brake service, transmission repair, and routine maintenance for all vehicle makes and models.</p>
                                </div>

                                <div 
                                    className={`rw-cat-card ${formData.category === 'electronique' ? 'is-selected' : 'is-default'}`}
                                    onClick={() => updateForm('category', 'electronique')}
                                >
                                    {formData.category === 'electronique' && (
                                        <div className="rw-cat-check text-sm"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>done</span></div>
                                    )}
                                    <div className="rw-cat-icon-wrap bg-green-tint">
                                        <span className="material-symbols-outlined rw-icon-green">devices</span>
                                    </div>
                                    <h3 className="rw-cat-title text-on-surface-color">Electronics</h3>
                                    <p className="rw-cat-desc">Smart home setups, device repairs, hardware upgrades, and specialized micro-soldering for circuit boards.</p>
                                </div>
                            </div>

                            {/* Descriptive Image Card (Bento Style Extension) */}
                            <div className="rw-promo-grid">
                                <div className="rw-promo-image-card group-hover-trigger">
                                    <img 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8SEJfzRWe7laPxlk9GCTnsVpcIJqN-VQc3qpfpuiGE4p238f4WlZOWPD6KYFIUUnD0kAd1hueBq6E52VGgK14J1eHg1JLX0dtC8TPvJSV_B0-qTUnX--HIg6GKC0rhMoXeRuYwXbyKYDsa8bDIlKycYwzCCQBNHO6TASZnnaMLfNbtY_keaIGx0wO2d2ZZJvDOlSbnTdXDoqIY7FkfN4fW0hneN3h6-9J3lMA7WCIKxsE_3sKMw7ELamIeZa1xZDNLm_LfOAIFA" 
                                        alt="Technician at work" 
                                        className="rw-promo-img"
                                    />
                                    <div className="rw-promo-img-overlay">
                                        <h4>Trusted Experts Only</h4>
                                        <p>Every specialist on TechMarket is verified through a rigorous 5-step background and skills assessment.</p>
                                    </div>
                                </div>
                                <div className="rw-promo-text-card">
                                    <div className="rw-promo-icon-wrap">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                                    </div>
                                    <h3>Satisfaction Guaranteed</h3>
                                    <p>We hold your payment in escrow until the job is completed to your satisfaction. Our 24/7 support team is always here to help.</p>
                                    
                                    <button 
                                        className="rw-promo-btn"
                                        onClick={nextStep}
                                        disabled={!formData.category}   
                                    >
                                        Next Step
                                        <span className="material-symbols-outlined ml-2 arrow-icon">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DETAILS */}
                    {step === 2 && (
                        <div className="rw-step2-wrapper anim-fade-in">
                            {/* Header & Progress Visual */}
                            <header className="rw-step-header-compact">
                                <div className="rw-progress-bar">
                                    <div className="rw-progress-segment is-active"></div>
                                    <div className="rw-progress-segment is-active"></div>
                                    <div className="rw-progress-segment"></div>
                                    <div className="rw-progress-segment"></div>
                                    <div className="rw-progress-segment"></div>
                                </div>
                                <h1 className="rw-step-title-compact">Détails du problème</h1>
                                <p className="rw-step-desc-compact">Aidez nos experts à comprendre le problème en fournissant des informations claires et concises.</p>
                            </header>

                            {/* Glassmorphism Container Form */}
                            <section className="rw-glass-box">
                                {/* Decorative Gradient */}
                                <div className="rw-glass-blob"></div>
                                
                                <form className="rw-glass-form" onSubmit={(e) => { e.preventDefault(); nextStep(); }}>
                                    {/* Title Input */}
                                    <div className="rw-input-group">
                                        <label htmlFor="problem-title">Titre du problème</label>
                                        <input 
                                            id="problem-title"
                                            type="text"
                                            placeholder="ex: Fuite d'eau sous l'évier de la cuisine"
                                            value={formData.title}
                                            onChange={(e) => updateForm('title', e.target.value)}
                                            required
                                            className="rw-input"
                                        />
                                        <p className="rw-input-hint">Décrivez brièvement le problème en 5 à 10 mots.</p>
                                    </div>

                                    {/* Description Textarea */}
                                    <div className="rw-input-group">
                                        <label htmlFor="problem-description">Description détaillée</label>
                                        <textarea 
                                            id="problem-description"
                                            rows={6}
                                            placeholder="Depuis quand avez-vous remarqué le problème ? Avez-vous déjà essayé de le réparer ?"
                                            value={formData.description}
                                            onChange={(e) => updateForm('description', e.target.value)}
                                            required
                                            className="rw-input rw-textarea"
                                        ></textarea>
                                        <div className="rw-input-footer">
                                            <p className="rw-input-hint">Incluez les codes d'erreur, bruits ou signes visuels.</p>
                                            <span className="rw-char-count">{formData.description.length} / 500 caractères</span>
                                        </div>
                                    </div>

                                    {/* Visual Card Accent (Asymmetric Pattern) */}
                                    <div className="rw-tips-grid">
                                        <div className="rw-tip-card rw-tip-pro">
                                            <span className="material-symbols-outlined rw-tip-icon">lightbulb</span>
                                            <div>
                                                <h4>Conseil Pro</h4>
                                                <p>Ajouter des photos à la prochaine étape augmente le taux de réponse de 40%.</p>
                                            </div>
                                        </div>
                                        <div className="rw-tip-card rw-tip-priority">
                                            <span className="material-symbols-outlined rw-tip-icon">verified_user</span>
                                            <div>
                                                <h4>Support Prioritaire</h4>
                                                <p>Les requêtes vérifiées sont directement transmises aux experts certifiés.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="rw-form-actions">
                                        <button className="rw-btn-secondary" type="button" onClick={prevStep}>
                                            <span className="material-symbols-outlined">arrow_back</span>
                                            Étape précédente
                                        </button>
                                        <button className="rw-btn-primary" type="submit" disabled={!formData.title.trim()}>
                                            Enregistrer & Continuer
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </button>
                                    </div>
                                </form>
                            </section>
                        </div>
                    )}

                    {/* STEP 3: UPLOAD PHOTOS */}
                    {step === 3 && (
                        <div className="rw-step3-wrapper anim-fade-in">
                            <div className="rw-step-header-compact">
                                <h1 className="rw-step-title-compact">Contexte Visuel</h1>
                                <p className="rw-step-desc-compact">Aidez notre IA et nos techniciens à comprendre la nature exacte du problème technique. Des photos claires augmentent la précision du devis de 40%.</p>
                            </div>

                            {/* Bento Grid Layout for Upload Section */}
                            <div className="rw-upload-grid">
                                {/* Main Upload Zone (Large Span) */}
                                <div className="rw-dropzone">
                                    <div className="rw-dropzone-overlay"></div>
                                    <div className="rw-dropzone-icon-wrap">
                                        <span className="material-symbols-outlined text-4xl" style={{color: 'var(--on-secondary-container)'}}>add_a_photo</span>
                                    </div>
                                    <h3>Glissez-déposez vos photos</h3>
                                    <p>PNG, JPG ou HEIC (10Mo max par appareil)</p>
                                    <label className="rw-btn-upload cursor-pointer">
                                        <span className="material-symbols-outlined">file_upload</span>
                                        Parcourir
                                        <input type="file" multiple accept="image/*" style={{display: 'none'}} />
                                    </label>
                                </div>

                                {/* AI Estimation Helper Card */}
                                <div className="rw-ai-insight">
                                    <div className="rw-ai-header">
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                        <span>Analyse IA</span>
                                    </div>
                                    <p className="rw-ai-desc">
                                        Notre IA analyse vos photos pour détecter les modèles de composants, l'usure visible et la complexité de l'environnement.
                                    </p>
                                    <div className="rw-ai-footer">
                                        <ul>
                                            <li>
                                                <span className="material-symbols-outlined">check</span>
                                                Prenez plusieurs angles
                                            </li>
                                            <li>
                                                <span className="material-symbols-outlined">check</span>
                                                Assurez un bon éclairage
                                            </li>
                                            <li>
                                                <span className="material-symbols-outlined">check</span>
                                                Montrez la zone environnante
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Uploaded Thumbnails (Visual Feedback) */}
                                <div className="rw-thumbnails-section">
                                    <h4 className="rw-thumbnails-title">Fichiers téléversés (3)</h4>
                                    <div className="rw-thumbnails-grid">
                                        {/* File 1 */}
                                        <div className="rw-thumbnail-card">
                                            <img 
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4kQZTF7PCMV9MiAzxdvxkPVpQqz8l56Ly7VLYbSXDnChnAqFSWHTQZ7f10YiL4PwTjraLnTyf2IJ_rw4tMh7-r_H0022VU29As7uZqBjVLQ5qsq4fOyKS0-_cxpZVPnk9hicNmk3watMxWubXhUNMI105E8TVE3_sYh1jw-rvnfHgsxNh-I0L5azJNuLI8kOcqxGLM5wCx3XSXohJOS_9kYNtHNx4aKeiZRHtLbjl8eJ_T-Eo1RgHCHZvORF22TamFzYVkrI49g" 
                                                alt="Technical issue 1" 
                                                className="rw-thumb-img"
                                            />
                                            <div className="rw-thumb-overlay">
                                                <button className="rw-thumb-action-view" type="button"><span className="material-symbols-outlined">visibility</span></button>
                                                <button className="rw-thumb-action-delete" type="button"><span className="material-symbols-outlined">delete</span></button>
                                            </div>
                                            <div className="rw-thumb-label-wrap">
                                                <div className="rw-thumb-label">Mainboard_Fault.jpg</div>
                                            </div>
                                        </div>

                                        {/* File 2 */}
                                        <div className="rw-thumbnail-card">
                                            <img 
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNQqHmdj1h8eBzhxV6qju46fjttbwo8KcYdqxckNKp2wf7CmkkdI5S-aA3kv-B0RKaLPvLH-R4CumARcaZkpToFVDs1rkRGeUQL156Vyygh_PSCkPnEhkAhonZV_hrxkHZc2ViBSVzOn6qzSOqPW4YsX3D1WywEvDJkA8JqWKE3gyA9frfi7SKve1cwtCRGDCfVWqslaGrgX7ltFbWgAwDA9ImfQSj2N0wcsXnNw2bp_5p3CA3G64dzz180qPCBMDEK0UHxGAffA" 
                                                alt="Technical issue 2" 
                                                className="rw-thumb-img"
                                            />
                                            <div className="rw-thumb-overlay">
                                                <button className="rw-thumb-action-view" type="button"><span className="material-symbols-outlined">visibility</span></button>
                                                <button className="rw-thumb-action-delete" type="button"><span className="material-symbols-outlined">delete</span></button>
                                            </div>
                                            <div className="rw-thumb-label-wrap">
                                                <div className="rw-thumb-label">Wiring_Context.jpg</div>
                                            </div>
                                        </div>

                                        {/* File 3 (Uploading State) */}
                                        <div className="rw-thumbnail-card-uploading">
                                            <div className="rw-spinner"></div>
                                            <span className="rw-upload-pct">Téléversement 72%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Wizard Navigation Actions */}
                            <div className="rw-step3-actions">
                                <button className="rw-btn-secondary" type="button" onClick={prevStep}>
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    Retour
                                </button>
                                <div className="rw-actions-right">
                                    <span className="rw-step-indicator">Étape 3 sur 5</span>
                                    <button className="rw-btn-primary" type="button" onClick={nextStep}>
                                        Continuer
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: AI ANALYSIS */}
                    {step === 4 && (
                        <div className="rw-step4-wrapper anim-fade-in">
                            {/* Background Decorative Elements */}
                            <div className="rw-ai-bg-overlays">
                                <div className="rw-ai-blob-1"></div>
                                <div className="rw-ai-blob-2"></div>
                            </div>

                            <div className="rw-ai-grid">
                                {/* Left: Phase Status List */}
                                <div className="rw-ai-phases-col">
                                    <div className="rw-glass-panel rw-ai-phases-box">
                                        <h1>Analyse IA en cours...</h1>
                                        
                                        <div className="space-y-6">
                                            {/* Phase 1 */}
                                            <div className="rw-phase-item">
                                                <div className="rw-phase-icon-col">
                                                    <div className={`rw-phase-circle ${analysisPhase >= 1 ? 'completed' : (analysisPhase === 0 ? 'active' : 'pending')}`}>
                                                        <span className={`material-symbols-outlined text-base ${analysisPhase === 0 ? 'animate-spin' : ''}`} style={analysisPhase >= 1 ? {fontVariationSettings: "'FILL' 1"} : {}}>
                                                            {analysisPhase >= 1 ? 'check' : 'sync'}
                                                        </span>
                                                    </div>
                                                    <div className={`rw-phase-line ${analysisPhase >= 1 ? 'completed' : 'pending'}`}></div>
                                                </div>
                                                <div className="rw-phase-text-col">
                                                    <p className={`rw-phase-title ${analysisPhase >= 1 ? 'completed' : (analysisPhase === 0 ? 'active' : 'pending')}`}>Phase 1: Diagnostic de panne</p>
                                                    <p className={`rw-phase-desc ${analysisPhase >= 1 ? '' : 'pending'}`}>
                                                        {analysisPhase >= 1 ? "Analyse des symptômes terminée. Panne qualifiée." : "Analyse des symptômes en cours..."}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Phase 2 */}
                                            <div className="rw-phase-item">
                                                <div className="rw-phase-icon-col">
                                                    <div className={`rw-phase-circle ${analysisPhase >= 2 ? 'completed' : (analysisPhase === 1 ? 'active' : 'pending')}`}>
                                                        <span className={`material-symbols-outlined text-base ${analysisPhase === 1 ? 'animate-spin' : ''}`} style={analysisPhase >= 2 ? {fontVariationSettings: "'FILL' 1"} : {}}>
                                                            {analysisPhase >= 2 ? 'check' : 'sync'}
                                                        </span>
                                                    </div>
                                                    <div className={`rw-phase-line ${analysisPhase >= 2 ? 'completed' : 'pending'}`}></div>
                                                </div>
                                                <div className="rw-phase-text-col">
                                                    <p className={`rw-phase-title ${analysisPhase >= 2 ? 'completed' : (analysisPhase === 1 ? 'active' : 'pending')}`}>Phase 2: Évaluation de la complexité</p>
                                                    <p className={`rw-phase-desc ${analysisPhase >= 2 ? '' : 'pending'}`}>
                                                        {analysisPhase >= 2 ? "Complexité estimée. Durée prévisionnelle calculée." : (analysisPhase === 1 ? "Estimation du temps et des pièces nécessaires..." : "En attente du diagnostic...")}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Phase 3 */}
                                            <div className="rw-phase-item">
                                                <div className="rw-phase-icon-col">
                                                    <div className={`rw-phase-circle ${analysisPhase >= 3 ? 'completed' : (analysisPhase === 2 ? 'active' : 'pending')}`}>
                                                        <span className={`material-symbols-outlined text-base ${analysisPhase === 2 ? 'animate-spin' : ''}`} style={analysisPhase >= 3 ? {fontVariationSettings: "'FILL' 1"} : {}}>
                                                            {analysisPhase >= 3 ? 'check' : 'location_on'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="rw-phase-text-col">
                                                    <p className={`rw-phase-title ${analysisPhase >= 3 ? 'completed' : (analysisPhase === 2 ? 'active' : 'pending')}`}>Phase 3: Recherche de techniciens</p>
                                                    <p className={`rw-phase-desc ${analysisPhase >= 3 ? '' : 'pending'}`}>
                                                        {analysisPhase >= 3 ? "Experts locaux trouvés." : (analysisPhase === 2 ? "Croisement des profils qualifiés à proximité..." : "En attente d'évaluation...")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Center: High-End Radar Visualization */}
                                <div className="rw-ai-radar-col">
                                    <div className="rw-radar-wrap">
                                        <div className="rw-radar-ring-1"></div>
                                        <div className="rw-radar-ring-2"></div>
                                        <div className="rw-radar-ring-3"></div>
                                        
                                        <div className="rw-radar-scan-mask">
                                            <div className="rw-scan-line"></div>
                                        </div>
                                        
                                        <div className="rw-radar-core">
                                            <div className="rw-radar-pct">{Math.min(92, Math.max(12, analysisPhase * 30))}%</div>
                                            <div className="rw-radar-label">Analyse Profonde</div>
                                            <div className="w-full bg-surface-variant h-1 rounded-full mt-3 overflow-hidden">
                                                <div className="bg-primary h-full transition-all duration-1000" style={{width: `${Math.min(92, Math.max(12, analysisPhase * 30))}%`}}></div>
                                            </div>
                                        </div>

                                        {/* Data Points */}
                                        <div className="rw-data-point-1"></div>
                                        <div className="rw-data-point-2"></div>
                                        <div className="rw-data-point-3"></div>
                                    </div>
                                </div>

                                {/* Right: Live Data Feed / Bento Cards */}
                                <div className="rw-ai-metrics-col">
                                    <div className="rw-glass-panel rw-metric-panel">
                                        <div className="rw-metric-header">
                                            <span>Métriques Système</span>
                                            <span className="rw-metric-dot"></span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="rw-metric-row">
                                                <span className="rw-metric-label">Latence</span>
                                                <span className="rw-metric-value">12ms</span>
                                            </div>
                                            <div className="rw-metric-row">
                                                <span className="rw-metric-label">Complexité IA</span>
                                                <span className="rw-metric-value">Élevée (0.84)</span>
                                            </div>
                                            <div className="rw-metric-row">
                                                <span className="rw-metric-label">Modèles Scannés</span>
                                                <span className="rw-metric-value">{300 + analysisPhase * 1150}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rw-glass-panel rw-metric-panel flex-1">
                                        <h4 className="rw-candidates-title">Techniciens Candidats</h4>
                                        <div className="space-y-3 overflow-y-auto max-h-60 pr-2">
                                            {/* Candidate 1 */}
                                            <div className="rw-candidate-card" style={{opacity: analysisPhase >= 2 ? 1 : 0.2, transition: 'opacity 0.5s'}}>
                                                <div className="rw-candidate-avatar"></div>
                                                <div className="flex-1">
                                                    <div className="rw-candidate-line1"></div>
                                                    <div className="rw-candidate-line2"></div>
                                                </div>
                                            </div>
                                            {/* Candidate 2 */}
                                            <div className="rw-candidate-card" style={{opacity: analysisPhase >= 3 ? 0.6 : 0.2, transition: 'opacity 0.5s'}}>
                                                <div className="rw-candidate-avatar"></div>
                                                <div className="flex-1">
                                                    <div className="rw-candidate-line1" style={{width: '3rem'}}></div>
                                                    <div className="rw-candidate-line2" style={{width: '3.5rem'}}></div>
                                                </div>
                                            </div>
                                            {/* Candidate 3 */}
                                            <div className="rw-candidate-card" style={{opacity: analysisPhase >= 3 ? 0.4 : 0.1, transition: 'opacity 0.5s'}}>
                                                <div className="rw-candidate-avatar"></div>
                                                <div className="flex-1">
                                                    <div className="rw-candidate-line1" style={{width: '4.5rem'}}></div>
                                                    <div className="rw-candidate-line2" style={{width: '2rem'}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Action */}
                            <div className="rw-ai-bottom-action">
                                <button className="rw-btn-processing group">
                                    <span>Traitement des résultats</span>
                                    <span className="material-symbols-outlined animate-spin group-hover:rotate-180 duration-500">autorenew</span>
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RequestWizard;
