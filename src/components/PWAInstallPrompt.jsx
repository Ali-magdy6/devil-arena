import React, { useState, useEffect } from 'react';
import pwaService from '../services/pwaService';
import './PWAInstallPrompt.css';

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    if (pwaService.isRunningAsPWA()) {
      return;
    }

    // Check if install prompt should be shown
    const shouldShowPrompt = localStorage.getItem('pwa-install-prompt-dismissed') !== 'true';
    if (shouldShowPrompt) {
      setShowPrompt(true);
    }

    // Get device info
    setDeviceInfo(pwaService.getDeviceInfo());
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await pwaService.installApp();
      setShowPrompt(false);
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-dismissed', 'true');
  };

  const handleLater = () => {
    setShowPrompt(false);
    // Show again after 24 hours
    setTimeout(() => {
      localStorage.removeItem('pwa-install-prompt-dismissed');
    }, 24 * 60 * 60 * 1000);
  };

  if (!showPrompt || !deviceInfo) {
    return null;
  }

  const getInstallMessage = () => {
    if (deviceInfo.isIOS) {
      return 'Add to Home Screen for the best experience';
    } else if (deviceInfo.isAndroid) {
      return 'Install the app for quick access';
    } else {
      return 'Install the app for a better experience';
    }
  };

  const getInstallInstructions = () => {
    if (deviceInfo.isIOS) {
      return (
        <div className="install-instructions">
          <p>To install this app:</p>
          <ol>
            <li>Tap the Share button <span className="icon">📤</span></li>
            <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
            <li>Tap &quot;Add&quot; to confirm</li>
          </ol>
        </div>
      );
    } else if (deviceInfo.isAndroid) {
      return (
        <div className="install-instructions">
          <p>To install this app:</p>
          <ol>
            <li>Tap the menu button <span className="icon">⋮</span></li>
            <li>Select &quot;Add to Home screen&quot; or &quot;Install app&quot;</li>
            <li>Tap &quot;Add&quot; or &quot;Install&quot; to confirm</li>
          </ol>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pwa-install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-header">
          <div className="app-icon">
            <img src="/logo192.png" alt="Devil Arena" />
          </div>
          <div className="app-info">
            <h3>Devil Arena</h3>
            <p>{getInstallMessage()}</p>
          </div>
          <button className="close-btn" onClick={handleDismiss}>
            <span>&times;</span>
          </button>
        </div>

        <div className="install-prompt-body">
          <div className="benefits">
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <span>Faster loading</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📱</span>
              <span>Mobile optimized</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🔔</span>
              <span>Push notifications</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📶</span>
              <span>Works offline</span>
            </div>
          </div>

          {getInstallInstructions()}
        </div>

        <div className="install-prompt-footer">
          <button 
            className="install-btn"
            onClick={handleInstall}
            disabled={isInstalling}
          >
            {isInstalling ? (
              <div className="install-loading">
                <div className="spinner"></div>
                Installing...
              </div>
            ) : (
              <>
                <span className="btn-icon">📱</span>
                Install App
              </>
            )}
          </button>
          <button className="later-btn" onClick={handleLater}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
