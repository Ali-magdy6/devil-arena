import React, { useState, useEffect } from 'react';
import { useGamification } from '../context/GamificationContext';
import '../style.css';

const Leaderboard = ({ lang }) => {
  const { user, leaderboard, updateLeaderboard } = useGamification();
  const [timeFilter, setTimeFilter] = useState('all'); // all, week, month
  const [categoryFilter, setCategoryFilter] = useState('points'); // points, visits, spending

  useEffect(() => {
    // Generate mock leaderboard data
    const generateLeaderboard = () => {
      const mockUsers = [
        { id: 1, name: 'Ahmed Ali', points: 2500, visits: 15, spending: 1200, level: 3, avatar: '👨‍💼' },
        { id: 2, name: 'Sarah Mohamed', points: 2200, visits: 12, spending: 980, level: 2, avatar: '👩‍💼' },
        { id: 3, name: 'Omar Hassan', points: 1800, visits: 10, spending: 750, level: 2, avatar: '👨‍🎓' },
        { id: 4, name: 'Fatima Ahmed', points: 1600, visits: 8, spending: 650, level: 2, avatar: '👩‍🎨' },
        { id: 5, name: 'Youssef Ibrahim', points: 1400, visits: 7, spending: 580, level: 1, avatar: '👨‍🔬' },
        { id: 6, name: 'Aisha Khalil', points: 1200, visits: 6, spending: 520, level: 1, avatar: '👩‍⚕️' },
        { id: 7, name: 'Mohamed Tarek', points: 1000, visits: 5, spending: 450, level: 1, avatar: '👨‍💻' },
        { id: 8, name: 'Nour El-Din', points: 800, visits: 4, spending: 380, level: 1, avatar: '👩‍🏫' },
        { id: 9, name: 'Karim Farouk', points: 600, visits: 3, spending: 300, level: 1, avatar: '👨‍🎨' },
        { id: 10, name: 'Layla Mansour', points: 400, visits: 2, spending: 200, level: 1, avatar: '👩‍💼' }
      ];

      // Add current user if not in the list
      const currentUserInList = mockUsers.find(u => u.id === user.id);
      if (!currentUserInList && user.id) {
        mockUsers.push({
          id: user.id,
          name: user.name || 'You',
          points: user.points,
          visits: user.totalVisits,
          spending: user.totalSpent,
          level: user.level,
          avatar: '👤',
          isCurrentUser: true
        });
      }

      return mockUsers;
    };

    const generatedLeaderboard = generateLeaderboard();
    updateLeaderboard(generatedLeaderboard);
  }, [user, updateLeaderboard]);

  const getSortedLeaderboard = () => {
    if (!leaderboard.length) return [];

    const sorted = [...leaderboard].sort((a, b) => {
      switch (categoryFilter) {
        case 'points':
          return b.points - a.points;
        case 'visits':
          return b.visits - a.visits;
        case 'spending':
          return b.spending - a.spending;
        default:
          return b.points - a.points;
      }
    });

    return sorted;
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      points: lang === 'ar' ? 'النقاط' : 'Points',
      visits: lang === 'ar' ? 'الزيارات' : 'Visits',
      spending: lang === 'ar' ? 'الإنفاق' : 'Spending'
    };
    return labels[category] || labels.points;
  };

  // const getTimeFilterLabel = (filter) => {
  //   const labels = {
  //     all: lang === 'ar' ? 'كل الأوقات' : 'All Time',
  //     week: lang === 'ar' ? 'هذا الأسبوع' : 'This Week',
  //     month: lang === 'ar' ? 'هذا الشهر' : 'This Month'
  //   };
  //   return labels[filter] || labels.all;
  // };

  const sortedLeaderboard = getSortedLeaderboard();

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-card">
        <div className="leaderboard-header">
          <h3>{lang === 'ar' ? 'لوحة المتصدرين' : 'Leaderboard'}</h3>
          <div className="leaderboard-icon">🏆</div>
        </div>

        {/* Filters */}
        <div className="leaderboard-filters">
          <div className="filter-group">
            <label>{lang === 'ar' ? 'التصنيف:' : 'Category:'}</label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="points">{lang === 'ar' ? 'النقاط' : 'Points'}</option>
              <option value="visits">{lang === 'ar' ? 'الزيارات' : 'Visits'}</option>
              <option value="spending">{lang === 'ar' ? 'الإنفاق' : 'Spending'}</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>{lang === 'ar' ? 'الفترة:' : 'Time:'}</label>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">{lang === 'ar' ? 'كل الأوقات' : 'All Time'}</option>
              <option value="week">{lang === 'ar' ? 'هذا الأسبوع' : 'This Week'}</option>
              <option value="month">{lang === 'ar' ? 'هذا الشهر' : 'This Month'}</option>
            </select>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="leaderboard-list">
          {sortedLeaderboard.map((player, index) => {
            const rank = index + 1;
            const isCurrentUser = player.isCurrentUser || player.id === user.id;
            const value = player[categoryFilter];

            return (
              <div 
                key={player.id} 
                className={`leaderboard-item ${isCurrentUser ? 'current-user' : ''}`}
              >
                <div className="rank">
                  {getRankIcon(rank)}
                </div>
                
                <div className="player-avatar">
                  {player.avatar}
                </div>
                
                <div className="player-info">
                  <div className="player-name">
                    {player.name}
                    {isCurrentUser && (
                      <span className="you-badge">
                        {lang === 'ar' ? 'أنت' : 'You'}
                      </span>
                    )}
                  </div>
                  <div className="player-level">
                    {lang === 'ar' ? 'المستوى' : 'Level'} {player.level}
                  </div>
                </div>
                
                <div className="player-stats">
                  <div className="stat-value">
                    {categoryFilter === 'spending' ? `$${value}` : value.toLocaleString()}
                  </div>
                  <div className="stat-label">
                    {getCategoryLabel(categoryFilter)}
                  </div>
                </div>
                
                {rank <= 3 && (
                  <div className="medal">
                    {getRankIcon(rank)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Current User Stats */}
        {user.id && (
          <div className="current-user-stats">
            <h4>{lang === 'ar' ? 'إحصائياتك' : 'Your Stats'}</h4>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-number">{user.points.toLocaleString()}</div>
                  <div className="stat-label">{lang === 'ar' ? 'النقاط' : 'Points'}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🏃</div>
                <div className="stat-content">
                  <div className="stat-number">{user.totalVisits}</div>
                  <div className="stat-label">{lang === 'ar' ? 'الزيارات' : 'Visits'}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <div className="stat-number">${user.totalSpent}</div>
                  <div className="stat-label">{lang === 'ar' ? 'الإنفاق' : 'Spent'}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎖️</div>
                <div className="stat-content">
                  <div className="stat-number">{user.level}</div>
                  <div className="stat-label">{lang === 'ar' ? 'المستوى' : 'Level'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
