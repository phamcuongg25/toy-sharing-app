import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ToyCard from "../components/ToyCard";
import {
  getToysByOwner,
  getBorrowsByOwner,
  updateBorrow,
  updateToy,
  getCurrentUser,
} from "../services/api";

const REQUEST_LABEL = {
  pending: "Yêu cầu mượn mới",
  extend_pending: "Yêu cầu gia hạn",
  return_pending: "Yêu cầu trả đồ",
};

export default function MyToys() {
  const user = getCurrentUser();
  const [toys, setToys] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    const [toysData, borrowsData] = await Promise.all([
      getToysByOwner(user.id),
      getBorrowsByOwner(user.id),
    ]);
    setToys(toysData);
    setRequests(
      borrowsData.filter(
        (b) =>
          b.status === "pending" ||
          b.status === "return_pending" ||
          b.status === "extend_pending"
      )
    );
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApprove = async (req) => {
    const today = new Date().toISOString().split("T")[0];
    await updateBorrow(req.id, {
      status: "borrowing",
      borrowDate: req.borrowDate || today,
    });
    await updateToy(req.toyId, { status: "borrowed" });
    setMessage(`Đã duyệt cho ${req.borrowerName} mượn "${req.toyName}".`);
    loadData();
  };

  const handleReject = async (req) => {
    await updateBorrow(req.id, { status: "rejected" });
    await updateToy(req.toyId, { status: "available" });
    setMessage(`Đã từ chối yêu cầu mượn "${req.toyName}".`);
    loadData();
  };

  const handleApproveExtend = async (req) => {
    const baseDate = new Date(req.dueDate || Date.now());
    const today = new Date();
    const startFrom = baseDate > today ? baseDate : today;
    startFrom.setDate(startFrom.getDate() + 7);
    const newDueDate = startFrom.toISOString().split("T")[0];

    await updateBorrow(req.id, {
      status: "borrowing",
      dueDate: newDueDate,
      extendCount: (req.extendCount || 0) + 1,
    });
    setMessage(
      `Đã đồng ý gia hạn đồ chơi "${req.toyName}" đến ngày ${newDueDate}.`
    );
    loadData();
  };

  const handleRejectExtend = async (req) => {
    await updateBorrow(req.id, {
      status: "borrowing",
      extendCount: (req.extendCount || 0) + 1,
    });
    setMessage(`Đã từ chối gia hạn đồ chơi "${req.toyName}".`);
    loadData();
  };

  const handleConfirmReturn = async (req) => {
    await updateBorrow(req.id, {
      status: "returned",
      returnDate: new Date().toISOString(),
    });
    await updateToy(req.toyId, { status: "available" });
    setMessage(`Đã xác nhận nhận lại "${req.toyName}".`);
    loadData();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Đồ chơi của tôi</h1>
        <p>Quản lý đồ chơi bạn chia sẻ và duyệt các yêu cầu mượn</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <section className="section">
        <h2>Yêu cầu cần xử lý ({requests.length})</h2>
        {loading ? (
          <p>Đang tải...</p>
        ) : requests.length === 0 ? (
          <p className="hint-text">Hiện chưa có yêu cầu nào.</p>
        ) : (
          <div className="request-list">
            {requests.map((req) => (
              <div key={req.id} className="request-item">
                <img src={req.toyImage} alt={req.toyName} />
                <div className="request-info">
                  <strong>{req.toyName}</strong>
                  <span className="badge badge-yellow">
                    {REQUEST_LABEL[req.status]}
                  </span>
                  <p>Người mượn: {req.borrowerName}</p>
                </div>
                <div className="request-actions">
                  {req.status === "pending" ? (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApprove(req)}
                      >
                        Duyệt
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => handleReject(req)}
                      >
                        Từ chối
                      </button>
                    </>
                  ) : req.status === "extend_pending" ? (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApproveExtend(req)}
                      >
                        Đồng ý (+7 ngày)
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => handleRejectExtend(req)}
                      >
                        Từ chối
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleConfirmReturn(req)}
                    >
                      Xác nhận đã nhận lại
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <hr></hr>
      <section className="section">
        <div className="section-header-row">
          <h2>Danh sách đồ chơi ({toys.length})</h2>
          <Link to="/add-toy" className="btn btn-primary">
            Thêm đồ chơi mới
          </Link>
        </div>

        {loading ? (
          <p>Đang tải...</p>
        ) : toys.length === 0 ? (
          <p className="hint-text">Bạn chưa chia sẻ đồ chơi nào.</p>
        ) : (
          <div className="toy-grid">
            {toys.map((toy) => (
              <ToyCard key={toy.id} toy={toy}>
                <Link to={`/edit-toy/${toy.id}`} className="btn btn-outline">
                  Chỉnh sửa
                </Link>
              </ToyCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
