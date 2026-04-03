import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTechSkills, getAllSkillsCatalog, addTechSkill, deleteTechSkill } from '../../services/technicianService';
import './SkillMatrix.css';

interface Skill {
    id: string;
    name: string;
    category: string;
    proficiency: number;
    experience_years: number;
}

interface CatalogSkill {
    id: string;
    name: string;
    category: string;
}

const SkillMatrix: React.FC = () => {
    const navigate = useNavigate();
    
    // States
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Modal Form States
    const [catalog, setCatalog] = useState<CatalogSkill[]>([]);
    const [selectedSkillId, setSelectedSkillId] = useState('');
    const [proficiency, setProficiency] = useState(3);
    const [experience, setExperience] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchSkills();
        fetchCatalog();
    }, []);

    const fetchSkills = async () => {
        try {
            const data = await getTechSkills();
            setSkills(data);
        } catch (error) {
            console.error("Erreur chargement skills", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCatalog = async () => {
        try {
            const data = await getAllSkillsCatalog();
            setCatalog(data);
        } catch (error) {
            console.error("Erreur chargement catalogue", error);
        }
    };

    const handleAddSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSkillId) return;

        setIsAdding(true);
        try {
            await addTechSkill({
                skill_id: selectedSkillId,
                proficiency: proficiency,
                experience_years: experience
            });
            setIsModalOpen(false);
            fetchSkills(); // Refresh the list
        } catch (error) {
            console.error("Erreur ajout skill", error);
            alert("Erreur lors de l'ajout.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteSkill = async (id: string) => {
        if (!window.confirm("Remove this skill from your matrix?")) return;
        try {
            await deleteTechSkill(id);
            fetchSkills();
        } catch (error) {
            console.error(error);
        }
    };

    const getProficiencyLabel = (level: number) => {
        switch(level) {
            case 1: return "Beginner (L1)";
            case 2: return "Novice (L2)";
            case 3: return "Intermediate (L3)";
            case 4: return "Advanced (L4)";
            case 5: return "Expert (L5)";
            default: return "Unknown";
        }
    };

    const getCategoryIcon = (category: string) => {
        if(category.toLowerCase().includes('hvac')) return 'hvac';
        if(category.toLowerCase().includes('electrical') || category.toLowerCase().includes('wiring')) return 'bolt';
        if(category.toLowerCase().includes('smart')) return 'grid_view';
        if(category.toLowerCase().includes('plumbing')) return 'plumbing';
        return 'build';
    };

    if (isLoading) {
        return <div className="tech-matrix-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>;
    }

    return (
        <div className="tech-matrix-page">
            {/* Header Section */}
            <header className="tech-matrix-header">
                <div className="tech-matrix-title-group">
                    <button 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.25rem', 
                            padding: 0, 
                            marginBottom: '0.75rem', 
                            color: 'var(--tech-on-surface-variant)', 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}
                        onClick={() => navigate(-1)}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_back</span>
                        Back to Profile
                    </button>
                    <h1>Skill &amp; Certification Matrix</h1>
                    <p>
                        Your verified capabilities determine your algorithmic prioritization. Expanding your matrix increases your <span>Match Score</span> for high-value industrial contracts.
                    </p>
                </div>
                <div className="tech-matrix-actions">
                    <button className="tech-btn-secondary">
                        <span className="material-symbols-outlined">upload_file</span>
                        Upload Cert
                    </button>
                    <button className="tech-btn-primary" onClick={() => setIsModalOpen(true)}>
                        <span className="material-symbols-outlined">add</span>
                        Add New Skill
                    </button>
                </div>
            </header>

            {/* Bento Layout */}
            <div className="tech-matrix-grid">
                
                {/* Left: Match Score Indicator */}
                <section className="tech-matrix-left">
                    <div className="tech-score-card">
                        <div className="tech-score-bg-circle"></div>
                        <h3 className="tech-score-title">Current Performance</h3>
                        
                        <div className="tech-score-display">
                            <div className="tech-circular-progress">
                                <svg viewBox="0 0 96 96">
                                    <circle className="tech-progress-bg" cx="48" cy="48" r="42"></circle>
                                    <circle className="tech-progress-fill" cx="48" cy="48" r="42"></circle>
                                </svg>
                                <span className="tech-progress-text">98<span>%</span></span>
                            </div>
                            <div className="tech-score-info">
                                <h4>Match Score</h4>
                                <p>Top 2% of Network</p>
                            </div>
                        </div>

                        <div className="tech-score-bars">
                            <div className="tech-bar-row">
                                <span className="tech-bar-label">Skill Coverage</span>
                                <span className="tech-bar-value">+12.4%</span>
                            </div>
                            <div className="tech-bar-bg">
                                <div className="tech-bar-fill" style={{width: '88%'}}></div>
                            </div>
                            
                            <div className="tech-bar-row">
                                <span className="tech-bar-label">Cert. Recency</span>
                                <span className="tech-bar-value">+8.1%</span>
                            </div>
                            <div className="tech-bar-bg">
                                <div className="tech-bar-fill" style={{width: '94%'}}></div>
                            </div>
                        </div>
                    </div>

                    <div className="tech-growth-card group">
                        <div className="tech-growth-icon">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <h3>Growth Projection</h3>
                        <p>Add 'Quantum PLC Calibration' to unlock Tier 1 data center projects worth an estimated +$14k/yr.</p>
                        <button>
                            View Skill Path <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </section>

                {/* Right: Skills Grid */}
                <section className="tech-matrix-right">
                    
                    <div className="tech-skills-section">
                        <div className="tech-skills-header">
                            <h2>Verified Technical Skills</h2>
                            <span>{skills.length} Total Skills</span>
                        </div>
                        
                        <div className="tech-skills-grid">
                            
                            {skills.map((skill) => (
                                <div className="tech-skill-card" key={skill.id}>
                                    <div className="tech-skill-card-top">
                                        <div className="tech-skill-icon">
                                            <span className="material-symbols-outlined">{getCategoryIcon(skill.category)}</span>
                                        </div>
                                        <span className="tech-verified-badge">
                                            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                                            Verified
                                        </span>
                                    </div>
                                    <h4>{skill.name}</h4>
                                    <p className="tech-skill-desc">{skill.category}</p>
                                    <div className="tech-skill-stats">
                                        <div>
                                            <p className="tech-stat-label">Proficiency</p>
                                            <p className="tech-stat-value">{getProficiencyLabel(skill.proficiency)}</p>
                                        </div>
                                        <div style={{textAlign: 'right'}}>
                                            <p className="tech-stat-label">Experience</p>
                                            <p className="tech-stat-value">{skill.experience_years} Years</p>
                                        </div>
                                    </div>
                                    <div style={{marginTop: '1rem', textAlign: 'right'}}>
                                        <button 
                                            onClick={() => handleDeleteSkill(skill.id)}
                                            style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px'}}
                                        >
                                            <span className="material-symbols-outlined" style={{fontSize: '1rem'}}>delete</span> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Action Card */}
                            <div className="tech-skill-card-empty" onClick={() => setIsModalOpen(true)} style={{cursor: 'pointer'}}>
                                <div className="tech-empty-icon">
                                    <span className="material-symbols-outlined">add_circle</span>
                                </div>
                                <h4>Expand Matrix</h4>
                                <p>Add a new technical domain to your profile.</p>
                            </div>
                        </div>
                    </div>

                    {/* Certifications Section */}
                    <div className="tech-cert-section">
                        <h2>Professional Certifications</h2>
                        <div className="tech-cert-table-wrapper">
                            <table className="tech-cert-table">
                                <thead>
                                    <tr>
                                        <th>Credential</th>
                                        <th>Issuer</th>
                                        <th>Status</th>
                                        <th style={{textAlign: 'right'}}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="tech-cert-name">
                                                <span className="material-symbols-outlined">description</span>
                                                <div>
                                                    <p className="cert-title">Certified Network Installer (CNI)</p>
                                                    <p className="cert-id">ID: CERT-8821-XP</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>TechCorp Global</td>
                                        <td>
                                            <span className="tech-cert-status status-approved">
                                                <span className="status-dot"></span> Approved
                                            </span>
                                        </td>
                                        <td style={{textAlign: 'right'}}>
                                            <button className="tech-btn-icon"><span className="material-symbols-outlined">visibility</span></button>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className="tech-cert-name">
                                                <span className="material-symbols-outlined">description</span>
                                                <div>
                                                    <p className="cert-title">Advanced PLC Diploma</p>
                                                    <p className="cert-id">ID: DPL-2209-BA</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>Industrial Academy</td>
                                        <td>
                                            <span className="tech-cert-status status-pending">
                                                <span className="status-dot"></span> Pending
                                            </span>
                                        </td>
                                        <td style={{textAlign: 'right'}}>
                                            <button className="tech-btn-icon"><span className="material-symbols-outlined">visibility</span></button>
                                        </td>
                                    </tr>

                                    <tr className="tech-cert-expired-row">
                                        <td>
                                            <div className="tech-cert-name">
                                                <span className="material-symbols-outlined">history</span>
                                                <div>
                                                    <p className="cert-title">OSHA 10 Safety Card</p>
                                                    <p className="cert-id">ID: SFT-0012-L1</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>OSHA Board</td>
                                        <td>
                                            <span className="tech-cert-status status-expired">
                                                <span className="status-dot"></span> Expired
                                            </span>
                                        </td>
                                        <td style={{textAlign: 'right'}}>
                                            <button className="tech-btn-renew">Renew</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </section>
            </div>

            {/* Modal de création */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex justify-center items-center">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative border border-slate-200">
                        <button 
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-transparent"
                            onClick={() => setIsModalOpen(false)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-slate-900">Add New Skill</h2>
                        
                        <form onSubmit={handleAddSkill} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Select Skill</label>
                                <select 
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800"
                                    value={selectedSkillId}
                                    onChange={(e) => setSelectedSkillId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>-- Choose from catalog --</option>
                                    {catalog.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name} ({cat.category})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Proficiency Level (1-5)</label>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="5" 
                                    value={proficiency}
                                    onChange={(e) => setProficiency(Number(e.target.value))}
                                    className="w-full"
                                />
                                <div className="text-center font-medium mt-1 text-slate-900">{getProficiencyLabel(proficiency)}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Years of Experience</label>
                                <input 
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={experience}
                                    onChange={(e) => setExperience(Number(e.target.value))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="mt-4 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                                disabled={isAdding || !selectedSkillId}
                                style={{ border: 'none', cursor: isAdding ? 'wait' : 'pointer' }}
                            >
                                {isAdding ? "Adding..." : "Confirm & Add Skill"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillMatrix;
