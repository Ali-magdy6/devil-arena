import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NotificationSystem.css';

const NotificationSystem = ({ bookings, lang, darkMode }) => {
  const [notifications, setNotifications] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Generate notifications based on bookings
  useEffect(() => {
    if (!isEnabled) return;

    const newNotifications = [];
    const now = new Date();

    // Check for new bookings (last 5 minutes)
    const recentBookings = bookings.filter(booking => {
      const bookingTime = new Date(booking.timestamp || booking.date);
      const timeDiff = now - bookingTime;
      return timeDiff < 5 * 60 * 1000; // 5 minutes
    });

    recentBookings.forEach(booking => {
      newNotifications.push({
        id: `booking-${booking.id}-${Date.now()}`,
        type: 'booking',
        title: lang === 'ar' ? 'حجز جديد!' : 'New Booking!',
        message: lang === 'ar' 
          ? `حجز جديد من ${booking.name} في ${booking.date} الساعة ${booking.time}`
          : `New booking from ${booking.name} on ${booking.date} at ${booking.time}`,
        timestamp: new Date(),
        priority: 'high',
        data: booking
      });
    });

    // Add new notifications
    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 50));
      
      // Play notification sound
      if (soundEnabled) {
        playNotificationSound();
      }
    }
  }, [bookings, isEnabled, soundEnabled, lang]);

  const playNotificationSound = () => {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      booking: '📅',
      reminder: '⏰',
      revenue: '💰',
      system: '⚙️',
      warning: '⚠️',
      success: '✅'
    };
    return icons[type] || '📢';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#dc3545',
      medium: '#ffc107',
      low: '#28a745'
    };
    return colors[priority] || '#6c757d';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) {
      return lang === 'ar' ? 'الآن' : 'Just now';
    } else if (minutes < 60) {
      return lang === 'ar' ? `${minutes} دقيقة` : `${minutes}m ago`;
    } else {
      return lang === 'ar' ? `${hours} ساعة` : `${hours}h ago`;
    }
  };

  return (
    <div className={`notification-system ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <div className="notification-header">
        <div className="header-left">
        <h3>{lang === 'ar' ? 'نظام الإشعارات' : 'Notification System'}</h3>
      <div className="notification-stats">
            <span className="total-notifications">
              {notifications.length} {lang === 'ar' ? 'إشعار' : 'notifications'}
            </span>
            <span className={`status-indicator ${isEnabled ? 'active' : 'inactive'}`}>
              {isEnabled ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'غير نشط' : 'Inactive')}
            </span>
          </div>
        </div>
        <div className="header-right">
        <button 
            className={`toggle-btn ${isEnabled ? 'enabled' : 'disabled'}`}
            onClick={() => setIsEnabled(!isEnabled)}
        >
            {isEnabled ? '🔔' : '🔕'}
        </button>
        <button 
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
        >
            ⚙️
        </button>
          {notifications.length > 0 && (
        <button 
              className="dismiss-all-btn"
              onClick={dismissAll}
            >
              {lang === 'ar' ? 'مسح الكل' : 'Clear All'}
                    </button>
          )}
        </div>
                  </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="settings-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                />
                {lang === 'ar' ? 'تفعيل الإشعارات' : 'Enable Notifications'}
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                />
                {lang === 'ar' ? 'تفعيل الصوت' : 'Enable Sound'}
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications List */}
      <div className="notifications-container">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div
              className="no-notifications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="no-notifications-icon">📭</div>
              <p>{lang === 'ar' ? 'لا توجد إشعارات جديدة' : 'No new notifications'}</p>
            </motion.div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                className={`notification-item ${notification.priority}`}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={{
                  borderLeftColor: getPriorityColor(notification.priority)
                }}
              >
                <div className="notification-content">
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-details">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      <span className="notification-priority">
                        {notification.priority}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="notification-actions">
              <button 
                    className="dismiss-btn"
                    onClick={() => dismissNotification(notification.id)}
                    title={lang === 'ar' ? 'إغلاق' : 'Dismiss'}
                  >
                    ✕
              </button>
            </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        </div>
    </div>
  );
};

export default NotificationSystem;