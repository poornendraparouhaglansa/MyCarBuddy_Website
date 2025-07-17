// src/components/ModelPopup.js
import React from "react";
import "./BrandPopup.css"; // Same style as BrandPopup for animation and UI

const ModelPopup = ({ models, selected, onSelect, onClose }) => {
  return (
    <div className="brand-popup-overlay">
      <div className="brand-popup zoom-in bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Choose Your Model</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="brand-scroll-container">
          <div className="row brand-grid">
            {(models || []).map((m) => (
              <div key={m.id} className="col-6 col-md-4 col-lg-3 mb-3">
                <div
                  className={`card brand-card ${selected === m.name ? "border-primary shadow" : ""}`}
                  onClick={() => onSelect(m.name)}
                  style={{ cursor: "pointer", transition: "0.3s"}}
                >
                  <img
                    src={m.logo}
                    alt={m.name}
                    className="card-img-top p-3"
                    style={{ height: "90px", objectFit: "contain" }}
                  />
                  <div className="card-body text-center p-2">
                    <h6 className="card-title mb-0">{m.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPopup;
