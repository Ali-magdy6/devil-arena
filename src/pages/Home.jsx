import React, { useState } from "react";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import AboutSection from "../pages/About";
import BookingSection from "../pages/Booking";
import LocationSection from "../components/Location";
import SocialSection from "../components/SocialSection";
import ScrollToTopButton from "../components/ScrollToTopButton";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import LiveChat from "../components/LiveChat";
import VirtualTour from "../components/VirtualTour";
import WeatherWidget from "../components/WeatherWidget";
import SocialFeed from "../components/SocialFeed";
import InteractiveFeaturesDemo from "../components/InteractiveFeaturesDemo";
import GamificationDashboard from "../components/GamificationDashboard";
import "../App.css"; // ستايل عام
import "../style.css"; // ملفات إضافية

function Home({ toggleDarkMode, darkMode, toggleLanguage, language, showScrollTop, t }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeSlotSelect = (date, time) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setSelectedTime(time);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <TopBar 
        toggleDarkMode={toggleDarkMode} 
        darkMode={darkMode} 
        toggleLanguage={toggleLanguage} 
        language={language} 
        t={t} 
      />
      
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} t={t} lang={language} />
      
      {/* Gamification & Engagement Dashboard */}
      <section className="section">
        <div className="container">
          <GamificationDashboard t={t} lang={language} />
        </div>
      </section>
      
      {/* Interactive Features Demo */}
      <section className="section">
        <div className="container">
          <InteractiveFeaturesDemo t={t} lang={language} />
        </div>
      </section>
      
      {/* Weather Widget */}
      <section className="section">
        <div className="container">
          <WeatherWidget t={t} lang={language} />
        </div>
      </section>

      <AboutSection t={t} lang={language} />
      
      {/* Availability Calendar */}
      <section className="section">
        <div className="container">
          <AvailabilityCalendar 
            t={t} 
            lang={language} 
            onTimeSlotSelect={handleTimeSlotSelect}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </div>
      </section>

      <BookingSection t={t} lang={language} />
      
      {/* Virtual Tour */}
      <section className="section">
        <div className="container">
          <VirtualTour t={t} lang={language} />
        </div>
      </section>

      <LocationSection t={t} lang={language} />
      
      {/* Social Media Feed */}
      <section className="section">
        <div className="container">
          <SocialFeed t={t} lang={language} />
        </div>
      </section>

      <SocialSection t={t} lang={language} />

      {/* Live Chat */}
      <LiveChat 
        t={t} 
        lang={language} 
        isOpen={isChatOpen} 
        onToggle={toggleChat} 
      />

      {showScrollTop && <ScrollToTopButton />}
    </>
  );
}

export default Home;
