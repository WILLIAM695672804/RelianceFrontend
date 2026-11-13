import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { financeService } from '../../services/financeService';
import { formatXAF } from '../../utils/format';

interface Diagnostic { id: string; amount: number; platform_fee: number; net_to_technician: number; paid: boolean; }

/**
 * Frais de diagnostic (cahier des charges §4.4) : le technicien mandaté les fixe, le client les règle
 * depuis son portefeuille, avant ou après l'intervention.
 */
const DiagnosticFee: React.FC<{ requestId: string; role: 'client' | 'technicien' }> = ({ requestId, role }) => {
    const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [amount, setAmount] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<{ texte: string; wallet?: boolean; activer2fa?: boolean } | null>(null);

    const charger = useCallback(async () => {
        try {
            const res = await financeService.getDiagnostic(requestId);
            setDiagnostic(res.data?.data ?? null);
        } catch { /* section facultative */ }
        finally { setLoaded(true); }
    }, [requestId]);

    useEffect(() => { void charger(); }, [charger]);

    const echec = (err: any, defaut: string) => {
        const d = err?.response?.data;
        setError({ texte: d?.message || defaut, wallet: err?.response?.status === 402, activer2fa: !!d?.requires_2fa_setup });
    };

    const fixer = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const montant = Number(amount);
        if (!montant || montant < 100) { setError({ texte: 'Montant minimum : 100 XAF.' }); return; }
        setBusy(true);
        try { await financeService.setDiagnostic(requestId, montant); setAmount(''); await charger(); }
        catch (err) { echec(err, 'Impossible de fixer les frais de diagnostic.'); }
        finally { setBusy(false); }
    };

    const payer = async () => {
        if (!diagnostic) return;
        setError(null);
        setBusy(true);
        try { await financeService.payDiagnostic(diagnostic.id); await charger(); }
        catch (err) { echec(err, 'Le paiement a échoué.'); }
        finally { setBusy(false); }
    };

    if (!loaded) return null;
    if (!diagnostic && role === 'client') return null;

    return (
        <section aria-label="Frais de diagnostic" style={{ marginTop: 16 }}>
            <h4>Frais de diagnostic</h4>
            {!diagnostic ? (
                <form onSubmit={fixer} style={{ display: 'flex', gap: 8 }}>
                    <input type="number" min="100" placeholder="Montant (XAF)" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <button type="submit" disabled={busy}>Fixer les frais</button>
                </form>
            ) : (
                <div>
                    <p>Montant : <strong>{formatXAF(diagnostic.amount)}</strong></p>
                    {role === 'client' ? (
                        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Dont commission de la plateforme : {formatXAF(diagnostic.platform_fee)}.</p>
                    ) : (
                        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Net après commission : {formatXAF(diagnostic.net_to_technician)}.</p>
                    )}
                    {diagnostic.paid ? (
                        <p role="status" style={{ color: '#16a34a' }}>Réglés</p>
                    ) : role === 'client' ? (
                        <button type="button" onClick={payer} disabled={busy}>{busy ? 'Paiement…' : 'Payer les frais'}</button>
                    ) : (
                        <p>En attente de règlement par le client.</p>
                    )}
                </div>
            )}
            {error && (
                <p role="alert" style={{ color: '#dc2626' }}>
                    {error.texte}
                    {error.wallet && <> <Link to="/espace-client/wallet">Recharger mon portefeuille</Link></>}
                    {error.activer2fa && <> <Link to="/espace-client/profil">Activer la double authentification</Link></>}
                </p>
            )}
        </section>
    );
};

export default DiagnosticFee;
