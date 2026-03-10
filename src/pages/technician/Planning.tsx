import React, { useState } from 'react';
import {
    FaChevronLeft,
    FaChevronRight,
    FaPlus,
    FaClock,
    FaExclamationTriangle,
    FaTimes,
    FaCalendarTimes,
    FaCheckCircle,
    FaRegClock
} from 'react-icons/fa';
import './Planning.css';

interface CalendarEvent {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    type: 'mission' | 'unavailability';
    time?: string;
}

const Planning: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showExceptionModal, setShowExceptionModal] = useState(false);
    const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);

    // SLA Simulation Data
    const slaMetrics = {
        onTimeRate: 94,
        cancelRate: 2,
        avgResponseTime: '15 min'
    };

    const [events, setEvents] = useState<CalendarEvent[]>([
        { id: '1', date: '2026-03-12', title: 'Mission #M-2684', type: 'mission', time: '10:00 - 12:00' },
        { id: '2', date: '2026-03-15', title: 'Mission #M-2685', type: 'mission', time: '14:00 - 16:30' },
        { id: '3', date: '2026-03-20', title: 'Rendez-vous médical', type: 'unavailability' }
    ]);

    // Forms state
    const [exceptionForm, setExceptionForm] = useState({ date: '', reason: '' });

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay(); // 0 = Sunday
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleAddException = (e: React.FormEvent) => {
        e.preventDefault();
        if (exceptionForm.date) {
            setEvents([...events, {
                id: Date.now().toString(),
                date: exceptionForm.date,
                title: exceptionForm.reason || 'Indisponibilité',
                type: 'unavailability'
            }]);
            setShowExceptionModal(false);
            setExceptionForm({ date: '', reason: '' });
        }
    };

    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    // Generate Calendar Grid
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Make Monday the first day

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-cell inactive-month"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayEvents = events.filter(e => e.date === dateString);

        const isToday = i === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

        days.push(
            <div key={i} className={`calendar-cell ${isToday ? 'today' : ''}`} onClick={() => {
                setExceptionForm({ ...exceptionForm, date: dateString });
                setShowTimeSlotModal(true);
            }}>
                <span className="cell-date">{i}</span>
                {dayEvents.map(ev => (
                    <div key={ev.id} className={`calendar-event event-type-${ev.type}`}>
                        {ev.type === 'mission' ? <FaClock /> : <FaExclamationTriangle />}
                        <span>{ev.time ? `${ev.time} ` : ''}{ev.title}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="tech-page planning-page" style={{ paddingTop: 0, marginTop: 0 }}>
            {/* V2: SLA Dashboard */}
            <div className="sla-dashboard">
                <div className="sla-card">
                    <div className="sla-header">
                        Taux de Ponctualité
                        <FaCheckCircle className="sla-status-good" />
                    </div>
                    <div className="sla-value sla-status-good">{slaMetrics.onTimeRate}%</div>
                    <div className="sla-progress-bar"><div className="sla-progress-fill" style={{ width: `${slaMetrics.onTimeRate}%`, background: '#10b981' }}></div></div>
                </div>
                <div className="sla-card">
                    <div className="sla-header">
                        Taux d'Annulation
                        <FaExclamationTriangle className="sla-status-warning" />
                    </div>
                    <div className="sla-value sla-status-warning">{slaMetrics.cancelRate}%</div>
                    <div className="sla-progress-bar"><div className="sla-progress-fill" style={{ width: `${slaMetrics.cancelRate}%`, background: '#f59e0b' }}></div></div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Seuil critique: &gt; 5%</span>
                </div>
                <div className="sla-card">
                    <div className="sla-header">
                        Temps de Réponse
                        <FaRegClock style={{ color: '#7c3aed' }} />
                    </div>
                    <div className="sla-value">{slaMetrics.avgResponseTime}</div>
                    <div className="sla-progress-bar"><div className="sla-progress-fill" style={{ width: '75%', background: '#7c3aed' }}></div></div>
                </div>
            </div>

            <div className="planning-controls">
                <div className="month-nav">
                    <button className="nav-btn" onClick={prevMonth}><FaChevronLeft /></button>
                    <span className="current-month">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button className="nav-btn" onClick={nextMonth}><FaChevronRight /></button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-add-unavailability" style={{ background: 'white', color: '#1e293b', border: '1px solid #cbd5e1' }} onClick={() => setShowTimeSlotModal(true)}>
                        <FaClock /> Horaires de base
                    </button>
                    <button className="btn-add-unavailability" onClick={() => setShowExceptionModal(true)}>
                        <FaCalendarTimes /> Déclarer Absences
                    </button>
                </div>
            </div>

            <div className="calendar-container">
                <div className="calendar-header">
                    <div className="calendar-header-day">Lun</div>
                    <div className="calendar-header-day">Mar</div>
                    <div className="calendar-header-day">Mer</div>
                    <div className="calendar-header-day">Jeu</div>
                    <div className="calendar-header-day">Ven</div>
                    <div className="calendar-header-day" style={{ color: '#ef4444' }}>Sam</div>
                    <div className="calendar-header-day" style={{ color: '#ef4444' }}>Dim</div>
                </div>
                <div className="calendar-grid">
                    {days}
                </div>
            </div>

            <div className="planning-legend">
                <div className="legend-item">
                    <div className="legend-color mission"></div>
                    Mission Planifiée
                </div>
                <div className="legend-item">
                    <div className="legend-color unavailability"></div>
                    Absence / Indisponible
                </div>
            </div>

            {/* Modal: Schedule Exception */}
            {showExceptionModal && (
                <div className="modal-overlay" onClick={() => setShowExceptionModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Déclarer une Indisponibilité</h3>
                            <button className="btn-close" onClick={() => setShowExceptionModal(false)}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleAddException}>
                            <div className="form-group">
                                <label>Date</label>
                                <input type="date" className="form-control" required
                                    value={exceptionForm.date} onChange={e => setExceptionForm({ ...exceptionForm, date: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Motif (Optionnel)</label>
                                <input type="text" className="form-control" placeholder="Congés, Problème familial..."
                                    value={exceptionForm.reason} onChange={e => setExceptionForm({ ...exceptionForm, reason: e.target.value })} />
                            </div>
                            <button type="submit" className="btn-submit">Valider l'Absence</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Time Slots (Simulation) */}
            {showTimeSlotModal && (
                <div className="modal-overlay" onClick={() => setShowTimeSlotModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Configurer Time Slots</h3>
                            <button className="btn-close" onClick={() => setShowTimeSlotModal(false)}><FaTimes /></button>
                        </div>
                        <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.9rem' }}>
                            Définissez vos horaires d'ouverture standard pour que l'algorithme vous match correctement.
                        </p>
                        <div className="form-group">
                            <label>Lundi - Vendredi</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="time" className="form-control" defaultValue="08:00" />
                                <span style={{ display: 'flex', alignItems: 'center' }}>à</span>
                                <input type="time" className="form-control" defaultValue="18:00" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Samedi</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input type="time" className="form-control" defaultValue="09:00" />
                                <span style={{ display: 'flex', alignItems: 'center' }}>à</span>
                                <input type="time" className="form-control" defaultValue="13:00" />
                            </div>
                        </div>
                        <button className="btn-submit" onClick={() => setShowTimeSlotModal(false)}>Enregistrer les horaires</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Planning;
