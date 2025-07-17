import React, { useEffect, useState } from "react";
import "./ChooseCarModal.css";
import BrandPopup from "./BrandPopup"; // new popup component
import ModelPopup from "./ModelPopup";

const ChooseCarModal = ({ isVisible, onClose }) => {
  const [carType, setCarType] = useState("");
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState("");
  const [fuel, setFuel] = useState("");
  const [showBrandPopup, setShowBrandPopup] = useState(false);
  const [showModelPopup, setShowModelPopup] = useState(false);

  const brands = [
    { id: 1, name: "Maruti", logo: "/assets/brands/maruti.png" },
    { id: 2, name: "Hyundai", logo: "/assets/brands/hyundai.png" },
    { id: 3, name: "Tata", logo: "/assets/brands/tata.png" },
    { id: 4, name: "Mahindra", logo: "/assets/brands/mahindra.png" },
    { id: 5, name: "Kia", logo: "/assets/brands/kia.png" },
  ];

  const models = [
    { id: 1, name: "Maruti", logo: "/assets/brands/maruti.png" },
    { id: 2, name: "Hyundai", logo: "/assets/brands/hyundai.png" },
    { id: 3, name: "Tata", logo: "/assets/brands/tata.png" },
    { id: 4, name: "Mahindra", logo: "/assets/brands/mahindra.png" },
    { id: 5, name: "Kia", logo: "/assets/brands/kia.png" },
  ]

  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (carType) {
      localStorage.setItem("selectedCarType", carType);
      onClose();
    }
  };

  const handleBrandSelect = (id) => {
    setBrand(id);
    setShowBrandPopup(false);
  };

  const handleModelSelect = (id) => {
    setModel(id);
    setShowModelPopup(false);
  };

  return (
    <div className={`choose-car-modal ${isVisible ? "visible" : "hidden"}`}>
      <div className="modal-content">
        <h6>Select Your Car Type</h6>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 ">
            <label className="form-label">Choose Brand</label>
            <div className="d-flex flex-wrap gap-3 text-center">
              <button
                type="button"
                className="btn btn-outline-secondary py-10"
                onClick={() => setShowBrandPopup(true)}
              >
                {brand ? brands.find((b) => b.id === brand).name : "Choose Brand"}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Model</label>
            <div className="d-flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-outline-secondary py-10"
                onClick={() => setShowModelPopup(true)}
              >
                {model ? model : "Choose Model"}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Fuel Type</label>
            <div className="d-flex gap-2 flex-wrap">
              {fuelTypes.map((type) => (
                <button
                  type="button"
                  key={type}
                  className={`btn btn-outline-primary py-10 ${fuel === type ? "active" : ""}`}
                  onClick={() => setFuel(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-secondary py-10 "
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary py-10">
              Save
            </button>
          </div>
        </form>
      </div>

      {showBrandPopup && (
        <BrandPopup
          brands={brands}
          selected={brand}
          onSelect={handleBrandSelect}
          onClose={() => setShowBrandPopup(false)}
        />
      )}

      {showModelPopup && (
        <ModelPopup
          models={models}
          selected={model}
          onSelect={handleModelSelect}
          onClose={() => setShowModelPopup(false)}
        />
      )}
    </div>
  );
};

export default ChooseCarModal;
