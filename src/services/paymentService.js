// Mobile Payment Service for Devil Arena
class PaymentService {
  constructor() {
    this.isApplePayAvailable = false;
    this.isGooglePayAvailable = false;
    this.isPaymentRequestSupported = 'PaymentRequest' in window;
    
    this.init();
  }

  async init() {
    // Check Apple Pay availability
    if (window.ApplePaySession && ApplePaySession.canMakePayments) {
      this.isApplePayAvailable = ApplePaySession.canMakePayments();
    }

    // Check Google Pay availability
    if (window.PaymentRequest) {
      try {
        const googlePayMethod = {
          supportedMethods: 'https://google.com/pay',
          data: {
            environment: 'TEST', // Change to 'PRODUCTION' for live
            apiVersion: 2,
            apiVersionMinor: 0
          }
        };

        const paymentRequest = new PaymentRequest([googlePayMethod], {
          total: {
            label: 'Test Payment',
            amount: { currency: 'USD', value: '0.01' }
          }
        });

        this.isGooglePayAvailable = await paymentRequest.canMakePayment();
      } catch (error) {
        console.log('Google Pay not available:', error);
        this.isGooglePayAvailable = false;
      }
    }
  }

  // Get available payment methods
  getAvailablePaymentMethods() {
    const methods = ['card']; // Always include card payment

    if (this.isApplePayAvailable) {
      methods.push('apple_pay');
    }

    if (this.isGooglePayAvailable) {
      methods.push('google_pay');
    }

    return methods;
  }

  // Process payment with selected method
  async processPayment(paymentData, selectedMethod = 'card') {
    switch (selectedMethod) {
      case 'apple_pay':
        return this.processApplePay(paymentData);
      case 'google_pay':
        return this.processGooglePay(paymentData);
      case 'card':
      default:
        return this.processCardPayment(paymentData);
    }
  }

  // Apple Pay implementation
  async processApplePay(paymentData) {
    if (!this.isApplePayAvailable) {
      throw new Error('Apple Pay not available');
    }

    const paymentRequest = {
      countryCode: 'US',
      currencyCode: 'USD',
      supportedNetworks: ['visa', 'masterCard', 'amex'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: paymentData.description || 'Devil Arena Booking',
        amount: paymentData.amount.toString()
      },
      lineItems: [
        {
          label: paymentData.activity || 'Sports Activity',
          amount: paymentData.amount.toString()
        }
      ]
    };

    const session = new ApplePaySession(3, paymentRequest);

    return new Promise((resolve, reject) => {
      session.onvalidatemerchant = () => {
        // In production, validate with your server
        const merchantSession = {
          epochTimestamp: Date.now(),
          expiresAt: Date.now() + 3600000,
          merchantSessionIdentifier: 'merchant.com.devilarena',
          nonce: 'nonce',
          merchantIdentifier: 'merchant.com.devilarena',
          domainName: window.location.hostname,
          displayName: 'Devil Arena',
          signature: 'signature'
        };
        session.completeMerchantValidation(merchantSession);
      };

      session.onpaymentauthorized = (event) => {
        // Process payment with your server
        console.log('Apple Pay authorized:', event.payment);
        
        // Simulate server processing
        setTimeout(() => {
          if (Math.random() > 0.1) { // 90% success rate for demo
            session.completePayment(ApplePaySession.STATUS_SUCCESS);
            resolve({
              success: true,
              transactionId: 'apple_' + Date.now(),
              method: 'apple_pay'
            });
          } else {
            session.completePayment(ApplePaySession.STATUS_FAILURE);
            reject(new Error('Payment failed'));
          }
        }, 2000);
      };

      session.oncancel = () => {
        reject(new Error('Payment cancelled by user'));
      };

      session.begin();
    });
  }

  // Google Pay implementation
  async processGooglePay(paymentData) {
    if (!this.isGooglePayAvailable) {
      throw new Error('Google Pay not available');
    }

    const paymentMethod = {
      supportedMethods: 'https://google.com/pay',
      data: {
        environment: 'TEST',
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA']
          }
        }]
      }
    };

    const paymentDetails = {
      total: {
        label: paymentData.description || 'Devil Arena Booking',
        amount: {
          currency: 'USD',
          value: paymentData.amount.toString()
        }
      },
      displayItems: [
        {
          label: paymentData.activity || 'Sports Activity',
          amount: {
            currency: 'USD',
            value: paymentData.amount.toString()
          }
        }
      ]
    };

    const paymentRequest = new PaymentRequest([paymentMethod], paymentDetails);

    try {
      const paymentResponse = await paymentRequest.show();
      
      // Process payment with your server
      console.log('Google Pay response:', paymentResponse);
      
      // Simulate server processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (Math.random() > 0.1) { // 90% success rate for demo
        await paymentResponse.complete('success');
        return {
          success: true,
          transactionId: 'google_' + Date.now(),
          method: 'google_pay'
        };
      } else {
        await paymentResponse.complete('fail');
        throw new Error('Payment failed');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Payment cancelled by user');
      }
      throw error;
    }
  }

  // Card payment implementation
  async processCardPayment(paymentData) {
    // This would integrate with your payment processor (Stripe, Square, etc.)
    console.log('Processing card payment:', paymentData);
    
    // Simulate card payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (Math.random() > 0.1) { // 90% success rate for demo
      return {
        success: true,
        transactionId: 'card_' + Date.now(),
        method: 'card'
      };
    } else {
      throw new Error('Card payment failed');
    }
  }

  // Get payment method display info
  getPaymentMethodInfo(method) {
    const methods = {
      apple_pay: {
        name: 'Apple Pay',
        icon: '🍎',
        description: 'Pay with Apple Pay'
      },
      google_pay: {
        name: 'Google Pay',
        icon: 'G',
        description: 'Pay with Google Pay'
      },
      card: {
        name: 'Credit/Debit Card',
        icon: '💳',
        description: 'Pay with card'
      }
    };

    return methods[method] || methods.card;
  }

  // Format amount for display
  formatAmount(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Validate payment data
  validatePaymentData(paymentData) {
    const errors = [];

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push('Invalid amount');
    }

    if (!paymentData.activity) {
      errors.push('Activity is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new PaymentService();
