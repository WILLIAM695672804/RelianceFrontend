import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RequestWizard.css';
import requestService from '../../../services/requestService';

const RequestWizard: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [analysisPhase, setAnalysisPhase] = useState(0);
    const [showStepNav, setShowStepNav] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        description: '',
        latitude: 0,
        longitude: 0,
        files: [] as File[] // For UI simulation purposes
    });

    const [realMatchedTechnicians, setRealMatchedTechnicians] = useState<any[]>([]);

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

    const [scanCount, setScanCount] = useState(0);
    const [matchRequestId, setMatchRequestId] = useState<string | null>(null);
    const [matchData, setMatchData] = useState<any>(null);

    const startAiAnalysis = async () => {
        setIsSubmitting(true);
        setStep(4);
        setAnalysisPhase(0);
        setRealMatchedTechnicians([]);
        setScanCount(0);

        try {
            // Phase 0 -> 1 : Diagnostic (2s)
            await delay(2000);
            setAnalysisPhase(1);

            // Create the request during phase 1 animation
            const createResponse = await requestService.create({
                title: formData.title,
                description: formData.description,
                category_slug: formData.category || undefined,
                latitude: formData.latitude,
                longitude: formData.longitude,
                photos: formData.files.length > 0 ? formData.files : undefined,
            });

            const requestId = createResponse?.data?.id ?? createResponse?.id;
            setMatchRequestId(requestId);

            // Phase 1 -> 2 : Evaluation (2.5s)
            await delay(2500);
            setAnalysisPhase(2);

            // Trigger matching during phase 2
            const matchResult = await requestService.match(requestId);
            const technicians = matchResult?.data?.technicians || [];
            setMatchData(matchResult?.data);

            // Phase 2 -> 3 : Recherche de techniciens - reveal them progressively
            await delay(2000);
            setAnalysisPhase(3);

            // Reveal technicians one by one with delay
            for (let i = 0; i < technicians.length; i++) {
                await delay(800);
                setScanCount(prev => prev + 1);
                setRealMatchedTechnicians(prev => [...prev, technicians[i]]);
            }

            // If no technicians found, wait a bit to show scanning effect
            if (technicians.length === 0) {
                // Simulate scanning for 4 more seconds
                for (let i = 0; i < 8; i++) {
                    await delay(500);
                    setScanCount(prev => prev + 1);
                }
            }

            // Final phase - results ready
            await delay(1500);
            setAnalysisPhase(4);

            // Wait then navigate
            await delay(1000);
            navigate('/espace-client/matching', {
                state: { matchResult: matchResult.data, requestId },
            });

        } catch (error) {
            console.error("Erreur lors de la creation de la demande:", error);
            setIsSubmitting(false);
            setStep(2);
            alert("Une erreur est survenue lors de l'envoi de votre demande. Veuillez reessayer.");
        }
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
                                    className={`rw-cat-card ${formData.category === 'plomberie-generale' ? 'is-selected' : 'is-default'}`}
                                    onClick={() => updateForm('category', 'plomberie-generale')}
                                >
                                    {formData.category === 'plomberie-generale' && (
                                        <div className="rw-cat-check text-sm"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>done</span></div>
                                    )}
                                    <div className="rw-cat-icon-wrap bg-blue-tint">
                                        <span className="material-symbols-outlined rw-icon-primary">plumbing</span>
                                    </div>
                                    <h3 className="rw-cat-title text-primary-color">Plomberie</h3>
                                    <p className="rw-cat-desc">Fuites d'eau, canalisations bouchées, installation sanitaire, chauffe-eau.</p>
                                </div>

                                <div 
                                    className={`rw-cat-card ${formData.category === 'electricite-generale' ? 'is-selected' : 'is-default'}`}
                                    onClick={() => updateForm('category', 'electricite-generale')}
                                >
                                    {formData.category === 'electricite-generale' && (
                                        <div className="rw-cat-check text-sm"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>done</span></div>
                                    )}
                                    <div className="rw-cat-icon-wrap bg-yellow-tint">
                                        <span className="material-symbols-outlined rw-icon-yellow">electrical_services</span>
                                    </div>
                                    <h3 className="rw-cat-title text-on-surface-color">Électricité</h3>
                                    <p className="rw-cat-desc">Pannes électriques, disjoncteurs, câblages, installation d'éclairage.</p>
                                </div>

                                <div 
                                    className={`rw-cat-card ${formData.category === 'mecanique-auto' ? 'is-selected' : 'is-default'}`}
                                    onClick={() => updateForm('category', 'mecanique-auto')}
                                >
                                    {formData.category === 'mecanique-auto' && (
                                        <div className="rw-cat-check text-sm"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>done</span></div>
                                    )}
                                    <div className="rw-cat-icon-wrap bg-red-tint">
                                        <span className="material-symbols-outlined rw-icon-red">car_repair</span>
                                    </div>
                                    <h3 className="rw-cat-title text-on-surface-color">Mécanique Auto</h3>
                                    <p className="rw-cat-desc">Pannes moteurs, freins, batteries, ou visite complète de votre véhicule.</p>
                                </div>

                                <div 
                                    className={`rw-cat-card ${formData.category === 'maintenance-informatique' ? 'is-selected' : 'is-default'}`}
                                    onClick={() => updateForm('category', 'maintenance-informatique')}
                                >
                                    {formData.category === 'maintenance-informatique' && (
                                        <div className="rw-cat-check text-sm"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>done</span></div>
                                    )}
                                    <div className="rw-cat-icon-wrap bg-green-tint">
                                        <span className="material-symbols-outlined rw-icon-green">devices</span>
                                    </div>
                                    <h3 className="rw-cat-title text-on-surface-color">Informatique</h3>
                                    <p className="rw-cat-desc">Ordinateurs, réseaux Wi-Fi, box internet, et réparation électronique simple.</p>
                                </div>
                            </div>

                            {/* Descriptive Image Card (Bento Style Extension) */}
                            <div className="rw-promo-grid">
                                <div className="rw-promo-image-card group-hover-trigger">
                                    <img 
                                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Reliance" 
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
                                        <input type="file" multiple accept="image/*" style={{display: 'none'}} onChange={(e) => {
                                            if (e.target.files) {
                                                const newFiles = Array.from(e.target.files);
                                                updateForm('files', [...formData.files, ...newFiles]);
                                            }
                                        }} />
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
                                    <h4 className="rw-thumbnails-title">Fichiers téléversés ({formData.files.length})</h4>
                                    {formData.files.length > 0 && (
                                        <div className="rw-thumbnails-grid">
                                            {formData.files.map((file, idx) => (
                                                <div key={idx} className="rw-thumbnail-card">
                                                    <img 
                                                        src={URL.createObjectURL(file)} 
                                                        alt={`File ${idx + 1}`} 
                                                        className="rw-thumb-img"
                                                    />
                                                    <div className="rw-thumb-overlay">
                                                        <button className="rw-thumb-action-delete" type="button" onClick={() => {
                                                            const updated = formData.files.filter((_, i) => i !== idx);
                                                            updateForm('files', updated);
                                                        }}><span className="material-symbols-outlined">delete</span></button>
                                                    </div>
                                                    <div className="rw-thumb-label-wrap">
                                                        <div className="rw-thumb-label">{file.name}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                            <div className="rw-radar-pct">{analysisPhase >= 4 ? '100' : analysisPhase >= 3 ? Math.min(95, 60 + scanCount * 5) : Math.min(55, analysisPhase * 25)}%</div>
                                            <div className="rw-radar-label">{analysisPhase < 3 ? 'Analyse Profonde' : analysisPhase < 4 ? `Scan zone... (${scanCount})` : 'Termine !'}</div>
                                            <div className="w-full bg-surface-variant h-1 rounded-full mt-3 overflow-hidden">
                                                <div className="bg-primary h-full transition-all duration-1000" style={{width: `${analysisPhase >= 4 ? 100 : analysisPhase >= 3 ? Math.min(95, 60 + scanCount * 5) : Math.min(55, analysisPhase * 25)}%`}}></div>
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
                                            <span>Métriques de recherche</span>
                                            <span className="rw-metric-dot"></span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="rw-metric-row">
                                                <span className="rw-metric-label">Rayon d'action</span>
                                                <span className="rw-metric-value">50 km</span>
                                            </div>
                                            <div className="rw-metric-row">
                                                <span className="rw-metric-label">Zone</span>
                                                <span className="rw-metric-value">{formData.latitude ? "Géolocalisée" : "Par défaut"}</span>
                                            </div>
                                            <div className="rw-metric-row">
                                                <span className="rw-metric-label">Profils scannes</span>
                                                <span className="rw-metric-value">{analysisPhase >= 3 ? scanCount : "..."}</span>
                                            </div>
                                            <div className="rw-metric-row">
                                                <span className="rw-metric-label">Matches trouves</span>
                                                <span className="rw-metric-value">{realMatchedTechnicians.length}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rw-glass-panel rw-metric-panel flex-1">
                                        <h4 className="rw-candidates-title">Techniciens Candidats ({realMatchedTechnicians.length})</h4>
                                        <div className="space-y-3 overflow-y-auto max-h-60 pr-2">
                                            {realMatchedTechnicians.length > 0 ? (
                                                realMatchedTechnicians.map((tech, idx) => (
                                                    <div key={idx} className="rw-candidate-card" style={{opacity: 1, animation: 'fadeSlideIn 0.5s ease', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                                        <div className="rw-candidate-avatar" style={{
                                                            backgroundImage: tech.avatar_url ? `url(${tech.avatar_url})` : 'none',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: '#fff', fontWeight: 'bold'
                                                        }}>
                                                            {!tech.avatar_url && (tech.name?.charAt(0) || 'T')}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="rw-candidate-name text-sm font-bold text-white">{tech.name || "Technicien"}</div>
                                                            <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px'}}>
                                                                <span style={{color: '#10b981', fontSize: '0.75rem', fontWeight: 600}}>{tech.match_score}%</span>
                                                                <span style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem'}}>{tech.distance_km} km</span>
                                                                <span style={{color: '#fbbf24', fontSize: '0.7rem'}}>★ {tech.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-sm" style={{color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '20px 0'}}>
                                                    {analysisPhase >= 3 ? 'Scan des profils en cours...' : 'En attente du diagnostic...'}
                                                </div>
                                            )}
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
