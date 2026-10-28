import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  getToyById,
  updateToy,
  deleteToy,
  getCurrentUser,
} from "../services/api";

const categories = [
  "Xe cộ",
  "Xếp hình",
  "Thú nhồi bông",
  "Nhập vai",
  "Búp bê",
  "Giáo dục",
  "Thể thao",
  "Khác",
];

const ageGroups = [
  "0-2 tuổi",
  "3-5 tuổi",
  "6-8 tuổi",
  "9-12 tuổi",
  "12+ tuổi",
];

export default function EditToy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const toy = await getToyById(id);

        if (Number(toy.ownerId) !== Number(user?.id)) {
          setError("Bạn không có quyền chỉnh sửa đồ chơi này.");
          setNotFound(true);
          return;
        }

        setForm(toy);
        setPreview(toy.image);
      } catch (err) {
        setNotFound(true);
      }
    };

    load();
  }, [id, user?.id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);

      setForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Vui lòng nhập tên đồ chơi.");
      return;
    }

    if (!form.category) {
      setError("Vui lòng chọn danh mục.");
      return;
    }

    if (!form.image) {
      setError("Vui lòng chọn ảnh.");
      return;
    }

    setLoading(true);

    try {
      await updateToy(id, {
        ...form,
      });

      navigate("/my-toys");
    } catch (err) {
      setError("Không thể lưu thay đổi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Bạn có chắc muốn xóa đồ chơi này không?")
    ) {
      await deleteToy(id);
      navigate("/my-toys");
    }
  };

  if (notFound) {
    return (
      <div className="page">
        <div className="alert alert-error">
          {error || "Không tìm thấy đồ chơi."}
        </div>

        <Link to="/my-toys" className="btn btn-outline">
          Quay lại
        </Link>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="page">
        <p>Đang tải...</p>
      </div>
    );
  }

  const canEdit = form.status === "available";

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "30px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(0,0,0,.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#9389eb",
          marginBottom: "10px",
        }}
      >
        Chỉnh sửa đồ chơi
      </h1>

      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              background: "#ffebee",
              color: "#c62828",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {!canEdit && (
          <div
            style={{
              background: "#fff3cd",
              color: "#856404",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            Đồ chơi đang được mượn hoặc chờ duyệt. Bạn không thể xóa trong thời
            gian này.
          </div>
        )}

        <label style={{ fontWeight: "bold" }}>
          Tên đồ chơi *
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <label style={{ fontWeight: "bold" }}>
          Mô tả
        </label>

        <textarea
          rows="4"
          name="description"
          value={form.description}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <label style={{ fontWeight: "bold" }}>
          Chọn ảnh
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            width: "100%",
            marginTop: "10px",
            marginBottom: "20px",
          }}
        />

        {preview && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "25px",
            }}
          >
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "300px",
                height: "220px",
                objectFit: "cover",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,.15)",
              }}
            />
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Danh mục *
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
                background: "#fff",
                boxSizing: "border-box",
              }}
            >
              <option value="">-- Chọn danh mục --</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Độ tuổi phù hợp
            </label>

            <select
              name="ageGroup"
              value={form.ageGroup}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
                background: "#fff",
                boxSizing: "border-box",
              }}
            >
              <option value="">-- Chọn độ tuổi --</option>

              {ageGroups.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "30px",
          }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: "14px",
              background: loading ? "#9389eb" : "#9389eb",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Đang lưu..." : " Lưu thay đổi"}
          </button>

          <button
            type="button"
            disabled={!canEdit}
            onClick={handleDelete}
            style={{
              flex: 1,
              padding: "14px",
              background: canEdit ? "#e53935" : "#bdbdbd",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: canEdit ? "pointer" : "not-allowed",
            }}
          >
             Xóa đồ chơi
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate("/my-toys")}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #4CAF50",
            background: "#fff",
            color: "#4CAF50",
            fontSize: "15px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ← Quay lại
        </button>
      </form>
    </div>
  );
}
