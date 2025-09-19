import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import '../style.css';

const AnalyticsDashboard = ({ lang }) => {
  const { analytics, ui, setUI } = useAdmin();
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'revenue':
        return analytics.monthlyRevenue.map(item => ({
          x: item.month,
          y: item.revenue
        }));
      case 'bookings':
        return analytics.monthlyRevenue.map(item => ({
          x: item.month,
          y: item.bookings
        }));
      default:
        return [];
    }
  };

  const getPeakHoursData = () => {
    return analytics.peakHours.map(hour => ({
      hour: hour.hour,
      bookings: hour.bookings
    }));
  };

  const getPopularServicesData = () => {
    return analytics.popularServices.map(service => ({
      name: service.name,
      bookings: service.bookings,
      revenue: service.revenue
    }));
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h3>{lang === 'ar' ? 'لوحة التحليلات' : 'Analytics Dashboard'}</h3>
        <div className="date-range-selector">
          <select 
            value={ui.dateRange} 
            onChange={(e) => setUI({ dateRange: e.target.value })}
            className="range-select"
          >
            <option value="7d">{lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days'}</option>
            <option value="30d">{lang === 'ar' ? 'آخر 30 يوم' : 'Last 30 Days'}</option>
            <option value="90d">{lang === 'ar' ? 'آخر 90 يوم' : 'Last 90 Days'}</option>
            <option value="1y">{lang === 'ar' ? 'آخر سنة' : 'Last Year'}</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <div className="metric-value">{formatNumber(analytics.totalBookings)}</div>
            <div className="metric-label">{lang === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}</div>
            <div className="metric-change positive">+12.5%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(analytics.totalRevenue)}</div>
            <div className="metric-label">{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
            <div className="metric-change positive">+8.3%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.customerRetention}%</div>
            <div className="metric-label">{lang === 'ar' ? 'الاحتفاظ بالعملاء' : 'Customer Retention'}</div>
            <div className="metric-change positive">+2.1%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💵</div>
          <div className="metric-content">
            <div className="metric-value">{formatCurrency(analytics.averageBookingValue)}</div>
            <div className="metric-label">{lang === 'ar' ? 'متوسط قيمة الحجز' : 'Avg Booking Value'}</div>
            <div className="metric-change negative">-1.2%</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{analytics.conversionRate}%</div>
            <div className="metric-label">{lang === 'ar' ? 'معدل التحويل' : 'Conversion Rate'}</div>
            <div className="metric-change positive">+0.8%</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h4>{lang === 'ar' ? 'الاتجاهات الشهرية' : 'Monthly Trends'}</h4>
            <div className="chart-controls">
              <button 
                className={`chart-btn ${selectedMetric === 'revenue' ? 'active' : ''}`}
                onClick={() => setSelectedMetric('revenue')}
              >
                {lang === 'ar' ? 'الإيرادات' : 'Revenue'}
              </button>
              <button 
                className={`chart-btn ${selectedMetric === 'bookings' ? 'active' : ''}`}
                onClick={() => setSelectedMetric('bookings')}
              >
                {lang === 'ar' ? 'الحجوزات' : 'Bookings'}
              </button>
            </div>
          </div>
          <div className="chart-content">
            <div className="simple-chart">
              {getMetricData().map((item, index) => (
                <div key={index} className="chart-bar">
                  <div 
                    className="bar-fill"
                    style={{ 
                      height: `${(item.y / Math.max(...getMetricData().map(d => d.y))) * 100}%`,
                      backgroundColor: selectedMetric === 'revenue' ? '#ff0000' : '#4CAF50'
                    }}
                  ></div>
                  <div className="bar-label">{item.x}</div>
                  <div className="bar-value">
                    {selectedMetric === 'revenue' ? formatCurrency(item.y) : item.y}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h4>{lang === 'ar' ? 'ساعات الذروة' : 'Peak Hours'}</h4>
          </div>
          <div className="chart-content">
            <div className="peak-hours-chart">
              {getPeakHoursData().map((hour, index) => (
                <div key={index} className="peak-hour-item">
                  <div className="hour-label">{hour.hour}</div>
                  <div className="hour-bar">
                    <div 
                      className="hour-fill"
                      style={{ 
                        width: `${(hour.bookings / Math.max(...getPeakHoursData().map(h => h.bookings))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="hour-value">{hour.bookings}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Performance */}
      <div className="services-section">
        <div className="section-header">
          <h4>{lang === 'ar' ? 'أداء الخدمات' : 'Services Performance'}</h4>
        </div>
        <div className="services-grid">
          {getPopularServicesData().map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-info">
                <h5>{service.name}</h5>
                <div className="service-stats">
                  <div className="stat">
                    <span className="stat-label">{lang === 'ar' ? 'الحجوزات:' : 'Bookings:'}</span>
                    <span className="stat-value">{formatNumber(service.bookings)}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">{lang === 'ar' ? 'الإيرادات:' : 'Revenue:'}</span>
                    <span className="stat-value">{formatCurrency(service.revenue)}</span>
                  </div>
                </div>
              </div>
              <div className="service-chart">
                <div className="mini-chart">
                  <div 
                    className="mini-bar"
                    style={{ 
                      height: `${(service.bookings / Math.max(...getPopularServicesData().map(s => s.bookings))) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <div className="section-header">
          <h4>{lang === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}</h4>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📅</div>
            <div className="activity-content">
              <div className="activity-title">{lang === 'ar' ? 'حجز جديد' : 'New Booking'}</div>
              <div className="activity-desc">{lang === 'ar' ? 'Ahmed Ali - كرة قدم - 18:00' : 'Ahmed Ali - Football - 18:00'}</div>
              <div className="activity-time">2 minutes ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💰</div>
            <div className="activity-content">
              <div className="activity-title">{lang === 'ar' ? 'دفعة مستلمة' : 'Payment Received'}</div>
              <div className="activity-desc">{lang === 'ar' ? '$50.00 - بطاقة ائتمان' : '$50.00 - Credit Card'}</div>
              <div className="activity-time">5 minutes ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <div className="activity-title">{lang === 'ar' ? 'عميل جديد' : 'New Customer'}</div>
              <div className="activity-desc">{lang === 'ar' ? 'Sarah Mohamed - سجلت للتو' : 'Sarah Mohamed - Just registered'}</div>
              <div className="activity-time">10 minutes ago</div>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">❌</div>
            <div className="activity-content">
              <div className="activity-title">{lang === 'ar' ? 'إلغاء حجز' : 'Booking Cancelled'}</div>
              <div className="activity-desc">{lang === 'ar' ? 'Omar Hassan - كرة سلة - 14:00' : 'Omar Hassan - Basketball - 14:00'}</div>
              <div className="activity-time">15 minutes ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
