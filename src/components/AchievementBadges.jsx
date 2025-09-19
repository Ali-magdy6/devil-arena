import React, { useState } from 'react';
import { useGamification } from '../context/GamificationContext';
import '../style.css';

const AchievementBadges = ({ lang }) => {
  const { achievements, user } = useGamification();
  const [selectedBadge, setSelectedBadge] = useState(null);

  const getUnlockedBadges = () => {
    return achievements.filter(achievement => achievement.unlocked);
  };

  // const getLockedBadges = () => {
  //   return achievements.filter(achievement => !achievement.unlocked);
  // };

  const getProgressForBadge = (badgeId) => {
    switch (badgeId) {
      case 'first_visit':
        return Math.min((user.totalVisits / 1) * 100, 100);
      case 'loyal_customer':
        return Math.min((user.totalVisits / 10) * 100, 100);
      case 'big_spender':
        return Math.min((user.totalSpent / 500) * 100, 100);
      case 'social_butterfly': {
        const referrals = user.badges.filter(badge => badge === 'referral').length;
        return Math.min((referrals / 5) * 100, 100);
      }
      case 'early_bird': {
        const morningBookings = user.badges.filter(badge => badge === 'morning_booking').length;
        return Math.min((morningBookings / 5) * 100, 100);
      }
      case 'night_owl': {
        const eveningBookings = user.badges.filter(badge => badge === 'evening_booking').length;
        return Math.min((eveningBookings / 5) * 100, 100);
      }
      case 'champion':
        return Math.min((user.level / 10) * 100, 100);
      default:
        return 0;
    }
  };

  const getBadgeDescription = (badgeId) => {
    const descriptions = {
      first_visit: lang === 'ar' ? 'أكمل زيارتك الأولى' : 'Complete your first visit',
      loyal_customer: lang === 'ar' ? 'قم بـ 10 زيارات' : 'Make 10 visits',
      big_spender: lang === 'ar' ? 'أنفق $500 إجمالي' : 'Spend $500 total',
      social_butterfly: lang === 'ar' ? 'أحِد 5 أصدقاء' : 'Refer 5 friends',
      early_bird: lang === 'ar' ? 'احجز 5 جلسات صباحية' : 'Book 5 morning sessions',
      night_owl: lang === 'ar' ? 'احجز 5 جلسات مسائية' : 'Book 5 evening sessions',
      champion: lang === 'ar' ? 'وصل للمستوى 10' : 'Reach level 10'
    };
    return descriptions[badgeId] || '';
  };

  const getBadgeProgress = (badgeId) => {
    // const progress = getProgressForBadge(badgeId);
    switch (badgeId) {
      case 'first_visit':
        return `${user.totalVisits}/1`;
      case 'loyal_customer':
        return `${user.totalVisits}/10`;
      case 'big_spender':
        return `$${user.totalSpent}/$500`;
      case 'social_butterfly': {
        const referrals = user.badges.filter(badge => badge === 'referral').length;
        return `${referrals}/5`;
      }
      case 'early_bird': {
        const morningBookings = user.badges.filter(badge => badge === 'morning_booking').length;
        return `${morningBookings}/5`;
      }
      case 'night_owl': {
        const eveningBookings = user.badges.filter(badge => badge === 'evening_booking').length;
        return `${eveningBookings}/5`;
      }
      case 'champion':
        return `${user.level}/10`;
      default:
        return '0/1';
    }
  };

  return (
    <div className="achievement-badges-container">
      <div className="badges-header">
        <h3>{lang === 'ar' ? 'شارات الإنجاز' : 'Achievement Badges'}</h3>
        <div className="badges-stats">
          <span className="unlocked-count">
            {getUnlockedBadges().length}/{achievements.length} {lang === 'ar' ? 'مفتوح' : 'Unlocked'}
          </span>
        </div>
      </div>

      <div className="badges-grid">
        {achievements.map((achievement) => {
          const isUnlocked = achievement.unlocked;
          const progress = getProgressForBadge(achievement.id);
          const progressText = getBadgeProgress(achievement.id);

          return (
            <div 
              key={achievement.id}
              className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => setSelectedBadge(achievement)}
            >
              <div className="badge-icon">
                {isUnlocked ? achievement.icon : '🔒'}
              </div>
              
              <div className="badge-info">
                <h4 className="badge-name">{achievement.name}</h4>
                <p className="badge-description">
                  {isUnlocked ? achievement.description : getBadgeDescription(achievement.id)}
                </p>
                
                {!isUnlocked && (
                  <div className="badge-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{progressText}</span>
                  </div>
                )}
                
                <div className="badge-points">
                  +{achievement.points} {lang === 'ar' ? 'نقطة' : 'pts'}
                </div>
              </div>

              {isUnlocked && (
                <div className="unlocked-indicator">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="badge-modal-overlay" onClick={() => setSelectedBadge(null)}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedBadge.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedBadge(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-icon">
                {selectedBadge.unlocked ? selectedBadge.icon : '🔒'}
              </div>
              
              <p className="modal-description">
                {selectedBadge.unlocked ? 
                  selectedBadge.description : 
                  getBadgeDescription(selectedBadge.id)
                }
              </p>
              
              <div className="modal-points">
                +{selectedBadge.points} {lang === 'ar' ? 'نقطة' : 'points'}
              </div>
              
              {!selectedBadge.unlocked && (
                <div className="modal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${getProgressForBadge(selectedBadge.id)}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {getBadgeProgress(selectedBadge.id)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadges;
