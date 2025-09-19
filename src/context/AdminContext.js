import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AdminContext = createContext();

// Initial state
const initialState = {
  // Analytics Data
  analytics: {
    totalBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
    bookingTrends: [],
    peakHours: [],
    popularServices: [],
    customerRetention: 0,
    averageBookingValue: 0,
    conversionRate: 0
  },
  
  // Revenue Data
  revenue: {
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
    byService: [],
    byPaymentMethod: [],
    refunds: [],
    discounts: []
  },
  
  // Customer Data
  customers: [],
  
  // Notifications
  notifications: {
    email: {
      enabled: true,
      templates: [],
      scheduled: []
    },
    sms: {
      enabled: true,
      templates: [],
      scheduled: []
    }
  },
  
  // Booking Conflicts
  conflicts: [],
  
  // System Settings
  settings: {
    businessHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '09:00', close: '22:00', closed: false },
      sunday: { open: '09:00', close: '22:00', closed: false }
    },
    services: [
      { id: 1, name: 'Football Match', price: 50, duration: 90, maxPlayers: 22 },
      { id: 2, name: 'Basketball Game', price: 40, duration: 60, maxPlayers: 10 },
      { id: 3, name: 'Tennis Court', price: 30, duration: 60, maxPlayers: 4 },
      { id: 4, name: 'Training Session', price: 25, duration: 45, maxPlayers: 15 }
    ],
    notificationSettings: {
      bookingConfirmation: true,
      bookingReminder: true,
      paymentConfirmation: true,
      cancellationNotice: true
    }
  },
  
  // UI State
  ui: {
    activeTab: 'analytics',
    dateRange: '30d',
    selectedService: 'all',
    loading: false,
    error: null
  }
};

// Reducer
const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: { ...state.analytics, ...action.payload }
      };
    
    case 'SET_REVENUE':
      return {
        ...state,
        revenue: { ...state.revenue, ...action.payload }
      };
    
    case 'SET_CUSTOMERS':
      return {
        ...state,
        customers: action.payload
      };
    
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload]
      };
    
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? { ...customer, ...action.payload } : customer
        )
      };
    
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload)
      };
    
    case 'SET_CONFLICTS':
      return {
        ...state,
        conflicts: action.payload
      };
    
    case 'RESOLVE_CONFLICT':
      return {
        ...state,
        conflicts: state.conflicts.filter(conflict => conflict.id !== action.payload)
      };
    
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: { ...state.notifications, ...action.payload }
      };
    
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'SET_UI':
      return {
        ...state,
        ui: { ...state.ui, ...action.payload }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload }
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        ui: { ...state.ui, error: action.payload }
      };
    
    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload
      };
    
    default:
      return state;
  }
};

// Provider component
export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('devil-arena-admin');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    } else {
      // Generate mock data for demonstration
      generateMockData();
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('devil-arena-admin', JSON.stringify(state));
  }, [state]);

  // Generate mock data for demonstration
  const generateMockData = () => {
    const mockAnalytics = {
      totalBookings: 1247,
      totalRevenue: 45680,
      monthlyRevenue: [
        { month: 'Jan', revenue: 3200, bookings: 85 },
        { month: 'Feb', revenue: 3800, bookings: 95 },
        { month: 'Mar', revenue: 4200, bookings: 105 },
        { month: 'Apr', revenue: 3900, bookings: 98 },
        { month: 'May', revenue: 4500, bookings: 112 },
        { month: 'Jun', revenue: 4800, bookings: 120 },
        { month: 'Jul', revenue: 5200, bookings: 130 },
        { month: 'Aug', revenue: 5100, bookings: 128 },
        { month: 'Sep', revenue: 4700, bookings: 118 },
        { month: 'Oct', revenue: 4900, bookings: 122 },
        { month: 'Nov', revenue: 4600, bookings: 115 },
        { month: 'Dec', revenue: 4980, bookings: 125 }
      ],
      bookingTrends: [
        { date: '2024-01-01', bookings: 12, revenue: 480 },
        { date: '2024-01-02', bookings: 15, revenue: 600 },
        { date: '2024-01-03', bookings: 18, revenue: 720 },
        { date: '2024-01-04', bookings: 14, revenue: 560 },
        { date: '2024-01-05', bookings: 20, revenue: 800 },
        { date: '2024-01-06', bookings: 25, revenue: 1000 },
        { date: '2024-01-07', bookings: 22, revenue: 880 }
      ],
      peakHours: [
        { hour: '09:00', bookings: 15 },
        { hour: '10:00', bookings: 25 },
        { hour: '11:00', bookings: 35 },
        { hour: '12:00', bookings: 30 },
        { hour: '13:00', bookings: 20 },
        { hour: '14:00', bookings: 28 },
        { hour: '15:00', bookings: 40 },
        { hour: '16:00', bookings: 45 },
        { hour: '17:00', bookings: 50 },
        { hour: '18:00', bookings: 55 },
        { hour: '19:00', bookings: 60 },
        { hour: '20:00', bookings: 45 },
        { hour: '21:00', bookings: 30 }
      ],
      popularServices: [
        { name: 'Football Match', bookings: 450, revenue: 22500 },
        { name: 'Basketball Game', bookings: 320, revenue: 12800 },
        { name: 'Tennis Court', bookings: 280, revenue: 8400 },
        { name: 'Training Session', bookings: 197, revenue: 4925 }
      ],
      customerRetention: 78.5,
      averageBookingValue: 36.7,
      conversionRate: 12.3
    };

    const mockCustomers = [
      {
        id: 1,
        name: 'Ahmed Ali',
        email: 'ahmed.ali@email.com',
        phone: '+201234567890',
        totalBookings: 15,
        totalSpent: 750,
        lastVisit: '2024-01-15',
        status: 'active',
        joinDate: '2023-06-01',
        preferences: ['Football', 'Evening'],
        notes: 'Regular customer, prefers evening slots'
      },
      {
        id: 2,
        name: 'Sarah Mohamed',
        email: 'sarah.mohamed@email.com',
        phone: '+201234567891',
        totalBookings: 8,
        totalSpent: 320,
        lastVisit: '2024-01-10',
        status: 'active',
        joinDate: '2023-08-15',
        preferences: ['Basketball', 'Morning'],
        notes: 'Prefers morning sessions'
      },
      {
        id: 3,
        name: 'Omar Hassan',
        email: 'omar.hassan@email.com',
        phone: '+201234567892',
        totalBookings: 22,
        totalSpent: 1100,
        lastVisit: '2024-01-12',
        status: 'vip',
        joinDate: '2023-03-01',
        preferences: ['Football', 'Tennis'],
        notes: 'VIP customer, high value'
      }
    ];

    const mockConflicts = [
      {
        id: 1,
        type: 'double_booking',
        booking1: { id: 101, customer: 'Ahmed Ali', time: '18:00', service: 'Football' },
        booking2: { id: 102, customer: 'Omar Hassan', time: '18:00', service: 'Football' },
        date: '2024-01-20',
        status: 'pending',
        suggestedResolution: 'Move one booking to 19:00'
      },
      {
        id: 2,
        type: 'overlapping',
        booking1: { id: 103, customer: 'Sarah Mohamed', time: '14:00', service: 'Basketball' },
        booking2: { id: 104, customer: 'Fatima Ahmed', time: '14:30', service: 'Basketball' },
        date: '2024-01-21',
        status: 'pending',
        suggestedResolution: 'Extend first booking or move second'
      }
    ];

    dispatch({ type: 'SET_ANALYTICS', payload: mockAnalytics });
    dispatch({ type: 'SET_CUSTOMERS', payload: mockCustomers });
    dispatch({ type: 'SET_CONFLICTS', payload: mockConflicts });
  };

  const value = {
    ...state,
    dispatch,
    setAnalytics: (analytics) => dispatch({ type: 'SET_ANALYTICS', payload: analytics }),
    setRevenue: (revenue) => dispatch({ type: 'SET_REVENUE', payload: revenue }),
    setCustomers: (customers) => dispatch({ type: 'SET_CUSTOMERS', payload: customers }),
    addCustomer: (customer) => dispatch({ type: 'ADD_CUSTOMER', payload: customer }),
    updateCustomer: (customer) => dispatch({ type: 'UPDATE_CUSTOMER', payload: customer }),
    deleteCustomer: (id) => dispatch({ type: 'DELETE_CUSTOMER', payload: id }),
    setConflicts: (conflicts) => dispatch({ type: 'SET_CONFLICTS', payload: conflicts }),
    resolveConflict: (id) => dispatch({ type: 'RESOLVE_CONFLICT', payload: id }),
    setNotifications: (notifications) => dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications }),
    setSettings: (settings) => dispatch({ type: 'SET_SETTINGS', payload: settings }),
    setUI: (ui) => dispatch({ type: 'SET_UI', payload: ui }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error })
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

// Custom hook
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
