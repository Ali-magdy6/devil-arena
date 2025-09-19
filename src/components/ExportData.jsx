import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ExportData.css';

const ExportData = ({ bookings, lang, darkMode }) => {
  const [exportFormat, setExportFormat] = useState('excel');
  const [dateRange, setDateRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // Process data for export
  const processExportData = () => {
    let filteredBookings = [...bookings];

    // Apply date filter
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'today':
          filteredBookings = filteredBookings.filter(booking => 
            new Date(booking.date).toDateString() === now.toDateString()
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filteredBookings = filteredBookings.filter(booking => 
            new Date(booking.date) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filteredBookings = filteredBookings.filter(booking => 
            new Date(booking.date) >= filterDate
          );
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          filteredBookings = filteredBookings.filter(booking => 
            new Date(booking.date) >= filterDate
          );
          break;
      }
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filteredBookings = filteredBookings.filter(booking => 
        (booking.status || 'confirmed') === statusFilter
      );
    }

    // Add calculated fields
    return filteredBookings.map(booking => ({
      'ID': booking.id,
      'Customer Name': booking.name,
      'Phone': booking.phone,
      'Date': booking.date,
      'Time': booking.time,
      'Price': booking.price || 100,
      'Status': booking.status || 'confirmed',
      'Venue': booking.venue || 'Main Field',
      'Payment Method': booking.paymentMethod || 'Credit Card',
      'Created At': booking.timestamp || booking.date,
      'Revenue': booking.price || 100
    }));
  };

  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      const data = processExportData();
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
      
      // Auto-size columns
      const colWidths = [
        { wch: 10 }, // ID
        { wch: 20 }, // Customer Name
        { wch: 15 }, // Phone
        { wch: 12 }, // Date
        { wch: 10 }, // Time
        { wch: 10 }, // Price
        { wch: 12 }, // Status
        { wch: 15 }, // Venue
        { wch: 15 }, // Payment Method
        { wch: 20 }, // Created At
        { wch: 10 }  // Revenue
      ];
      worksheet['!cols'] = colWidths;
      
      const fileName = `bookings_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      const data = processExportData();
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(lang === 'ar' ? 'تقرير الحجوزات' : 'Bookings Report', 14, 22);
      
      // Add date
      doc.setFontSize(10);
      doc.text(
        `${lang === 'ar' ? 'تاريخ التصدير:' : 'Export Date:'} ${new Date().toLocaleDateString()}`,
        14,
        30
      );
      
      // Add summary
      const totalBookings = data.length;
      const totalRevenue = data.reduce((sum, booking) => sum + booking.Revenue, 0);
      const confirmedBookings = data.filter(booking => booking.Status === 'confirmed').length;
      
      doc.setFontSize(12);
      doc.text(`${lang === 'ar' ? 'إجمالي الحجوزات:' : 'Total Bookings:'} ${totalBookings}`, 14, 40);
      doc.text(`${lang === 'ar' ? 'إجمالي الإيرادات:' : 'Total Revenue:'} $${totalRevenue}`, 14, 48);
      doc.text(`${lang === 'ar' ? 'الحجوزات المؤكدة:' : 'Confirmed Bookings:'} ${confirmedBookings}`, 14, 56);
      
      // Prepare table data
      const tableData = data.map(booking => [
        booking.ID,
        booking['Customer Name'],
        booking.Phone,
        booking.Date,
        booking.Time,
        `$${booking.Price}`,
        booking.Status,
        booking.Venue
      ]);
      
      // Add table
      doc.autoTable({
        head: [[
          lang === 'ar' ? 'ID' : 'ID',
          lang === 'ar' ? 'اسم العميل' : 'Customer',
          lang === 'ar' ? 'الهاتف' : 'Phone',
          lang === 'ar' ? 'التاريخ' : 'Date',
          lang === 'ar' ? 'الوقت' : 'Time',
          lang === 'ar' ? 'السعر' : 'Price',
          lang === 'ar' ? 'الحالة' : 'Status',
          lang === 'ar' ? 'الملعب' : 'Venue'
        ]],
        body: tableData,
        startY: 70,
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [255, 0, 0],
          textColor: [255, 255, 255]
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        }
      });
      
      const fileName = `bookings_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('PDF export error:', error);
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      const data = processExportData();
      const csvContent = [
        // Headers
        Object.keys(data[0] || {}).join(','),
        // Data rows
        ...data.map(booking => Object.values(booking).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('CSV export error:', error);
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'excel':
        exportToExcel();
        break;
      case 'pdf':
        exportToPDF();
        break;
      case 'csv':
        exportToCSV();
        break;
      default:
        break;
    }
  };

  const getExportStats = () => {
    const data = processExportData();
    return {
      total: data.length,
      revenue: data.reduce((sum, booking) => sum + booking.Revenue, 0),
      confirmed: data.filter(booking => booking.Status === 'confirmed').length,
      cancelled: data.filter(booking => booking.Status === 'cancelled').length
    };
  };

  const stats = getExportStats();

  return (
    <motion.div 
      className={`export-data ${darkMode ? 'dark-mode' : 'light-mode'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="export-header">
        <h3>{lang === 'ar' ? 'تصدير البيانات' : 'Export Data'}</h3>
        <p>{lang === 'ar' ? 'تصدير بيانات الحجوزات بصيغ مختلفة' : 'Export booking data in various formats'}</p>
      </div>

      {/* Export Stats */}
      <div className="export-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">{lang === 'ar' ? 'إجمالي الحجوزات' : 'Total Bookings'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">${stats.revenue.toLocaleString()}</div>
            <div className="stat-label">{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.confirmed}</div>
            <div className="stat-label">{lang === 'ar' ? 'مؤكد' : 'Confirmed'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-value">{stats.cancelled}</div>
            <div className="stat-label">{lang === 'ar' ? 'ملغي' : 'Cancelled'}</div>
          </div>
        </div>
      </div>

      {/* Export Controls */}
      <div className="export-controls">
        <div className="control-group">
          <label>{lang === 'ar' ? 'نوع التصدير:' : 'Export Format:'}</label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="format-select"
          >
            <option value="excel">Excel (.xlsx)</option>
            <option value="pdf">PDF (.pdf)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
        </div>

        <div className="control-group">
          <label>{lang === 'ar' ? 'نطاق التاريخ:' : 'Date Range:'}</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-select"
          >
            <option value="all">{lang === 'ar' ? 'جميع التواريخ' : 'All Dates'}</option>
            <option value="today">{lang === 'ar' ? 'اليوم' : 'Today'}</option>
            <option value="week">{lang === 'ar' ? 'هذا الأسبوع' : 'This Week'}</option>
            <option value="month">{lang === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
            <option value="year">{lang === 'ar' ? 'هذا العام' : 'This Year'}</option>
          </select>
        </div>

        <div className="control-group">
          <label>{lang === 'ar' ? 'حالة الحجز:' : 'Booking Status:'}</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="all">{lang === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
            <option value="confirmed">{lang === 'ar' ? 'مؤكد' : 'Confirmed'}</option>
            <option value="cancelled">{lang === 'ar' ? 'ملغي' : 'Cancelled'}</option>
            <option value="pending">{lang === 'ar' ? 'في الانتظار' : 'Pending'}</option>
          </select>
        </div>
      </div>

      {/* Export Button */}
      <div className="export-actions">
        <motion.button
          className={`export-btn ${exportFormat}`}
          onClick={handleExport}
          disabled={isExporting || stats.total === 0}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExporting ? (
            <>
              <div className="loading-spinner"></div>
              {lang === 'ar' ? 'جاري التصدير...' : 'Exporting...'}
            </>
          ) : (
            <>
              <span className="export-icon">
                {exportFormat === 'excel' ? '📊' : 
                 exportFormat === 'pdf' ? '📄' : '📋'}
              </span>
              {lang === 'ar' ? 'تصدير البيانات' : 'Export Data'}
            </>
          )}
        </motion.button>

        {stats.total === 0 && (
          <p className="no-data-message">
            {lang === 'ar' ? 'لا توجد بيانات للتصدير' : 'No data to export'}
          </p>
        )}
      </div>

      {/* Export Preview */}
      {stats.total > 0 && (
        <div className="export-preview">
          <h4>{lang === 'ar' ? 'معاينة البيانات:' : 'Data Preview:'}</h4>
          <div className="preview-table">
            <table>
              <thead>
                <tr>
                  <th>{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                  <th>{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  <th>{lang === 'ar' ? 'الوقت' : 'Time'}</th>
                  <th>{lang === 'ar' ? 'السعر' : 'Price'}</th>
                  <th>{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {processExportData().slice(0, 5).map((booking, index) => (
                  <tr key={index}>
                    <td>{booking['Customer Name']}</td>
                    <td>{booking.Date}</td>
                    <td>{booking.Time}</td>
                    <td>${booking.Price}</td>
                    <td>
                      <span className={`status-badge ${booking.Status}`}>
                        {booking.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stats.total > 5 && (
              <p className="preview-note">
                {lang === 'ar' 
                  ? `و ${stats.total - 5} حجز إضافي...` 
                  : `And ${stats.total - 5} more bookings...`
                }
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ExportData;
