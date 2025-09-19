import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import '../style.css';

const ConflictDetection = ({ lang }) => {
  const { conflicts, setConflicts } = useAdmin();
  const [activeTab, setActiveTab] = useState('detected');
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionType, setResolutionType] = useState('');

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getConflictTypeLabel = (type) => {
    const labels = {
      double_booking: lang === 'ar' ? 'حجز مزدوج' : 'Double Booking',
      overlapping: lang === 'ar' ? 'تداخل' : 'Overlapping',
      resource_conflict: lang === 'ar' ? 'تعارض الموارد' : 'Resource Conflict',
      time_conflict: lang === 'ar' ? 'تعارض الوقت' : 'Time Conflict'
    };
    return labels[type] || type;
  };

  const getConflictSeverity = (conflict) => {
    if (conflict.type === 'double_booking') return 'high';
    if (conflict.type === 'overlapping') return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getSeverityLabel = (severity) => {
    const labels = {
      high: lang === 'ar' ? 'عالي' : 'High',
      medium: lang === 'ar' ? 'متوسط' : 'Medium',
      low: lang === 'ar' ? 'منخفض' : 'Low'
    };
    return labels[severity] || severity;
  };

  const handleResolveConflict = (conflictId) => {
    // Simulate conflict resolution
    setConflicts(conflicts.filter(conflict => conflict.id !== conflictId));
    setShowResolutionModal(false);
    setSelectedConflict(null);
    
    // Show success message
    alert(lang === 'ar' ? 'تم حل التعارض بنجاح' : 'Conflict resolved successfully!');
  };

  const handleAutoResolve = (conflictId) => {
    const conflict = conflicts.find(c => c.id === conflictId);
    if (conflict) {
      // Auto-resolve based on conflict type
      let resolution = '';
      switch (conflict.type) {
        case 'double_booking':
          resolution = 'Move second booking to next available slot';
          break;
        case 'overlapping':
          resolution = 'Extend first booking or move second booking';
          break;
        default:
          resolution = 'Automatically resolved';
      }
      handleResolveConflict(conflictId, resolution);
    }
  };

  const getConflictStats = () => {
    const total = conflicts.length;
    const high = conflicts.filter(c => getConflictSeverity(c) === 'high').length;
    const medium = conflicts.filter(c => getConflictSeverity(c) === 'medium').length;
    const low = conflicts.filter(c => getConflictSeverity(c) === 'low').length;
    const resolved = 0; // This would come from actual data

    return { total, high, medium, low, resolved };
  };

  const stats = getConflictStats();

  return (
    <div className="conflict-detection">
      <div className="dashboard-header">
        <h3>{lang === 'ar' ? 'كشف التعارضات' : 'Conflict Detection'}</h3>
        <div className="header-actions">
          <button 
            className="scan-btn"
            onClick={() => {
              // Simulate conflict scan
              alert(lang === 'ar' ? 'تم فحص التعارضات' : 'Conflict scan completed!');
            }}
          >
            <span className="btn-icon">🔍</span>
            {lang === 'ar' ? 'فحص التعارضات' : 'Scan Conflicts'}
          </button>
        </div>
      </div>

      {/* Conflict Stats */}
      <div className="conflict-stats">
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">{lang === 'ar' ? 'إجمالي التعارضات' : 'Total Conflicts'}</div>
          </div>
        </div>
        <div className="stat-card high">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <div className="stat-value">{stats.high}</div>
            <div className="stat-label">{lang === 'ar' ? 'عالي الخطورة' : 'High Priority'}</div>
          </div>
        </div>
        <div className="stat-card medium">
          <div className="stat-icon">🟡</div>
          <div className="stat-content">
            <div className="stat-value">{stats.medium}</div>
            <div className="stat-label">{lang === 'ar' ? 'متوسط الخطورة' : 'Medium Priority'}</div>
          </div>
        </div>
        <div className="stat-card low">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <div className="stat-value">{stats.low}</div>
            <div className="stat-label">{lang === 'ar' ? 'منخفض الخطورة' : 'Low Priority'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.resolved}</div>
            <div className="stat-label">{lang === 'ar' ? 'تم الحل' : 'Resolved'}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="conflict-tabs">
        <button 
          className={`tab-btn ${activeTab === 'detected' ? 'active' : ''}`}
          onClick={() => setActiveTab('detected')}
        >
          {lang === 'ar' ? 'المكتشفة' : 'Detected'}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'resolved' ? 'active' : ''}`}
          onClick={() => setActiveTab('resolved')}
        >
          {lang === 'ar' ? 'المحلولة' : 'Resolved'}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          {lang === 'ar' ? 'الإعدادات' : 'Settings'}
        </button>
      </div>

      {/* Detected Conflicts */}
      {activeTab === 'detected' && (
        <div className="conflicts-section">
          {conflicts.length === 0 ? (
            <div className="no-conflicts">
              <div className="no-conflicts-icon">✅</div>
              <h4>{lang === 'ar' ? 'لا توجد تعارضات' : 'No Conflicts Found'}</h4>
              <p>{lang === 'ar' ? 'جميع الحجوزات متوافقة' : 'All bookings are compatible'}</p>
            </div>
          ) : (
            <div className="conflicts-list">
              {conflicts.map((conflict) => {
                const severity = getConflictSeverity(conflict);
                return (
                  <div key={conflict.id} className={`conflict-card ${severity}`}>
                    <div className="conflict-header">
                      <div className="conflict-type">
                        <span className="type-badge">{getConflictTypeLabel(conflict.type)}</span>
                        <span 
                          className="severity-badge"
                          style={{ backgroundColor: getSeverityColor(severity) }}
                        >
                          {getSeverityLabel(severity)}
                        </span>
                      </div>
                      <div className="conflict-date">{formatDate(conflict.date)}</div>
                    </div>
                    
                    <div className="conflict-details">
                      <div className="booking-conflict">
                        <div className="booking-item">
                          <div className="booking-info">
                            <div className="booking-customer">{conflict.booking1.customer}</div>
                            <div className="booking-service">{conflict.booking1.service}</div>
                            <div className="booking-time">{formatTime(conflict.booking1.time)}</div>
                          </div>
                          <div className="booking-id">#{conflict.booking1.id}</div>
                        </div>
                        <div className="conflict-vs">VS</div>
                        <div className="booking-item">
                          <div className="booking-info">
                            <div className="booking-customer">{conflict.booking2.customer}</div>
                            <div className="booking-service">{conflict.booking2.service}</div>
                            <div className="booking-time">{formatTime(conflict.booking2.time)}</div>
                          </div>
                          <div className="booking-id">#{conflict.booking2.id}</div>
                        </div>
                      </div>
                      
                      <div className="conflict-suggestion">
                        <strong>{lang === 'ar' ? 'الحل المقترح:' : 'Suggested Resolution:'}</strong>
                        <p>{conflict.suggestedResolution}</p>
                      </div>
                    </div>
                    
                    <div className="conflict-actions">
                      <button 
                        className="action-btn resolve"
                        onClick={() => {
                          setSelectedConflict(conflict);
                          setShowResolutionModal(true);
                        }}
                      >
                        {lang === 'ar' ? 'حل يدوي' : 'Manual Resolve'}
                      </button>
                      <button 
                        className="action-btn auto"
                        onClick={() => handleAutoResolve(conflict.id)}
                      >
                        {lang === 'ar' ? 'حل تلقائي' : 'Auto Resolve'}
                      </button>
                      <button 
                        className="action-btn ignore"
                        onClick={() => handleResolveConflict(conflict.id, 'Ignored')}
                      >
                        {lang === 'ar' ? 'تجاهل' : 'Ignore'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Resolved Conflicts */}
      {activeTab === 'resolved' && (
        <div className="resolved-section">
          <div className="no-conflicts">
            <div className="no-conflicts-icon">📋</div>
            <h4>{lang === 'ar' ? 'لا توجد تعارضات محلولة' : 'No Resolved Conflicts'}</h4>
            <p>{lang === 'ar' ? 'سيتم عرض التعارضات المحلولة هنا' : 'Resolved conflicts will appear here'}</p>
          </div>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="conflict-settings">
          <div className="settings-group">
            <h4>{lang === 'ar' ? 'إعدادات الكشف' : 'Detection Settings'}</h4>
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked />
                {lang === 'ar' ? 'كشف الحجوزات المزدوجة' : 'Detect Double Bookings'}
              </label>
            </div>
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked />
                {lang === 'ar' ? 'كشف التداخل الزمني' : 'Detect Time Overlaps'}
              </label>
            </div>
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked />
                {lang === 'ar' ? 'كشف تعارض الموارد' : 'Detect Resource Conflicts'}
              </label>
            </div>
          </div>

          <div className="settings-group">
            <h4>{lang === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}</h4>
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked />
                {lang === 'ar' ? 'إشعار فوري عند اكتشاف تعارض' : 'Instant notification on conflict detection'}
              </label>
            </div>
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" defaultChecked />
                {lang === 'ar' ? 'تذكير دوري للتعارضات غير المحلولة' : 'Periodic reminder for unresolved conflicts'}
              </label>
            </div>
          </div>

          <div className="settings-group">
            <h4>{lang === 'ar' ? 'إعدادات الحل التلقائي' : 'Auto-Resolution Settings'}</h4>
            <div className="setting-item">
              <label className="setting-label">
                {lang === 'ar' ? 'الحد الأدنى للوقت بين الحجوزات:' : 'Minimum time between bookings:'}
                <select className="setting-select">
                  <option value="15">{lang === 'ar' ? '15 دقيقة' : '15 Minutes'}</option>
                  <option value="30">{lang === 'ar' ? '30 دقيقة' : '30 Minutes'}</option>
                  <option value="60">{lang === 'ar' ? 'ساعة واحدة' : '1 Hour'}</option>
                </select>
              </label>
            </div>
            <div className="setting-item">
              <label className="setting-label">
                <input type="checkbox" />
                {lang === 'ar' ? 'حل تلقائي للتعارضات منخفضة الخطورة' : 'Auto-resolve low priority conflicts'}
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {showResolutionModal && selectedConflict && (
        <div className="modal-overlay" onClick={() => setShowResolutionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{lang === 'ar' ? 'حل التعارض' : 'Resolve Conflict'}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowResolutionModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="conflict-summary">
                <h4>{lang === 'ar' ? 'تفاصيل التعارض' : 'Conflict Details'}</h4>
                <p>
                  {lang === 'ar' ? 
                    `تعارض ${getConflictTypeLabel(selectedConflict.type)} بين ${selectedConflict.booking1.customer} و ${selectedConflict.booking2.customer}` :
                    `${getConflictTypeLabel(selectedConflict.type)} between ${selectedConflict.booking1.customer} and ${selectedConflict.booking2.customer}`
                  }
                </p>
              </div>
              
              <div className="resolution-options">
                <h4>{lang === 'ar' ? 'خيارات الحل' : 'Resolution Options'}</h4>
                <div className="resolution-option">
                  <input 
                    type="radio" 
                    id="move1" 
                    name="resolution" 
                    value="move_booking1"
                    onChange={(e) => setResolutionType(e.target.value)}
                  />
                  <label htmlFor="move1">
                    {lang === 'ar' ? 
                      `نقل حجز ${selectedConflict.booking1.customer} إلى وقت آخر` :
                      `Move ${selectedConflict.booking1.customer}'s booking to another time`
                    }
                  </label>
                </div>
                <div className="resolution-option">
                  <input 
                    type="radio" 
                    id="move2" 
                    name="resolution" 
                    value="move_booking2"
                    onChange={(e) => setResolutionType(e.target.value)}
                  />
                  <label htmlFor="move2">
                    {lang === 'ar' ? 
                      `نقل حجز ${selectedConflict.booking2.customer} إلى وقت آخر` :
                      `Move ${selectedConflict.booking2.customer}'s booking to another time`
                    }
                  </label>
                </div>
                <div className="resolution-option">
                  <input 
                    type="radio" 
                    id="cancel1" 
                    name="resolution" 
                    value="cancel_booking1"
                    onChange={(e) => setResolutionType(e.target.value)}
                  />
                  <label htmlFor="cancel1">
                    {lang === 'ar' ? 
                      `إلغاء حجز ${selectedConflict.booking1.customer}` :
                      `Cancel ${selectedConflict.booking1.customer}'s booking`
                    }
                  </label>
                </div>
                <div className="resolution-option">
                  <input 
                    type="radio" 
                    id="cancel2" 
                    name="resolution" 
                    value="cancel_booking2"
                    onChange={(e) => setResolutionType(e.target.value)}
                  />
                  <label htmlFor="cancel2">
                    {lang === 'ar' ? 
                      `إلغاء حجز ${selectedConflict.booking2.customer}` :
                      `Cancel ${selectedConflict.booking2.customer}'s booking`
                    }
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowResolutionModal(false)}
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                className="btn-primary"
                onClick={() => handleResolveConflict(selectedConflict.id, resolutionType)}
                disabled={!resolutionType}
              >
                {lang === 'ar' ? 'تطبيق الحل' : 'Apply Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConflictDetection;
