import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import '../style.css';

const CustomerManagement = ({ lang }) => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAdmin();
  // const [activeTab, setActiveTab] = useState('list');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: [],
    notes: ''
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'vip': return '#FF9800';
      case 'inactive': return '#F44336';
      default: return '#757575';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: lang === 'ar' ? 'نشط' : 'Active',
      vip: lang === 'ar' ? 'VIP' : 'VIP',
      inactive: lang === 'ar' ? 'غير نشط' : 'Inactive'
    };
    return labels[status] || status;
  };

  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'totalBookings':
          return b.totalBookings - a.totalBookings;
        case 'lastVisit':
          return new Date(b.lastVisit) - new Date(a.lastVisit);
        default:
          return 0;
      }
    });

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      const customer = {
        ...newCustomer,
        id: Date.now(),
        totalBookings: 0,
        totalSpent: 0,
        lastVisit: null,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      };
      addCustomer(customer);
      setNewCustomer({ name: '', email: '', phone: '', preferences: [], notes: '' });
      setShowAddModal(false);
    }
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      updateCustomer(selectedCustomer);
      setShowEditModal(false);
      setSelectedCustomer(null);
    }
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا العميل؟' : 'Are you sure you want to delete this customer?')) {
      deleteCustomer(id);
    }
  };

  const getCustomerStats = () => {
    const total = customers.length;
    const active = customers.filter(c => c.status === 'active').length;
    const vip = customers.filter(c => c.status === 'vip').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const averageSpent = total > 0 ? totalRevenue / total : 0;

    return { total, active, vip, totalRevenue, averageSpent };
  };

  const stats = getCustomerStats();

  return (
    <div className="customer-management">
      <div className="dashboard-header">
        <h3>{lang === 'ar' ? 'إدارة العملاء' : 'Customer Management'}</h3>
        <div className="header-actions">
          <button 
            className="add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <span className="btn-icon">+</span>
            {lang === 'ar' ? 'إضافة عميل' : 'Add Customer'}
          </button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="customer-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">{lang === 'ar' ? 'إجمالي العملاء' : 'Total Customers'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">{lang === 'ar' ? 'عملاء نشطون' : 'Active Customers'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{stats.vip}</div>
            <div className="stat-label">{lang === 'ar' ? 'عملاء VIP' : 'VIP Customers'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
            <div className="stat-label">{lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.averageSpent)}</div>
            <div className="stat-label">{lang === 'ar' ? 'متوسط الإنفاق' : 'Average Spent'}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="customer-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder={lang === 'ar' ? 'البحث عن العملاء...' : 'Search customers...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-controls">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">{lang === 'ar' ? 'جميع العملاء' : 'All Customers'}</option>
            <option value="active">{lang === 'ar' ? 'نشط' : 'Active'}</option>
            <option value="vip">{lang === 'ar' ? 'VIP' : 'VIP'}</option>
            <option value="inactive">{lang === 'ar' ? 'غير نشط' : 'Inactive'}</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="name">{lang === 'ar' ? 'الاسم' : 'Name'}</option>
            <option value="totalSpent">{lang === 'ar' ? 'إجمالي الإنفاق' : 'Total Spent'}</option>
            <option value="totalBookings">{lang === 'ar' ? 'عدد الحجوزات' : 'Total Bookings'}</option>
            <option value="lastVisit">{lang === 'ar' ? 'آخر زيارة' : 'Last Visit'}</option>
          </select>
        </div>
      </div>

      {/* Customer List */}
      <div className="customer-list">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-avatar">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div className="customer-info">
              <div className="customer-name">{customer.name}</div>
              <div className="customer-contact">
                <span className="contact-item">📧 {customer.email}</span>
                <span className="contact-item">📱 {customer.phone}</span>
              </div>
              <div className="customer-stats">
                <span className="stat-item">
                  {customer.totalBookings} {lang === 'ar' ? 'حجز' : 'bookings'}
                </span>
                <span className="stat-item">
                  {formatCurrency(customer.totalSpent)} {lang === 'ar' ? 'منفق' : 'spent'}
                </span>
                <span className="stat-item">
                  {lang === 'ar' ? 'آخر زيارة:' : 'Last visit:'} {customer.lastVisit ? formatDate(customer.lastVisit) : 'N/A'}
                </span>
              </div>
              {customer.preferences.length > 0 && (
                <div className="customer-preferences">
                  {customer.preferences.map((pref, index) => (
                    <span key={index} className="preference-tag">{pref}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="customer-actions">
              <div className="customer-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(customer.status) }}
                >
                  {getStatusLabel(customer.status)}
                </span>
              </div>
              <div className="action-buttons">
                <button 
                  className="action-btn edit"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowEditModal(true);
                  }}
                >
                  ✏️
                </button>
                <button 
                  className="action-btn delete"
                  onClick={() => handleDeleteCustomer(customer.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{lang === 'ar' ? 'إضافة عميل جديد' : 'Add New Customer'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{lang === 'ar' ? 'الاسم' : 'Name'}</label>
                <input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'الملاحظات' : 'Notes'}</label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                className="btn-primary"
                onClick={handleAddCustomer}
              >
                {lang === 'ar' ? 'إضافة' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{lang === 'ar' ? 'تعديل العميل' : 'Edit Customer'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>{lang === 'ar' ? 'الاسم' : 'Name'}</label>
                <input
                  type="text"
                  value={selectedCustomer.name}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                <input
                  type="email"
                  value={selectedCustomer.email}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                <input
                  type="tel"
                  value={selectedCustomer.phone}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'الحالة' : 'Status'}</label>
                <select
                  value={selectedCustomer.status}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, status: e.target.value })}
                  className="form-select"
                >
                  <option value="active">{lang === 'ar' ? 'نشط' : 'Active'}</option>
                  <option value="vip">{lang === 'ar' ? 'VIP' : 'VIP'}</option>
                  <option value="inactive">{lang === 'ar' ? 'غير نشط' : 'Inactive'}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? 'الملاحظات' : 'Notes'}</label>
                <textarea
                  value={selectedCustomer.notes}
                  onChange={(e) => setSelectedCustomer({ ...selectedCustomer, notes: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                className="btn-primary"
                onClick={handleEditCustomer}
              >
                {lang === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
