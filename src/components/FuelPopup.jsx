import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./BrandPopup.css";

const FuelPopup = ({ fuels, selected, onSelect, onClose, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFuels = fuels.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="brand-popup-overlay" onClick={onClose}>
      <div
        className="brand-popup-box animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="brand-popup-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h5 className="popup-title mb-3">Choose Your Fuel Type</h5>
        <input
          type="text"
          placeholder="Search fuel types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mb-3"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="brand-scroll-container">
          <div className="row d-flex justify-content-center">
            {loading ? (
              // Show skeleton loaders
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="col-6 col-sm-4 col-md-2 mb-3">
                  <div className="card brand-card">
                    <div
                      className="skeleton-loader"
                      style={{
                        width: "100%",
                        height: 80,
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    ></div>
                    <div className="card-body text-center p-2">
                      <div
                        className="skeleton-loader"
                        style={{
                          width: "60%",
                          height: 16,
                          backgroundColor: "#e0e0e0",
                          borderRadius: "4px",
                          animation: "pulse 1.5s ease-in-out infinite",
                          margin: "0 auto",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              filteredFuels.map((f) => (
                <div key={f.id} className="col-6 col-sm-4 col-md-2 mb-3">
                  <div
                    className={`card brand-card ${
                      selected === f.id ? "selected" : ""
                    }`}
                    onClick={() => onSelect(f.id)}
                  >
                    <div className="fuel-icon-container p-3">
                      <i className={`bi ${getFuelIcon(f.name)}`} style={{ fontSize: "2rem", color: getFuelColor(f.name) }}></i>
                    </div>
                    <div className="card-body text-center p-2">
                      <h6 className="card-title mb-0">{f.name}</h6>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get appropriate icon for fuel type
const getFuelIcon = (fuelName) => {
  const name = fuelName.toLowerCase();
  if (name.includes('petrol') || name.includes('gasoline')) {
    return 'bi-fuel-pump';
  } else if (name.includes('diesel')) {
    return 'bi-fuel-pump-diesel';
  } else if (name.includes('electric') || name.includes('ev')) {
    return 'bi-lightning-charge';
  } else if (name.includes('hybrid')) {
    return 'bi-battery-charging';
  } else if (name.includes('cng')) {
    return 'bi-fuel-pump';
  } else if (name.includes('lpg')) {
    return 'bi-fuel-pump';
  } else {
    return 'bi-fuel-pump';
  }
};

// Helper function to get appropriate color for fuel type
const getFuelColor = (fuelName) => {
  const name = fuelName.toLowerCase();
  if (name.includes('petrol') || name.includes('gasoline')) {
    return '#ff6b35';
  } else if (name.includes('diesel')) {
    return '#2c3e50';
  } else if (name.includes('electric') || name.includes('ev')) {
    return '#00d4aa';
  } else if (name.includes('hybrid')) {
    return '#8e44ad';
  } else if (name.includes('cng')) {
    return '#3498db';
  } else if (name.includes('lpg')) {
    return '#e74c3c';
  } else {
    return '#95a5a6';
  }
};

export default FuelPopup;
