import React, { useState, useEffect } from 'react';
import './Notification.css';

let notificationId = 0;
const notifications = [];
const listeners = [];

const addListener = (callback) => {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

const notifyListeners = () => {
  listeners.forEach(callback => callback([...notifications]));
};

export const showNotification = (message, type = 'info', duration = 3000) => {
  const id = notificationId++;
  const notification = { id, message, type, duration };
  notifications.push(notification);
  notifyListeners();

  setTimeout(() => {
    const index = notifications.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.splice(index, 1);
      notifyListeners();
    }
  }, duration);
};

const NotificationContainer = () => {
  const [notificationsList, setNotificationsList] = useState([]);

  useEffect(() => {
    const unsubscribe = addListener(setNotificationsList);
    return unsubscribe;
  }, []);

  return (
    <div className="notification-container">
      {notificationsList.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
        >
          {notification.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;

