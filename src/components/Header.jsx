import React from "react";
// import { Link } from "react-router-dom";

// Header component with translation support
export default function Header({ t }) {
  return (
    <header className="header">
      <img
        src={require("../images/logo-removebg-preview.png")}
        alt={t.header?.logoAlt || "Devil Arena Logo"}
        className="logo"
      />
      <div className="title-container">
        <h1 className="title">{t.header?.title || "Devil Arena"}</h1>
        <p className="subtitle">
          {t.header?.subtitle || t.welcome}
        </p>
      </div>
    </header>
  );
}
