import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GamificationContext = createContext();

// Initial state
const initialState = {
  user: {
    id: null,
    name: '',
    email: '',
    points: 0,
    level: 1,
    badges: [],
    referralCode: '',
    totalVisits: 0,
    totalSpent: 0,
    joinDate: null
  },
  achievements: [
    {
      id: 'first_visit',
      name: 'First Steps',
      description: 'Complete your first visit',
      icon: '🎯',
      points: 50,
      unlocked: false
    },
    {
      id: 'loyal_customer',
      name: 'Loyal Customer',
      description: 'Visit 10 times',
      icon: '⭐',
      points: 200,
      unlocked: false
    },
    {
      id: 'big_spender',
      name: 'Big Spender',
      description: 'Spend $500 total',
      icon: '💰',
      points: 300,
      unlocked: false
    },
    {
      id: 'social_butterfly',
      name: 'Social Butterfly',
      description: 'Refer 5 friends',
      icon: '🦋',
      points: 400,
      unlocked: false
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Book 5 morning sessions',
      icon: '🐦',
      points: 150,
      unlocked: false
    },
    {
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Book 5 evening sessions',
      icon: '🦉',
      points: 150,
      unlocked: false
    },
    {
      id: 'champion',
      name: 'Champion',
      description: 'Reach level 10',
      icon: '🏆',
      points: 1000,
      unlocked: false
    }
  ],
  leaderboard: [],
  photos: [],
  referralDiscounts: {
    referrer: 0.1, // 10% discount for referrer
    referee: 0.15  // 15% discount for new user
  }
};

// Reducer
const gamificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case 'ADD_POINTS': {
      const newPoints = state.user.points + action.payload;
      const newLevel = Math.floor(newPoints / 1000) + 1;
      return {
        ...state,
        user: {
          ...state.user,
          points: newPoints,
          level: newLevel
        }
      };
    }
    
    case 'UNLOCK_ACHIEVEMENT': {
      const updatedAchievements = state.achievements.map(achievement => 
        achievement.id === action.payload 
          ? { ...achievement, unlocked: true }
          : achievement
      );
      return {
        ...state,
        achievements: updatedAchievements,
        user: {
          ...state.user,
          badges: [...state.user.badges, action.payload]
        }
      };
    }
    
    case 'ADD_VISIT':
      return {
        ...state,
        user: {
          ...state.user,
          totalVisits: state.user.totalVisits + 1
        }
      };
    
    case 'ADD_SPENDING':
      return {
        ...state,
        user: {
          ...state.user,
          totalSpent: state.user.totalSpent + action.payload
        }
      };
    
    case 'UPDATE_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.payload
      };
    
    case 'ADD_PHOTO':
      return {
        ...state,
        photos: [...state.photos, action.payload]
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
export const GamificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gamificationReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('devil-arena-gamification');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading gamification data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('devil-arena-gamification', JSON.stringify(state));
  }, [state]);

  // Check and unlock achievements
  useEffect(() => {
    const checkAchievements = () => {
      state.achievements.forEach(achievement => {
        if (achievement.unlocked) return;

        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first_visit':
            shouldUnlock = state.user.totalVisits >= 1;
            break;
          case 'loyal_customer':
            shouldUnlock = state.user.totalVisits >= 10;
            break;
          case 'big_spender':
            shouldUnlock = state.user.totalSpent >= 500;
            break;
          case 'social_butterfly':
            shouldUnlock = state.user.badges.filter(badge => badge === 'referral').length >= 5;
            break;
          case 'early_bird':
            shouldUnlock = state.user.badges.filter(badge => badge === 'morning_booking').length >= 5;
            break;
          case 'night_owl':
            shouldUnlock = state.user.badges.filter(badge => badge === 'evening_booking').length >= 5;
            break;
          case 'champion':
            shouldUnlock = state.user.level >= 10;
            break;
        }

        if (shouldUnlock) {
          dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement.id });
          dispatch({ type: 'ADD_POINTS', payload: achievement.points });
        }
      });
    };

    checkAchievements();
  }, [state.user.totalVisits, state.user.totalSpent, state.user.level, state.user.badges]);

  const value = {
    ...state,
    dispatch,
    addPoints: (points) => dispatch({ type: 'ADD_POINTS', payload: points }),
    addVisit: () => dispatch({ type: 'ADD_VISIT' }),
    addSpending: (amount) => dispatch({ type: 'ADD_SPENDING', payload: amount }),
    addPhoto: (photo) => dispatch({ type: 'ADD_PHOTO', payload: photo }),
    updateLeaderboard: (leaderboard) => dispatch({ type: 'UPDATE_LEADERBOARD', payload: leaderboard })
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

// Custom hook
export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export default GamificationContext;
