import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaArrowRight, FaArrowLeft, FaTint, FaBolt, FaWrench, 
    FaCar, FaImages, FaMapMarkerAlt, FaCheckCircle, FaRobot, FaSearchLocation
} from 'react-icons/fa';
import './RequestWizard.css';

const categories = [
    { id: 'plomberie', name: 'Plomberie', icon: <FaTint /> },
    { id: 'electricite', name: 'Électricité', icon: <FaBolt /> },
    { id: 'mecanique', name: 'Mécanique Auto', icon: <FaCar /> },
    { id: 'electronique', name: 'Électronique', icon: <FaWrench /> }
];

const RequestWizard: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [analysisPhase, setAnalysisPhase] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        category: '',
        title: '',
        description: '',
        location: ''
    });

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => {
        if (step === 4) {
            startAiAnalysis();
        } else {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
        else navigate('/client/dashboard');
    };

    const startAiAnalysis = () => {
        setStep(5);
        // Simulate AI analysis progression
        setTimeout(() => setAnalysisPhase(1), 1500); // Analyse texte
        setTimeout(() => setAnalysisPhase(2), 3000); // Estimation prix
        setTimeout(() => setAnalysisPhase(3), 4500); // Recherche techs
        setTimeout(() => {
            // Once done, navigate to Matching HUB (HUB 3)
            navigate('/client/matching');
        }, 6000);
    };

    // Calculate progress percentage (steps 1 to 4)
    const progress = step <= 4 ? ((step - 1) / 3) * 100 : 100;

    return (
        <div className="wizard-container">
            {/* Header / Progress - Hidden during AI Analysis */}
            {step < 5 && (
                <div className="wizard-header">
                    <div className="wizard-progress-bar">
                        <div className="wizard-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="wizard-steps-info">
                        <h2>
                            {step === 1 && "Quelle est la nature du problème ?"}
                            {step === 2 && "Détaillez votre besoin"}
                            {step === 3 && "Ajoutez des photos (Optionnel)"}
                            {step === 4 && "Où se déroule l'intervention ?"}
                        </h2>
                        <span>Étape {step} sur 4</span>
                    </div>
                </div>
            )}

            {/* Dynamic Content */}
            <div className="wizard-content">
                {/* STEP 1: Categories */}
                {step === 1 && (
                    <div className="category-grid">
                        {categories.map(cat => (
                            <div 
                                key={cat.id} 
                                className={`category-card ${formData.category === cat.id ? 'selected' : ''}`}
                                onClick={() => updateForm('category', cat.id)}
                            >
                                <div className="cat-icon-wrapper">{cat.icon}</div>
                                <h4>{cat.name}</h4>
                            </div>
                        ))}
                    </div>
                )}

                {/* STEP 2: Details */}
                {step === 2 && (
                    <div className="details-form">
                        <div className="form-group">
                            <label>Titre de l'intervention</label>
                            <input 
                                type="text" 
                                className="wizard-input" 
                                placeholder="ex: Fuite d'eau sous l'évier"
                                value={formData.title}
                                onChange={(e) => updateForm('title', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Description détaillée</label>
                            <textarea 
                                className="wizard-textarea" 
                                placeholder="Expliquez le problème, depuis combien de temps, etc..."
                                value={formData.description}
                                onChange={(e) => updateForm('description', e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                )}

                {/* STEP 3: Media */}
                {step === 3 && (
                    <div className="media-upload-area">
                        <FaImages className="upload-icon" />
                        <p>Glissez-déposez vos photos ici</p>
                        <p className="upload-hint">ou cliquez pour parcourir vos fichiers. L'IA précisera le devis grâce aux images.</p>
                        <button className="btn-wizard-back" style={{ marginTop: '10px' }}>Parcourir</button>
                    </div>
                )}

                {/* STEP 4: Location */}
                {step === 4 && (
                    <div className="location-map-placeholder">
                        <div className="location-input-overlay">
                            <FaSearchLocation style={{ color: '#0ea5e9' }} />
                            <input 
                                type="text" 
                                placeholder="Entrez votre adresse ou utilisez la position actuelle..."
                                value={formData.location}
                                onChange={(e) => updateForm('location', e.target.value)}
                            />
                        </div>
                        <FaMapMarkerAlt className="map-icon" />
                        <p>La carte interactive sera chargée ici</p>
                    </div>
                )}

                {/* STEP 5: AI Analysis */}
                {step === 5 && (
                    <div className="ai-analysis-screen">
                        <div className="ai-scanner-circle">
                            <div className="ai-center-icon">
                                <FaRobot />
                            </div>
                        </div>
                        <h2>Analyse Reliance IA en cours...</h2>
                        <p>Nous qualifions votre demande pour trouver les meilleurs experts.</p>

                        <div className="ai-steps">
                            <div className={`ai-step ${analysisPhase >= 0 ? 'active' : ''}`}>
                                {analysisPhase >= 1 ? <FaCheckCircle className="ai-step-icon" /> : <div className="ai-spinner-small"></div>}
                                Analyse du type de panne
                            </div>
                            <div className={`ai-step ${analysisPhase >= 1 ? 'active' : ''}`} style={{ opacity: analysisPhase >= 1 ? 1 : 0.5 }}>
                                {analysisPhase >= 2 ? <FaCheckCircle className="ai-step-icon" /> : (analysisPhase === 1 ? <div className="ai-spinner-small"></div> : <FaCheckCircle style={{ opacity: 0 }} />)}
                                Évaluation de la complexité & Tarification
                            </div>
                            <div className={`ai-step ${analysisPhase >= 2 ? 'active' : ''}`} style={{ opacity: analysisPhase >= 2 ? 1 : 0.5 }}>
                                {analysisPhase >= 3 ? <FaCheckCircle className="ai-step-icon" /> : (analysisPhase === 2 ? <div className="ai-spinner-small"></div> : <FaCheckCircle style={{ opacity: 0 }} />)}
                                Matching géographique des techniciens
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer / Nav Buttons - Hidden during AI Analysis */}
            {step < 5 && (
                <div className="wizard-footer">
                    <button className="btn-wizard-back" onClick={prevStep}>
                        <FaArrowLeft /> Retour
                    </button>
                    <button 
                        className="btn-wizard-next" 
                        onClick={nextStep}
                        disabled={
                            (step === 1 && !formData.category) ||
                            (step === 2 && !formData.title.trim()) ||
                            (step === 4 && !formData.location.trim())
                        }
                    >
                        {step === 4 ? 'Analyser & Trouver un expert' : 'Continuer'} 
                        {step < 4 && <FaArrowRight />}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RequestWizard;
