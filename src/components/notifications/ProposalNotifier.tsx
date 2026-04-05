import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProposalNotifier.css';

const SSE_URL = 'http://127.0.0.1:8000/api/v1/proposals/stream';

const ProposalNotifier: React.FC = () => {
    const [toast, setToast] = useState<{ title: string; price?: number } | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    const connectSSE = useCallback(() => {
        // Close existing connection
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const token = localStorage.getItem('auth_token');
        if (!token) return;

        // EventSource doesn't support headers natively, pass token as query param
        const url = `${SSE_URL}?token=${encodeURIComponent(token)}`;
        const es = new EventSource(url);
        eventSourceRef.current = es;

        es.addEventListener('new_proposal', (event) => {
            try {
                const data = JSON.parse(event.data);
                playSound();
                setToast({
                    title: data.title ?? 'Nouvelle mission',
                    price: data.price,
                });
                // Auto-dismiss after 8 seconds
                setTimeout(() => setToast(null), 8000);
            } catch {
                // Parse error
            }
        });

        es.addEventListener('connected', () => {
            // Connection established
        });

        es.onerror = () => {
            es.close();
            // Reconnect after 5 seconds
            reconnectTimeoutRef.current = setTimeout(connectSSE, 5000);
        };
    }, [playSound]);

    useEffect(() => {
        connectSSE();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connectSSE]);

    // Hide on radar/matching page — technician already sees proposals there
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
                        {toast.title}{toast.price ? ` — ${toast.price.toLocaleString()} XAF` : ''}
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
