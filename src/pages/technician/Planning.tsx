import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTechCalendar, removeScheduleException, addScheduleException } from '../../services/scheduleService';
import { getUpcomingAppointments, getAppointments, updateAppointmentStatus, type Appointment } from '../../services/operationsService';
import './Planning.css';

const Planning: React.FC = () => {
    const navigate = useNavigate();
    const [calendarData, setCalendarData] = useState<any>(null);
    const [upcomingAppts, setUpcomingAppts] = useState<Appointment[]>([]);
    const [pendingAppts, setPendingAppts] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [weekOffset, setWeekOffset] = useState(0);
    const [view, setView] = useState<'week' | 'month'>('week');
    const [apptUpdating, setApptUpdating] = useState<string | null>(null);

    // Modale "Demander une absence"
    const [showExcModal, setShowExcModal] = useState(false);
    const [excStart, setExcStart] = useState('');
    const [excEnd, setExcEnd] = useState('');
    const [excReason, setExcReason] = useState('');
    const [excSaving, setExcSaving] = useState(false);

    useEffect(() => {
        fetchCalendar();
        fetchUpcoming();
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await getAppointments();
            setPendingAppts((res.data ?? []).filter((a) => a.status === 'scheduled'));
        } catch {
            // silent
        }
    };

    const handleAcceptAppt = async (id: string) => {
        setApptUpdating(id);
        try {
            await updateAppointmentStatus(id, 'confirmed');
            await Promise.all([fetchPending(), fetchUpcoming(), fetchCalendar()]);
        } catch {
            // silent
        } finally {
            setApptUpdating(null);
        }
    };

    const handleRefuseAppt = async (id: string) => {
        setApptUpdating(id);
        try {
            await updateAppointmentStatus(id, 'cancelled');
            await fetchPending();
        } catch {
            // silent
        } finally {
            setApptUpdating(null);
        }
    };

    const handleAddException = async () => {
        if (!excStart || !excEnd || excSaving) return;
        setExcSaving(true);
        try {
            await addScheduleException({
                start_ts: new Date(excStart).toISOString(),
                end_ts: new Date(excEnd).toISOString(),
                reason: excReason || undefined,
            });
            setShowExcModal(false);
            setExcStart(''); setExcEnd(''); setExcReason('');
            await fetchCalendar();
        } catch {
            // silent
        } finally {
            setExcSaving(false);
        }
    };

    const fetchCalendar = async () => {
        try {
            const data = await getTechCalendar();
            setCalendarData(data);
        } catch (error) {
            console.error("Failed to fetch calendar", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUpcoming = async () => {
        try {
            const appts = await getUpcomingAppointments();
            setUpcomingAppts(appts);
        } catch {
            // silent
        }
    };

    const handleDeleteException = async (id: string) => {
        if(!window.confirm("Delete this absence/exception?")) return;
        try {
            await removeScheduleException(id);
            fetchCalendar();
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return <div className="tech-planning-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Chargement du calendrier...</div>;
    }

    const data = calendarData || {};
    const exceptions = data.exceptions || [];
    const recurringSlots = data.recurring_slots || [];
    const appointments = data.appointments || [];
    const insights = data.insights || { capacity_percent: 0, booked_hours: 0, total_hours: 45 };

    // Helper to get week days
    const getWeekDays = () => {
        const today = new Date();
        const ref = new Date();
        ref.setDate(ref.getDate() + weekOffset * 7);
        const startOfWeek = new Date(ref);
        startOfWeek.setDate(ref.getDate() - ref.getDay() + (ref.getDay() === 0 ? -6 : 1)); // Start on Monday

        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return {
                name: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
                number: date.getDate(),
                year: date.getFullYear(),
                dateKey: date.toDateString(),
                isToday: date.toDateString() === today.toDateString(),
                isWeekend: i >= 5
            };
        });
    };

    // Rendez-vous confirmes/en cours a afficher dans la grille
    const apptsByDay: Record<string, Appointment[]> = {};
    appointments.forEach((appt: Appointment) => {
        if (!['confirmed', 'in_progress'].includes(appt.status)) return;
        const key = new Date(appt.scheduled_start).toDateString();
        (apptsByDay[key] = apptsByDay[key] || []).push(appt);
    });

    const weekDays = getWeekDays();
    const weekRange = `${weekDays[0].name} ${weekDays[0].number} - ${weekDays[6].name} ${weekDays[6].number}, ${weekDays[6].year}`;

    return (
        <div className="tech-planning-page">
            {/* Header Section */}
            <div className="tech-planning-header">
                <div className="tech-planning-titles">
                    <h2>Planification des interventions</h2>
                    <p>Gérez vos disponibilités, vos demandes de rendez-vous et vos interventions planifiées.</p>
                </div>
                <div className="tech-planning-actions">
                    <button className={view === 'week' ? 'tech-btn-active' : 'tech-btn-inactive'} onClick={() => setView('week')}>Semaine</button>
                    <button className={view === 'month' ? 'tech-btn-active' : 'tech-btn-inactive'} onClick={() => setView('month')}>Mois</button>
                </div>
            </div>

            {/* Demandes de rendez-vous à confirmer */}
            {pendingAppts.length > 0 && (
                <section className="tech-pending-section">
                    <div className="tech-pending-header">
                        <span className="material-symbols-outlined">notifications_active</span>
                        <h3>Demandes de rendez-vous ({pendingAppts.length})</h3>
                    </div>
                    <div className="tech-pending-list">
                        {pendingAppts.map((appt) => {
                            const start = new Date(appt.scheduled_start);
                            return (
                                <div className="tech-pending-card" key={appt.id}>
                                    <div className="tech-pending-info">
                                        <h5>{appt.request?.title || 'Intervention'}</h5>
                                        <p className="tech-pending-date">
                                            <span className="material-symbols-outlined">event</span>
                                            {start.toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        {appt.location?.address && (
                                            <p className="tech-pending-loc">
                                                <span className="material-symbols-outlined">location_on</span>
                                                {appt.location.address}, {appt.location.city}
                                            </p>
                                        )}
                                        {appt.notes && <p className="tech-pending-notes">{appt.notes}</p>}
                                    </div>
                                    <div className="tech-pending-actions">
                                        <button
                                            className="tech-pending-accept"
                                            disabled={apptUpdating === appt.id}
                                            onClick={() => handleAcceptAppt(appt.id)}
                                        >
                                            <span className="material-symbols-outlined">check</span>
                                            {apptUpdating === appt.id ? '...' : 'Accepter'}
                                        </button>
                                        <button
                                            className="tech-pending-refuse"
                                            disabled={apptUpdating === appt.id}
                                            onClick={() => handleRefuseAppt(appt.id)}
                                        >
                                            <span className="material-symbols-outlined">close</span>
                                            Refuser
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Bento Grid Layout */}
            <div className="tech-planning-grid">
                {/* Main Calendar View */}
                <div className="tech-planning-calendar">
                    <div className="tech-cal-header">
                        <div className="tech-cal-nav">
                            <h3>{weekRange}</h3>
                            <div className="tech-cal-buttons">
                                <button onClick={() => setWeekOffset((o) => o - (view === 'month' ? 4 : 1))}><span className="material-symbols-outlined">chevron_left</span></button>
                                <button onClick={() => setWeekOffset((o) => o + (view === 'month' ? 4 : 1))}><span className="material-symbols-outlined">chevron_right</span></button>
                            </div>
                        </div>
                        <div className="tech-cal-legend">
                            <div className="tech-legend-item">
                                <span className="tech-legend-dot tech-dot-available"></span>
                                <span>Disponible</span>
                            </div>
                            <div className="tech-legend-item">
                                <span className="tech-legend-dot tech-dot-booked"></span>
                                <span>Réservé</span>
                            </div>
                            <div className="tech-legend-item">
                                <span className="tech-legend-dot tech-dot-ooo"></span>
                                <span>Absent</span>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="tech-cal-grid">
                        {/* Time Column */}
                        <div className="tech-cal-time-col">
                            <div className="tech-cal-time-header"></div>
                            <div className="tech-cal-time-labels">
                                <div>08:00</div>
                                <div>10:00</div>
                                <div>12:00</div>
                                <div>14:00</div>
                                <div>16:00</div>
                                <div>18:00</div>
                            </div>
                        </div>

                        {/* Dynamic Days */}
                        {weekDays.map((day, idx) => (
                            <div className={`tech-cal-day-col ${day.isWeekend ? 'tech-day-disabled' : ''}`} key={idx}>
                                <div className="tech-cal-day-header">
                                    <span className="tech-day-name">{day.name}</span>
                                    <span className={`tech-day-number ${day.isToday ? 'tech-day-active tech-color-secondary' : 'tech-day-active'}`}>
                                        {day.number}
                                    </span>
                                </div>
                                <div className="tech-cal-day-slots">
                                    {(() => {
                                        const dayAppts = apptsByDay[day.dateKey] || [];
                                        if (dayAppts.length === 0) {
                                            return day.isWeekend ? null : (
                                                <div className="tech-slot-available tech-slot-hfull" style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                                                    <p style={{ fontSize: '0.75rem', textAlign: 'center' }}>Disponible</p>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '4px' }}>
                                                {dayAppts.map((appt) => (
                                                    <div
                                                        key={appt.id}
                                                        className="tech-slot-booked"
                                                        style={{ cursor: 'pointer', padding: '6px 8px', borderRadius: '8px' }}
                                                        onClick={() => navigate(`/technicien/mission/${appt.request_id}`)}
                                                    >
                                                        <p style={{ fontSize: '0.7rem', fontWeight: 700, margin: 0 }}>
                                                            {new Date(appt.scheduled_start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p style={{ fontSize: '0.7rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {appt.request?.title || 'Intervention'}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Panels */}
                <div className="tech-planning-sidebar">
                    {/* Recurring Availability Card */}
                    <div className="tech-panel-card">
                        <div className="tech-panel-header">
                            <span className="material-symbols-outlined">sync</span>
                            <h4>Créneaux récurrents</h4>
                        </div>
                        <div className="tech-panel-body">
                            {recurringSlots.length > 0 ? (
                                recurringSlots.map((slot: any) => (
                                    <div className="tech-slot-item" key={slot.id}>
                                        <div>
                                            <p className="tech-slot-label">{slot.day_of_week}</p>
                                            <p className="tech-slot-time">{slot.start_time} — {slot.end_time}</p>
                                        </div>
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1", color: "var(--tech-tertiary)"}}>check_circle</span>
                                    </div>
                                ))
                            ) : (
                                <div className="py-4 text-center">
                                    <p className="text-xs text-slate-500 mb-3">Aucun créneau récurrent défini.</p>
                                </div>
                            )}
                            <button className="tech-btn-add-shift" onClick={() => navigate('/technicien/zone')}>+ Ajouter un créneau</button>
                        </div>
                    </div>

                    {/* Exceptions */}
                    <div className="tech-panel-card tech-panel-shadow">
                        <h4 className="tech-exceptions-title">Absences</h4>
                        <div className="tech-exceptions-list">
                            {exceptions.length > 0 ? (
                                exceptions.map((exc: any) => (
                                    <div className="tech-exception-item" key={exc.id}>
                                        <div className="tech-exc-icon" style={{backgroundColor: "rgba(186, 26, 26, 0.2)", color: "var(--tech-error)"}}>
                                            <span className="material-symbols-outlined">event_busy</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p className="tech-exc-title">{exc.reason || 'Exception'}</p>
                                            <p className="tech-exc-time">{new Date(exc.start_ts).toLocaleDateString()} - {new Date(exc.end_ts).toLocaleDateString()}</p>
                                            <span className="tech-exc-badge" style={{backgroundColor: "var(--tech-error-container)", color: "var(--tech-on-error-container)"}}>Absent</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteException(exc.id)}
                                            style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>delete</span>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.875rem', color: 'var(--tech-on-surface-variant)' }}>Aucune absence à venir.</p>
                            )}
                        </div>
                        <button className="tech-btn-request-time" onClick={() => setShowExcModal(true)}>
                            <span className="material-symbols-outlined">add</span> Déclarer une absence
                        </button>
                    </div>

                    {/* Service Insights */}
                    <div className="tech-insights-card">
                        <div className="tech-insights-content">
                            <p className="tech-insights-subtitle">Capacité hebdomadaire</p>
                            <div className="tech-insights-bar-wrapper">
                                <div className="tech-insights-bar-labels">
                                    <span>{insights.capacity_percent}% réservé</span>
                                    <span>{insights.booked_hours} / {insights.total_hours} h</span>
                                </div>
                                <div className="tech-insights-bar-bg">
                                    <div className="tech-insights-bar-fill" style={{width: `${insights.capacity_percent}%`}}></div>
                                </div>
                            </div>
                            <p className="tech-insights-desc">Il vous reste {Math.max(0, insights.total_hours - insights.booked_hours)} heures libres cette semaine.</p>
                        </div>
                        <div className="tech-insights-bg-icon">
                            <span className="material-symbols-outlined">query_stats</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments */}
            <section className="tech-upcoming-appointments">
                <div className="tech-upcoming-header">
                    <h3>Prochains rendez-vous</h3>
                    <button onClick={() => navigate('/technicien/cockpit')}>Voir le cockpit</button>
                </div>
                <div className="tech-upcoming-grid">

                    {upcomingAppts.length > 0 ? (
                        upcomingAppts.map((appt) => (
                            <div className="tech-appt-card" key={appt.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/technicien/mission/${appt.request_id}`)}>
                                <div className="tech-appt-card-header">
                                    <span className="tech-appt-time">
                                        {new Date(appt.scheduled_start).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        {' '}
                                        {new Date(appt.scheduled_start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px',
                                        borderRadius: '12px', textTransform: 'uppercase',
                                        background: appt.status === 'confirmed' ? '#dcfce7' : '#dbeafe',
                                        color: appt.status === 'confirmed' ? '#16a34a' : '#2563eb'
                                    }}>{appt.status}</span>
                                </div>
                                <h5>{appt.request?.title || 'Intervention'}</h5>
                                <p className="tech-appt-address">{appt.location?.address ? `${appt.location.address}, ${appt.location.city}` : 'Adresse a confirmer'}</p>
                                {appt.notes && (
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>{appt.notes}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="tech-appt-card" style={{ borderStyle: 'dashed', background: 'transparent', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                             <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--tech-on-surface-variant)', opacity: 0.5 }}>calendar_today</span>
                             <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--tech-on-surface-variant)' }}>Aucune intervention à venir</p>
                        </div>
                    )}

                    <div className="tech-appt-card-empty">
                        <span className="material-symbols-outlined">add_circle</span>
                        <p className="tech-empty-title">Nouvelle intervention directe</p>
                        <p className="tech-empty-desc">Saisie manuelle pour clients hors ligne</p>
                    </div>
                </div>
            </section>

            {/* Modale : déclarer une absence */}
            {showExcModal && (
                <div className="tech-exc-modal-backdrop" onClick={() => !excSaving && setShowExcModal(false)}>
                    <div className="tech-exc-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="tech-exc-modal-close" onClick={() => !excSaving && setShowExcModal(false)}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <h3>Déclarer une absence</h3>
                        <p>Bloquez une période pendant laquelle vous ne serez pas disponible.</p>

                        <label>Début</label>
                        <input type="datetime-local" value={excStart} onChange={(e) => setExcStart(e.target.value)} />

                        <label>Fin</label>
                        <input type="datetime-local" value={excEnd} min={excStart || undefined} onChange={(e) => setExcEnd(e.target.value)} />

                        <label>Motif (optionnel)</label>
                        <input type="text" placeholder="Ex : congés, formation..." value={excReason} onChange={(e) => setExcReason(e.target.value)} />

                        <button
                            className="tech-exc-modal-submit"
                            disabled={!excStart || !excEnd || excSaving}
                            onClick={handleAddException}
                        >
                            {excSaving ? 'Enregistrement...' : "Enregistrer l'absence"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planning;
