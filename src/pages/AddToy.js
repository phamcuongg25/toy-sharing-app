import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createToy, getCurrentUser, getToys } from "../services/api";

const initialForm = {
  name: "",
  description: "",
  image: "",
  category: "",
  ageGroup: "",
};

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

export default function AddToy() {
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = getCurrentUser();

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
      const toys = await getToys();

      const isDuplicate = toys.some(
        (toy) =>
          Number(toy.ownerId) === Number(user.id) &&
          toy.name.trim().toLowerCase() ===
          form.name.trim().toLowerCase()
      );

      if (isDuplicate) {
        setError("Bạn đã có một đồ chơi với tên này.");
        setLoading(false);
        return;
      }

      await createToy({
        ...form,
        ownerId: user.id,
        ownerName: user.name,
        status: "available",
      });

      navigate("/my-toys");
    } catch (err) {
      setError("Không thể thêm đồ chơi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "30px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(0,0,0,.1)",
      }}
    >
      <h1
        style={{
          marginBottom: "10px",
          color: "#9389eb",
          textAlign: "center",
        }}
      >
        Thêm đồ chơi
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
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "15px",
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
          placeholder="Nhập mô tả..."
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />

        <label style={{ fontWeight: "bold" }}>
          Chọn ảnh *
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
              alt="preview"
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
                border: "1px solid #ccc",
                borderRadius: "8px",
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
              Độ tuổi
            </label>

            <select
              name="ageGroup"
              value={form.ageGroup}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
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

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading ? "#9389eb" : "#9389eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.background = "#9389eb";
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.background = "#9389eb";
          }}
        >
          {loading ? "Đang lưu..." : " Thêm đồ chơi"}
        </button>
      </form>
    </div>
  );
}