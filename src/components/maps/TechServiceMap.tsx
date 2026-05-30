import React from 'react';
import Map, { Marker, Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface TechServiceMapProps {
    latitude: number;
    longitude: number;
    radiusInKm?: number;
    city?: string;
    /** Reçoit l'instance maplibre une fois la carte chargée (pour piloter zoom/recentrage). */
    onReady?: (map: any) => void;
}

const TechServiceMap: React.FC<TechServiceMapProps> = ({ latitude, longitude, radiusInKm = 5, city, onReady }) => {
    // Helper to generate a GeoJSON circle
    const createGeoJSONCircle = (center: [number, number], radiusInKm: number, points: number = 64) => {
        const coords = {
            latitude: center[1],
            longitude: center[0]
        };
        const distanceX = radiusInKm / (111.32 * Math.cos(coords.latitude * Math.PI / 180));
        const distanceY = radiusInKm / 110.574;

        const ret = [];
        for (let i = 0; i < points; i++) {
            const theta = (i / points) * (2 * Math.PI);
            const x = distanceX * Math.cos(theta);
            const y = distanceY * Math.sin(theta);

            ret.push([coords.longitude + x, coords.latitude + y]);
        }
        ret.push(ret[0]);

        return {
            type: 'Feature' as const,
            geometry: {
                type: 'Polygon' as const,
                coordinates: [ret]
            },
            properties: {}
        };
    };

    const circleData = createGeoJSONCircle([longitude, latitude], radiusInKm);

    return (
        <div className="tech-service-map-wrapper" style={{ width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
            <Map
                initialViewState={{
                    longitude: longitude || 11.5021, // Default Yaoundé if null
                    latitude: latitude || 3.8480,
                    zoom: 11
                }}
                mapStyle="https://tiles.openfreemap.org/styles/liberty" // Pro-grade detailed OSM style
                style={{ width: '100%', height: '100%' }}
                onLoad={(e) => onReady?.(e.target)}
            >
                <NavigationControl position="top-right" />
                <FullscreenControl position="top-left" />

                {/* Service Radius Circle */}
                <Source id="service-radius" type="geojson" data={circleData}>
                    <Layer
                        id="radius-fill"
                        type="fill"
                        paint={{
                            'fill-color': '#0284c7',
                            'fill-opacity': 0.15
                        }}
                    />
                    <Layer
                        id="radius-outline"
                        type="line"
                        paint={{
                            'line-color': '#0284c7',
                            'line-width': 2,
                            'line-dasharray': [2, 1]
                        }}
                    />
                </Source>

                {/* Technician Marker */}
                <Marker longitude={longitude} latitude={latitude} anchor="bottom">
                    <div style={{ color: 'var(--tech-secondary)', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '32px', fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    </div>
                </Marker>

                {/* Map Overlay for Info */}
                <div className="tech-map-ui" style={{ position: 'absolute', bottom: '16px', left: '16px', zIndex: 10, background: 'rgba(255,255,255,0.9)', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <span className="material-symbols-outlined text-secondary">verified</span>
                    <div>
                        <p className="tech-map-ui-title" style={{ fontSize: '0.75rem', fontWeight: 700, margin: 0 }}>Active Zone</p>
                        <p className="tech-map-ui-desc" style={{ fontSize: '0.7rem', margin: 0 }}>{city || 'Cameroon Hub'}</p>
                    </div>
                </div>
            </Map>
        </div>
    );
};

export default TechServiceMap;
