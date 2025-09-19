// Notification Service for Devil Arena
class NotificationService {
  constructor() {
    this.permission = Notification.permission;
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    this.registration = null;
  }

  async init() {
    if (!this.isSupported) {
      console.log('Notifications not supported');
      return false;
    }

    // Get service worker registration
    if ('serviceWorker' in navigator) {
      this.registration = await navigator.serviceWorker.ready;
    }

    return true;
  }

  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Notifications not supported');
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      throw new Error('Notification permission denied');
    }

    this.permission = await Notification.requestPermission();
    return this.permission === 'granted';
  }

  async subscribeToPush() {
    if (!this.registration) {
      throw new Error('Service worker not ready');
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa40HI8pFdvyh3qw1LkM6BxHztWItHzr3B8iBGfW8dpHWrTz4wHMq1S_7Xk9c'
        )
      });

      console.log('Push subscription:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      throw error;
    }
  }

  async sendNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== 'granted') {
      console.log('Cannot send notification - permission not granted');
      return;
    }

    const defaultOptions = {
      body: 'You have a new booking reminder!',
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [100, 50, 100],
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'View Booking',
          icon: '/logo192.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    const notificationOptions = { ...defaultOptions, ...options };

    if (this.registration) {
      // Use service worker for better control
      this.registration.showNotification(title, notificationOptions);
    } else {
      // Fallback to regular notification
      new Notification(title, notificationOptions);
    }
  }

  // Booking reminder notifications
  async sendBookingReminder(booking) {
    const title = 'Booking Reminder';
    const body = `Your ${booking.activity} is scheduled for ${new Date(booking.date).toLocaleDateString()} at ${booking.time}`;
    
    await this.sendNotification(title, {
      body,
      data: {
        type: 'booking_reminder',
        bookingId: booking.id,
        url: '/admin'
      }
    });
  }

  // Payment reminder notifications
  async sendPaymentReminder(booking) {
    const title = 'Payment Reminder';
    const body = `Please complete payment for your ${booking.activity} booking`;
    
    await this.sendNotification(title, {
      body,
      data: {
        type: 'payment_reminder',
        bookingId: booking.id,
        url: '/payment'
      }
    });
  }

  // Booking confirmation notifications
  async sendBookingConfirmation(booking) {
    const title = 'Booking Confirmed!';
    const body = `Your ${booking.activity} booking for ${new Date(booking.date).toLocaleDateString()} has been confirmed`;
    
    await this.sendNotification(title, {
      body,
      data: {
        type: 'booking_confirmation',
        bookingId: booking.id,
        url: '/admin'
      }
    });
  }

  // Schedule a notification for later
  scheduleNotification(title, options, delay) {
    setTimeout(() => {
      this.sendNotification(title, options);
    }, delay);
  }

  // Schedule booking reminder (24 hours before)
  scheduleBookingReminder(booking) {
    const bookingTime = new Date(`${booking.date} ${booking.time}`);
    const reminderTime = new Date(bookingTime.getTime() - (24 * 60 * 60 * 1000)); // 24 hours before
    const delay = reminderTime.getTime() - Date.now();

    if (delay > 0) {
      this.scheduleNotification(
        'Booking Reminder',
        {
          body: `Your ${booking.activity} is tomorrow at ${booking.time}`,
          data: { type: 'booking_reminder', bookingId: booking.id }
        },
        delay
      );
    }
  }

  // Utility function to convert VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Check if notifications are enabled
  isEnabled() {
    return this.isSupported && this.permission === 'granted';
  }

  // Get permission status
  getPermissionStatus() {
    return this.permission;
  }
}

export default new NotificationService();
