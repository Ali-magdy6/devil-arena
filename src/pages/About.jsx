// 🟦 هذا الكومبننت مسؤول عن عرض قسم التعريف بـ Devil Arena، ويحتوي على عنوان ووصف وصورة الملعب
import React from "react";

function AboutSection({ t }) {
  return (
    <section className="about-section" data-aos="fade-up">
      <div className="section-box">
        <h2>{t.about_title}</h2>
        <p>{t.about_description}</p>
        <img
          src="/images/playground.jpg"
          alt={t.pitch_image_alt}
          className="pitch-img"
        />
      </div>
    </section>
  );
}

export default AboutSection;
