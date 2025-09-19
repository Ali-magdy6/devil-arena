import React, { useState } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import RevenueTracking from './RevenueTracking';
import CustomerManagement from './CustomerManagement';
import NotificationSystem from './NotificationSystem';
import ConflictDetection from './ConflictDetection';
import EnhancedReservationsTable from './EnhancedReservationsTable';
import AdminCharts from './AdminCharts';
import ExportData from './ExportData';
import '../style.css';

const AdminDashboard = ({ t, lang, toggleLanguage, bookings = [], darkMode = false }) => {
  const [activeTab, setActiveTab] = useState('reservations');

  const tabs = [
    {
      id: 'reservations',
      name: lang === 'ar' ? 'الحجوزات المتقدمة' : 'Enhanced Reservations',
      icon: '📋',
      component: EnhancedReservationsTable
    },
    {
      id: 'charts',
      name: lang === 'ar' ? 'الرسوم البيانية' : 'Charts & Analytics',
      icon: '📊',
      component: AdminCharts
    },
    {
      id: 'notifications',
      name: lang === 'ar' ? 'الإشعارات' : 'Notifications',
      icon: '🔔',
      component: NotificationSystem
    },
    {
      id: 'export',
      name: lang === 'ar' ? 'تصدير البيانات' : 'Export Data',
      icon: '📤',
      component: ExportData
    },
    {
      id: 'analytics',
      name: lang === 'ar' ? 'التحليلات' : 'Analytics',
      icon: '📈',
      component: AnalyticsDashboard
    },
    {
      id: 'revenue',
      name: lang === 'ar' ? 'الإيرادات' : 'Revenue',
      icon: '💰',
      component: RevenueTracking
    },
    {
      id: 'customers',
      name: lang === 'ar' ? 'العملاء' : 'Customers',
      icon: '👥',
      component: CustomerManagement
    },
    {
      id: 'conflicts',
      name: lang === 'ar' ? 'التعارضات' : 'Conflicts',
      icon: '⚠️',
      component: ConflictDetection
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <h2>{lang === 'ar' ? 'لوحة الإدارة المتقدمة' : 'Advanced Admin Dashboard'}</h2>
          <p className="admin-subtitle">
            {lang === 'ar' 
              ? 'إدارة شاملة لجميع جوانب العمل' 
              : 'Comprehensive management for all business aspects'
            }
          </p>
        </div>
        <div className="admin-actions">
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
          <button className="modern-icon-btn admin-btn">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span className="btn-text">{lang === 'ar' ? 'الإعدادات' : 'Settings'}</span>
          </button>
          <button className="modern-icon-btn admin-btn">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span className="btn-text">{lang === 'ar' ? 'تصدير' : 'Export'}</span>
          </button>
          <button className="modern-icon-btn admin-btn primary">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="btn-text">{lang === 'ar' ? 'إضافة جديد' : 'Add New'}</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="admin-overview">
        <div className="overview-card">
          <div className="overview-icon">📊</div>
          <div className="overview-content">
            <div className="overview-value">1,247</div>
            <div className="overview-label">{lang === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}</div>
            <div className="overview-change positive">+12.5%</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">💰</div>
          <div className="overview-content">
            <div className="overview-value">$45,680</div>
            <div className="overview-label">{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
            <div className="overview-change positive">+8.3%</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">👥</div>
          <div className="overview-content">
            <div className="overview-value">342</div>
            <div className="overview-label">{lang === 'ar' ? 'العملاء النشطون' : 'Active Customers'}</div>
            <div className="overview-change positive">+5.2%</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">⚠️</div>
          <div className="overview-content">
            <div className="overview-value">3</div>
            <div className="overview-label">{lang === 'ar' ? 'التعارضات' : 'Conflicts'}</div>
            <div className="overview-change negative">+2</div>
          </div>
        </div>
        <div className="overview-card">
          <div className="overview-icon">📧</div>
          <div className="overview-content">
            <div className="overview-value">156</div>
            <div className="overview-label">{lang === 'ar' ? 'الإشعارات المرسلة' : 'Notifications Sent'}</div>
            <div className="overview-change positive">+23.1%</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Active Component */}
      <div className="admin-content">
        {ActiveComponent && (
          <ActiveComponent 
            t={t} 
            lang={lang} 
            bookings={bookings}
            darkMode={darkMode}
            onUpdateBooking={(id, updates) => {
              // Handle booking updates
              console.log('Update booking:', id, updates);
            }}
            onDeleteBooking={(id) => {
              // Handle booking deletion
              console.log('Delete booking:', id);
            }}
          />
        )}
      </div>

      {/* Recent Activity Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-section">
          <h4>{lang === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</h4>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📅</div>
              <div className="activity-content">
                <div className="activity-title">{lang === 'ar' ? 'حجز جديد' : 'New Booking'}</div>
                <div className="activity-desc">{lang === 'ar' ? 'Ahmed Ali - كرة قدم' : 'Ahmed Ali - Football'}</div>
                <div className="activity-time">2 min ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💰</div>
              <div className="activity-content">
                <div className="activity-title">{lang === 'ar' ? 'دفعة مستلمة' : 'Payment Received'}</div>
                <div className="activity-desc">{lang === 'ar' ? '$50.00 - بطاقة ائتمان' : '$50.00 - Credit Card'}</div>
                <div className="activity-time">5 min ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">⚠️</div>
              <div className="activity-content">
                <div className="activity-title">{lang === 'ar' ? 'تعارض مكتشف' : 'Conflict Detected'}</div>
                <div className="activity-desc">{lang === 'ar' ? 'حجز مزدوج - 18:00' : 'Double booking - 18:00'}</div>
                <div className="activity-time">10 min ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📧</div>
              <div className="activity-content">
                <div className="activity-title">{lang === 'ar' ? 'إشعار مرسل' : 'Notification Sent'}</div>
                <div className="activity-desc">{lang === 'ar' ? 'تأكيد الحجز - Sarah' : 'Booking confirmation - Sarah'}</div>
                <div className="activity-time">15 min ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <h4>{lang === 'ar' ? 'التنبيهات' : 'Alerts'}</h4>
          <div className="alerts-list">
            <div className="alert-item high">
              <div className="alert-icon">🔴</div>
              <div className="alert-content">
                <div className="alert-title">{lang === 'ar' ? 'تعارض عالي الخطورة' : 'High Priority Conflict'}</div>
                <div className="alert-desc">{lang === 'ar' ? 'يتطلب حل فوري' : 'Requires immediate attention'}</div>
              </div>
            </div>
            <div className="alert-item medium">
              <div className="alert-icon">🟡</div>
              <div className="alert-content">
                <div className="alert-title">{lang === 'ar' ? 'حجز قريب' : 'Upcoming Booking'}</div>
                <div className="alert-desc">{lang === 'ar' ? 'في غضون ساعة' : 'Within 1 hour'}</div>
              </div>
            </div>
            <div className="alert-item low">
              <div className="alert-icon">🟢</div>
              <div className="alert-content">
                <div className="alert-title">{lang === 'ar' ? 'تقرير جاهز' : 'Report Ready'}</div>
                <div className="alert-desc">{lang === 'ar' ? 'تقرير الإيرادات الشهري' : 'Monthly revenue report'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <h4>{lang === 'ar' ? 'الإحصائيات السريعة' : 'Quick Stats'}</h4>
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="stat-label">{lang === 'ar' ? 'اليوم:' : 'Today:'}</span>
              <span className="stat-value">12 {lang === 'ar' ? 'حجز' : 'bookings'}</span>
            </div>
            <div className="quick-stat">
              <span className="stat-label">{lang === 'ar' ? 'هذا الأسبوع:' : 'This Week:'}</span>
              <span className="stat-value">89 {lang === 'ar' ? 'حجز' : 'bookings'}</span>
            </div>
            <div className="quick-stat">
              <span className="stat-label">{lang === 'ar' ? 'هذا الشهر:' : 'This Month:'}</span>
              <span className="stat-value">347 {lang === 'ar' ? 'حجز' : 'bookings'}</span>
            </div>
            <div className="quick-stat">
              <span className="stat-label">{lang === 'ar' ? 'معدل التحويل:' : 'Conversion Rate:'}</span>
              <span className="stat-value">12.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
