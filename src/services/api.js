import axios from "axios";

// json-server chạy ở cổng 9999 (npm run server)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:9999",
});

/* =========================================================
   AUTH (đăng nhập / phiên đăng nhập lưu trong localStorage)
   ========================================================= */
const CURRENT_USER_KEY = "toy_sharing_current_user";

export const login = async (username, password) => {
  const res = await api.get(
    `/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(
      password
    )}`
  );
  if (res.data.length === 0) {
    throw new Error("Sai tên đăng nhập hoặc mật khẩu");
  }
  const user = res.data[0];
  sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const logout = () => {
  sessionStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  const raw = sessionStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

/* =========================================================
   TOYS - đồ chơi
   ========================================================= */
export const getToys = async () => {
  const res = await api.get("/toys?_sort=id&_order=desc");
  return res.data;
};

export const getToyById = async (id) => {
  const res = await api.get(`/toys/${id}`);
  return res.data;
};

export const getToysByOwner = async (ownerId) => {
  const res = await api.get(`/toys?ownerId=${ownerId}&_sort=id&_order=desc`);
  return res.data;
};

export const createToy = async (toy) => {
  const res = await api.post("/toys", { ...toy, status: "available" });
  return res.data;
};

export const updateToy = async (id, toy) => {
  const res = await api.patch(`/toys/${id}`, toy);
  return res.data;
};

export const deleteToy = async (id) => {
  await api.delete(`/toys/${id}`);
};

/* =========================================================
   BORROWS - phiếu mượn/trả
   Trạng thái (status) của 1 phiếu mượn:
   - "pending"        : người mượn vừa gửi yêu cầu, chờ chủ đồ chơi duyệt
   - "borrowing"       : chủ đã duyệt, đang mượn
   - "return_pending"  : người mượn báo trả, chờ chủ xác nhận
   - "returned"        : đã trả xong
   - "rejected"         : chủ từ chối yêu cầu mượn
   ========================================================= */
export const getBorrowsByBorrower = async (borrowerId) => {
  const res = await api.get(
    `/borrows?borrowerId=${borrowerId}&_sort=id&_order=desc`
  );
  return res.data;
};

export const getBorrowsByOwner = async (ownerId) => {
  const res = await api.get(
    `/borrows?ownerId=${ownerId}&_sort=id&_order=desc`
  );
  return res.data;
};

export const createBorrow = async (borrow) => {
  const res = await api.post("/borrows", {
    ...borrow,
    status: "pending",
    requestDate: new Date().toISOString(),
  });
  return res.data;
};

export const updateBorrow = async (id, data) => {
  const res = await api.patch(`/borrows/${id}`, data);
  return res.data;
};
export const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

export const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDate(d);
};

export default api;
