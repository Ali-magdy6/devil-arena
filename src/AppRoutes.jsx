import React from "react";
import { Routes, Route } from "react-router-dom";

// استيراد الصفحات أو المكونات
import Home from "./pages/Home";
import About from "./pages/About";
import Booking from "./pages/Booking";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/Login";  // تأكد من وجود هذا الملف
import NotFound from "./pages/NotFound";

function AppRoutes({ toggleDarkMode, darkMode, toggleLanguage, language, showScrollTop, t }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
            toggleLanguage={toggleLanguage}
            language={language}
            showScrollTop={showScrollTop}
            t={t}
          />
        }
      />
      <Route path="/about" element={<About t={t} language={language} />} />
      <Route path="/booking" element={<Booking t={t} language={language} />} />
      <Route path="/login" element={<Login t={t} language={language} />} /> {/* إضافة صفحة تسجيل الدخول */}
      <Route path="/admin" element={<AdminPage darkMode={darkMode} t={t} lang={language} toggleLanguage={toggleLanguage} />} />
      <Route path="*" element={<NotFound t={t} language={language} />} />
    </Routes>
  );
}

export default AppRoutes;
