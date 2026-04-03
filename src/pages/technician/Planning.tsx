import React, { useState, useEffect } from 'react';
import { getTechCalendar, removeScheduleException } from '../../services/scheduleService';
import './Planning.css';

const Planning: React.FC = () => {
    const [calendarData, setCalendarData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCalendar();
    }, []);

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
        return <div className="tech-planning-page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading Calendar...</div>;
    }

    const data = calendarData || {};
    const exceptions = data.exceptions || [];
    const recurringSlots = data.recurring_slots || [];
    const appointments = data.appointments || [];
    const insights = data.insights || { capacity_percent: 0, booked_hours: 0, total_hours: 45 };

    // Helper to get week days
    const getWeekDays = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)); // Start on Monday
        
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return {
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                number: date.getDate(),
                isToday: date.toDateString() === now.toDateString(),
                isWeekend: i >= 5
            };
        });
    };

    const weekDays = getWeekDays();
    const weekRange = `${weekDays[0].name} ${weekDays[0].number} - ${weekDays[6].name} ${weekDays[6].number}, ${new Date().getFullYear()}`;

    return (
        <div className="tech-planning-page">
            {/* Header Section */}
            <div className="tech-planning-header">
                <div className="tech-planning-titles">
                    <h2>Intervention Planning</h2>
                    <p>Manage your service availability and scheduled technician interventions.</p>
                </div>
                <div className="tech-planning-actions">
                    <button className="tech-btn-active">Week View</button>
                    <button className="tech-btn-inactive">Month View</button>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="tech-planning-grid">
                {/* Main Calendar View */}
                <div className="tech-planning-calendar">
                    <div className="tech-cal-header">
                        <div className="tech-cal-nav">
                            <h3>{weekRange}</h3>
                            <div className="tech-cal-buttons">
                                <button><span className="material-symbols-outlined">chevron_left</span></button>
                                <button><span className="material-symbols-outlined">chevron_right</span></button>
                            </div>
                        </div>
                        <div className="tech-cal-legend">
                            <div className="tech-legend-item">
                                <span className="tech-legend-dot tech-dot-available"></span>
                                <span>Available</span>
                            </div>
                            <div className="tech-legend-item">
                                <span className="tech-legend-dot tech-dot-booked"></span>
                                <span>Booked</span>
                            </div>
                            <div className="tech-legend-item">
                                <span className="tech-legend-dot tech-dot-ooo"></span>
                                <span>O.O.O</span>
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
                                    {/* For now, we show "Empty" or "Available" state if no specific appts are mapped to the grid */}
                                    {day.isWeekend ? null : (
                                        <div className="tech-slot-available tech-slot-hfull" style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                                            <p style={{ fontSize: '0.75rem', textAlign: 'center' }}>Available<br/>(No Interventions)</p>
                                        </div>
                                    )}
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
                            <h4>Recurring Slots</h4>
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
                                    <p className="text-xs text-slate-500 mb-3">No recurring shifts defined.</p>
                                </div>
                            )}
                            <button className="tech-btn-add-shift">+ Add Shift</button>
                        </div>
                    </div>

                    {/* Exceptions */}
                    <div className="tech-panel-card tech-panel-shadow">
                        <h4 className="tech-exceptions-title">Exceptions</h4>
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
                                <p style={{ fontSize: '0.875rem', color: 'var(--tech-on-surface-variant)' }}>No upcoming absences.</p>
                            )}
                        </div>
                        <button className="tech-btn-request-time" onClick={() => alert("Modal Add Exception not fully plugged in this sprint, use API (Postman)")}>
                            <span className="material-symbols-outlined">add</span> Request Time Off
                        </button>
                    </div>

                    {/* Service Insights */}
                    <div className="tech-insights-card">
                        <div className="tech-insights-content">
                            <p className="tech-insights-subtitle">Weekly Capacity</p>
                            <div className="tech-insights-bar-wrapper">
                                <div className="tech-insights-bar-labels">
                                    <span>{insights.capacity_percent}% Booked</span>
                                    <span>{insights.booked_hours} / {insights.total_hours} hrs</span>
                                </div>
                                <div className="tech-insights-bar-bg">
                                    <div className="tech-insights-bar-fill" style={{width: `${insights.capacity_percent}%`}}></div>
                                </div>
                            </div>
                            <p className="tech-insights-desc">You have {Math.max(0, insights.total_hours - insights.booked_hours)} free hours available this week.</p>
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
                    <h3>Immediate Appointments</h3>
                    <button>View All</button>
                </div>
                <div className="tech-upcoming-grid">
                    
                    {appointments.length > 0 ? (
                        appointments.map((appt: any) => (
                            <div className="tech-appt-card" key={appt.id}>
                                <div className="tech-appt-card-header">
                                    <span className="tech-appt-time">{appt.scheduled_start}</span>
                                    <button className="tech-btn-more"><span className="material-symbols-outlined">more_vert</span></button>
                                </div>
                                <h5>{appt.title}</h5>
                                <p className="tech-appt-address">{appt.address}</p>
                                <div className="tech-appt-client">
                                    <img src="https://ui-avatars.com/api/?name=" alt="Client"/>
                                    <span>{appt.client_name}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="tech-appt-card" style={{ borderStyle: 'dashed', background: 'transparent', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                             <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--tech-on-surface-variant)', opacity: 0.5 }}>calendar_today</span>
                             <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--tech-on-surface-variant)' }}>No upcoming interventions</p>
                        </div>
                    )}

                    <div className="tech-appt-card-empty">
                        <span className="material-symbols-outlined">add_circle</span>
                        <p className="tech-empty-title">New Direct Intervention</p>
                        <p className="tech-empty-desc">Manual entry for offline clients</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Planning;
