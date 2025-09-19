import React, { useState } from 'react';
import LoyaltyPoints from './LoyaltyPoints';
import AchievementBadges from './AchievementBadges';
import ReferralProgram from './ReferralProgram';
import Leaderboard from './Leaderboard';
import PhotoGallery from './PhotoGallery';
import '../style.css';

const GamificationDashboard = ({ t, lang }) => {
  const [activeTab, setActiveTab] = useState('points');

  const tabs = [
    {
      id: 'points',
      name: lang === 'ar' ? 'النقاط' : 'Points',
      icon: '⭐',
      component: LoyaltyPoints
    },
    {
      id: 'badges',
      name: lang === 'ar' ? 'الشارات' : 'Badges',
      icon: '🏆',
      component: AchievementBadges
    },
    {
      id: 'referral',
      name: lang === 'ar' ? 'الإحالة' : 'Referral',
      icon: '🎁',
      component: ReferralProgram
    },
    {
      id: 'leaderboard',
      name: lang === 'ar' ? 'المتصدرين' : 'Leaderboard',
      icon: '🏅',
      component: Leaderboard
    },
    {
      id: 'gallery',
      name: lang === 'ar' ? 'المعرض' : 'Gallery',
      icon: '📸',
      component: PhotoGallery
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="gamification-dashboard">
      <div className="dashboard-header">
        <h2>{lang === 'ar' ? 'نظام الترفيه والتفاعل' : 'Gamification & Engagement'}</h2>
        <p className="dashboard-subtitle">
          {lang === 'ar' 
            ? 'اكسب النقاط، احصل على الشارات، وشارك في التحديات!' 
            : 'Earn points, get badges, and join the challenges!'
          }
        </p>
      </div>

      <div className="dashboard-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-name">{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {ActiveComponent && (
          <ActiveComponent t={t} lang={lang} />
        )}
      </div>

      {/* Quick Stats Overview */}
      <div className="quick-stats">
        <div className="stats-header">
          <h4>{lang === 'ar' ? 'نظرة سريعة' : 'Quick Overview'}</h4>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">{lang === 'ar' ? 'النقاط' : 'Points'}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">{lang === 'ar' ? 'الشارات' : 'Badges'}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">{lang === 'ar' ? 'الإحالات' : 'Referrals'}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📸</div>
            <div className="stat-content">
              <div className="stat-number">0</div>
              <div className="stat-label">{lang === 'ar' ? 'الصور' : 'Photos'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationDashboard;
