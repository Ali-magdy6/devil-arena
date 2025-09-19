import React, { useState } from 'react';
import './InteractiveFeaturesDemo.css';

const InteractiveFeaturesDemo = ({ t }) => {
  const [activeFeature, setActiveFeature] = useState('calendar');

  const features = [
    {
      id: 'calendar',
      title: t.calendarTitle || 'Real-time Availability Calendar',
      description: t.calendarDesc || 'Interactive calendar with visual time slots showing availability',
      icon: '📅',
      color: '#ff0000'
    },
    {
      id: 'chat',
      title: t.chatTitle || 'Live Chat Support',
      description: t.chatDesc || 'Instant customer service with AI-powered responses',
      icon: '💬',
      color: '#00ff00'
    },
    {
      id: 'tour',
      title: t.tourTitle || '360° Virtual Tour',
      description: t.tourDesc || 'Immersive virtual experience of the arena',
      icon: '🏟️',
      color: '#0066ff'
    },
    {
      id: 'weather',
      title: t.weatherTitle || 'Weather Integration',
      description: t.weatherDesc || 'Real-time weather conditions and recommendations',
      icon: '🌤️',
      color: '#ff6600'
    },
    {
      id: 'social',
      title: t.socialTitle || 'Social Media Feed',
      description: t.socialDesc || 'Latest posts and activities from social platforms',
      icon: '📱',
      color: '#9900ff'
    }
  ];

  return (
    <div className="interactive-features-demo">
      <div className="demo-header">
        <h2 className="demo-title">
          {t.demoTitle || '🎮 Interactive Features'}
        </h2>
        <p className="demo-subtitle">
          {t.demoSubtitle || 'Experience the future of arena booking'}
        </p>
      </div>

      <div className="features-grid">
        {features.map(feature => (
          <div
            key={feature.id}
            className={`feature-card ${activeFeature === feature.id ? 'active' : ''}`}
            onClick={() => setActiveFeature(feature.id)}
            style={{ '--feature-color': feature.color }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
            <div className="feature-indicator"></div>
          </div>
        ))}
      </div>

      <div className="feature-showcase">
        <div className="showcase-content">
          <h3 className="showcase-title">
            {features.find(f => f.id === activeFeature)?.title}
          </h3>
          <p className="showcase-description">
            {features.find(f => f.id === activeFeature)?.description}
          </p>
          
          <div className="feature-benefits">
            <h4>{t.benefits || 'Key Benefits'}:</h4>
            <ul>
              {activeFeature === 'calendar' && (
                <>
                  <li>{t.calendarBenefit1 || 'Real-time availability updates'}</li>
                  <li>{t.calendarBenefit2 || 'Visual time slot selection'}</li>
                  <li>{t.calendarBenefit3 || 'Prevent double bookings'}</li>
                </>
              )}
              {activeFeature === 'chat' && (
                <>
                  <li>{t.chatBenefit1 || '24/7 instant support'}</li>
                  <li>{t.chatBenefit2 || 'AI-powered responses'}</li>
                  <li>{t.chatBenefit3 || 'Quick reply suggestions'}</li>
                </>
              )}
              {activeFeature === 'tour' && (
                <>
                  <li>{t.tourBenefit1 || '360° immersive experience'}</li>
                  <li>{t.tourBenefit2 || 'Interactive hotspots'}</li>
                  <li>{t.tourBenefit3 || 'Fullscreen viewing'}</li>
                </>
              )}
              {activeFeature === 'weather' && (
                <>
                  <li>{t.weatherBenefit1 || 'Real-time weather data'}</li>
                  <li>{t.weatherBenefit2 || 'Smart recommendations'}</li>
                  <li>{t.weatherBenefit3 || 'Outdoor condition alerts'}</li>
                </>
              )}
              {activeFeature === 'social' && (
                <>
                  <li>{t.socialBenefit1 || 'Live social updates'}</li>
                  <li>{t.socialBenefit2 || 'Multi-platform integration'}</li>
                  <li>{t.socialBenefit3 || 'Interactive engagement'}</li>
                </>
              )}
            </ul>
          </div>

          <div className="feature-stats">
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">{t.uptime || 'Uptime'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">{t.support || 'Support'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">HD</span>
              <span className="stat-label">{t.quality || 'Quality'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveFeaturesDemo;
