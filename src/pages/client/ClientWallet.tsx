import React, { useState } from 'react';
import { 
    FaWallet, FaLock, FaUnlockAlt, FaCreditCard, 
    FaHistory, FaArrowUp, FaTimes, FaMobileAlt, FaCheckCircle 
} from 'react-icons/fa';
import './ClientWallet.css';

interface Transaction {
    id: string;
    type: 'recharge' | 'escrow' | 'payment';
    amount: number;
    date: string;
    label: string;
}

const ClientWallet: React.FC = () => {
    // Mock Data
    const [balance] = useState(24500); // Available balance
    const [escrowAmount, setEscrowAmount] = useState(20000); // Funds currently locked for ongoing interventions
    
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [rechargeStep, setRechargeStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState('');

    const transactions: Transaction[] = [
        { id: 'TRX-101', type: 'escrow', amount: 20000, date: 'Aujourd\'hui', label: 'Séquestre: Fuite d\'eau #REQ-019' },
        { id: 'TRX-098', type: 'recharge', amount: 50000, date: '10 Mars 2026', label: 'Recharge Orange Money' },
        { id: 'TRX-095', type: 'payment', amount: 15000, date: '25 Fév 2026', label: 'Paiement: Électricité #REQ-012' }
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
    };

    const handleReleaseFunds = () => {
        if (window.confirm('Voulez-vous libérer le paiement de 20 000 FCFA au technicien pour finaliser la mission ?')) {
            setEscrowAmount(0);
            alert('Fonds libérés avec succès ! Le technicien a été payé.');
        }
    };

    return (
        <div className="client-wallet-container">
            <div className="wallet-header">
                <div>
                    <h1>Portefeuille & Paiements</h1>
                    <p>Gérez vos moyens de paiement et surveillez vos transactions en toute transparence.</p>
                </div>
                <button className="btn-recharge-primary" onClick={() => setShowRechargeModal(true)}>
                    <FaArrowUp /> Recharger mon compte
                </button>
            </div>

            <div className="balances-row">
                {/* Available Balance */}
                <div className="balance-card-client main">
                    <div className="balance-icon-btn"><FaWallet /></div>
                    <div className="balance-info-client">
                        <h3>Solde Disponible</h3>
                        <div className="amount-display">{formatCurrency(balance)}</div>
                        <span className="balance-hint">Utilisable immédiatement pour payer ou bloquer un devis.</span>
                    </div>
                </div>

                {/* Escrow Balance */}
                <div className={`balance-card-client escrow ${escrowAmount > 0 ? 'active' : ''}`}>
                    <div className="balance-icon-btn">{escrowAmount > 0 ? <FaLock /> : <FaUnlockAlt />}</div>
                    <div className="balance-info-client">
                        <h3>Fonds en Séquestre</h3>
                        <div className="amount-display">{formatCurrency(escrowAmount)}</div>
                        <span className="balance-hint">
                            {escrowAmount > 0 
                                ? 'Bloqués sur la plateforme jusqu\'à la validation des travaux.' 
                                : 'Aucun montant bloqué actuellement.'}
                        </span>
                    </div>
                    {escrowAmount > 0 && (
                        <button className="btn-release-escrow" onClick={handleReleaseFunds}>
                            Libérer l'artisan
                        </button>
                    )}
                </div>
            </div>

            <div className="wallet-bottom-grid">
                {/* Payment Methods */}
                <div className="payment-methods-widget">
                    <h3><FaCreditCard /> Moyens de paiement</h3>
                    
                    <div className="pm-list">
                        <div className="pm-card default">
                            <div className="pm-logo om">OM</div>
                            <div className="pm-details">
                                <strong>Orange Money</strong>
                                <span>+237 6** ** ** 12</span>
                            </div>
                            <span className="pm-badge">Par défaut</span>
                        </div>
                        <div className="pm-card">
                            <div className="pm-logo mtn">MOMO</div>
                            <div className="pm-details">
                                <strong>MTN Mobile Money</strong>
                                <span>+237 6** ** ** 45</span>
                            </div>
                        </div>
                        <button className="btn-add-pm">+ Ajouter un moyen de paiement</button>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="transaction-history-widget">
                    <h3><FaHistory /> Historique récent</h3>
                    
                    <div className="transactions-list">
                        {transactions.map(trx => (
                            <div key={trx.id} className="transaction-item">
                                <div className={`trx-icon ${trx.type}`}>
                                    {trx.type === 'recharge' && <FaArrowUp />}
                                    {trx.type === 'escrow' && <FaLock />}
                                    {trx.type === 'payment' && <FaUnlockAlt />}
                                </div>
                                <div className="trx-details">
                                    <strong>{trx.label}</strong>
                                    <span>{trx.date} • {trx.id}</span>
                                </div>
                                <div className={`trx-amount ${trx.type}`}>
                                    {trx.type === 'recharge' ? '+' : '-'}{formatCurrency(trx.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn-view-all-trx">Voir tout l'historique</button>
                </div>
            </div>

            {/* Recharge Modal */}
            {showRechargeModal && (
                <div className="wallet-modal-overlay">
                    <div className="wallet-modal-content">
                        <button className="btn-close-modal" onClick={() => {setShowRechargeModal(false); setRechargeStep(1)}}>
                            <FaTimes />
                        </button>

                        {rechargeStep === 1 && (
                            <div className="recharge-step-1">
                                <h2>Recharger mon compte</h2>
                                <p>Choisissez votre méthode de paiement sécurisée.</p>

                                <div className="recharge-methods-grid">
                                    <div 
                                        className={`recharge-method-card ${selectedMethod === 'om' ? 'selected' : ''}`}
                                        onClick={() => setSelectedMethod('om')}
                                    >
                                        <div className="pm-logo om">OM</div>
                                        <span>Orange Money</span>
                                    </div>
                                    <div 
                                        className={`recharge-method-card ${selectedMethod === 'momo' ? 'selected' : ''}`}
                                        onClick={() => setSelectedMethod('momo')}
                                    >
                                        <div className="pm-logo mtn">MOMO</div>
                                        <span>MTN MoMo</span>
                                    </div>
                                    <div 
                                        className={`recharge-method-card ${selectedMethod === 'card' ? 'selected' : ''}`}
                                        onClick={() => setSelectedMethod('card')}
                                    >
                                        <div className="pm-logo card"><FaCreditCard /></div>
                                        <span>Carte Bancaire</span>
                                    </div>
                                </div>

                                <div className="amount-input-group">
                                    <label>Montant à recharger (FCFA)</label>
                                    <input type="number" placeholder="Ex: 10000" className="recharge-input" />
                                </div>

                                <button 
                                    className="btn-recharge-next" 
                                    disabled={!selectedMethod}
                                    onClick={() => setRechargeStep(2)}
                                >
                                    Continuer vers le paiement
                                </button>
                            </div>
                        )}

                        {rechargeStep === 2 && (
                            <div className="recharge-step-2">
                                <div className="processing-icon">
                                    <FaMobileAlt className="shake-animation" />
                                </div>
                                <h2>Veuillez confirmer sur votre téléphone</h2>
                                <p>Un menu USSD a été envoyé (ou envoyez manuellement au #150*...). Entrez votre code PIN secret pour valider la transaction de rechargement.</p>
                                
                                <button className="btn-simul-success" onClick={() => setRechargeStep(3)}>
                                    (Simuler Succès)
                                </button>
                            </div>
                        )}

                        {rechargeStep === 3 && (
                            <div className="recharge-step-3">
                                <FaCheckCircle className="success-check-icon" />
                                <h2>Paiement réussi !</h2>
                                <p>Votre portefeuille a été crédité avec succès. Les fonds sont disponibles immédiatement.</p>
                                <button className="btn-recharge-next" onClick={() => {setShowRechargeModal(false); setRechargeStep(1)}}>
                                    Fermer
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientWallet;
