// src/components/ModelPopup.js
import React from "react";
import { FaTimes } from "react-icons/fa";
import "./BrandPopup.css"; 

const ModelPopup = ({ models, selected, onSelect, onClose }) => {
  return (
    <div className="brand-popup-overlay" onClick={onClose}>
      <div className="brand-popup-box animate-in" onClick={(e) => e.stopPropagation()}>
        <button className="brand-popup-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h5 className="popup-title mb-3">Choose Your Model</h5>
        <div className="brand-scroll-container">
          <div className="row d-flex justify-content-center">
            {models.map((m) => (
              <div key={m.id} className="col-6 col-sm-4 col-md-2 mb-3">
                <div
                  className={`card brand-card ${selected === m.name ? "selected" : ""}`}
                  onClick={() => onSelect(m.id)}
                >
                  <img
                    src={m.logo}
                    alt={m.name}
                    className="brand-logo p-3"
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
