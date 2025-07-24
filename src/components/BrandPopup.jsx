import React from "react";
import { FaTimes } from "react-icons/fa";
import "./BrandPopup.css";

const BrandPopup = ({ brands, selected, onSelect, onClose }) => {
  return (
    <div className="brand-popup-overlay" onClick={onClose}>
      <div
        className="brand-popup-box animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="brand-popup-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h5 className="popup-title mb-3">Choose Your Brand</h5>
        <div className="brand-scroll-container">
          <div className="row brand-grid">
            {brands.map((b) => (
              <div key={b.id} className="col-6 col-sm-3 col-md-2 mb-3">
                <div
                  className={`card brand-card ${
                    selected === b.id ? "selected" : ""
                  }`}
                  onClick={() => onSelect(b.id)}
                >
                  <img
                    src={b.logo}
                    alt={b.name}
                    className="brand-logo p-3"
                  />
                  {/* <div className="card-body text-center p-2">
                    <h6 className="card-title mb-0">{b.name}</h6>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPopup;
