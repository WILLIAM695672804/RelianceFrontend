import React from 'react';
import './Planning.css';

const Planning: React.FC = () => {
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
                            <h3>Oct 23 - Oct 29, 2023</h3>
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

                        {/* Mon */}
                        <div className="tech-cal-day-col">
                            <div className="tech-cal-day-header">
                                <span className="tech-day-name">Mon</span>
                                <span className="tech-day-number tech-day-active">23</span>
                            </div>
                            <div className="tech-cal-day-slots">
                                <div className="tech-slot-available tech-slot-h32">
                                    <p>Available</p>
                                </div>
                                <div className="tech-slot-booked tech-slot-h20">
                                    <p className="tech-slot-type">Booked</p>
                                    <p className="tech-slot-title">HVAC Repair #402</p>
                                </div>
                            </div>
                        </div>

                        {/* Tue */}
                        <div className="tech-cal-day-col">
                            <div className="tech-cal-day-header">
                                <span className="tech-day-name">Tue</span>
                                <span className="tech-day-number tech-day-active">24</span>
                            </div>
                            <div className="tech-cal-day-slots">
                                <div className="tech-slot-available tech-slot-h48">
                                    <p>Available</p>
                                </div>
                            </div>
                        </div>

                        {/* Wed */}
                        <div className="tech-cal-day-col">
                            <div className="tech-cal-day-header">
                                <span className="tech-day-name">Wed</span>
                                <span className="tech-day-number tech-day-active tech-color-secondary">25</span>
                            </div>
                            <div className="tech-cal-day-slots tech-slot-relative">
                                <div className="tech-slot-ooo-bg">
                                    <span className="tech-ooo-watermark">OUT OF OFFICE</span>
                                </div>
                                <div className="tech-slot-ooo-block">
                                    <p>Personal Leave</p>
                                </div>
                            </div>
                        </div>

                        {/* Thu */}
                        <div className="tech-cal-day-col">
                            <div className="tech-cal-day-header">
                                <span className="tech-day-name">Thu</span>
                                <span className="tech-day-number tech-day-active">26</span>
                            </div>
                            <div className="tech-cal-day-slots">
                                <div className="tech-slot-available tech-slot-h24"></div>
                                <div className="tech-slot-booked tech-slot-h24">
                                    <p className="tech-slot-type">Booked</p>
                                    <p className="tech-slot-title">Wiring Audit</p>
                                </div>
                                <div className="tech-slot-available tech-slot-h24"></div>
                            </div>
                        </div>

                        {/* Fri */}
                        <div className="tech-cal-day-col">
                            <div className="tech-cal-day-header">
                                <span className="tech-day-name">Fri</span>
                                <span className="tech-day-number tech-day-active">27</span>
                            </div>
                            <div className="tech-cal-day-slots">
                                <div className="tech-slot-available tech-slot-h64"></div>
                            </div>
                        </div>

                        {/* Sat */}
                        <div className="tech-cal-day-col tech-day-disabled">
                            <div className="tech-cal-day-header">
                                <span className="tech-day-name">Sat</span>
                                <span className="tech-day-number tech-day-active">28</span>
                            </div>
                        </div>

                        {/* Sun */}
                        <div className="tech-cal-day-col tech-day-disabled">
                            <div className="tech-cal-day-header">
                                <span className="tech-day-name">Sun</span>
                                <span className="tech-day-number tech-day-active">29</span>
                            </div>
                        </div>
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
                            <div className="tech-slot-item">
                                <div>
                                    <p className="tech-slot-label">Weekdays</p>
                                    <p className="tech-slot-time">08:00 — 17:00</p>
                                </div>
                                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1", color: "var(--tech-tertiary)"}}>check_circle</span>
                            </div>
                            <div className="tech-slot-item tech-item-disabled">
                                <div>
                                    <p className="tech-slot-label">Saturdays</p>
                                    <p className="tech-slot-time">Unavailable</p>
                                </div>
                                <button className="tech-btn-edit">Edit</button>
                            </div>
                            <button className="tech-btn-add-shift">+ Add Shift</button>
                        </div>
                    </div>

                    {/* Exceptions */}
                    <div className="tech-panel-card tech-panel-shadow">
                        <h4 className="tech-exceptions-title">Exceptions</h4>
                        <div className="tech-exceptions-list">
                            <div className="tech-exception-item">
                                <div className="tech-exc-icon" style={{backgroundColor: "rgba(186, 26, 26, 0.2)", color: "var(--tech-error)"}}>
                                    <span className="material-symbols-outlined">event_busy</span>
                                </div>
                                <div>
                                    <p className="tech-exc-title">Dental Appointment</p>
                                    <p className="tech-exc-time">Oct 25, 09:00 - 12:00</p>
                                    <span className="tech-exc-badge" style={{backgroundColor: "var(--tech-error-container)", color: "var(--tech-on-error-container)"}}>Personal</span>
                                </div>
                            </div>
                            <div className="tech-exception-item">
                                <div className="tech-exc-icon" style={{backgroundColor: "rgba(125, 182, 255, 0.2)", color: "var(--tech-secondary)"}}>
                                    <span className="material-symbols-outlined">beach_access</span>
                                </div>
                                <div>
                                    <p className="tech-exc-title">Annual Leave</p>
                                    <p className="tech-exc-time">Nov 12 - Nov 19</p>
                                    <span className="tech-exc-badge" style={{backgroundColor: "var(--tech-secondary-fixed)", color: "var(--tech-on-secondary-fixed-variant)"}}>Vacation</span>
                                </div>
                            </div>
                        </div>
                        <button className="tech-btn-request-time">
                            <span className="material-symbols-outlined">add</span> Request Time Off
                        </button>
                    </div>

                    {/* Service Insights */}
                    <div className="tech-insights-card">
                        <div className="tech-insights-content">
                            <p className="tech-insights-subtitle">Weekly Capacity</p>
                            <div className="tech-insights-bar-wrapper">
                                <div className="tech-insights-bar-labels">
                                    <span>72% Booked</span>
                                    <span>32 / 45 hrs</span>
                                </div>
                                <div className="tech-insights-bar-bg">
                                    <div className="tech-insights-bar-fill" style={{width: '72%'}}></div>
                                </div>
                            </div>
                            <p className="tech-insights-desc">You have 3 emergency slots remaining for the current period.</p>
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
                    <div className="tech-appt-card">
                        <div className="tech-appt-card-header">
                            <span className="tech-appt-time">Today • 14:30</span>
                            <button className="tech-btn-more"><span className="material-symbols-outlined">more_vert</span></button>
                        </div>
                        <h5>HVAC Maintenance</h5>
                        <p className="tech-appt-address">482 Oak Ridge Dr, Seattle</p>
                        <div className="tech-appt-client">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVw1Z9QfL4FQwVKXN-1O8w_OwxjAqyDikaPgedRtFZSeson0-0h1Qq2j0xaKDxc0T-4-BbMbVfeSL39lJZ5UV5Lx7vLX3wTmOvZ0T43qSirE6lIgyV1mjEwdifzW9_1PJapi6Ui7c34w-_QWpy-w8aMLSWe5S29Od0j9ANRCSARm4WO-y_gfJOsE9n3-DG9jx9zKNTHIm0AK_4mHaxldgpP6ZEqQcl3jyfMA46lQ8zxpNCdBfsLFjcj8HeEwwsJv4zmyicxIqqLA" alt="Client"/>
                            <span>Marcus Thorne</span>
                        </div>
                    </div>

                    <div className="tech-appt-card">
                        <div className="tech-appt-card-header">
                            <span className="tech-appt-time">Oct 26 • 09:00</span>
                            <button className="tech-btn-more"><span className="material-symbols-outlined">more_vert</span></button>
                        </div>
                        <h5>Smart Panel Install</h5>
                        <p className="tech-appt-address">901 Pine St, Vancouver</p>
                        <div className="tech-appt-client">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhmE0tjyW-2yw-hDWOsMCBbXo3SLXqjNRFW3HUVGs5FBKyrwk1GRRqGt989yQ7BfKIzXDXmRsBV3M8SjB2WTx4C35hpuINvqDVbmaQAmEpyisjg-zqd3Gh04W2tteeWVbBxXfLeL7zPcSq41nZ_h3U_OXk5jRg4Sq3s2wS9nvVDm0VZFMphj_-tQfd7_gi19ZZCzB5iPtKkM4QyaEPIEJ9djNTNqW9z0BKYlG319If3aKcK0DYHksjdA00xVZICRy5pzchjn3tgQ" alt="Client"/>
                            <span>Elena Vance</span>
                        </div>
                    </div>

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
