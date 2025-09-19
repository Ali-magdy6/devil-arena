import React, { useState, useEffect } from 'react';
import './AvailabilityCalendar.css';

const AvailabilityCalendar = ({ t, onTimeSlotSelect, selectedDate, selectedTime }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [loading, setLoading] = useState(false);
  // const [hoveredSlot, setHoveredSlot] = useState(null);

  // Time slots configuration
  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  // Fetch booked slots from API
  useEffect(() => {
    fetchBookedSlots();
  }, [currentMonth]);

  const fetchBookedSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://68945f77be3700414e12e8ba.mockapi.io/devil-arena/bookings');
      const bookings = await response.json();
      
      const booked = new Set();
      bookings.forEach(booking => {
        const dateKey = `${booking.date}T${booking.time}`;
        booked.add(dateKey);
      });
      
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calendar navigation
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    // const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const isPast = date < today;
      
      days.push({
        date,
        isCurrentMonth,
        isToday,
        isPast,
        dateString: date.toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  // Check if time slot is available
  const isTimeSlotAvailable = (date, time) => {
    const dateString = date.toISOString().split('T')[0];
    const slotKey = `${dateString}T${time}`;
    return !bookedSlots.has(slotKey);
  };

  // Handle time slot selection
  const handleTimeSlotClick = (date, time) => {
    if (isTimeSlotAvailable(date, time)) {
      onTimeSlotSelect(date, time);
    }
  };

  // Get availability status for a date
  const getDateAvailability = (date) => {
    const availableSlots = timeSlots.filter(time => isTimeSlotAvailable(date, time));
    return {
      total: timeSlots.length,
      available: availableSlots.length,
      percentage: Math.round((availableSlots.length / timeSlots.length) * 100)
    };
  };

  const days = getCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="availability-calendar">
      <div className="calendar-header">
        <button 
          className="nav-btn" 
          onClick={() => navigateMonth(-1)}
          disabled={loading}
        >
          ‹
        </button>
        
        <h3 className="month-title">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button 
          className="nav-btn" 
          onClick={() => navigateMonth(1)}
          disabled={loading}
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        
        {days.map((day, index) => {
          const availability = getDateAvailability(day.date);
          const isSelected = selectedDate && day.dateString === selectedDate;
          
          return (
            <div
              key={index}
              className={`calendar-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${
                day.isToday ? 'today' : ''
              } ${day.isPast ? 'past' : ''} ${isSelected ? 'selected' : ''} ${
                availability.available > 0 ? 'has-availability' : 'no-availability'
              }`}
              onClick={() => !day.isPast && day.isCurrentMonth && onTimeSlotSelect(day.date, null)}
            >
              <div className="calendar-day-content">
                <span className="day-number">{day.date.getDate()}</span>
                {day.isCurrentMonth && !day.isPast && (
                  <div className="availability-indicator">
                    <div 
                      className="availability-bar"
                      style={{ width: `${availability.percentage}%` }}
                    ></div>
                    <span className="availability-text">
                      {availability.available}/{availability.total}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="time-slots-container">
          <h4 className="time-slots-title">
            {t.availableTimes || 'Available Times'} - {selectedDate}
          </h4>
          
          <div className="time-slots-grid">
            {timeSlots.map(time => {
              const date = new Date(selectedDate);
              const isAvailable = isTimeSlotAvailable(date, time);
              const isSelected = selectedTime === time;
              
              return (
                <button
                  key={time}
                  className={`time-slot ${isAvailable ? 'available' : 'booked'} ${
                    isSelected ? 'selected' : ''
                  }`}
                  disabled={!isAvailable}
                  onClick={() => handleTimeSlotClick(date, time)}
                  // onMouseEnter={() => setHoveredSlot(time)}
                  // onMouseLeave={() => setHoveredSlot(null)}
                >
                  {time}
                  {!isAvailable && <span className="booked-icon">✕</span>}
                  {isSelected && <span className="selected-icon">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>{t.loading || 'Loading availability...'}</p>
        </div>
      )}

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>{t.available || 'Available'}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color booked"></div>
          <span>{t.booked || 'Booked'}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>{t.selected || 'Selected'}</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
