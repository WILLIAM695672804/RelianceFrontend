import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import './NotificationBell.css';

interface NotificationBellProps {
  basePath: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ basePath }) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        setUnreadCount(res.data.count ?? 0);
      } catch {
        // silent
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button className="notif-bell" onClick={() => navigate(`${basePath}/notifications`)}>
      <span className="material-symbols-outlined">notifications</span>
      {unreadCount > 0 && (
        <span className="notif-bell-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}
    </button>
  );
};

export default NotificationBell;
