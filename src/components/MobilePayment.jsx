import React, { useState, useEffect } from 'react';
import paymentService from '../services/paymentService';
import './MobilePayment.css';

const MobilePayment = ({ bookingData, onPaymentComplete, onPaymentError }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [availableMethods, setAvailableMethods] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData] = useState({
    amount: bookingData?.amount || 0,
    activity: bookingData?.activity || '',
    description: `Booking for ${bookingData?.activity || 'sports activity'}`
  });

  useEffect(() => {
    // Get available payment methods
    const methods = paymentService.getAvailablePaymentMethods();
    setAvailableMethods(methods);
    
    // Set default method based on device
    if (methods.includes('apple_pay') && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      setSelectedMethod('apple_pay');
    } else if (methods.includes('google_pay') && /Android/.test(navigator.userAgent)) {
      setSelectedMethod('google_pay');
    }
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Validate payment data
      const validation = paymentService.validatePaymentData(paymentData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Process payment
      const result = await paymentService.processPayment(paymentData, selectedMethod);
      
      if (result.success) {
        onPaymentComplete?.(result);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentMethod = (method) => {
    const methodInfo = paymentService.getPaymentMethodInfo(method);
    const isSelected = selectedMethod === method;
    const isAvailable = availableMethods.includes(method);

    return (
      <div
        key={method}
        className={`payment-method ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
        onClick={() => isAvailable && setSelectedMethod(method)}
      >
        <div className="payment-method-icon">
          {methodInfo.icon}
        </div>
        <div className="payment-method-info">
          <div className="payment-method-name">{methodInfo.name}</div>
          <div className="payment-method-description">{methodInfo.description}</div>
        </div>
        <div className="payment-method-radio">
          <input
            type="radio"
            name="payment-method"
            value={method}
            checked={isSelected}
            onChange={() => setSelectedMethod(method)}
            disabled={!isAvailable}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="mobile-payment">
      <div className="payment-header">
        <h2>Complete Payment</h2>
        <div className="payment-amount">
          {paymentService.formatAmount(paymentData.amount)}
        </div>
      </div>

      <div className="payment-details">
        <div className="payment-item">
          <span className="item-label">Activity:</span>
          <span className="item-value">{paymentData.activity}</span>
        </div>
        <div className="payment-item">
          <span className="item-label">Amount:</span>
          <span className="item-value">{paymentService.formatAmount(paymentData.amount)}</span>
        </div>
      </div>

      <div className="payment-methods">
        <h3>Choose Payment Method</h3>
        <div className="payment-methods-list">
          {availableMethods.map(renderPaymentMethod)}
        </div>
      </div>

      <div className="payment-actions">
        <button
          className="payment-button"
          onClick={handlePayment}
          disabled={isProcessing || !selectedMethod}
        >
          {isProcessing ? (
            <div className="payment-loading">
              <div className="spinner"></div>
              Processing...
            </div>
          ) : (
            `Pay ${paymentService.formatAmount(paymentData.amount)}`
          )}
        </button>
      </div>

      <div className="payment-security">
        <div className="security-badges">
          <span className="security-badge">🔒 Secure</span>
          <span className="security-badge">🛡️ Protected</span>
          <span className="security-badge">✅ Verified</span>
        </div>
        <p className="security-text">
          Your payment information is encrypted and secure
        </p>
      </div>
    </div>
  );
};

export default MobilePayment;
