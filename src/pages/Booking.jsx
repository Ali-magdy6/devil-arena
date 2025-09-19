import React, { useState, useRef } from "react";
import { useBooking } from "../context/BookingContext"; // ✅ التأكد من الاستيراد الصح
import { useNavigate } from "react-router-dom"; // 👈 للإنتقال بعد الدفع

// Mobile-first components and services
import MobilePayment from "../components/MobilePayment";
import QRCodeGenerator from "../components/QRCodeGenerator";
import notificationService from "../services/notificationService";
// import qrCodeService from "../services/qrCodeService";

function BookingSection({ t = {} }) {
  const { state, dispatch } = useBooking();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showMobilePayment, setShowMobilePayment] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // ✅ لعرض رسالة نجاح
  const [paymentError, setPaymentError] = useState("");
  const formRef = useRef(null);
  const navigate = useNavigate(); // 👈 hook من react-router-dom

  const validateFields = (fields) => {
    const newErrors = {};

    if (!fields.name || fields.name.length < 3) {
      newErrors.name = t.nameError || "الاسم يجب أن يكون 3 أحرف على الأقل";
    }

    if (!fields.date) {
      newErrors.date = t.dateRequired || "يرجى اختيار التاريخ";
    } else {
      const bookingDateTime = new Date(
        `${fields.date}T${fields.time || "00:00"}`
      );
      if (bookingDateTime < new Date()) {
        newErrors.date = t.pastDateMsg || "لا يمكن اختيار وقت في الماضي.";
      }
    }

    if (!fields.time) {
      newErrors.time = t.timeRequired || "يرجى اختيار الوقت";
    }

    if (!fields.phone) {
      newErrors.phone = t.phoneRequired || "يرجى إدخال رقم الهاتف";
    } else if (!/^\d{11}$/.test(fields.phone)) {
      newErrors.phone = t.phoneError || "رقم الهاتف يجب أن يحتوي على 11 رقم";
    }

    return newErrors;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    const form = e.target;
    const fields = {
      name: form.name.value.trim(),
      date: form.date.value,
      time: form.time.value,
      phone: form.phone.value.trim(),
    };

    // تحقق من الحقول
    const validationErrors = validateFields(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // منع الحجز المكرر (تاريخ + وقت)
    const existingBookings =
      JSON.parse(localStorage.getItem("allBookings")) || [];
    const isDuplicate = existingBookings.some(
      (booking) => booking.date === fields.date && booking.time === fields.time
    );
    if (isDuplicate) {
      alert(t.duplicateBookingMsg || "تم الحجز بالفعل في هذا الوقت.");
      return;
    }

    // جسم الحجز
    const booking = { ...fields, timestamp: new Date().toISOString() };

    // بدء الإرسال
    dispatch({ type: "ADD_BOOKING_START" });

    try {
      const response = await fetch(
        "https://68945f77be3700414e12e8ba.mockapi.io/devil-arena/bookings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(booking),
        }
      );

      if (!response.ok) throw new Error("فشل إرسال البيانات");

      // الحجز جاهز للدفع
      dispatch({ type: "ADD_BOOKING_READY", payload: booking });
      
      // Show mobile payment options
      setShowMobilePayment(true);
    } catch (error) {
      console.error("خطأ في الإرسال:", error);
      dispatch({
        type: "ADD_BOOKING_ERROR",
        payload: t.sendError || "فشل إرسال بيانات الحجز. حاول لاحقًا.",
      });
      alert(t.sendError || "فشل إرسال بيانات الحجز. حاول لاحقًا.");
    }
  };

  const handleFakePayment = () => {
    const bookingData = state.pendingBooking;
    if (!bookingData) return;

    // خزّن الحجز محليًا
    const existingBookings =
      JSON.parse(localStorage.getItem("allBookings")) || [];
    const updatedBookings = [...existingBookings, bookingData];
    localStorage.setItem("allBookings", JSON.stringify(updatedBookings));

    // أكد الحجز عالميًا
    dispatch({ type: "ADD_BOOKING_CONFIRMED", payload: bookingData });

    // ✅ إشعار نجاح
    setSuccessMessage(t.paymentSuccessMsg || "تم الدفع بنجاح ✅");

    // تنظيف الواجهة
    setShowPaymentForm(false);
    if (formRef.current) formRef.current.reset();
    setErrors({});

    // ✅ رجع المستخدم للصفحة الرئيسية بعد ثانيتين
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  // Mobile payment handlers
  const handleMobilePaymentComplete = async (paymentResult) => {
    const bookingData = state.pendingBooking;
    if (!bookingData) return;

    try {
      // Store booking locally
      const existingBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
      const bookingWithPayment = {
        ...bookingData,
        paymentMethod: paymentResult.method,
        transactionId: paymentResult.transactionId,
        paymentStatus: 'completed'
      };
      const updatedBookings = [...existingBookings, bookingWithPayment];
      localStorage.setItem("allBookings", JSON.stringify(updatedBookings));

      // Confirm booking globally
      dispatch({ type: "ADD_BOOKING_CONFIRMED", payload: bookingWithPayment });

      // Send booking confirmation notification
      if (notificationService.isEnabled()) {
        await notificationService.sendBookingConfirmation(bookingWithPayment);
        // Schedule reminder for 24 hours before
        notificationService.scheduleBookingReminder(bookingWithPayment);
      }

      // Show success message
      setSuccessMessage(t.paymentSuccessMsg || "تم الدفع بنجاح ✅");
      setShowMobilePayment(false);
      setPaymentError("");

      // Reset form
      if (formRef.current) formRef.current.reset();
      setErrors({});

      // Navigate to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error('Payment completion error:', error);
      setPaymentError('خطأ في تأكيد الدفع');
    }
  };

  const handleMobilePaymentError = (error) => {
    console.error('Payment error:', error);
    setPaymentError(error.message || 'خطأ في الدفع');
  };

  // QR Code handlers
  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  const handleCloseQRCode = () => {
    setShowQRCode(false);
  };

  const handleCloseMobilePayment = () => {
    setShowMobilePayment(false);
    setPaymentError("");
  };

  return (
    <section className="booking-section" data-aos="fade-up">
      <div className="section-box">
        <h2>{t.bookNow || "احجز الآن"}</h2>

        {!showPaymentForm ? (
          <form
            id="booking-form"
            className="form-container"
            onSubmit={handleBooking}
            ref={formRef}
            noValidate
          >
            <div className="form-group">
              <label htmlFor="name">{t.name || "الاسم"}</label>
              <input type="text" id="name" name="name" />
              {errors.name && <p className="error-msg">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="date">{t.date || "التاريخ"}</label>
              <input type="date" id="date" name="date" />
              {errors.date && <p className="error-msg">{errors.date}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="time">{t.time || "الوقت"}</label>
              <input type="time" id="time" name="time" />
              {errors.time && <p className="error-msg">{errors.time}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t.phoneNumber || "رقم الهاتف"}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                pattern="[0-9]{11}"
                title="أدخل رقم مكون من 11 رقم"
              />
              {errors.phone && <p className="error-msg">{errors.phone}</p>}
            </div>

            <button type="submit" disabled={state.loading}>
              {state.loading
                ? t.loading || "جارٍ الإرسال..."
                : t.payNow || "التالي"}
            </button>

            {state.error && <p className="error-msg">{state.error}</p>}
          </form>
        ) : (
          <div className="payment-box">
            <h3>{t.paymentFormTitle || "بيانات الدفع"}</h3>
            <p>{t.bookingPrice || "السعر: 100 جنيه"}</p>

            <div className="form-group">
              <label>{t.cardNumber || "رقم البطاقة"}</label>
              <input type="text" placeholder="1234 5678 9012 3456" />
            </div>

            <div className="form-group">
              <label>{t.expiryDate || "تاريخ الانتهاء"}</label>
              <input type="text" placeholder="MM/YY" />
            </div>

            <div className="form-group">
              <label>{t.cvv || "CVV"}</label>
              <input type="text" placeholder="123" />
            </div>

            <button onClick={handleFakePayment}>
              {t.payButton || "ادفع الآن"}
            </button>
          </div>
        )}

        {/* ✅ رسالة النجاح */}
        {successMessage && <p className="success-msg">{successMessage}</p>}

        {/* Mobile Payment Modal */}
        {showMobilePayment && (
          <div className="mobile-payment-modal">
            <div className="modal-overlay" onClick={handleCloseMobilePayment}></div>
            <div className="modal-content">
              <MobilePayment
                bookingData={{
                  ...state.pendingBooking,
                  amount: 100, // Default price
                  activity: 'Sports Activity'
                }}
                onPaymentComplete={handleMobilePaymentComplete}
                onPaymentError={handleMobilePaymentError}
              />
              <button className="close-modal-btn" onClick={handleCloseMobilePayment}>
                &times;
              </button>
            </div>
          </div>
        )}

        {/* QR Code Generator Modal */}
        {showQRCode && (
          <QRCodeGenerator
            bookingData={state.pendingBooking}
            onClose={handleCloseQRCode}
          />
        )}

        {/* Payment Error */}
        {paymentError && (
          <div className="payment-error">
            <p>{paymentError}</p>
            <button onClick={() => setPaymentError("")}>Close</button>
          </div>
        )}

        {/* QR Code Button */}
        {state.pendingBooking && (
          <div className="booking-actions">
            <button 
              className="qr-code-btn"
              onClick={handleShowQRCode}
            >
              <span className="btn-icon">📱</span>
              Generate QR Code
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default BookingSection;
