import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/api";

// Bọc quanh các trang yêu cầu đăng nhập.
// Nếu chưa đăng nhập -> chuyển hướng về trang /login
export default function PrivateRoute({ children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
