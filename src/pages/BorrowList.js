import React, { useEffect, useState } from "react";
import {
  getBorrowsByBorrower,
  updateBorrow,
  getCurrentUser,
} from "../services/api";

const STATUS_LABEL = {
  pending: {
    text: "Chờ chủ duyệt",
    className: "badge badge-yellow",
  },
  borrowing: {
    text: "Đang mượn",
    className: "badge badge-gray",
  },
  extend_pending: {
    text: "Chờ duyệt gia hạn",
    className: "badge badge-yellow",
  },
  return_pending: {
    text: "Chờ xác nhận trả",
    className: "badge badge-yellow",
  },
  returned: {
    text: "Đã trả",
    className: "badge badge-green",
  },
  rejected: {
    text: "Bị từ chối",
    className: "badge badge-red",
  },
};

export default function BorrowList() {
  const user = getCurrentUser();

  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    const data = await getBorrowsByBorrower(user.id);
    setBorrows(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequestReturn = async (borrow) => {
    await updateBorrow(borrow.id, {
      status: "return_pending",
    });

    setMessage(
      `Đã gửi yêu cầu trả "${borrow.toyName}". Chờ chủ xác nhận.`
    );

    loadData();
  };

  const handleRequestExtend = async (borrow) => {
    await updateBorrow(borrow.id, {
      status: "extend_pending",
    });

    setMessage(
      `Đã gửi yêu cầu gia hạn "${borrow.toyName}".`
    );

    loadData();
  };

  const getRemainDays = (dueDate) => {
    if (!dueDate) return null;

    const today = new Date();
    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Đồ chơi tôi mượn</h1>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : borrows.length === 0 ? (
        <p className="hint-text">
          Bạn chưa mượn đồ chơi nào.
        </p>
      ) : (
        <div className="request-list">
          {borrows.map((b) => {
            const status =
              STATUS_LABEL[b.status] ||
              STATUS_LABEL.pending;

            const remainDays = getRemainDays(b.dueDate);

            return (
              <div key={b.id} className="request-item">
                <img
                  src={b.toyImage}
                  alt={b.toyName}
                />

                <div className="request-info">
                  <strong>{b.toyName}</strong>

                  <span className={status.className}>
                    {status.text}
                  </span>

                  <p>
                    Chủ sở hữu: {b.ownerName}
                  </p>

                  {b.borrowDate && (
                    <p>
                       Ngày mượn: {b.borrowDate}
                    </p>
                  )}

                  {b.dueDate && (
                    <>
                      <p>
                         Hạn trả: {b.dueDate}
                      </p>

                      {b.status !== "returned" && (
                        <>
                          {remainDays > 0 && (
                            <p
                              style={{
                                color: "green",
                                fontWeight: "bold",
                              }}
                            >
                              Còn {remainDays} ngày
                            </p>
                          )}

                          {remainDays === 0 && (
                            <p
                              style={{
                                color: "orange",
                                fontWeight: "bold",
                              }}
                            >
                              Hôm nay là hạn cuối
                            </p>
                          )}

                          {remainDays < 0 && (
                            <p
                              style={{
                                color: "red",
                                fontWeight: "bold",
                              }}
                            >
                              Quá hạn {Math.abs(remainDays)} ngày
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="request-actions">
                  {b.status === "borrowing" && (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleRequestReturn(b)
                        }
                      >
                        Trả đồ chơi
                      </button>

                      {(!b.extendCount ||
                        b.extendCount < 1) && (
                        <button
                          className="btn btn-outline"
                          onClick={() =>
                            handleRequestExtend(b)
                          }
                        >
                          Xin gia hạn
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}