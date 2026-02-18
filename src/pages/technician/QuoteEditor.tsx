import React, { useState } from 'react';
import {
    FaArrowLeft,
    FaTrash,
    FaPlus,
    FaFilePdf,
    FaPaperPlane,
    FaSave
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './QuoteEditor.css';

interface QuoteItem {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
}

const QuoteEditor: React.FC = () => {
    const navigate = useNavigate();

    // Initial Item
    const [items, setItems] = useState<QuoteItem[]>([
        { id: 1, description: "Remplacement Joint d'étanchéité", quantity: 1, unitPrice: 5000 },
        { id: 2, description: "Main d'œuvre (Heure)", quantity: 2, unitPrice: 7500 }
    ]);

    const addItem = () => {
        setItems([...items, {
            id: Date.now(),
            description: "",
            quantity: 1,
            unitPrice: 0
        }]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: number, field: keyof QuoteItem, value: string | number) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * 0.1925; // TVA 19.25% (Example)
    const total = subtotal + tax;

    return (
        <div className="tech-page quote-editor-page">
            <button className="back-btn" onClick={() => navigate('/technicien/mission/M-2684')} style={{ marginBottom: '20px' }}>
                <FaArrowLeft /> Retour à la mission
            </button>

            <h1 className="page-title">Éditeur de Devis</h1>

            <div className="quote-header">
                <div className="quote-info">
                    <h2>Devis #D-2026-001</h2>
                    <p>Client : Sophie M. • Mission #M-2684</p>
                </div>
                <div className="quote-status">BROUILLON</div>
            </div>

            {/* Quote Items Table */}
            <div className="quote-items-container">
                <div className="quote-items-header">
                    <span>Description</span>
                    <span>Quantité</span>
                    <span>Prix Unitaire</span>
                    <span>Total</span>
                    <span></span>
                </div>

                {items.map(item => (
                    <div key={item.id} className="quote-item-row">
                        <input
                            type="text"
                            className="item-input"
                            placeholder="Description de la prestation"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        />
                        <input
                            type="number"
                            className="item-input"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                        <input
                            type="number"
                            className="item-input"
                            min="0"
                            placeholder="Prix"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                        />
                        <div className="item-total">
                            {(item.quantity * item.unitPrice).toLocaleString()}
                        </div>
                        <button className="delete-item-btn" onClick={() => removeItem(item.id)}>
                            <FaTrash />
                        </button>
                    </div>
                ))}

                <button className="add-item-btn" onClick={addItem}>
                    <FaPlus /> Ajouter une ligne
                </button>
            </div>

            {/* Summary */}
            <div className="quote-summary">
                <div className="summary-rows">
                    <div className="summary-row">
                        <span>Sous-total HT</span>
                        <span>{subtotal.toLocaleString()} FCFA</span>
                    </div>
                    <div className="summary-row">
                        <span>TVA (19.25%)</span>
                        <span>{tax.toLocaleString(undefined, { maximumFractionDigits: 0 })} FCFA</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total TTC</span>
                        <span>{total.toLocaleString(undefined, { maximumFractionDigits: 0 })} FCFA</span>
                    </div>
                </div>
            </div>

            {/* Floating Actions */}
            <div className="quote-actions">
                <button className="action-btn btn-preview">
                    <FaFilePdf /> Aperçu
                </button>
                <button className="action-btn btn-send">
                    <FaPaperPlane /> Envoyer au client
                </button>
            </div>
        </div>
    );
};

export default QuoteEditor;
