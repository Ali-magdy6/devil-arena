import React from "react";
import { Link } from "react-router-dom";

export default function TopBar({ 
  toggleDarkMode, 
  darkMode, 
  toggleLanguage, 
  language, 
  t 
}) {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div className="top-bar-left">
          {/* Empty space for future logo or branding */}
        </div>
        
        <div className="top-bar-right">
          {/* Language Toggle Button */}
          <button 
            onClick={toggleLanguage} 
            className="modern-icon-btn language-btn"
            title={language === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span className="btn-text">{language === "en" ? "عربي" : "EN"}</span>
          </button>

          {/* Dark Mode Toggle Button */}
          <button 
            onClick={toggleDarkMode} 
            className="modern-icon-btn dark-mode-btn"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
            <span className="btn-text">{darkMode ? "Light" : "Dark"}</span>
          </button>

          {/* Admin Button */}
          <Link 
            to="/admin" 
            className="modern-icon-btn admin-btn"
            title="Admin Panel"
          >
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <path d="M9 9h6v6H9z"/>
              <path d="M9 1v6M15 1v6M9 17v6M15 17v6M1 9h6M17 9h6M1 15h6M17 15h6"/>
            </svg>
            <span className="btn-text">Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
