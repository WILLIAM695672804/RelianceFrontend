import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaSync, FaGoogle, FaCalendarPlus } from 'react-icons/fa';
import './Planning.css';

// Types
interface Event {
    id: string;
    type: 'INTERVENTION' | 'UNAVAILABLE';
    title: string;
    startTime: number; // Hour (0-24)
    duration: number; // Hours
    dayIndex: number; // 0-6 (Mon-Sun)
}

const Planning: React.FC = () => {
    const [view, setView] = useState<'week' | 'day'>('week');
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock Events
    const events: Event[] = [
        { id: '1', type: 'INTERVENTION', title: 'Fuite d\'eau - Mme. Diallo', startTime: 9, duration: 2, dayIndex: 0 },
        { id: '2', type: 'UNAVAILABLE', title: 'Déjeuner', startTime: 12, duration: 1, dayIndex: 0 },
        { id: '3', type: 'INTERVENTION', title: 'Installation Clim - Bureau', startTime: 14, duration: 3, dayIndex: 1 },
        { id: '4', type: 'UNAVAILABLE', title: 'RDV Dentiste', startTime: 10, duration: 1.5, dayIndex: 2 }
    ];

    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const timeSlots = Array.from({ length: 24 }, (_, i) => i); // 0 to 23 hours

    // Helper to get dates for current week
    const getWeekDates = (date: Date) => {
        const curr = new Date(date);
        const day = curr.getDay();
        const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start

        return weekDays.map((_, index) => {
            const nextDay = new Date(curr.setDate(diff + index));
            return nextDay.getDate();
        });
    };

    const weekDates = getWeekDates(currentDate);

    return (
        <div className="tech-page planning-page">
            <h1 className="page-title">Planning Intelligent</h1>

            <div className="calendar-container">
                {/* Header */}
                <div className="calendar-header">
                    <div className="calendar-nav">
                        <button className="nav-btn"><FaChevronLeft /></button>
                        <h2 className="current-date">Février 2026</h2>
                        <button className="nav-btn"><FaChevronRight /></button>
                    </div>

                    <div className="calendar-actions">
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${view === 'day' ? 'active' : ''}`}
                                onClick={() => setView('day')}
                            >
                                Jour
                            </button>
                            <button
                                className={`view-btn ${view === 'week' ? 'active' : ''}`}
                                onClick={() => setView('week')}
                            >
                                Semaine
                            </button>
                        </div>

                        <button className="sync-btn" title="Synchroniser avec Google Agenda">
                            <FaSync />
                            <span>Synchroniser</span>
                        </button>
                    </div>
                </div>

                {/* Calendar Body (Week View) */}
                <div className="calendar-body">
                    <div className="week-days-header">
                        <div className="time-header-spacer"></div>
                        {weekDays.map((day, index) => (
                            <div key={day} className={`day-header ${index === 0 ? 'today' : ''}`}>
                                <span className="day-name">{day}</span>
                                <span className="day-number">{weekDates[index]}</span>
                            </div>
                        ))}
                    </div>

                    <div className="time-grid">
                        {/* Time Labels Column */}
                        <div className="time-column">
                            {timeSlots.map(hour => (
                                <div key={hour} className="time-slot-label">
                                    {hour}:00
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        {weekDays.map((_, dayIndex) => (
                            <div key={dayIndex} className="day-column">
                                {events
                                    .filter(e => e.dayIndex === dayIndex)
                                    .map(event => (
                                        <div
                                            key={event.id}
                                            className={`event-block ${event.type === 'INTERVENTION' ? 'intervention' : 'unavailable'}`}
                                            style={{
                                                top: `${event.startTime * 60}px`,
                                                height: `${event.duration * 60}px`
                                            }}
                                            title={event.title}
                                        >
                                            <span className="event-title">{event.title}</span>
                                            <span className="event-time">
                                                {event.startTime}:00 - {event.startTime + Math.floor(event.duration)}:
                                                {(event.duration % 1) * 60 === 0 ? '00' : '30'}
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        ))}

                        {/* Current Time Indicator (Static for demo) */}
                        <div
                            className="current-time-line"
                            style={{ top: `${(10 * 60) + 30}px`, left: '60px' }} // 10:30 AM
                        >
                            <div className="current-time-circle"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Planning;
