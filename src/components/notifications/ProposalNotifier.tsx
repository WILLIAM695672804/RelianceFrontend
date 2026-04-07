import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import './ProposalNotifier.css';

const ProposalNotifier: React.FC = () => {
    const [toast, setToast] = useState<{ title: string; price?: number } | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const playSound = useCallback(() => {
        try {
            const ctx = new AudioContext();
            const playTone = (freq: number, start: number, dur: number) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
                osc.start(ctx.currentTime + start);
                osc.stop(ctx.currentTime + start + dur);
            };
            playTone(880, 0, 0.15);
            playTone(1100, 0.15, 0.2);
        } catch {
            // Audio not supported
        }
    }, []);

    const checkForNotifications = useCallback(async () => {
        try {
            const res = await api.get('/proposals/check-new');
            const data = res.data;
            if (data.has_new && data.data) {
                playSound();
                setToast({
                    title: data.data.title ?? 'Nouvelle mission',
                    price: data.data.price,
                });
                setTimeout(() => setToast(null), 8000);
            }
        } catch {
            // Silent
        }
    }, [playSound]);

    useEffect(() => {
        // Check immediately then every 3 seconds
        checkForNotifications();
        intervalRef.current = setInterval(checkForNotifications, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [checkForNotifications]);

    // Hide on radar/cockpit pages
    const isOnRadarPage = location.pathname.includes('/radar') || location.pathname.includes('/cockpit');
    if (isOnRadarPage || !toast) return null;

    return (
        <div className="pn-toast">
            <div className="pn-toast-inner">
                <div className="pn-toast-icon">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '24px' }}>notifications_active</span>
                </div>
                <div className="pn-toast-content">
                    <p className="pn-toast-title">Nouvelle proposition !</p>
                    <p className="pn-toast-sub">
                        {toast.title}{toast.price ? ` — ${Number(toast.price).toLocaleString()} XAF` : ''}
                    </p>
                </div>
                <div className="pn-toast-actions">
                    <button
                        className="pn-toast-btn"
                        onClick={() => {
                            setToast(null);
                            navigate('/technicien/radar');
                        }}
                    >
                        Voir
                    </button>
                    <button className="pn-toast-close" onClick={() => setToast(null)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProposalNotifier;
