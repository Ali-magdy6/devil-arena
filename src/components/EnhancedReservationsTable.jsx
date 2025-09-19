import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EnhancedReservationsTable.css';

const EnhancedReservationsTable = ({ bookings, onUpdateBooking, onDeleteBooking, lang, darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBookings, setSelectedBookings] = useState([]);

  // Enhanced booking data with status and price
  const enhancedBookings = useMemo(() => {
    return bookings.map(booking => ({
      ...booking,
      status: booking.status || (Math.random() > 0.1 ? 'confirmed' : 'cancelled'),
      price: booking.price || (Math.floor(Math.random() * 200) + 50), // Random price between 50-250
      venue: booking.venue || 'Main Field',
      paymentMethod: booking.paymentMethod || 'Credit Card'
    }));
  }, [bookings]);

  // Filter and search logic
  const filteredBookings = useMemo(() => {
    let filtered = enhancedBookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        booking.venue.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(booking => 
            new Date(booking.date).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(booking => new Date(booking.date) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(booking => new Date(booking.date) >= filterDate);
          break;
        case 'year':
          filterDate.setFullYear(today.getFullYear() - 1);
          filtered = filtered.filter(booking => new Date(booking.date) >= filterDate);
          break;
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(a.date);
        bValue = new Date(b.date);
      } else if (sortField === 'price') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      } else {
        aValue = aValue?.toString().toLowerCase() || '';
        bValue = bValue?.toString().toLowerCase() || '';
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [enhancedBookings, searchTerm, statusFilter, dateFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle status change
  const handleStatusChange = (bookingId, newStatus) => {
    onUpdateBooking(bookingId, { status: newStatus });
  };

  // Handle bulk actions
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBookings(paginatedBookings.map(booking => booking.id));
    } else {
      setSelectedBookings([]);
    }
  };

  const handleSelectBooking = (bookingId, checked) => {
    if (checked) {
      setSelectedBookings([...selectedBookings, bookingId]);
    } else {
      setSelectedBookings(selectedBookings.filter(id => id !== bookingId));
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    selectedBookings.forEach(bookingId => {
      onUpdateBooking(bookingId, { status: newStatus });
    });
    setSelectedBookings([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف الحجوزات المحددة؟' : 'Are you sure you want to delete selected bookings?')) {
      selectedBookings.forEach(bookingId => {
        onDeleteBooking(bookingId);
      });
      setSelectedBookings([]);
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { 
        text: lang === 'ar' ? 'مؤكد' : 'Confirmed', 
        class: 'status-confirmed',
        icon: '✅'
      },
      cancelled: { 
        text: lang === 'ar' ? 'ملغي' : 'Cancelled', 
        class: 'status-cancelled',
        icon: '❌'
      },
      pending: { 
        text: lang === 'ar' ? 'في الانتظار' : 'Pending', 
        class: 'status-pending',
        icon: '⏳'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  return (
    <motion.div 
      className={`enhanced-reservations-table ${darkMode ? 'dark-mode' : 'light-mode'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Controls */}
      <div className="table-header">
        <div className="table-title">
          <h3>{lang === 'ar' ? 'جدول الحجوزات المتقدم' : 'Enhanced Reservations Table'}</h3>
          <span className="total-count">
            {filteredBookings.length} {lang === 'ar' ? 'حجز' : 'bookings'}
          </span>
        </div>

        {/* Search and Filters */}
        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder={lang === 'ar' ? 'البحث في الحجوزات...' : 'Search bookings...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">{lang === 'ar' ? 'جميع الحالات' : 'All Status'}</option>
              <option value="confirmed">{lang === 'ar' ? 'مؤكد' : 'Confirmed'}</option>
              <option value="cancelled">{lang === 'ar' ? 'ملغي' : 'Cancelled'}</option>
              <option value="pending">{lang === 'ar' ? 'في الانتظار' : 'Pending'}</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">{lang === 'ar' ? 'جميع التواريخ' : 'All Dates'}</option>
              <option value="today">{lang === 'ar' ? 'اليوم' : 'Today'}</option>
              <option value="week">{lang === 'ar' ? 'هذا الأسبوع' : 'This Week'}</option>
              <option value="month">{lang === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
              <option value="year">{lang === 'ar' ? 'هذا العام' : 'This Year'}</option>
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="filter-select"
            >
              <option value={5}>5 {lang === 'ar' ? 'عناصر' : 'items'}</option>
              <option value={10}>10 {lang === 'ar' ? 'عناصر' : 'items'}</option>
              <option value={25}>25 {lang === 'ar' ? 'عنصر' : 'items'}</option>
              <option value={50}>50 {lang === 'ar' ? 'عنصر' : 'items'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <motion.div 
          className="bulk-actions"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="bulk-info">
            {selectedBookings.length} {lang === 'ar' ? 'عنصر محدد' : 'items selected'}
          </div>
          <div className="bulk-buttons">
            <button 
              className="bulk-btn confirm-btn"
              onClick={() => handleBulkStatusChange('confirmed')}
            >
              {lang === 'ar' ? 'تأكيد المحدد' : 'Confirm Selected'}
            </button>
            <button 
              className="bulk-btn cancel-btn"
              onClick={() => handleBulkStatusChange('cancelled')}
            >
              {lang === 'ar' ? 'إلغاء المحدد' : 'Cancel Selected'}
            </button>
            <button 
              className="bulk-btn delete-btn"
              onClick={handleBulkDelete}
            >
              {lang === 'ar' ? 'حذف المحدد' : 'Delete Selected'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="reservations-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedBookings.length === paginatedBookings.length && paginatedBookings.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('name')}
              >
                {lang === 'ar' ? 'اسم العميل' : 'Customer Name'}
                {sortField === 'name' && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('date')}
              >
                {lang === 'ar' ? 'التاريخ' : 'Date'}
                {sortField === 'date' && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>{lang === 'ar' ? 'الوقت' : 'Time'}</th>
              <th 
                className="sortable"
                onClick={() => handleSort('price')}
              >
                {lang === 'ar' ? 'السعر' : 'Price'}
                {sortField === 'price' && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('status')}
              >
                {lang === 'ar' ? 'الحالة' : 'Status'}
                {sortField === 'status' && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>{lang === 'ar' ? 'الملعب' : 'Venue'}</th>
              <th>{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedBookings.map((booking, index) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={selectedBookings.includes(booking.id) ? 'selected' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={(e) => handleSelectBooking(booking.id, e.target.checked)}
                    />
                  </td>
                  <td className="customer-name">
                    <div className="customer-info">
                      <div className="name">{booking.name}</div>
                      <div className="phone">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="date-cell">
                    {new Date(booking.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                  </td>
                  <td className="time-cell">{booking.time}</td>
                  <td className="price-cell">
                    <span className="price">${booking.price}</span>
                    <span className="payment-method">{booking.paymentMethod}</span>
                  </td>
                  <td className="status-cell">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="venue-cell">{booking.venue}</td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">{lang === 'ar' ? 'في الانتظار' : 'Pending'}</option>
                        <option value="confirmed">{lang === 'ar' ? 'مؤكد' : 'Confirmed'}</option>
                        <option value="cancelled">{lang === 'ar' ? 'ملغي' : 'Cancelled'}</option>
                      </select>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => {/* Edit functionality */}}
                        title={lang === 'ar' ? 'تعديل' : 'Edit'}
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDeleteBooking(booking.id)}
                        title={lang === 'ar' ? 'حذف' : 'Delete'}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          {lang === 'ar' 
            ? `عرض ${(currentPage - 1) * itemsPerPage + 1} إلى ${Math.min(currentPage * itemsPerPage, filteredBookings.length)} من ${filteredBookings.length} حجز`
            : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredBookings.length)} of ${filteredBookings.length} bookings`
          }
        </div>
        
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            {lang === 'ar' ? 'الأولى' : 'First'}
          </button>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {lang === 'ar' ? 'السابق' : 'Previous'}
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {lang === 'ar' ? 'التالي' : 'Next'}
          </button>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {lang === 'ar' ? 'الأخيرة' : 'Last'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedReservationsTable;
