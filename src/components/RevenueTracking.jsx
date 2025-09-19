import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import '../style.css';

const RevenueTracking = ({ lang }) => {
  const { analytics } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedView, setSelectedView] = useState('overview');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getRevenueData = () => {
    switch (selectedPeriod) {
      case 'daily':
        return [
          { date: '2024-01-15', revenue: 450, bookings: 12 },
          { date: '2024-01-16', revenue: 520, bookings: 14 },
          { date: '2024-01-17', revenue: 380, bookings: 10 },
          { date: '2024-01-18', revenue: 610, bookings: 16 },
          { date: '2024-01-19', revenue: 480, bookings: 13 },
          { date: '2024-01-20', revenue: 550, bookings: 15 },
          { date: '2024-01-21', revenue: 420, bookings: 11 }
        ];
      case 'weekly':
        return [
          { week: 'Week 1', revenue: 3200, bookings: 85 },
          { week: 'Week 2', revenue: 3800, bookings: 95 },
          { week: 'Week 3', revenue: 4200, bookings: 105 },
          { week: 'Week 4', revenue: 3900, bookings: 98 }
        ];
      case 'monthly':
        return analytics.monthlyRevenue;
      case 'yearly':
        return [
          { year: '2021', revenue: 25000, bookings: 650 },
          { year: '2022', revenue: 32000, bookings: 820 },
          { year: '2023', revenue: 41000, bookings: 1050 },
          { year: '2024', revenue: 45680, bookings: 1247 }
        ];
      default:
        return [];
    }
  };

  const getPaymentMethodData = () => [
    { method: 'Credit Card', percentage: 45, amount: 20556, color: '#ff0000' },
    { method: 'Cash', percentage: 30, amount: 13704, color: '#4CAF50' },
    { method: 'Bank Transfer', percentage: 15, amount: 6852, color: '#2196F3' },
    { method: 'Mobile Payment', percentage: 10, amount: 4568, color: '#FF9800' }
  ];

  const getServiceRevenueData = () => [
    { service: 'Football Match', revenue: 22500, percentage: 49.3, bookings: 450 },
    { service: 'Basketball Game', revenue: 12800, percentage: 28.0, bookings: 320 },
    { service: 'Tennis Court', revenue: 8400, percentage: 18.4, bookings: 280 },
    { service: 'Training Session', revenue: 1980, percentage: 4.3, bookings: 197 }
  ];

  const getRefundData = () => [
    { date: '2024-01-15', amount: 50, reason: 'Customer cancellation', status: 'processed' },
    { date: '2024-01-12', amount: 40, reason: 'Weather cancellation', status: 'processed' },
    { date: '2024-01-10', amount: 30, reason: 'Double booking', status: 'pending' },
    { date: '2024-01-08', amount: 25, reason: 'Service unavailable', status: 'processed' }
  ];

  const getDiscountData = () => [
    { date: '2024-01-15', amount: 15, reason: 'First-time customer', customer: 'Ahmed Ali' },
    { date: '2024-01-14', amount: 20, reason: 'Loyalty discount', customer: 'Sarah Mohamed' },
    { date: '2024-01-13', amount: 10, reason: 'Group booking', customer: 'Omar Hassan' },
    { date: '2024-01-12', amount: 25, reason: 'Referral bonus', customer: 'Fatima Ahmed' }
  ];

  const currentData = getRevenueData();
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = currentData.reduce((sum, item) => sum + (item.bookings || 0), 0);
  const averageRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  return (
    <div className="revenue-tracking">
      <div className="dashboard-header">
        <h3>{lang === 'ar' ? 'تتبع الإيرادات' : 'Revenue Tracking'}</h3>
        <div className="controls">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="daily">{lang === 'ar' ? 'يومي' : 'Daily'}</option>
            <option value="weekly">{lang === 'ar' ? 'أسبوعي' : 'Weekly'}</option>
            <option value="monthly">{lang === 'ar' ? 'شهري' : 'Monthly'}</option>
            <option value="yearly">{lang === 'ar' ? 'سنوي' : 'Yearly'}</option>
          </select>
          <div className="view-tabs">
            <button 
              className={`view-tab ${selectedView === 'overview' ? 'active' : ''}`}
              onClick={() => setSelectedView('overview')}
            >
              {lang === 'ar' ? 'نظرة عامة' : 'Overview'}
            </button>
            <button 
              className={`view-tab ${selectedView === 'breakdown' ? 'active' : ''}`}
              onClick={() => setSelectedView('breakdown')}
            >
              {lang === 'ar' ? 'تفصيل' : 'Breakdown'}
            </button>
            <button 
              className={`view-tab ${selectedView === 'reports' ? 'active' : ''}`}
              onClick={() => setSelectedView('reports')}
            >
              {lang === 'ar' ? 'تقارير' : 'Reports'}
            </button>
          </div>
        </div>
      </div>

      {selectedView === 'overview' && (
        <>
          {/* Revenue Summary */}
          <div className="revenue-summary">
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <div className="summary-value">{formatCurrency(totalRevenue)}</div>
                <div className="summary-label">
                  {lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}
                </div>
                <div className="summary-period">
                  {selectedPeriod === 'daily' && (lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days')}
                  {selectedPeriod === 'weekly' && (lang === 'ar' ? 'آخر 4 أسابيع' : 'Last 4 Weeks')}
                  {selectedPeriod === 'monthly' && (lang === 'ar' ? 'آخر 12 شهر' : 'Last 12 Months')}
                  {selectedPeriod === 'yearly' && (lang === 'ar' ? 'آخر 4 سنوات' : 'Last 4 Years')}
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <div className="summary-value">{formatNumber(totalBookings)}</div>
                <div className="summary-label">
                  {lang === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}
                </div>
                <div className="summary-period">
                  {selectedPeriod === 'daily' && (lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days')}
                  {selectedPeriod === 'weekly' && (lang === 'ar' ? 'آخر 4 أسابيع' : 'Last 4 Weeks')}
                  {selectedPeriod === 'monthly' && (lang === 'ar' ? 'آخر 12 شهر' : 'Last 12 Months')}
                  {selectedPeriod === 'yearly' && (lang === 'ar' ? 'آخر 4 سنوات' : 'Last 4 Years')}
                </div>
              </div>
            </div>

            <div className="summary-card">
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <div className="summary-value">{formatCurrency(averageRevenue)}</div>
                <div className="summary-label">
                  {lang === 'ar' ? 'متوسط الإيراد' : 'Average Revenue'}
                </div>
                <div className="summary-period">
                  {lang === 'ar' ? 'لكل حجز' : 'Per Booking'}
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="revenue-chart-section">
            <div className="chart-header">
              <h4>{lang === 'ar' ? 'اتجاه الإيرادات' : 'Revenue Trend'}</h4>
            </div>
            <div className="revenue-chart">
              {currentData.map((item, index) => (
                <div key={index} className="chart-item">
                  <div className="chart-bar">
                    <div 
                      className="bar-fill"
                      style={{ 
                        height: `${(item.revenue / Math.max(...currentData.map(d => d.revenue))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="chart-label">
                    {selectedPeriod === 'daily' ? item.date.split('-')[2] : 
                     selectedPeriod === 'weekly' ? item.week : 
                     selectedPeriod === 'monthly' ? item.month : 
                     item.year}
                  </div>
                  <div className="chart-value">{formatCurrency(item.revenue)}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedView === 'breakdown' && (
        <>
          {/* Payment Methods */}
          <div className="breakdown-section">
            <div className="section-header">
              <h4>{lang === 'ar' ? 'طرق الدفع' : 'Payment Methods'}</h4>
            </div>
            <div className="payment-methods">
              {getPaymentMethodData().map((method, index) => (
                <div key={index} className="payment-method">
                  <div className="method-info">
                    <div className="method-name">{method.method}</div>
                    <div className="method-amount">{formatCurrency(method.amount)}</div>
                    <div className="method-percentage">{method.percentage}%</div>
                  </div>
                  <div className="method-bar">
                    <div 
                      className="method-fill"
                      style={{ 
                        width: `${method.percentage}%`,
                        backgroundColor: method.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Revenue */}
          <div className="breakdown-section">
            <div className="section-header">
              <h4>{lang === 'ar' ? 'إيرادات الخدمات' : 'Service Revenue'}</h4>
            </div>
            <div className="service-revenue">
              {getServiceRevenueData().map((service, index) => (
                <div key={index} className="service-revenue-item">
                  <div className="service-info">
                    <div className="service-name">{service.service}</div>
                    <div className="service-stats">
                      <span className="service-bookings">{service.bookings} {lang === 'ar' ? 'حجز' : 'bookings'}</span>
                      <span className="service-percentage">{service.percentage}%</span>
                    </div>
                  </div>
                  <div className="service-amount">{formatCurrency(service.revenue)}</div>
                  <div className="service-bar">
                    <div 
                      className="service-fill"
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {selectedView === 'reports' && (
        <>
          {/* Refunds */}
          <div className="reports-section">
            <div className="section-header">
              <h4>{lang === 'ar' ? 'المبالغ المستردة' : 'Refunds'}</h4>
            </div>
            <div className="refunds-table">
              <div className="table-header">
                <div className="table-cell">{lang === 'ar' ? 'التاريخ' : 'Date'}</div>
                <div className="table-cell">{lang === 'ar' ? 'المبلغ' : 'Amount'}</div>
                <div className="table-cell">{lang === 'ar' ? 'السبب' : 'Reason'}</div>
                <div className="table-cell">{lang === 'ar' ? 'الحالة' : 'Status'}</div>
              </div>
              {getRefundData().map((refund, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">{refund.date}</div>
                  <div className="table-cell">{formatCurrency(refund.amount)}</div>
                  <div className="table-cell">{refund.reason}</div>
                  <div className="table-cell">
                    <span className={`status-badge ${refund.status}`}>
                      {refund.status === 'processed' ? 
                        (lang === 'ar' ? 'مكتمل' : 'Processed') : 
                        (lang === 'ar' ? 'معلق' : 'Pending')
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discounts */}
          <div className="reports-section">
            <div className="section-header">
              <h4>{lang === 'ar' ? 'الخصومات' : 'Discounts'}</h4>
            </div>
            <div className="discounts-table">
              <div className="table-header">
                <div className="table-cell">{lang === 'ar' ? 'التاريخ' : 'Date'}</div>
                <div className="table-cell">{lang === 'ar' ? 'المبلغ' : 'Amount'}</div>
                <div className="table-cell">{lang === 'ar' ? 'السبب' : 'Reason'}</div>
                <div className="table-cell">{lang === 'ar' ? 'العميل' : 'Customer'}</div>
              </div>
              {getDiscountData().map((discount, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell">{discount.date}</div>
                  <div className="table-cell">{formatCurrency(discount.amount)}</div>
                  <div className="table-cell">{discount.reason}</div>
                  <div className="table-cell">{discount.customer}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="export-section">
            <div className="section-header">
              <h4>{lang === 'ar' ? 'تصدير التقارير' : 'Export Reports'}</h4>
            </div>
            <div className="export-options">
              <button className="export-btn">
                <span className="export-icon">📊</span>
                {lang === 'ar' ? 'تصدير Excel' : 'Export Excel'}
              </button>
              <button className="export-btn">
                <span className="export-icon">📄</span>
                {lang === 'ar' ? 'تصدير PDF' : 'Export PDF'}
              </button>
              <button className="export-btn">
                <span className="export-icon">📧</span>
                {lang === 'ar' ? 'إرسال بالبريد' : 'Email Report'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueTracking;
