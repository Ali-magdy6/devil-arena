import React from "react";

function LocationSection({ t }) {
  return (
    <section className="location-section">
      <div className="section-box">
        <h2>{t.location?.title || "Location"}</h2>
        <p>{t.location?.address || "123 Football Street, Cairo, Egypt"}</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18..."
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: "10px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Devil Arena Location"
        ></iframe>
      </div>
    </section>
  );
}

export default LocationSection;
