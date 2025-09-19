import React, { useState, useEffect } from 'react';
import qrCodeService from '../services/qrCodeService';
import './QRCodeGenerator.css';

const QRCodeGenerator = ({ bookingData, shareData, onClose }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateQRCode();
  }, [bookingData, shareData]);

  const generateQRCode = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      let qrDataURL;
      
      if (bookingData) {
        qrDataURL = await qrCodeService.generateBookingQR(bookingData);
      } else if (shareData) {
        qrDataURL = await qrCodeService.generateShareQR(shareData);
      } else {
        throw new Error('No data provided for QR code generation');
      }

      setQrCodeDataURL(qrDataURL);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (qrCodeDataURL) {
      const filename = bookingData 
        ? `booking-${bookingData.activity}-${new Date().toISOString().split('T')[0]}.png`
        : 'share-qr-code.png';
      qrCodeService.downloadQR(qrCodeDataURL, filename);
    }
  };

  const handleShare = async () => {
    if (navigator.share && qrCodeDataURL) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(qrCodeDataURL);
        const blob = await response.blob();
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Devil Arena Booking QR Code',
          text: 'Scan this QR code to view booking details',
          files: [file]
        });
      } catch (err) {
        console.log('Error sharing:', err);
        // Fallback to download
        handleDownload();
      }
    } else {
      // Fallback to download
      handleDownload();
    }
  };

  const getQRTitle = () => {
    if (bookingData) {
      return `Booking QR - ${bookingData.activity}`;
    } else if (shareData) {
      return 'Share QR Code';
    }
    return 'QR Code';
  };

  const getQRDescription = () => {
    if (bookingData) {
      return `Scan to view details for ${bookingData.activity} booking on ${new Date(bookingData.date).toLocaleDateString()}`;
    } else if (shareData) {
      return 'Scan to visit the shared link';
    }
    return 'Scan this QR code';
  };

  return (
    <div className="qr-code-generator">
      <div className="qr-modal-overlay" onClick={onClose}></div>
      <div className="qr-modal-content">
        <div className="qr-modal-header">
          <h3>{getQRTitle()}</h3>
          <button className="qr-modal-close" onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        
        <div className="qr-modal-body">
          {isGenerating ? (
            <div className="qr-loading">
              <div className="qr-spinner"></div>
              <p>Generating QR Code...</p>
            </div>
          ) : error ? (
            <div className="qr-error">
              <div className="error-icon">⚠️</div>
              <p>Error generating QR code</p>
              <button className="retry-btn" onClick={generateQRCode}>
                Try Again
              </button>
            </div>
          ) : qrCodeDataURL ? (
            <div className="qr-display">
              <img 
                src={qrCodeDataURL} 
                alt="QR Code" 
                className="qr-image"
              />
              <p className="qr-description">{getQRDescription()}</p>
            </div>
          ) : null}
        </div>
        
        {qrCodeDataURL && (
          <div className="qr-modal-footer">
            <button 
              className="qr-action-btn qr-download-btn"
              onClick={handleDownload}
            >
              <span className="btn-icon">📥</span>
              Download
            </button>
            <button 
              className="qr-action-btn qr-share-btn"
              onClick={handleShare}
            >
              <span className="btn-icon">📤</span>
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
