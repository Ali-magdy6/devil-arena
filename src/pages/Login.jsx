import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // بيانات الدخول (يمكن تغييرها أو استبدالها بالتحقق من API لاحقًا)
    const validUsername = "Weka";
    const validPassword = "123Weka";

    // مقارنة غير حساسة لحالة الأحرف
    if (
      username.trim().toLowerCase() === validUsername.toLowerCase() &&
      password === validPassword
    ) {
      localStorage.setItem("isAdmin", "true");
      alert("✅ تم تسجيل الدخول بنجاح");
      navigate("/admin");
    } else {
      alert("❌ اسم المستخدم أو كلمة السر غير صحيحة");
    }
  };

  return (
    <div className="login-container">
      <h2>تسجيل دخول الأدمن</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="كلمة السر"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">تسجيل الدخول</button>
      </form>
    </div>
  );
}

export default Login;
