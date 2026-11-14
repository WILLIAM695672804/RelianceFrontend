import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Marker, Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import type { Feature } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';
import './maplibreWorker';

interface Position {
    latitude: number;
    longitude: number;
}

interface RouteMapProps {
    /** Current user's position (from geolocation) */
    origin: Position | null;
    /** Other party's position */
    destination: Position | null;
    /** Label for origin marker */
    originLabel?: string;
    /** Label for destination marker */
    destinationLabel?: string;
    /** Whether origin is the technician (blue car icon) or client (home icon) */
    originType?: 'technician' | 'client';
}

const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

const RouteMap: React.FC<RouteMapProps> = ({
    origin,
    destination,
    originLabel = 'Vous',
    destinationLabel = 'Destination',
    originType = 'client',
}) => {
    const mapRef = useRef<MapRef>(null);
    const [routeGeoJSON, setRouteGeoJSON] = useState<Feature | null>(null);
    const [routeInfo, setRouteInfo] = useState<{ duration: number; distance: number } | null>(null);
    const prevRouteKey = useRef('');

    const fetchRoute = useCallback(async (orig: Position, dest: Position) => {
        const key = `${orig.latitude.toFixed(4)},${orig.longitude.toFixed(4)}-${dest.latitude.toFixed(4)},${dest.longitude.toFixed(4)}`;
        if (key === prevRouteKey.current) return;
        prevRouteKey.current = key;

        try {
            const url = `${OSRM_URL}/${orig.longitude},${orig.latitude};${dest.longitude},${dest.latitude}?overview=full&geometries=geojson`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                setRouteGeoJSON({
                    type: 'Feature',
                    properties: {},
                    geometry: route.geometry,
                });
                setRouteInfo({
                    duration: Math.round(route.duration / 60),
                    distance: +(route.distance / 1000).toFixed(1),
                });

                // Fit map to route bounds
                if (mapRef.current) {
                    const coords = route.geometry.coordinates;
                    const lngs = coords.map((c: number[]) => c[0]);
                    const lats = coords.map((c: number[]) => c[1]);
                    mapRef.current.fitBounds(
                        [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
                        { padding: 60, duration: 1000 }
                    );
                }
            }
        } catch {
            // OSRM unavailable
        }
    }, []);

    useEffect(() => {
        if (origin && destination) {
            fetchRoute(origin, destination);
        }
    }, [origin, destination, fetchRoute]);

    const center = origin ?? destination ?? { latitude: 3.848, longitude: 11.502 };

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: center.longitude,
                    latitude: center.latitude,
                    zoom: 13,
                }}
                mapStyle="https://tiles.openfreemap.org/styles/liberty"
                style={{ width: '100%', height: '100%' }}
            >
                <NavigationControl position="top-right" showCompass={false} />

                {/* Route line */}
                {routeGeoJSON && (
                    <Source id="route" type="geojson" data={routeGeoJSON}>
                        {/* Route shadow */}
                        <Layer
                            id="route-shadow"
                            type="line"
                            paint={{
                                'line-color': '#000',
                                'line-width': 8,
                                'line-opacity': 0.1,
                                'line-blur': 4,
                            }}
                        />
                        {/* Route outline */}
                        <Layer
                            id="route-outline"
                            type="line"
                            paint={{
                                'line-color': '#1e40af',
                                'line-width': 6,
                                'line-opacity': 0.3,
                            }}
                        />
                        {/* Main route */}
                        <Layer
                            id="route-main"
                            type="line"
                            paint={{
                                'line-color': '#3b82f6',
                                'line-width': 4,
                            }}
                        />
                    </Source>
                )}

                {/* Origin marker */}
                {origin && (
                    <Marker longitude={origin.longitude} latitude={origin.latitude} anchor="center">
                        {originType === 'technician' ? (
                            <TechMarker label={originLabel} />
                        ) : (
                            <ClientMarker label={originLabel} />
                        )}
                    </Marker>
                )}

                {/* Destination marker */}
                {destination && (
                    <Marker longitude={destination.longitude} latitude={destination.latitude} anchor="bottom">
                        {originType === 'technician' ? (
                            <DestinationMarker label={destinationLabel} type="client" />
                        ) : (
                            <DestinationMarker label={destinationLabel} type="technician" />
                        )}
                    </Marker>
                )}
            </Map>

            {/* Route info overlay */}
            {routeInfo && (
                <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    background: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(12px)',
                    padding: '10px 20px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#3b82f6', fontVariationSettings: "'FILL' 1" }}>schedule</span>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{routeInfo.duration} min</span>
                    </div>
                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#10b981', fontVariationSettings: "'FILL' 1" }}>route</span>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{routeInfo.distance} km</span>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes techPulse {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(2.8); opacity: 0; }
                }
                @keyframes bounce2 {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
            `}</style>
        </div>
    );
};

/* ---- Marker sub-components ---- */

const TechMarker: React.FC<{ label: string }> = ({ label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
            {/* Pulse */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.25)',
                animation: 'techPulse 2s ease-out infinite',
            }} />
            {/* Icon */}
            <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.5)',
                border: '3px solid #fff',
                position: 'relative', zIndex: 2,
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            </div>
        </div>
        <span style={{
            marginTop: '4px', fontSize: '0.65rem', fontWeight: 700, color: '#fff',
            background: '#2563eb', padding: '2px 8px', borderRadius: '8px',
            whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>{label}</span>
    </div>
);

const ClientMarker: React.FC<{ label: string }> = ({ label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.25)',
                animation: 'techPulse 2s ease-out infinite',
            }} />
            <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.5)',
                border: '3px solid #fff',
                position: 'relative', zIndex: 2,
            }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
        </div>
        <span style={{
            marginTop: '4px', fontSize: '0.65rem', fontWeight: 700, color: '#fff',
            background: '#059669', padding: '2px 8px', borderRadius: '8px',
            whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>{label}</span>
    </div>
);

const DestinationMarker: React.FC<{ label: string; type: 'technician' | 'client' }> = ({ label, type }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'bounce2 2s ease infinite' }}>
        <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: type === 'technician'
                ? 'linear-gradient(135deg, #2563eb, #3b82f6)'
                : 'linear-gradient(135deg, #059669, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            border: '3px solid #fff',
        }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>
                {type === 'client' ? 'home_pin' : 'local_shipping'}
            </span>
        </div>
        <span style={{
            marginTop: '4px', fontSize: '0.65rem', fontWeight: 700, color: '#fff',
            background: type === 'technician' ? '#2563eb' : '#059669',
            padding: '2px 8px', borderRadius: '8px',
            whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}>{label}</span>
        {/* Pin tail */}
        <div style={{
            width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: `8px solid ${type === 'technician' ? '#2563eb' : '#059669'}`,
        }} />
    </div>
);

export default RouteMap;
