import React, { useEffect, useMemo, useState } from "react";
import ToyCard from "../components/ToyCard";
import {
  getToys,
  createBorrow,
  updateToy,
  getCurrentUser,
} from "../services/api";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [message, setMessage] = useState("");

  const user = getCurrentUser();
  const navigate = useNavigate();

  // Popup mượn
  const [showModal, setShowModal] = useState(false);
  const [selectedToy, setSelectedToy] = useState(null);
  const [modalError, setModalError] = useState("");

  const [borrowForm, setBorrowForm] = useState({
    dueDate: "",
    note: "",
  });

  const loadToys = async () => {
    setLoading(true);
    const data = await getToys();
    setToys(data);
    setLoading(false);
  };

  useEffect(() => {
    loadToys();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(toys.map((t) => t.category));
    return ["all", ...Array.from(set)];
  }, [toys]);

  const filteredToys = toys.filter((toy) => {
    const matchesSearch = toy.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "all" || toy.category === category;

    return matchesSearch && matchesCategory;
  });

  // Mở popup
  const openBorrowModal = (toy) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const today = new Date();
    today.setDate(today.getDate() + 7);

    setBorrowForm({
      dueDate: today.toISOString().split("T")[0],
      note: "",
    });

    setModalError("");
    setSelectedToy(toy);
    setShowModal(true);
  };

  // Đóng popup
  const closeBorrowModal = () => {
    setShowModal(false);
    setSelectedToy(null);
    setModalError("");

    setBorrowForm({
      dueDate: "",
      note: "",
    });
  };

  // Gửi yêu cầu mượn
  const handleBorrowSubmit = async () => {
    setModalError("");

    if (!borrowForm.dueDate) {
      setModalError("Vui lòng chọn ngày trả.");
      return;
    }

    const today = new Date();
    const due = new Date(borrowForm.dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    if (due <= today) {
      setModalError("Ngày trả phải sau hôm nay.");
      return;
    }

    try {
      await createBorrow({
        toyId: selectedToy.id,
        toyName: selectedToy.name,
        toyImage: selectedToy.image,

        ownerId: selectedToy.ownerId,
        ownerName: selectedToy.ownerName,

        borrowerId: user.id,
        borrowerName: user.name,

        borrowDate: null,
        dueDate: borrowForm.dueDate,

        note: borrowForm.note,

        extendCount: 0,

        status: "pending",

        requestDate: new Date().toISOString(),
      });

      await updateToy(selectedToy.id, {
        status: "pending",
      });

      setMessage(
        `Đã gửi yêu cầu mượn "${selectedToy.name}".`
      );

      closeBorrowModal();

      loadToys();
    } catch (err) {
      setModalError("Có lỗi xảy ra khi gửi yêu cầu mượn.");
    }
  };
  return (
    <div className="page">
      <div className="page-header">
        <h1>Đồ chơi đang chia sẻ</h1>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Tìm kiếm đồ chơi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "Tất cả danh mục" : c}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : filteredToys.length === 0 ? (
        <p>Không tìm thấy đồ chơi nào.</p>
      ) : (
        <div className="toy-grid">
          {filteredToys.map((toy) => {
            const isOwner =
              Number(user?.id) === Number(toy.ownerId);

            return (
              <ToyCard key={toy.id} toy={toy}>
                {isOwner ? (
                  <span className="hint-text">
                    Đây là đồ chơi của bạn
                  </span>
                ) : toy.status === "available" ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => openBorrowModal(toy)}
                  >
                    Yêu cầu mượn
                  </button>
                ) : (
                  <button
                    className="btn btn-disabled"
                    disabled
                  >
                    {toy.status === "pending"
                      ? "Đang chờ duyệt"
                      : "Đã có người mượn"}
                  </button>
                )}
              </ToyCard>
            );
          })}
        </div>
      )}


      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Yêu cầu mượn đồ chơi</h2>

            {modalError && (
              <div className="alert alert-error">
                {modalError}
              </div>
            )}

            <img
              src={selectedToy.image}
              alt={selectedToy.name}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />

            <h3>{selectedToy.name}</h3>

            <p>{selectedToy.description}</p>

            <label>Ngày trả dự kiến</label>

            <input
              type="date"
              value={borrowForm.dueDate}
              onChange={(e) =>
                setBorrowForm({
                  ...borrowForm,
                  dueDate: e.target.value,
                })
              }
            />

            <label
              style={{
                marginTop: "15px",
                display: "block",
              }}
            >
              Ghi chú
            </label>

            <textarea
              rows="3"
              value={borrowForm.note}
              onChange={(e) =>
                setBorrowForm({
                  ...borrowForm,
                  note: e.target.value,
                })
              }
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                className="btn btn-outline"
                onClick={closeBorrowModal}
              >
                Hủy
              </button>

              <button
                className="btn btn-primary"
                onClick={handleBorrowSubmit}
              >
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );}