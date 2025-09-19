// src/pages/AdminPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminDashboard from "../components/AdminDashboard";

function AdminPage({ darkMode, t, lang, toggleLanguage }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();

  const apiURL = "https://68945f77be3700414e12e8ba.mockapi.io/devil-arena/bookings";

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      alert(lang === 'ar' ? "🚫 لا يمكنك الدخول لهذه الصفحة بدون تسجيل الدخول." : "🚫 You cannot access this page without logging in.");
      navigate("/login");
      return;
    }

    fetchBookings();
  }, [navigate, lang]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(apiURL);
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      alert(lang === 'ar' ? "❌ حدث خطأ أثناء تحميل البيانات." : "❌ Error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete individual booking
  const handleDelete = async (id) => {
    if (window.confirm(lang === 'ar' ? "هل أنت متأكد من إلغاء هذا الحجز؟" : "Are you sure you want to cancel this booking?")) {
      try {
        await axios.delete(`${apiURL}/${id}`);
        setBookings(bookings.filter((booking) => booking.id !== id));
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert(lang === 'ar' ? "❌ فشل في إلغاء الحجز." : "❌ Failed to cancel booking.");
      }
    }
  };

  // ✅ Delete all bookings
  const handleDeleteAll = async () => {
    if (window.confirm(lang === 'ar' ? "⚠️ هل أنت متأكد أنك تريد إلغاء جميع الحجوزات؟" : "⚠️ Are you sure you want to cancel all bookings?")) {
      try {
        await Promise.all(
          bookings.map((booking) =>
            axios.delete(`${apiURL}/${booking.id}`)
          )
        );
        setBookings([]);
      } catch (error) {
        console.error("Failed to delete all bookings:", error);
        alert(lang === 'ar' ? "❌ حدث خطأ أثناء إلغاء جميع الحجوزات." : "❌ Error occurred while canceling all bookings.");
      }
    }
  };

  return (
    <section className={`admin-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      {!showAdvanced ? (
        <div className="section-box">
          <div className="admin-page-header">
            <div className="admin-title-section">
              <h2>{lang === 'ar' ? '📋 قائمة الحجوزات' : '📋 Bookings List'}</h2>
              <button 
                className="modern-icon-btn language-switch-btn"
                onClick={toggleLanguage}
                title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              >
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span className="btn-text">{lang === 'ar' ? 'English' : 'العربية'}</span>
              </button>
            </div>
            <button 
              className="advanced-btn"
              onClick={() => setShowAdvanced(true)}
            >
              <span className="btn-icon">⚡</span>
              {lang === 'ar' ? 'لوحة الإدارة المتقدمة' : 'Advanced Admin Dashboard'}
            </button>
          </div>

          {loading ? (
            <p>{lang === 'ar' ? '⏳ جاري تحميل الحجوزات...' : '⏳ Loading bookings...'}</p>
          ) : bookings.length === 0 ? (
            <p>{lang === 'ar' ? '🚫 لا توجد أي حجوزات مسجلة حتى الآن.' : '🚫 No bookings registered yet.'}</p>
          ) : (
            <>
              <button className="delete-all-btn" onClick={handleDeleteAll}>
                {lang === 'ar' ? '🗑️ إلغاء جميع الحجوزات' : '🗑️ Cancel All Bookings'}
              </button>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                    <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th>{lang === 'ar' ? 'الوقت' : 'Time'}</th>
                    <th>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</th>
                    <th>{lang === 'ar' ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.name}</td>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
                      <td>{booking.phone}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(booking.id)}
                        >
                          {lang === 'ar' ? '❌ إلغاء' : '❌ Cancel'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      ) : (
        <div className="advanced-admin">
          <div className="admin-header-actions">
            <button 
              className="back-btn"
              onClick={() => setShowAdvanced(false)}
            >
              <span className="btn-icon">←</span>
              {lang === 'ar' ? 'العودة للقائمة البسيطة' : 'Back to Simple List'}
            </button>
            <button 
              className="modern-icon-btn language-switch-btn"
              onClick={toggleLanguage}
              title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span className="btn-text">{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
          <AdminDashboard 
            t={t} 
            lang={lang} 
            toggleLanguage={toggleLanguage}
            bookings={bookings}
            darkMode={darkMode}
          />
        </div>
      )}
    </section>
  );
}

export default AdminPage;
