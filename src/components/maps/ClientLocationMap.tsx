import React, { useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './maplibreWorker';

interface ClientLocationMapProps {
    onLocationFound?: (lat: number, lng: number) => void;
}

const ClientLocationMap: React.FC<ClientLocationMapProps> = ({ onLocationFound }) => {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Géolocalisation non supportée');
            setLoading(false);
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setPosition({ lat, lng });
                setLoading(false);
                setError(null);
                onLocationFound?.(lat, lng);
            },
            (err) => {
                setLoading(false);
                // Un délai dépassé ou une position momentanément indisponible (appareil immobile,
                // intérieur, ordinateur) ne doit pas effacer la dernière position connue : la carte
                // disparaissait au profit d'un message d'erreur au bout de quelques secondes.
                // Seul un refus d'autorisation retire la position ; sinon l'erreur ne s'affiche
                // que si aucune position n'a encore été obtenue (setError ne masque rien sinon).
                if (err.code === err.PERMISSION_DENIED) {
                    setPosition(null);
                    setError('Activez la localisation pour voir votre position');
                    return;
                }
                setError(err.code === err.POSITION_UNAVAILABLE
                    ? 'Position indisponible'
                    : 'Impossible de récupérer votre position');
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 30000,
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [onLocationFound]);

    if (loading) {
        return (
            <div style={overlayStyle}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--ds-secondary)', animation: 'spin 1.2s linear infinite' }}>my_location</span>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>Localisation en cours...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!position) {
        return (
            <div style={overlayStyle}>
                <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#ef4444' }}>location_off</span>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#64748b', textAlign: 'center', maxWidth: '200px' }}>{error}</p>
            </div>
        );
    }

    return (
        <Map
            initialViewState={{
                longitude: position.lng,
                latitude: position.lat,
                zoom: 15,
            }}
            mapStyle="https://tiles.openfreemap.org/styles/liberty"
            style={{ width: '100%', height: '100%' }}
        >
            <NavigationControl position="top-right" showCompass={false} />

            {/* Client position marker — blue pulsing dot like Uber */}
            <Marker longitude={position.lng} latitude={position.lat} anchor="center">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Pulse ring */}
                    <div style={{
                        position: 'absolute',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(25, 96, 163, 0.2)',
                        animation: 'clientPulse 2s ease-out infinite',
                    }} />
                    {/* Outer ring */}
                    <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    }}>
                        {/* Inner dot */}
                        <div style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            background: 'var(--ds-secondary, #1960a3)',
                        }} />
                    </div>
                </div>
            </Marker>

            {/* Info overlay */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                zIndex: 10,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                padding: '8px 14px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--ds-secondary, #1960a3)', fontVariationSettings: "'FILL' 1" }}>my_location</span>
                <div>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Votre position</p>
                    <p style={{ fontSize: '0.65rem', margin: 0, color: '#64748b' }}>
                        {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes clientPulse {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
            `}</style>
        </Map>
    );
};

const overlayStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1f5f9',
    borderRadius: 'inherit',
};

export default ClientLocationMap;
