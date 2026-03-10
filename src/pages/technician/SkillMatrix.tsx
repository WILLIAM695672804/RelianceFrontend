import React, { useState } from 'react';
import { FaTools, FaBolt, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import './SkillMatrix.css';

interface Skill {
    id: string;
    name: string;
    checked: boolean;
    price: string; // V2: Base fee definition
}

interface SkillCategory {
    id: string;
    title: string;
    icon: React.ReactNode;
    skills: Skill[];
}

const SkillMatrix: React.FC = () => {
    const [openCategory, setOpenCategory] = useState<string>('plomb');

    const [categories, setCategories] = useState<SkillCategory[]>([
        {
            id: 'plomb',
            title: 'Plomberie',
            icon: <FaTools />,
            skills: [
                { id: 'fuite', name: 'Recherche et réparation de fuite', checked: true, price: '15000' },
                { id: 'debouchage', name: 'Débouchage canalisations', checked: true, price: '10000' },
                { id: 'chauffe', name: 'Installation chauffe-eau', checked: false, price: '25000' },
                { id: 'robinet', name: 'Remplacement robinetterie', checked: true, price: '8000' }
            ]
        },
        {
            id: 'elec',
            title: 'Électricité',
            icon: <FaBolt />,
            skills: [
                { id: 'panne', name: 'Dépannage électrique (Coupure)', checked: false, price: '12000' },
                { id: 'tableau', name: 'Mise aux normes tableau', checked: false, price: '30000' },
                { id: 'luminaire', name: 'Installation luminaires', checked: false, price: '5000' }
            ]
        }
    ]);

    const toggleCategory = (id: string) => {
        setOpenCategory(openCategory === id ? '' : id);
    };

    const handleSkillToggle = (categoryId: string, skillId: string) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    skills: cat.skills.map(s =>
                        s.id === skillId ? { ...s, checked: !s.checked } : s
                    )
                };
            }
            return cat;
        }));
    };

    const handlePriceChange = (categoryId: string, skillId: string, value: string) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return {
                    ...cat,
                    skills: cat.skills.map(s =>
                        s.id === skillId ? { ...s, price: value } : s
                    )
                };
            }
            return cat;
        }));
    };

    const handleSave = () => {
        alert("Modifications enregistrées côté client (Frontend local) !\nCes prix influenceront les recommandations de l'algorithme.");
    };

    return (
        <div className="tech-page skills-page" style={{ paddingTop: 0, marginTop: 0, boxShadow: 'none' }}>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
                Sélectionnez vos spécialités et définissez votre **Tarif de base estimé** pour guider le système de matching.
            </p>

            <div className="skills-accordion">
                {categories.map(cat => (
                    <div key={cat.id} className={`accordion-item ${openCategory === cat.id ? 'active' : ''}`}>
                        <div
                            className="accordion-header"
                            onClick={() => toggleCategory(cat.id)}
                        >
                            <h3 className="accordion-title">
                                <span className="accordion-icon">{cat.icon}</span>
                                {cat.title}
                            </h3>
                            <div>{openCategory === cat.id ? '▲' : '▼'}</div>
                        </div>

                        {openCategory === cat.id && (
                            <div className="accordion-content">
                                <div className="skills-grid-v2">
                                    {cat.skills.map(skill => (
                                        <div key={skill.id} className={`skill-card ${skill.checked ? 'checked' : ''}`}>
                                            <label className="skill-checkbox-area">
                                                <input
                                                    type="checkbox"
                                                    checked={skill.checked}
                                                    onChange={() => handleSkillToggle(cat.id, skill.id)}
                                                />
                                                <span className="skill-name">{skill.name}</span>
                                            </label>

                                            {skill.checked && (
                                                <div className="skill-pricing-area">
                                                    <label>Tarif de base (FCFA)</label>
                                                    <div className="price-input-wrapper">
                                                        <FaMoneyBillWave className="price-icon" />
                                                        <input
                                                            type="number"
                                                            value={skill.price}
                                                            onChange={(e) => handlePriceChange(cat.id, skill.id, e.target.value)}
                                                            placeholder="Ex: 10000"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Expérience Commune */}
            <div className="settings-block">
                <h2>Outils & Véhicule</h2>
                <div className="skills-grid-v2">
                    <label className="skill-checkbox-area">
                        <input type="checkbox" defaultChecked />
                        <span className="skill-name">Je possède mon propre véhicule (Auto/Moto)</span>
                    </label>
                    <label className="skill-checkbox-area">
                        <input type="checkbox" defaultChecked />
                        <span className="skill-name">Je possède mon matériel professionnel</span>
                    </label>
                </div>
            </div>

            <button className="btn-primary save-skills" onClick={handleSave}>
                <FaCheckCircle /> Enregistrer le Profil Compétences
            </button>
        </div>
    );
};

export default SkillMatrix;
