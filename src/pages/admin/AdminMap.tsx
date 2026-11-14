import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../../components/maps/maplibreWorker';
import adminService from '../../services/adminService';

interface MapTechnician {
    id: string; name: string; verified: boolean; rating: number;
    latitude: number; longitude: number; radius_km: number; city?: string | null; skills: string[];
}
interface MapRequest { id: string; title: string; status: string; latitude: number; longitude: number; }

type Selected = { kind: 'tech'; item: MapTechnician } | { kind: 'request'; item: MapRequest } | null;

/** Cartographie d'administration : techniciens référencés et demandes actives. */
const AdminMap: React.FC = () => {
    const [technicians, setTechnicians] = useState<MapTechnician[]>([]);
    const [requests, setRequests] = useState<MapRequest[]>([]);
    const [selected, setSelected] = useState<Selected>(null);
    const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

    useEffect(() => {
        adminService.getMap()
            .then((res: any) => {
                setTechnicians(res.data?.technicians ?? []);
                setRequests(res.data?.requests ?? []);
                setState('ready');
            })
            .catch(() => setState('error'));
    }, []);

    if (state === 'loading') return <div style={{ padding: 24 }}>Chargement de la carte…</div>;
    if (state === 'error') return <div style={{ padding: 24 }}>Impossible de charger la cartographie.</div>;

    return (
        <div style={{ padding: 16 }}>
            <h1 style={{ marginBottom: 4 }}>Cartographie</h1>
            <p style={{ marginBottom: 12, opacity: 0.8 }}>
                {technicians.length} technicien(s) · {requests.length} demande(s) active(s)
                <span style={{ marginLeft: 12 }}>🔧 technicien · 📍 demande</span>
            </p>
            <div style={{ height: '70vh', borderRadius: 12, overflow: 'hidden' }}>
                <Map
                    initialViewState={{ longitude: 9.7679, latitude: 4.0511, zoom: 9 }}
                    mapStyle="https://tiles.openfreemap.org/styles/liberty"
                    style={{ width: '100%', height: '100%' }}
                >
                    <NavigationControl position="top-right" />
                    {technicians.map((t) => (
                        <Marker key={`t-${t.id}`} longitude={t.longitude} latitude={t.latitude} anchor="bottom"
                            onClick={(e) => { e.originalEvent.stopPropagation(); setSelected({ kind: 'tech', item: t }); }}>
                            <span style={{ fontSize: 22, cursor: 'pointer' }} title={t.name}>🔧</span>
                        </Marker>
                    ))}
                    {requests.map((r) => (
                        <Marker key={`r-${r.id}`} longitude={r.longitude} latitude={r.latitude} anchor="bottom"
                            onClick={(e) => { e.originalEvent.stopPropagation(); setSelected({ kind: 'request', item: r }); }}>
                            <span style={{ fontSize: 22, cursor: 'pointer' }} title={r.title}>📍</span>
                        </Marker>
                    ))}
                    {selected && (
                        <Popup longitude={selected.item.longitude} latitude={selected.item.latitude}
                            anchor="top" onClose={() => setSelected(null)} closeOnClick={false}>
                            {selected.kind === 'tech' ? (
                                <div>
                                    <strong>{selected.item.name}</strong>
                                    <div>{selected.item.verified ? 'Vérifié' : 'Non vérifié'} · ★ {Number(selected.item.rating).toFixed(1)}</div>
                                    <div>Rayon : {selected.item.radius_km} km</div>
                                    {selected.item.skills.length > 0 && <div>{selected.item.skills.join(', ')}</div>}
                                </div>
                            ) : (
                                <div>
                                    <strong>{selected.item.title}</strong>
                                    <div>Statut : {selected.item.status}</div>
                                </div>
                            )}
                        </Popup>
                    )}
                </Map>
            </div>
        </div>
    );
};

export default AdminMap;
