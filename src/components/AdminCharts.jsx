import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './AdminCharts.css';

const AdminCharts = ({ bookings, lang, darkMode }) => {
  const [activeChart, setActiveChart] = useState('weekly');

  // Process data for charts
  const chartData = useMemo(() => {
    const now = new Date();
    const last7Days = [];
    const last12Months = [];
    const last12Weeks = [];

    // Generate last 7 days data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayBookings = bookings.filter(booking => booking.date === dateStr);
      const revenue = dayBookings.reduce((sum, booking) => sum + (booking.price || 100), 0);
      
      last7Days.push({
        date: date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        bookings: dayBookings.length,
        revenue: revenue,
        fullDate: dateStr
      });
    }

    // Generate last 12 months data
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().substring(0, 7);
      
      const monthBookings = bookings.filter(booking => 
        booking.date && booking.date.startsWith(monthStr)
      );
      const revenue = monthBookings.reduce((sum, booking) => sum + (booking.price || 100), 0);
      
      last12Months.push({
        month: date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { 
          month: 'short',
          year: '2-digit'
        }),
        bookings: monthBookings.length,
        revenue: revenue,
        fullMonth: monthStr
      });
    }

    // Generate last 12 weeks data
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 7));
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= weekStart && bookingDate <= weekEnd;
      });
      const revenue = weekBookings.reduce((sum, booking) => sum + (booking.price || 100), 0);
      
      last12Weeks.push({
        week: `W${12-i}`,
        bookings: weekBookings.length,
        revenue: revenue,
        weekRange: `${weekStart.getDate()}/${weekStart.getMonth()+1} - ${weekEnd.getDate()}/${weekEnd.getMonth()+1}`
      });
    }

    // Status distribution
    const statusCounts = bookings.reduce((acc, booking) => {
      const status = booking.status || 'confirmed';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status === 'confirmed' ? (lang === 'ar' ? 'مؤكد' : 'Confirmed') :
            status === 'cancelled' ? (lang === 'ar' ? 'ملغي' : 'Cancelled') :
            (lang === 'ar' ? 'في الانتظار' : 'Pending'),
      value: count,
      status: status
    }));

    // Venue distribution
    const venueCounts = bookings.reduce((acc, booking) => {
      const venue = booking.venue || 'Main Field';
      acc[venue] = (acc[venue] || 0) + 1;
      return acc;
    }, {});

    const venueData = Object.entries(venueCounts).map(([venue, count]) => ({
      name: venue,
      value: count
    }));

    return {
      last7Days,
      last12Months,
      last12Weeks,
      statusData,
      venueData
    };
  }, [bookings, lang]);

  const chartTypes = [
    {
      id: 'weekly',
      name: lang === 'ar' ? 'الحجوزات الأسبوعية' : 'Weekly Bookings',
      icon: '📅',
      description: lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 days'
    },
    {
      id: 'monthly',
      name: lang === 'ar' ? 'الإيرادات الشهرية' : 'Monthly Revenue',
      icon: '💰',
      description: lang === 'ar' ? 'آخر 12 شهر' : 'Last 12 months'
    },
    {
      id: 'status',
      name: lang === 'ar' ? 'توزيع الحالات' : 'Status Distribution',
      icon: '📊',
      description: lang === 'ar' ? 'حالات الحجوزات' : 'Booking statuses'
    },
    {
      id: 'venues',
      name: lang === 'ar' ? 'توزيع الملاعب' : 'Venue Distribution',
      icon: '🏟️',
      description: lang === 'ar' ? 'استخدام الملاعب' : 'Venue usage'
    }
  ];

  const colors = {
    primary: '#ff0000',
    secondary: '#28a745',
    accent: '#007bff',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    success: '#28a745',
    light: '#f8f9fa',
    dark: '#343a40'
  };

  const pieColors = ['#ff0000', '#28a745', '#007bff', '#ffc107', '#dc3545', '#17a2b8'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (activeChart) {
      case 'weekly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData.last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="bookings"
                stackId="1"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.6}
                name={lang === 'ar' ? 'الحجوزات' : 'Bookings'}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData.last12Months}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="revenue"
                fill={colors.secondary}
                name={lang === 'ar' ? 'الإيرادات ($)' : 'Revenue ($)'}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'status':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'venues':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData.venueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.venueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      className={`admin-charts ${darkMode ? 'dark-mode' : 'light-mode'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="charts-header">
        <h3>{lang === 'ar' ? 'الرسوم البيانية والإحصائيات' : 'Charts & Analytics'}</h3>
        <p>{lang === 'ar' ? 'تحليل شامل لأداء الحجوزات والإيرادات' : 'Comprehensive analysis of bookings and revenue performance'}</p>
      </div>

      {/* Chart Type Selector */}
      <div className="chart-selector">
        {chartTypes.map((chart) => (
          <motion.button
            key={chart.id}
            className={`chart-type-btn ${activeChart === chart.id ? 'active' : ''}`}
            onClick={() => setActiveChart(chart.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="chart-icon">{chart.icon}</span>
            <div className="chart-info">
              <div className="chart-name">{chart.name}</div>
              <div className="chart-description">{chart.description}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Chart Container */}
      <motion.div 
        className="chart-container"
        key={activeChart}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="chart-wrapper">
          {renderChart()}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="quick-stats-grid">
        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">
              {chartData.last7Days.reduce((sum, day) => sum + day.bookings, 0)}
            </div>
            <div className="stat-label">
              {lang === 'ar' ? 'حجوزات هذا الأسبوع' : 'This Week Bookings'}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">
              ${chartData.last7Days.reduce((sum, day) => sum + day.revenue, 0).toLocaleString()}
            </div>
            <div className="stat-label">
              {lang === 'ar' ? 'إيرادات هذا الأسبوع' : 'This Week Revenue'}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">
              {Math.round(chartData.last7Days.reduce((sum, day) => sum + day.bookings, 0) / 7)}
            </div>
            <div className="stat-label">
              {lang === 'ar' ? 'متوسط يومي' : 'Daily Average'}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="stat-card"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">
              {Math.round((chartData.statusData.find(s => s.status === 'confirmed')?.value || 0) / 
                chartData.statusData.reduce((sum, s) => sum + s.value, 0) * 100)}%
            </div>
            <div className="stat-label">
              {lang === 'ar' ? 'معدل التأكيد' : 'Confirmation Rate'}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminCharts;
