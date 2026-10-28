import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, getCurrentUser } from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Nếu đã đăng nhập rồi thì đưa thẳng về trang chủ
  useEffect(() => {
    if (getCurrentUser()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 style={{textAlign: "center"}}>Đăng nhập</h2>
        <p className="auth-subtitle">
          Đăng nhập để chia sẻ và mượn đồ chơi cùng cộng đồng
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <label>Tên đăng nhập</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Mật khẩu</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button style={{marginTop: "20px"}} type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="auth-hint">
          Tài khoản demo: <strong>user1</strong> / <strong>user2</strong> / <strong>user3</strong> (mật khẩu: <strong>123456</strong>)
        </p>
      </form>
    </div>
  );
}
