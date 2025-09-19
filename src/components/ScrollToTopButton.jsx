// 🟦 هذا الكومبننت مسؤول عن زر الرجوع لأعلى الصفحة عند التمرير لأسفل، ويظهر فقط عند التمرير
import React from "react";

function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className="scroll-to-top"
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 1000,
        backgroundColor: "#333",
        border: "none",
        borderRadius: "50%",
        padding: "10px",
        cursor: "pointer",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}

export default ScrollToTopButton;
