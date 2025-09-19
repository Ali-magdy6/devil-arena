import React from 'react';
import { useGamification } from '../context/GamificationContext';
import '../style.css';

const LoyaltyPoints = ({ lang }) => {
  const { user, addPoints } = useGamification();

  const getLevelInfo = (level) => {
    const levelThresholds = [
      { level: 1, name: 'Rookie', color: '#8B4513', nextLevel: 1000 },
      { level: 2, name: 'Player', color: '#C0C0C0', nextLevel: 2000 },
      { level: 3, name: 'Pro', color: '#FFD700', nextLevel: 3000 },
      { level: 4, name: 'Expert', color: '#FF6B6B', nextLevel: 4000 },
      { level: 5, name: 'Master', color: '#4ECDC4', nextLevel: 5000 },
      { level: 6, name: 'Legend', color: '#45B7D1', nextLevel: 6000 },
      { level: 7, name: 'Elite', color: '#96CEB4', nextLevel: 7000 },
      { level: 8, name: 'Champion', color: '#FFEAA7', nextLevel: 8000 },
      { level: 9, name: 'Hero', color: '#DDA0DD', nextLevel: 9000 },
      { level: 10, name: 'God', color: '#FF6347', nextLevel: null }
    ];

    return levelThresholds.find(l => l.level === level) || levelThresholds[0];
  };

  const currentLevel = getLevelInfo(user.level);
  const pointsToNext = currentLevel.nextLevel ? currentLevel.nextLevel - user.points : 0;
  const progressPercentage = currentLevel.nextLevel ? 
    ((user.points % 1000) / 1000) * 100 : 100;

  const earnPoints = (activity, amount) => {
    const pointValues = {
      visit: 50,
      booking: 100,
      referral: 200,
      review: 25,
      social_share: 15,
      photo_upload: 30
    };

    const points = pointValues[activity] || amount || 0;
    addPoints(points);
    
    // Show notification
    if (window.showNotification) {
      window.showNotification(
        lang === 'ar' ? `+${points} نقطة!` : `+${points} Points!`,
        lang === 'ar' ? `لقد حصلت على ${points} نقطة` : `You earned ${points} points`
      );
    }
  };

  return (
    <div className="loyalty-points-container">
      <div className="loyalty-card">
        <div className="loyalty-header">
          <h3>{lang === 'ar' ? 'نظام النقاط' : 'Loyalty Points'}</h3>
          <div className="level-badge" style={{ backgroundColor: currentLevel.color }}>
            {currentLevel.name}
          </div>
        </div>
        
        <div className="points-display">
          <div className="current-points">
            <span className="points-number">{user.points.toLocaleString()}</span>
            <span className="points-label">{lang === 'ar' ? 'نقطة' : 'Points'}</span>
          </div>
          
          {currentLevel.nextLevel && (
            <div className="level-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${progressPercentage}%`,
                    backgroundColor: currentLevel.color 
                  }}
                ></div>
              </div>
              <div className="progress-text">
                {lang === 'ar' ? 
                  `${pointsToNext} نقطة للوصول للمستوى ${user.level + 1}` :
                  `${pointsToNext} points to level ${user.level + 1}`
                }
              </div>
            </div>
          )}
        </div>

        <div className="points-actions">
          <h4>{lang === 'ar' ? 'كيفية كسب النقاط:' : 'How to earn points:'}</h4>
          <div className="earn-methods">
            <div className="earn-method">
              <span className="method-icon">🏃</span>
              <span className="method-text">
                {lang === 'ar' ? 'زيارة الموقع' : 'Visit the arena'} - 50 {lang === 'ar' ? 'نقطة' : 'pts'}
              </span>
              <button 
                className="earn-btn"
                onClick={() => earnPoints('visit')}
              >
                {lang === 'ar' ? 'كسب' : 'Earn'}
              </button>
            </div>
            
            <div className="earn-method">
              <span className="method-icon">📅</span>
              <span className="method-text">
                {lang === 'ar' ? 'حجز موعد' : 'Book a session'} - 100 {lang === 'ar' ? 'نقطة' : 'pts'}
              </span>
              <button 
                className="earn-btn"
                onClick={() => earnPoints('booking')}
              >
                {lang === 'ar' ? 'كسب' : 'Earn'}
              </button>
            </div>
            
            <div className="earn-method">
              <span className="method-icon">👥</span>
              <span className="method-text">
                {lang === 'ar' ? 'إحالة صديق' : 'Refer a friend'} - 200 {lang === 'ar' ? 'نقطة' : 'pts'}
              </span>
              <button 
                className="earn-btn"
                onClick={() => earnPoints('referral')}
              >
                {lang === 'ar' ? 'كسب' : 'Earn'}
              </button>
            </div>
            
            <div className="earn-method">
              <span className="method-icon">⭐</span>
              <span className="method-text">
                {lang === 'ar' ? 'كتابة تقييم' : 'Write a review'} - 25 {lang === 'ar' ? 'نقطة' : 'pts'}
              </span>
              <button 
                className="earn-btn"
                onClick={() => earnPoints('review')}
              >
                {lang === 'ar' ? 'كسب' : 'Earn'}
              </button>
            </div>
          </div>
        </div>

        <div className="points-rewards">
          <h4>{lang === 'ar' ? 'المكافآت المتاحة:' : 'Available Rewards:'}</h4>
          <div className="rewards-grid">
            <div className="reward-item">
              <span className="reward-cost">500 {lang === 'ar' ? 'نقطة' : 'pts'}</span>
              <span className="reward-name">{lang === 'ar' ? 'خصم 10%' : '10% Discount'}</span>
            </div>
            <div className="reward-item">
              <span className="reward-cost">1000 {lang === 'ar' ? 'نقطة' : 'pts'}</span>
              <span className="reward-name">{lang === 'ar' ? 'جلسة مجانية' : 'Free Session'}</span>
            </div>
            <div className="reward-item">
              <span className="reward-cost">2000 {lang === 'ar' ? 'نقطة' : 'pts'}</span>
              <span className="reward-name">{lang === 'ar' ? 'خصم 25%' : '25% Discount'}</span>
            </div>
            <div className="reward-item">
              <span className="reward-cost">5000 {lang === 'ar' ? 'نقطة' : 'pts'}</span>
              <span className="reward-name">{lang === 'ar' ? 'عضو VIP' : 'VIP Membership'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPoints;
