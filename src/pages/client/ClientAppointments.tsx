import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments, type Appointment } from '../../services/operationsService';
import './ClientAppointments.css';

const STATUS_META: Record<string, { label: string; cls: string; icon: string }> = {
    scheduled: { label: 'En attente de confirmation', cls: 'ca-status-pending', icon: 'hourglass_empty' },
    confirmed: { label: 'Confirmé', cls: 'ca-status-confirmed', icon: 'event_available' },
    in_progress: { label: 'En cours', cls: 'ca-status-progress', icon: 'pending_actions' },
    completed: { label: 'Terminé', cls: 'ca-status-completed', icon: 'task_alt' },
    cancelled: { label: 'Refusé / annulé', cls: 'ca-status-cancelled', icon: 'event_busy' },
    no_show: { label: 'Absence', cls: 'ca-status-cancelled', icon: 'person_off' },
};

const ClientAppointments: React.FC = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAppointments();
                setAppointments(res.data ?? []);
            } catch { /* silent */ }
            finally { setLoading(false); }
        })();
    }, []);

    return (
        <div className="ca-page">
            <header className="ca-header">
                <div>
                    <h1 className="ca-title">Mes rendez-vous</h1>
                    <p className="ca-subtitle">Suivez vos demandes d'intervention planifiées et leur confirmation par les techniciens.</p>
                </div>
                <button className="ca-new-btn" onClick={() => navigate('/espace-client/demande')}>
                    <span className="material-symbols-outlined">add</span>
                    Nouvelle demande
                </button>
            </header>

            {loading ? (
                <div className="ca-empty">Chargement...</div>
            ) : appointments.length === 0 ? (
                <div className="ca-empty">
                    <span className="material-symbols-outlined">calendar_today</span>
                    <p>Aucun rendez-vous planifié pour le moment.</p>
                    <button className="ca-new-btn" onClick={() => navigate('/espace-client/matching')}>
                        Trouver un technicien
                    </button>
                </div>
            ) : (
                <div className="ca-list">
                    {appointments.map((appt) => {
                        const meta = STATUS_META[appt.status] ?? STATUS_META.scheduled;
                        const start = new Date(appt.scheduled_start);
                        return (
                            <div key={appt.id} className="ca-card">
                                <div className="ca-card-date">
                                    <span className="ca-date-day">{start.toLocaleDateString('fr-FR', { day: '2-digit' })}</span>
                                    <span className="ca-date-month">{start.toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                </div>
                                <div className="ca-card-body">
                                    <h3>{appt.request?.title ?? 'Intervention'}</h3>
                                    <p className="ca-card-meta">
                                        <span className="material-symbols-outlined">schedule</span>
                                        {start.toLocaleString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {appt.technician && (
                                        <p className="ca-card-meta">
                                            <span className="material-symbols-outlined">engineering</span>
                                            {appt.technician.name}
                                        </p>
                                    )}
                                    {appt.notes && <p className="ca-card-notes">{appt.notes}</p>}
                                </div>
                                <div className={`ca-status-badge ${meta.cls}`}>
                                    <span className="material-symbols-outlined">{meta.icon}</span>
                                    {meta.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ClientAppointments;
