import React, { useEffect, useRef, useState } from "react";
import "./ChooseCarModal.css";
import BrandPopup from "./BrandPopup"; // new popup component
import ModelPopup from "./ModelPopup";
import axios from "axios";

const ChooseCarModal = ({ isVisible, onClose }) => {
  const BASE_URL = process.env.REACT_APP_CARBUDDY_BASE_URL;
  const [carType, setCarType] = useState("");
  const [brand, setBrand] = useState(null);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [model, setModel] = useState("");
  const [fuel, setFuel] = useState("");
  const [showBrandPopup, setShowBrandPopup] = useState(false);
  const [showModelPopup, setShowModelPopup] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}VehicleBrands/GetVehicleBrands`
        );
        if (response.data?.status && Array.isArray(response.data.data)) {
          const formattedBrands = response.data.data
            .filter((b) => b.BrandLogo)
            .map((b) => ({
              id: b.BrandID,
              name: b.BrandName,
              logo: `https://api.mycarsbuddy.com/images${b.BrandLogo.startsWith("/") ? "" : "/"}${b.BrandLogo}`,
            }));
          console.log("Formatted brands:", formattedBrands);
          setBrands(formattedBrands);
        }
      } catch (err) {
        console.error("Failed to fetch brands", err);
      }
    };

    fetchBrands();
    fetchFuels();
  }, []);

  const fetchModels = async (brandId) => {
    try {
      const response = await axios.get("https://api.mycarsbuddy.com/api/VehicleModels/GetListVehicleModel");
      if (response.data?.status && Array.isArray(response.data.data)) {
        const getImageUrl = (path) => {
          if (!path) return "https://via.placeholder.com/100?text=No+Image";
          const fileName = path.split('/').pop();
          return `https://api.mycarsbuddy.com/Images/VehicleModel/${fileName}`;
        };
        const filteredModels = response.data.data
          .filter((m) => m.BrandID === brandId && m.IsActive)
          .map((m) => ({
            id: m.ModelID,
            name: m.ModelName,
            logo: getImageUrl(m.VehicleImage), // Use the full valid image URL
          }));

        setModels(filteredModels);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const fetchFuels = async () => {
    try {
      const res = await axios.get("https://api.mycarsbuddy.com/api/FuelTypes/GetFuelTypes");
      if (res.data?.status && Array.isArray(res.data.data)) {
        const formatted = res.data.data
          .filter(f => f.IsActive)
          .map(f => {
            const fileName = f.FuelImage?.split("/").pop();
            const encodedFileName = encodeURIComponent(fileName);
            const imageUrl = `https://api.mycarsbuddy.com/images/FuelImages/${encodedFileName}`;

            return {
              id: f.FuelTypeID,
              name: f.FuelTypeName,
              image: imageUrl,
            };
          });
        setFuels(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch fuels", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!brand || !model || !fuel) {
      alert("Please select brand, model, and fuel type.");
      return;
    }

    const selectedCarDetails = {
      brand: brands.find((b) => b.id === brand),
      model: models.find((m) => m.id === model),
      fuel: fuel,
    };

    localStorage.setItem("selectedCarDetails", JSON.stringify(selectedCarDetails));
    console.log("Saved Car:", selectedCarDetails);

    onClose();
  };

  const handleBrandSelect = (id) => {
    setBrand(id);
    setModel(""); // Reset model if brand changes
    setShowBrandPopup(false);
    fetchModels(id); // Fetch models for the selected brand
  };

  const handleModelSelect = (id) => {
    setModel(id);
    setShowModelPopup(false);
  };

  return (
    <div className={`choose-car-modal ${isVisible ? "visible" : "hidden"}`}>
      <div className="modal-content" ref={modalRef}>
        <button className="modal-close" onClick={onClose}>×</button>
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
                {brand ? (brands.find((b) => b.id === brand)?.name || "Choose Brand") : "Choose Brand"}
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
                disabled={!brand}
              >
                {model ? models.find((m) => m.id === model)?.name || "Choose Model" : "Choose Model"}
              </button>
            </div>
          </div>

          {model && (
            <div className="mb-4">
              <label className="form-label">Fuel Type</label>
              <div className="d-flex gap-3 flex-wrap">
                {fuels.map((f) => (
                  <div
                    key={f.id}
                    className={`text-center px-2 py-1 border rounded shadow-sm ${fuel === f.name ? "border-primary" : ""}`}
                    style={{ cursor: "pointer", width: 100 }}
                    onClick={() => setFuel(f.name)}
                  >
                    <img src={f.image} alt={f.name} style={{ width: "40px", height: "40px", objectFit: "contain" }} />
                    <small className="d-block mt-1">{f.name}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

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
