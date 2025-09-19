import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css"; // لو حابب تضيف شوية ستايل خارجي

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>الصفحة غير موجودة</p>
      <Link to="/" className="back-home">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}

export default NotFound;
