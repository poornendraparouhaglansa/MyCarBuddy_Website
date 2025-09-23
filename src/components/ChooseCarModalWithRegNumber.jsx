import React, { useEffect, useRef, useState } from "react";
import "./ChooseCarModalWithScanner.css";
import BrandPopup from "./BrandPopup";
import ModelPopup from "./ModelPopup";
import axios from "axios";
import { useAlert } from "../context/AlertContext";

const ChooseCarModal = ({ isVisible, onClose, onCarSaved }) => {
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
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const modalRef = useRef();
  const imageBaseURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;
  const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;

  // Registration Number Scanner states
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [isProcessingReg, setIsProcessingReg] = useState(false);
  const [regResult, setRegResult] = useState(null);
  const [useRegScanner, setUseRegScanner] = useState(false);
  const [activeTab, setActiveTab] = useState("reg"); // "reg" or "manual"
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const response = await axios.get(
          `${BASE_URL}VehicleBrands/GetVehicleBrands`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data?.status && Array.isArray(response.data.data)) {
          const formattedBrands = response.data.data
            .filter((b) => b.IsActive === true)
            .map((b) => ({
              id: b.BrandID,
              name: b.BrandName,
              logo: `${imageBaseURL}${b.BrandLogo.startsWith("/") ? b.BrandLogo.slice(1) : b.BrandLogo}`,
            }));
          console.log("Formatted brands:", formattedBrands);
          setBrands(formattedBrands);
        }
      } catch (err) {
        console.error("Failed to fetch brands", err);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
    fetchFuels();
  }, []);

  const fetchModels = async (brandId) => {
    setLoadingModels(true);
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.get(`${BASE_URL}VehicleModels/BrandId?brandid=${brandId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Raw models data:", response.data);

      if (Array.isArray(response.data)) {
        console.log("Raw models data:", response.data);
        const getImageUrl = (path) => {
          if (!path) return "https://via.placeholder.com/100?text=No+Image";
          const fileName = path.split('/').pop();
          return  `${imageBaseURL}${path.startsWith("/") ? path.slice(1) : path}`;
        };
        const filteredModels = response.data
          .filter((m) => m.BrandID === brandId && m.IsActive)
          .map((m) => ({
            id: m.ModelID,
            name: m.ModelName,
            logo: getImageUrl(m.VehicleImage),
          }));

        setModels(filteredModels);
      }
      else {
        setModels([]);
        console.error("Error fetching models:", response.data);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoadingModels(false);
    }
  };

  const fetchFuels = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const res = await axios.get(`${BASE_URL}FuelTypes/GetFuelTypes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data?.status && Array.isArray(res.data.data)) {
        const formatted = res.data.data
          .filter(f => f.IsActive)
          .map(f => {
            const fileName = f.FuelImage?.split("/").pop();
            const encodedFileName = encodeURIComponent(fileName);
            const imageUrl = `${imageBaseURL}${f.FuelImage}`;

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

  // Registration Number Lookup Function
const lookupRegistrationNumber = async () => {
  if (!registrationNumber.trim()) {
    alert("Please enter a registration number");
    return;
  }

  setIsProcessingReg(true);

  try {
    const response = await fetch('https://api.attestr.com/api/v2/public/checkx/rc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic T1gwUzZJLWpyRUliT0FzU0phLjViNDU0MTE4YTkwYzJmMDhlNTcxNzFiYmUzZmE1ZTUwOmNmYzY4YjkwMDU2OTEyZjRmNTM2M2FkNGZiY2RhNzgwZmU1MmZhNmJjNWNlODIwNQ=='
      },
      body: JSON.stringify({
        reg: registrationNumber.trim()
      })
    });

    const data = await response.json();

    if ((data.valid === true || data.valid === 1) && data.category === "4WN") {
      // Extract only the needed information
      const extractedData = {
        registrationNumber: registrationNumber.trim(),
        brand: data.makerDescription || 'Not detected',
        model: data.makerModel || 'Not detected',
        fuelType: data.fuelType || 'Not detected',
        owner: data.owner || 'Not detected',
        color: data.colorType || 'Not detected',
        chassisNumber: data.chassisNumber || 'Not detected',
        engineNumber: data.engineNumber || 'Not detected',
        status: data.status || 'Not detected',
        rawData: data
      };

      setRegResult(extractedData);
      await autoPopulateFromRegData(extractedData);
    } else if ((data.valid === true || data.valid === 1) && (data.category !== "4WN" || data.categoryDescription?.toUpperCase().includes("LMV") || data.categoryDescription?.toUpperCase().includes("CAR"))) {
      // showAlert("Vehicle registration number not found or invalid");
      // setRegResult(null);
    } else {
      // showAlert("Vehicle registration number not found or invalid");
      // setRegResult(null);
    }

  } catch (error) {
    console.error("Registration lookup failed:", error);
    showAlert("Failed to lookup registration number. Please try again or use manual selection.");
  } finally {
    setIsProcessingReg(false);
  }
};


  const autoPopulateFromRegData = async (data) => {
    if (!data.brand || data.brand === 'Not detected') return;

    try {
      // Extract brand name from makerDescription (e.g., "MARUTI SUZUKI INDIA LTD." -> "MARUTI")
      let brandName = data.brand;
      if (brandName.includes('MARUTI')) {
        brandName = 'MARUTI';
      } else if (brandName.includes('HYUNDAI')) {
        brandName = 'HYUNDAI';
      } else if (brandName.includes('TATA')) {
        brandName = 'TATA';
      } else if (brandName.includes('MAHINDRA')) {
        brandName = 'MAHINDRA';
      } else if (brandName.includes('TOYOTA')) {
        brandName = 'TOYOTA';
      } else if (brandName.includes('HONDA')) {
        brandName = 'HONDA';
      } else if (brandName.includes('FORD')) {
        brandName = 'FORD';
      } else if (brandName.includes('VOLKSWAGEN')) {
        brandName = 'VOLKSWAGEN';
      } else if (brandName.includes('NISSAN')) {
        brandName = 'NISSAN';
      } else if (brandName.includes('RENAULT')) {
        brandName = 'RENAULT';
      } else if (brandName.includes('SKODA')) {
        brandName = 'SKODA';
      } else if (brandName.includes('FIAT')) {
        brandName = 'FIAT';
      } else if (brandName.includes('CHEVROLET')) {
        brandName = 'CHEVROLET';
      } else if (brandName.includes('AUDI')) {
        brandName = 'AUDI';
      } else if (brandName.includes('BMW')) {
        brandName = 'BMW';
      } else if (brandName.includes('MERCEDES')) {
        brandName = 'MERCEDES';
      }

      // Find matching brand
      const matchedBrand = brands.find(b =>
        b.name.toLowerCase().includes(brandName.toLowerCase()) ||
        brandName.toLowerCase().includes(b.name.toLowerCase())
      );

      if (matchedBrand) {
        setBrand(matchedBrand.id);
        await fetchModels(matchedBrand.id);

        // Find matching fuel type
        if (data.fuelType && data.fuelType !== 'Not detected') {
          const matchedFuel = fuels.find(f =>
            f.name.toLowerCase().includes(data.fuelType.toLowerCase()) ||
            data.fuelType.toLowerCase().includes(f.name.toLowerCase())
          );
          if (matchedFuel) {
            setFuel(matchedFuel.id);
          }
        }
      }
    } catch (error) {
      console.error("Failed to auto-populate car details:", error);
    }
  };

  const resetRegScanner = () => {
    setRegistrationNumber("");
    setRegResult(null);
    setBrand(null);
    setModel("");
    setFuel("");
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
      fuel: fuels.find((f) => f.id === fuel),
    };

    localStorage.setItem("selectedCarDetails", JSON.stringify(selectedCarDetails));

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.identifier) {
      const userCarKey = `selectedCar_${user.identifier}`;
      localStorage.setItem(userCarKey, JSON.stringify(selectedCarDetails));
    }
    if (onCarSaved) {
      onCarSaved(selectedCarDetails);
    }
    localStorage.removeItem("cartItems");

      setTimeout(() => {
        window.location.reload();
      }, 500);

    console.log("Saved Car:", selectedCarDetails);

    // onClose();
  };

  const handleBrandSelect = (id) => {
    setBrand(id);
    setModel("");
    setShowBrandPopup(false);
    fetchModels(id);
    setTimeout(() => {
      setShowModelPopup(true);
    }, 100);
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

        {/* Tab Navigation */}
        <div className="tab-navigation mb-4">
          <div className="nav nav-tabs" id="carSelectionTabs" role="tablist">
            <button
              className={`nav-link ${activeTab === "reg" ? "active" : ""}`}
              onClick={() => setActiveTab("reg")}
              type="button"
            >
              <i className="fas fa-search me-2"></i>
              Registration Lookup
            </button>
            <button
              className={`nav-link ${activeTab === "manual" ? "active" : ""}`}
              onClick={() => setActiveTab("manual")}
              type="button"
            >
              <i className="fas fa-hand-paper me-2"></i>
              Manual Selection
            </button>
          </div>
        </div>

        {/* Bootstrap Grid Layout */}
        <div className="row">
          {/* Left Column - Registration Number Lookup */}
          <div className="col-md-6">
            {activeTab === "reg" && (
              <div className="reg-lookup-section">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="form-label mb-0">Vehicle Registration Lookup</label>
                  <small className="text-muted">(Auto-detect)</small>
                </div>

                <div className="reg-input-area">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Registration Number (e.g., TS15FH4090)"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                      style={{ textTransform: 'uppercase' }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={lookupRegistrationNumber}
                      disabled={isProcessingReg || !registrationNumber.trim()}
                    >
                      {isProcessingReg ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Looking up...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search me-2"></i>
                          Lookup
                        </>
                      )}
                    </button>
                  </div>

                  <div className="lookup-instructions">
                    <p className="small text-muted mb-2">
                      Enter your vehicle registration number to automatically fetch car details
                    </p>
                    <div className="alert alert-info py-2 small">
                      <i className="fas fa-info-circle me-2"></i>
                      This will fetch brand, model, and fuel type information from the RTO database
                    </div>
                  </div>
                </div>

                {/* Registration Lookup Results */}
                {regResult && (
                  <div className="reg-result mt-3 p-3 bg-light rounded">
                    <h6 className="text-success mb-2">Vehicle Information:</h6>
                    <div className="row g-2">
                      <div className="col-6">
                        <small className="text-muted">Reg. No:</small>
                        <div className="fw-bold">{regResult.registrationNumber}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Owner:</small>
                        <div className="fw-bold">{regResult.owner}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Brand:</small>
                        <div className="fw-bold">{regResult.brand}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Model:</small>
                        <div className="fw-bold">{regResult.model}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Fuel Type:</small>
                        <div className="fw-bold">{regResult.fuelType}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Color:</small>
                        <div className="fw-bold">{regResult.color}</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={resetRegScanner}
                      >
                        <i className="fas fa-redo me-2"></i>
                        Lookup Different Vehicle
                      </button>
                    </div>

                    {regResult.rawData && (
                      <details className="mt-2">
                        <summary className="text-muted small">View complete data</summary>
                        <pre className="text-xs mt-2 p-2 bg-white rounded border" style={{fontSize: '10px'}}>
                          {JSON.stringify(regResult.rawData, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Manual Selection */}
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Choose Brand & Model</label>
                <div className="d-flex gap-3 flex-wrap justify-content-between">

                  {/* Brand Card */}
                  <div
                    onClick={() => {
                      if (!loadingBrands) setShowBrandPopup(true);
                    }}
                    className={`rounded shadow-sm text-center p-3 car-box ${brand ? "border-primary border-2" : "border"
                      } bg-white hover-shadow`}
                    style={{
                      width: 120,
                      height: 120,
                      cursor: loadingBrands ? "not-allowed" : "pointer",
                      transition: "0.3s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: loadingBrands ? 0.6 : 1,
                    }}
                  >
                    <div className="fw-semibold small mb-2 text-dark">Brand</div>
                    {loadingBrands ? (
                      <div
                        className="skeleton-loader"
                        style={{
                          width: 70,
                          height: 70,
                          backgroundColor: "#e0e0e0",
                          borderRadius: "4px",
                          animation: "pulse 1.5s ease-in-out infinite",
                        }}
                      ></div>
                    ) : brand ? (
                      <img
                        src={brands.find((b) => b.id === brand)?.logo}
                        alt="Brand Logo"
                        style={{ width: 70, height: 70, objectFit: "contain" }}
                      />
                    ) : (
                      <div className="text-muted small">Choose</div>
                    )}
                  </div>

                  {/* Model Card */}
                  <div
                    onClick={() => {
                      if (!loadingModels && brand) setShowModelPopup(true);
                    }}
                    className={`rounded shadow-sm text-center p-3 car-box ${model ? "border-primary border-2" : "border"
                      } bg-white hover-shadow`}
                    style={{
                      width: 120,
                      height: 120,
                      cursor: loadingModels || !brand ? "not-allowed" : "pointer",
                      opacity: loadingModels || !brand ? 0.6 : 1,
                      transition: "0.3s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="fw-semibold small mb-2 text-dark">Model</div>
                    {loadingModels ? (
                      <div
                        className="skeleton-loader"
                        style={{
                          width: 70,
                          height: 70,
                          backgroundColor: "#e0e0e0",
                          borderRadius: "4px",
                          animation: "pulse 1.5s ease-in-out infinite",
                        }}
                      ></div>
                    ) : model ? (
                      <img
                        src={models.find((m) => m.id === model)?.logo}
                        alt="Model Image"
                        style={{ width: 70, height: 70, objectFit: "contain" }}
                      />
                    ) : (
                      <div className="text-muted small">Choose</div>
                    )}
                  </div>

                </div>

                {/* Chosen result display */}
                {(brand || model) && (
                  <div className="mt-3 px-2 py-1 bg-white rounded shadow-sm text-center small fw-bold text-secondary">
                    {brand && brands.find((b) => b.id === brand)?.name}
                    {brand && model && " - "}
                    {model && models.find((m) => m.id === model)?.name}
                  </div>
                )}
              </div>

              {/* Fuel Type Section */}
              {model && (
                <div className="mb-4">
                  <label className="form-label">Fuel Type</label>
                  <div className="d-flex gap-3 flex-wrap">
                    {fuels.map((f) => (
                      <div
                        key={f.id}
                        className={`text-center px-2 py-2 border rounded shadow-sm ${fuel === f.id ? "border-primary" : ""}`}
                        style={{ cursor: "pointer", width: 100 }}
                        onClick={() => setFuel(f.id)}
                      >
                        <img
                          src={f.image}
                          alt={f.name}
                          style={{ width: "40px", height: "40px", objectFit: "contain" }}
                        />
                        <small className="d-block mt-1">{f.name}</small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="d-flex justify-content-center gap-2">
                <button type="button" className="btn btn-light py-2 px-4" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary py-2 px-4">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

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
          loading={loadingModels}
        />
      )}
    </div>
  );
};

export default ChooseCarModal;
