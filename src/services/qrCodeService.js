// QR Code Service for Devil Arena
import QRCode from 'qrcode';

class QRCodeService {
  constructor() {
    this.qrCodeContainer = null;
  }

  // Generate QR code for booking sharing
  async generateBookingQR(bookingData) {
    const qrData = {
      type: 'booking',
      bookingId: bookingData.id,
      activity: bookingData.activity,
      date: bookingData.date,
      time: bookingData.time,
      venue: bookingData.venue || 'Devil Arena',
      shareUrl: `${window.location.origin}/booking/${bookingData.id}`
    };

    return this.generateQR(JSON.stringify(qrData));
  }

  // Generate QR code for general sharing
  async generateShareQR(data) {
    const shareData = {
      type: 'share',
      url: data.url || window.location.href,
      title: data.title || 'Devil Arena',
      description: data.description || 'Check out Devil Arena for sports booking'
    };

    return this.generateQR(JSON.stringify(shareData));
  }

  // Generate QR code for contact info
  async generateContactQR(contactInfo) {
    const contactData = {
      type: 'contact',
      name: contactInfo.name || 'Devil Arena',
      phone: contactInfo.phone,
      email: contactInfo.email,
      website: contactInfo.website || window.location.origin
    };

    return this.generateQR(JSON.stringify(contactData));
  }

  // Main QR code generation method
  async generateQR(data, options = {}) {
    const defaultOptions = {
      width: 256,
      color: {
        dark: '#4682B4',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M',
      margin: 2,
      type: 'image/png'
    };

    const qrOptions = { ...defaultOptions, ...options };

    try {
      // Use the qrcode library for proper QR code generation
      const qrCodeDataURL = await QRCode.toDataURL(data, qrOptions);
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  // Note: Using qrcode library for proper QR code generation

  // Display QR code in a modal
  showQRModal(qrDataURL, title = 'QR Code') {
    // Create modal if it doesn't exist
    let modal = document.getElementById('qr-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'qr-modal';
      modal.className = 'qr-modal';
      modal.innerHTML = `
        <div class="qr-modal-content">
          <div class="qr-modal-header">
            <h3>${title}</h3>
            <button class="qr-modal-close">&times;</button>
          </div>
          <div class="qr-modal-body">
            <img id="qr-image" src="" alt="QR Code" />
            <p>Scan this QR code to share</p>
          </div>
          <div class="qr-modal-footer">
            <button id="qr-download" class="btn btn-primary">Download</button>
            <button id="qr-close" class="btn btn-secondary">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Update QR code image
    const qrImage = modal.querySelector('#qr-image');
    qrImage.src = qrDataURL;

    // Show modal
    modal.style.display = 'flex';

    // Add event listeners
    const closeBtn = modal.querySelector('.qr-modal-close');
    const closeBtn2 = modal.querySelector('#qr-close');
    const downloadBtn = modal.querySelector('#qr-download');

    const closeModal = () => {
      modal.style.display = 'none';
    };

    closeBtn.onclick = closeModal;
    closeBtn2.onclick = closeModal;
    downloadBtn.onclick = () => this.downloadQR(qrDataURL, title);

    // Close on outside click
    modal.onclick = (e) => {
      if (e.target === modal) {
        closeModal();
      }
    };
  }

  // Download QR code
  downloadQR(qrDataURL, filename = 'qr-code') {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = qrDataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Generate and show booking QR
  async showBookingQR(bookingData) {
    try {
      const qrDataURL = await this.generateBookingQR(bookingData);
      this.showQRModal(qrDataURL, `Booking QR - ${bookingData.activity}`);
    } catch (error) {
      console.error('Error generating booking QR:', error);
      alert('Error generating QR code. Please try again.');
    }
  }

  // Generate and show share QR
  async showShareQR(shareData) {
    try {
      const qrDataURL = await this.generateShareQR(shareData);
      this.showQRModal(qrDataURL, 'Share QR Code');
    } catch (error) {
      console.error('Error generating share QR:', error);
      alert('Error generating QR code. Please try again.');
    }
  }
}

export default new QRCodeService();
