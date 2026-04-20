import React, { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../../services/notificationService';
import './Notifications.css';

interface Notification {
  id: string;
  title: string;
  body: string;
  payload: any;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadNotifications = useCallback(async (p: number) => {
    try {
      const res = await notificationService.getNotifications(p);
      const data = res.data.data || [];
      if (p === 1) {
        setNotifications(data);
      } else {
        setNotifications((prev) => [...prev, ...data]);
      }
      setHasMore(data.length >= 20);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(page);
  }, [page, loadNotifications]);

  const handleMarkRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${Math.floor(hours / 24)}j`;
  };

  if (loading) {
    return (
      <div className="notif-loading">
        <div className="notif-spinner" />
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notif-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button className="mark-all-btn" onClick={handleMarkAllRead}>
            Tout marquer lu ({unreadCount})
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="notif-empty">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--tech-outline-variant)" strokeWidth="1.5">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <p>Aucune notification</p>
        </div>
      ) : (
        <div className="notif-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-item ${n.is_read ? 'read' : 'unread'}`}
              onClick={() => !n.is_read && handleMarkRead(n.id)}
            >
              <div className="notif-dot-col">
                {!n.is_read && <span className="notif-dot" />}
              </div>
              <div className="notif-content">
                <h4>{n.title}</h4>
                <p>{n.body}</p>
                <span className="notif-time">{timeAgo(n.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && notifications.length > 0 && (
        <button className="load-more-btn" onClick={() => setPage((p) => p + 1)}>
          Charger plus
        </button>
      )}
    </div>
  );
};

export default Notifications;
