import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import "./index.css";
import "./style.css";
import "./App.css";

import AppRoutes from "./AppRoutes"; // ✅ ملف الروتس
import { BookingProvider } from "./context/BookingContext";
import { GamificationProvider } from "./context/GamificationContext";
import { AdminProvider } from "./context/AdminContext";
import translations from "./translations";

// Mobile-first services
import pwaService from "./services/pwaService";
import notificationService from "./services/notificationService";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);

    // Load saved language from localStorage
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLanguage(savedLang);

    // Initialize mobile-first services
    const initializeMobileServices = async () => {
      try {
        // Initialize PWA service
        pwaService.init();
        
        // Initialize notification service
        await notificationService.init();
        
        // Request notification permission
        if (notificationService.isSupported) {
          await notificationService.requestPermission();
        }
      } catch (error) {
        console.log('Mobile services initialization:', error);
      }
    };

    initializeMobileServices();

    const timer = setTimeout(() => setLoading(false), 2000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (loading) {
    return (
      <div className="splash-screen">
        <img
          src={require("./images/logo-removebg-preview.png")}
          alt="Devil Arena"
          className="splash-logo"
        />
        <p>Loading...</p>
      </div>
    );
  }

  const t = translations[language];
  const themeClass = darkMode ? "dark-mode" : "light-mode";
  const directionClass = language === "ar" ? "rtl" : "ltr";

  return (
    <BookingProvider>
      <GamificationProvider>
        <AdminProvider>
          <BrowserRouter>
            <div className={`${themeClass} ${directionClass}`}>
              <AppRoutes
                toggleDarkMode={toggleDarkMode}
                darkMode={darkMode}
                toggleLanguage={toggleLanguage}
                language={language}
                showScrollTop={showScrollTop}
                t={t}
              />
              <PWAInstallPrompt />
            </div>
          </BrowserRouter>
        </AdminProvider>
      </GamificationProvider>
    </BookingProvider>
  );
}

export default App;
