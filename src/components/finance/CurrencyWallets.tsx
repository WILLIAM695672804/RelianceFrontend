import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { financeService } from '../../services/financeService';

interface WalletLine { currency: string; balance: number; available_balance: number; }

const DEVISES = ['XAF', 'EUR', 'USD'];
const formater = (montant: number, devise: string) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: devise, maximumFractionDigits: devise === 'XAF' ? 0 : 2 }).format(montant);

/** Portefeuilles multi-devises (XAF, EUR, USD) et conversion au taux défini par l'administrateur. */
const CurrencyWallets: React.FC = () => {
    const [wallets, setWallets] = useState<WalletLine[]>([]);
    const [amount, setAmount] = useState('');
    const [from, setFrom] = useState('XAF');
    const [to, setTo] = useState('EUR');
    const [message, setMessage] = useState<{ type: 'ok' | 'erreur'; texte: string; activer2fa?: boolean } | null>(null);
    const [busy, setBusy] = useState(false);

    const charger = useCallback(async () => {
        try {
            const res = await financeService.getWallets();
            setWallets(res.data?.data ?? []);
        } catch { /* l'écran du portefeuille principal reste utilisable */ }
    }, []);

    useEffect(() => { void charger(); }, [charger]);

    const convertir = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        const montant = Number(amount);
        if (!montant || montant <= 0) { setMessage({ type: 'erreur', texte: 'Saisissez un montant positif.' }); return; }
        if (from === to) { setMessage({ type: 'erreur', texte: 'Choisissez deux devises différentes.' }); return; }
        setBusy(true);
        try {
            const res = await financeService.convertCurrency({ amount: montant, from_currency: from, to_currency: to });
            const d = res.data?.data;
            setMessage({ type: 'ok', texte: `${formater(d.debited, from)} converti en ${formater(d.credited, to)}.` });
            setAmount('');
            await charger();
        } catch (err: any) {
            const data = err?.response?.data;
            setMessage({ type: 'erreur', texte: data?.message || 'Conversion impossible.', activer2fa: !!data?.requires_2fa_setup });
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="currency-wallets" aria-label="Portefeuilles par devise" style={{ marginTop: 24 }}>
            <h3>Mes devises</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {wallets.map((w) => (
                    <li key={w.currency} data-testid={`wallet-${w.currency}`}>
                        <strong>{w.currency}</strong> : {formater(Number(w.available_balance ?? w.balance), w.currency)}
                    </li>
                ))}
            </ul>
            <form onSubmit={convertir} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="number" min="0" step="0.01" placeholder="Montant à convertir" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <select aria-label="Devise source" value={from} onChange={(e) => setFrom(e.target.value)}>
                    {DEVISES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <span aria-hidden>→</span>
                <select aria-label="Devise cible" value={to} onChange={(e) => setTo(e.target.value)}>
                    {DEVISES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <button type="submit" disabled={busy}>{busy ? 'Conversion…' : 'Convertir'}</button>
            </form>
            {message && (
                <p role={message.type === 'ok' ? 'status' : 'alert'} style={{ color: message.type === 'ok' ? '#16a34a' : '#dc2626' }}>
                    {message.texte}
                    {message.activer2fa && <> <Link to="/espace-client/profil">Activer la double authentification</Link></>}
                </p>
            )}
        </section>
    );
};

export default CurrencyWallets;
