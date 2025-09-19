import React, { useState, useRef } from 'react';
import './VirtualTour.css';

const VirtualTour = ({ t }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  // Single main field image (no slides)
  const mainField = {
    name: t.mainField || "الملعب الرئيسي",
    description: t.mainFieldDesc || "ملعب كرة القدم الرئيسي مع إضاءة LED حديثة",
    image: "/images/playground.jpg",
    hotspots: [
      { x: 30, y: 40, title: t.goalPost || "مرمى", description: t.goalPostDesc || "مرمى احترافي" },
      { x: 70, y: 60, title: t.bleachers || "المدرجات", description: t.bleachersDesc || "مدرجات مريحة" },
      { x: 50, y: 20, title: t.lighting || "الإضاءة", description: t.lightingDesc || "إضاءة LED عالية الجودة" }
    ]
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleHotspotClick = (hotspot) => {
    alert(`${hotspot.title}: ${hotspot.description}`);
  };

  return (
    <div className="virtual-tour-container">
      <div className="tour-header">
        <h2 className="tour-title">
          {t.virtualTourTitle || "جولة افتراضية 360°"}
        </h2>
        <p className="tour-subtitle">
          {t.virtualTourSubtitle || "استكشف ديفيل أرينا من كل الزوايا"}
        </p>
      </div>

      <div 
        ref={containerRef}
        className={`tour-viewer ${isFullscreen ? 'fullscreen' : ''}`}
      >
        <div className="image-container">
          <img
            src={mainField.image}
            alt={mainField.name}
            className={`tour-image ${isLoading ? 'loading' : ''}`}
            onLoad={() => setIsLoading(false)}
          />
          
          {/* Hotspots */}
          {mainField.hotspots.map((hotspot, index) => (
            <div
              key={index}
              className="hotspot"
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`
              }}
              onClick={() => handleHotspotClick(hotspot)}
              title={hotspot.title}
            >
              <div className="hotspot-pulse"></div>
              <div className="hotspot-icon">📍</div>
            </div>
          ))}

          {/* Loading overlay */}
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>

        {/* Fullscreen toggle */}
        <button 
          className="fullscreen-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? (t.exitFullscreen || "خروج من وضع ملء الشاشة") : (t.fullscreen || "ملء الشاشة")}
        >
          {isFullscreen ? '⤓' : '⤢'}
        </button>
      </div>

      {/* Tour information */}
      <div className="tour-info">
        <h3 className="current-area-title">{mainField.name}</h3>
        <p className="current-area-description">{mainField.description}</p>
        
        <div className="tour-stats">
          <div className="stat">
            <span className="stat-number">1</span>
            <span className="stat-label">{t.area || "منطقة"}</span>
          </div>
          <div className="stat">
            <span className="stat-number">360°</span>
            <span className="stat-label">{t.view || "عرض"}</span>
          </div>
          <div className="stat">
            <span className="stat-number">HD</span>
            <span className="stat-label">{t.quality || "جودة"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;
