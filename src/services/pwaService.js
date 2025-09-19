// PWA Service for Devil Arena
class PWAService {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    
    this.init();
  }

  init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallButton();
      console.log('PWA was installed');
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showOnlineStatus();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineStatus();
    });
  }

  async installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      this.deferredPrompt = null;
    }
  }

  showInstallButton() {
    // Create install button if it doesn't exist
    let installBtn = document.getElementById('pwa-install-btn');
    if (!installBtn) {
      installBtn = document.createElement('button');
      installBtn.id = 'pwa-install-btn';
      installBtn.innerHTML = '📱 Install App';
      installBtn.className = 'pwa-install-btn';
      installBtn.onclick = () => this.installApp();
      
      // Add to header or create floating button
      const header = document.querySelector('header') || document.body;
      header.appendChild(installBtn);
    }
    installBtn.style.display = 'block';
  }

  hideInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }

  showOnlineStatus() {
    this.showStatusMessage('You are back online!', 'success');
  }

  showOfflineStatus() {
    this.showStatusMessage('You are offline. Some features may be limited.', 'warning');
  }

  showStatusMessage(message, type = 'info') {
    // Create or update status message
    let statusEl = document.getElementById('pwa-status');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.id = 'pwa-status';
      statusEl.className = 'pwa-status';
      document.body.appendChild(statusEl);
    }
    
    statusEl.textContent = message;
    statusEl.className = `pwa-status pwa-status-${type}`;
    statusEl.style.display = 'block';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }

  // Check if app is running as PWA
  isRunningAsPWA() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  // Get device info
  getDeviceInfo() {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isAndroid: /Android/.test(navigator.userAgent),
      isPWA: this.isRunningAsPWA(),
      isOnline: this.isOnline
    };
  }
}

export default new PWAService();
