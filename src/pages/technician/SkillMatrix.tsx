import React, { useState } from 'react';
import { FaChevronDown, FaUpload, FaCheck, FaSave } from 'react-icons/fa';
import './SkillMatrix.css';

interface Skill {
    id: string;
    name: string;
    selected: boolean;
    hourlyRate?: number;
    baseFee?: number;
    expertiseLevel: number; // 0-100
    certificate?: string; // Placeholder for file name
}

interface Category {
    id: string;
    name: string;
    skills: Skill[];
}

const initialData: Category[] = [
    {
        id: 'plomberie',
        name: 'Plomberie',
        skills: [
            { id: 'fuite', name: 'Recherche de fuite', selected: false, expertiseLevel: 50 },
            { id: 'chauffe-eau', name: 'Installation Chauffe-eau', selected: false, expertiseLevel: 50 },
            { id: 'wc', name: 'Remplacement WC', selected: false, expertiseLevel: 50 },
            { id: 'debouchage', name: 'Débouchage Canalisation', selected: false, expertiseLevel: 50 },
        ]
    },
    {
        id: 'electricite',
        name: 'Électricité',
        skills: [
            { id: 'tableau', name: 'Mise aux normes tableau électrique', selected: false, expertiseLevel: 50 },
            { id: 'prise', name: 'Installation Prise / Interrupteur', selected: false, expertiseLevel: 50 },
            { id: 'panne', name: 'Recherche de panne', selected: false, expertiseLevel: 50 },
        ]
    },
    {
        id: 'climatisation',
        name: 'Froid & Climatisation',
        skills: [
            { id: 'install-clim', name: 'Installation Climatiseur', selected: false, expertiseLevel: 50 },
            { id: 'entretien-clim', name: 'Entretien & Recharge gaz', selected: false, expertiseLevel: 50 },
            { id: 'depannage-frigo', name: 'Dépannage Frigo Industriel', selected: false, expertiseLevel: 50 },
        ]
    },
    {
        id: 'serrurerie',
        name: 'Serrurerie',
        skills: [
            { id: 'ouverture', name: 'Ouverture de porte', selected: false, expertiseLevel: 50 },
            { id: 'blindage', name: 'Blindage de porte', selected: false, expertiseLevel: 50 },
            { id: 'changement-serrure', name: 'Changement de serrure', selected: false, expertiseLevel: 50 },
        ]
    }
];

const SkillMatrix: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>(initialData);
    const [openCategory, setOpenCategory] = useState<string | null>('plomberie');

    const toggleCategory = (id: string) => {
        setOpenCategory(openCategory === id ? null : id);
    };

    const handleSkillToggle = (categoryId: string, skillId: string) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
                ...cat,
                skills: cat.skills.map(skill => {
                    if (skill.id !== skillId) return skill;
                    return { ...skill, selected: !skill.selected };
                })
            };
        }));
    };

    const handleSkillChange = (categoryId: string, skillId: string, field: keyof Skill, value: any) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id !== categoryId) return cat;
            return {
                ...cat,
                skills: cat.skills.map(skill => {
                    if (skill.id !== skillId) return skill;
                    return { ...skill, [field]: value };
                })
            };
        }));
    };

    return (
        <div className="tech-page">
            <h1 className="page-title">Matrice de Compétences</h1>
            <p className="page-subtitle" style={{ marginBottom: '30px', color: '#666' }}>
                Définissez précisément les services que vous proposez ainsi que vos tarifs.
            </p>

            {categories.map(category => (
                <div key={category.id} className="skill-category">
                    <div
                        className="category-header"
                        onClick={() => toggleCategory(category.id)}
                    >
                        <h3 className="category-title">
                            {category.name}
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '10px', fontWeight: 'normal' }}>
                                ({category.skills.filter(s => s.selected).length} activés)
                            </span>
                        </h3>
                        <FaChevronDown className={`toggle-icon ${openCategory === category.id ? 'open' : ''}`} />
                    </div>

                    {openCategory === category.id && (
                        <div className="category-content">
                            {category.skills.map(skill => (
                                <div key={skill.id} className={`skill-item ${skill.selected ? 'selected' : ''}`}>
                                    <div className="skill-header">
                                        <label className="skill-checkbox-wrapper">
                                            <input
                                                type="checkbox"
                                                className="skill-checkbox"
                                                checked={skill.selected}
                                                onChange={() => handleSkillToggle(category.id, skill.id)}
                                            />
                                            <span className="skill-name">{skill.name}</span>
                                        </label>
                                    </div>

                                    {skill.selected && (
                                        <div className="skill-details">
                                            <div className="form-group">
                                                <label className="form-label">Taux Horaire (XAF)</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    placeholder="Ex: 5000"
                                                    value={skill.hourlyRate || ''}
                                                    onChange={(e) => handleSkillChange(category.id, skill.id, 'hourlyRate', parseInt(e.target.value))}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Frais Déplacement (XAF)</label>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    placeholder="Ex: 2000"
                                                    value={skill.baseFee || ''}
                                                    onChange={(e) => handleSkillChange(category.id, skill.id, 'baseFee', parseInt(e.target.value))}
                                                />
                                            </div>

                                            <div className="form-group" style={{ minWidth: '250px' }}>
                                                <label className="form-label">
                                                    Niveau d'expertise: {skill.expertiseLevel}%
                                                </label>
                                                <div className="expertise-slider-container">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="100"
                                                        className="expertise-slider"
                                                        value={skill.expertiseLevel}
                                                        onChange={(e) => handleSkillChange(category.id, skill.id, 'expertiseLevel', parseInt(e.target.value))}
                                                    />
                                                    <div className="expertise-labels">
                                                        <span>Débutant</span>
                                                        <span>Expert</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="upload-section">
                                                <button className="upload-btn">
                                                    <FaUpload />
                                                    {skill.certificate ? 'Certificat chargé' : 'Preuve de compétence (PDF/JPG)'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <div className="action-bar">
                <button className="btn btn-primary save-btn">
                    <FaSave style={{ marginRight: '10px' }} />
                    Enregistrer mes compétences
                </button>
            </div>
        </div>
    );
};

export default SkillMatrix;
