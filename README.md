# Toy Sharing App — Quản lý & chia sẻ đồ chơi trẻ em

Ứng dụng React sử dụng **json-server** làm database giả lập (REST API),
cho phép người dùng đăng nhập, đăng đồ chơi cho mượn, và quản lý mượn/trả.

## Chức năng chính

- **Đăng nhập** bằng tài khoản có sẵn trong `db.json` (không cần đăng ký).
- **Trang chủ**: xem tất cả đồ chơi, tìm kiếm theo tên, lọc theo danh mục,
  gửi **yêu cầu mượn** đồ chơi của người khác.
- **Đồ chơi của tôi**: thêm / sửa / xóa đồ chơi mình chia sẻ, xem và
  **duyệt / từ chối** yêu cầu mượn, **xác nhận** khi nhận lại đồ chơi.
- **Mượn / Trả**: xem danh sách đồ chơi mình đang mượn hoặc đã yêu cầu mượn,
  gửi **yêu cầu trả** đồ chơi.

### Luồng trạng thái mượn/trả

```
available --(gửi yêu cầu mượn)--> pending
pending   --(chủ duyệt)--------->  borrowing   (toy: borrowed)
pending   --(chủ từ chối)------->  rejected    (toy: available)
borrowing --(người mượn báo trả)-> return_pending
return_pending --(chủ xác nhận)--> returned    (toy: available)
```

## Cài đặt & chạy thử

Yêu cầu: đã cài **Node.js** (>= 16).

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Chạy json-server (database giả lập) ở cổng 9999
npm run server

# 3. Ở một terminal khác, chạy ứng dụng React (cổng 3000)
npm start
```

Ứng dụng React sẽ gọi API tới `http://localhost:9999`, vì vậy **json-server
phải chạy trước hoặc song song** với `npm start`.

## Tài khoản demo (trong db.json)

| Tên đăng nhập | Mật khẩu | Tên người dùng |
| ------------- | -------- | -------------- |
| user1         | 123456   | Nguyễn Văn A   |
| user2         | 123456   | Trần Thị B     |
| user3         | 123456   | Lê Thị C       |

## Cấu trúc thư mục

```
toy-sharing-app/
├── db.json                 # database cho json-server
├── package.json
└── src
    ├── components
    │   ├── Navbar.js
    │   ├── ToyCard.js
    │   └── PrivateRoute.js
    ├── pages
    │   ├── Login.js
    │   ├── Home.js
    │   ├── AddToy.js
    │   ├── EditToy.js
    │   ├── MyToys.js
    │   └── BorrowList.js
    ├── services
    │   └── api.js
    ├── App.js
    ├── index.js
    ├── App.css
    └── index.css
```

## Ghi chú

- Đăng nhập là dạng đơn giản (so khớp username/password trực tiếp qua
  json-server) — chỉ phù hợp cho mục đích học tập/demo, **không** dùng cho
  sản phẩm thực tế vì mật khẩu lưu ở dạng plain text.
- Có thể mở rộng thêm: đăng ký tài khoản mới, mã hoá mật khẩu, phân trang,
  đánh giá/nhận xét sau khi mượn, thông báo real-time, v.v.
