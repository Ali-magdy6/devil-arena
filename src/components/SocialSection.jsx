// 🟦 هذا الكومبننت مسؤول عن عرض أيقونات التواصل الاجتماعي مثل واتساب وفيسبوك وإنستجرام وتيك توك
import React from "react";

function SocialSection() {
  return (
    <section className="social-section">
      {/* أيقونة واتساب العائمة */}
      <a
        href="https://wa.me/201234567890"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <img
          src="/images/whatsapp-icon.png.png"
          alt="WhatsApp"
          style={{ width: "50px" }}
        />
      </a>

      {/* روابط السوشيال ميديا داخل بوكس داخلي */}
      <div className="section-box">
        <div className="social-icons">
          <a
            href="https://facebook.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/facebook-icon.png.png" alt="Facebook" />
          </a>
          <a
            href="https://instagram.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/instgram-icon.png.png" alt="Instagram" />
          </a>
          <a
            href="https://tiktok.com/@yourpage"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/tiktok-icon.png.png" alt="TikTok" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default SocialSection;
