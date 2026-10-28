import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
           ToyShare
        </Link>

        <div className="navbar-links">
          <Link to="/">Trang chủ</Link>
          {user && (
            <>
              <Link to="/add-toy">Thêm đồ chơi</Link>
              <Link to="/my-toys">Đồ chơi của tôi</Link>
              <Link to="/borrow-list">Mượn / Trả</Link>
            </>
          )}
        </div>

        <div className="navbar-auth">
          {user ? (
            <>
              <span className="navbar-user">{user.name}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
