import React, { useState } from 'react';
import {
    FaArrowLeft,
    FaMobileAlt,
    FaUniversity,
    FaInfoCircle,
    FaCheckCircle,
    FaMoneyBillWave
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Withdrawal.css';

const Withdrawal: React.FC = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<'MOBILE_MONEY' | 'BANK'>('MOBILE_MONEY');
    const [isSuccess, setIsSuccess] = useState(false);

    const availableBalance = 36000;
    const minWithdrawal = 5000;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers
        const val = e.target.value.replace(/[^0-9]/g, '');
        setAmount(val);
    };

    const parsedAmount = parseInt(amount) || 0;
    const fee = parsedAmount * 0.02; // 2% fee
    const totalDeduction = parsedAmount + fee;
    const isValid = parsedAmount >= minWithdrawal && totalDeduction <= availableBalance;

    const handleSubmit = () => {
        if (!isValid) return;
        // Simulate API call
        setTimeout(() => {
            setIsSuccess(true);
        }, 1000);
    };

    if (isSuccess) {
        return (
            <div className="tech-page withdrawal-page" style={{ textAlign: 'center', paddingTop: '50px' }}>
                <div style={{ fontSize: '4rem', color: '#22c55e', marginBottom: '20px' }}>
                    <FaCheckCircle />
                </div>
                <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>Demande envoyée !</h2>
                <p style={{ color: '#64748b', marginBottom: '30px' }}>
                    Votre retrait de <strong>{parsedAmount} FCFA</strong> est en cours de traitement.<br />
                    Vous recevrez les fonds sous 24h.
                </p>
                <button
                    className="submit-withdrawal-btn"
                    onClick={() => navigate('/technicien/wallet')}
                    style={{ width: 'auto', padding: '12px 40px', margin: '0 auto' }}
                >
                    Retour au Portefeuille
                </button>
            </div>
        );
    }

    return (
        <div className="tech-page withdrawal-page">
            <button className="back-btn" onClick={() => navigate('/technicien/wallet')} style={{ marginBottom: '20px' }}>
                <FaArrowLeft /> Retour
            </button>

            <h1 className="page-title">Effectuer un retrait</h1>

            <div className="withdrawal-card">
                <div className="balance-preview">
                    <span>Solde disponible</span>
                    <strong>{availableBalance.toLocaleString()} FCFA</strong>
                </div>

                <div className="info-alert">
                    <FaInfoCircle style={{ marginTop: '3px' }} />
                    <div>
                        Le montant minimum de retrait est de {minWithdrawal.toLocaleString()} FCFA.
                        Des frais de 2% s'appliquent à chaque transaction.
                    </div>
                </div>

                {/* Amount Input */}
                <div className="form-group">
                    <label className="form-label">Montant à retirer</label>
                    <div className="amount-input-wrapper">
                        <input
                            type="text"
                            className="amount-input"
                            placeholder="0"
                            value={amount}
                            onChange={handleAmountChange}
                        />
                        <span className="currency-suffix">FCFA</span>
                    </div>
                    {parsedAmount > availableBalance && (
                        <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '5px' }}>
                            Solde insuffisant pour ce montant (frais inclus).
                        </p>
                    )}
                </div>

                {/* Method Selection */}
                <div className="form-group">
                    <label className="form-label">Méthode de réception</label>
                    <div className="method-selector">
                        <div
                            className={`method-option ${method === 'MOBILE_MONEY' ? 'selected' : ''}`}
                            onClick={() => setMethod('MOBILE_MONEY')}
                        >
                            <FaMobileAlt className="method-icon" />
                            <span>Mobile Money</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(Orange/MTN)</span>
                        </div>
                        <div
                            className={`method-option ${method === 'BANK' ? 'selected' : ''}`}
                            onClick={() => setMethod('BANK')}
                        >
                            <FaUniversity className="method-icon" />
                            <span>Virement Bancaire</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(2-3 jours)</span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="fee-summary">
                    <div className="fee-row">
                        <span>Montant demandé</span>
                        <span>{parsedAmount.toLocaleString()} FCFA</span>
                    </div>
                    <div className="fee-row">
                        <span>Frais de service (2%)</span>
                        <span>{fee.toLocaleString()} FCFA</span>
                    </div>
                    <div className="fee-row total">
                        <span>Total déduit du solde</span>
                        <span>{totalDeduction.toLocaleString()} FCFA</span>
                    </div>
                </div>

                <button
                    className="submit-withdrawal-btn"
                    onClick={handleSubmit}
                    disabled={!isValid}
                >
                    <FaMoneyBillWave /> Confirmer le retrait
                </button>
            </div>
        </div>
    );
};

export default Withdrawal;
