import React, { createContext, useReducer, useContext } from "react";

// 1- initial state
const initialState = {
  bookings: [],
  pendingBooking: null, // ✅ علشان نحفظ الحجز قبل الدفع
  loading: false,
  error: null,
};

// 2- reducer
function bookingReducer(state, action) {
  switch (action.type) {
    case "ADD_BOOKING_START":
      return { ...state, loading: true, error: null };

    case "ADD_BOOKING_READY": // ✅ الحجز قبل الدفع
      return {
        ...state,
        loading: false,
        pendingBooking: action.payload,
        error: null,
      };

    case "ADD_BOOKING_CONFIRMED": // ✅ بعد الدفع
      return {
        ...state,
        bookings: [...state.bookings, action.payload],
        pendingBooking: null,
        loading: false,
      };

    case "ADD_BOOKING_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

// 3- context
const BookingContext = createContext();

// 4- provider
export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

// 5- hook
export function useBooking() {
  return useContext(BookingContext);
}
