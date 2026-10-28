import React from "react";

const STATUS_LABEL = {
  available: { text: "Có thể mượn", className: "badge badge-green" },
  pending: { text: "Chờ duyệt mượn", className: "badge badge-yellow" },
  borrowed: { text: "Đang được mượn", className: "badge badge-gray" },
};

export default function ToyCard({ toy, children }) {
  const status = STATUS_LABEL[toy.status] || STATUS_LABEL.available;

  return (
    <div className="toy-card">
      <img
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
          display: "block",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
        src={toy.image}
        alt={toy.name}
        className="toy-card-img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/400x300?text=Toy+Image";
        }}
      />
      <div className="toy-card-body">
        <div className="toy-card-header">
          <h3>{toy.name}</h3>
          <span className={status.className}>{status.text}</span>
        </div>
        <p className="toy-card-desc">{toy.description}</p>
        <div className="toy-card-meta">
          <span> {toy.category}</span>
          <span> {toy.ageGroup}</span>
        </div>
        <div className="toy-card-owner">Chủ sở hữu: {toy.ownerName}</div>
        {children && <div className="toy-card-actions">{children}</div>}
      </div>
    </div>
  );
}
