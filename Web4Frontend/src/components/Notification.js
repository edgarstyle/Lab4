import React, { useEffect } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'error', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        {onClose && (
          <button 
            className="notification-close" 
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;


