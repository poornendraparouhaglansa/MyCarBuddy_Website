import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const BookingVehicleDetails = ({
  vehicle,
  setVehicle,
  registrationNumber,
  setRegistrationNumber,
  allowCarSelection = true,
  formData,
  handlereInputChange,
  setFormData,
}) => {
  const [savedCars, setSavedCars] = useState([]);
  const [errors, setErrors] = useState({}); // ✅ Validation errors
  const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;

  const handleCarSelect = (e) => {
    const selectedId = e.target.value;
    const selected = savedCars.find((car) => car.id.toString() === selectedId);
    if (selected) {
      setVehicle({
        brand: { brandName: selected.brandName, id: selected.brandID },
        model: { modelName: selected.modelName, id: selected.modelID },
        fuelType: { fuelTypeName: selected.fuelType, id: selected.fuelTypeID },
      });

      setRegistrationNumber(selected.registrationNumber);
    }
  };

  // ✅ Validation logic
  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "registrationNumber") {
      if (!/^[A-Z0-9-]{5,15}$/i.test(value)) {
        errorMsg =
          "Registration number must be 5–15 characters (letters, numbers, dashes).";
      }
    }

    if (name === "yearOfPurchase") {
      const currentYear = new Date().getFullYear();
      if (!/^\d{4}$/.test(value) || value < 1900 || value > currentYear) {
        errorMsg = `Enter a valid year between 1900 and ${currentYear}.`;
      }
    }

    if (name === "kilometerDriven") {
      if (!/^\d+$/.test(value) || parseInt(value) < 0) {
        errorMsg = "Kilometers must be a positive number.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChangeWithValidation = (e) => {
    const { name, value } = e.target;
    handlereInputChange(e);
    validateField(name, value);
  };

  useEffect(() => {
    const localVehicle = JSON.parse(localStorage.getItem("selectedCarDetails"));
    if (localVehicle) {
      setSavedCars(localVehicle);
      setVehicle({
        brand: { brandName: localVehicle.brandName, id: localVehicle.brandID },
        model: { modelName: localVehicle.modelName, id: localVehicle.modelID },
        fuelType: {
          fuelTypeName: localVehicle.fuelType,
          id: localVehicle.fuelTypeID,
        },
      });
      setRegistrationNumber(localVehicle.registrationNumber || "");
    }
    console.log("Vehicle loaded from localStorage:", localVehicle);
  }, []);

  if (!vehicle) return null;

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h5 className="mb-3 text-primary fw-bold">🚗 Vehicle Information</h5>

      {allowCarSelection && savedCars.length > 0 && (
        <div className="mb-3">
          <label className="form-label fw-semibold">Choose from Saved Cars</label>
          <select
            className="form-select"
            onChange={handleCarSelect}
            defaultValue=""
          >
            <option value="" disabled>
              -- Select a Saved Car --
            </option>
            {savedCars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.brandName} - {car.modelName} ({car.registrationNumber})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="row">
        <div className="col-md-8 mb-3">
          <div className="row">
            {/* Registration Number */}
            <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Registration Number <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  className={`form-control ${errors.registrationNumber ? "is-invalid" : ""}`}
                  placeholder="Enter Registration Number"
                  value={formData.registrationNumber || registrationNumber || ""}
                  onChange={(e) => {
                    const upperValue = e.target.value.toUpperCase();
                    handleChangeWithValidation({ target: { name: "registrationNumber", value: upperValue } });
                  }}
                  style={{ textTransform: "uppercase" }}
                />
                {errors.registrationNumber && (
                  <div className="invalid-feedback">{errors.registrationNumber}</div>
                )}
              </div>

            {/* Year of Purchase */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Year of Purchase <span className="text-danger">*</span></label>
              <input
                type="text"
                name="yearOfPurchase"
                className={`form-control ${errors.yearOfPurchase ? "is-invalid" : ""}`}
                placeholder="e.g., 2020"
                value={formData.yearOfPurchase}
                onChange={handleChangeWithValidation}
              />
              {errors.yearOfPurchase && (
                <div className="invalid-feedback">{errors.yearOfPurchase}</div>
              )}
            </div>

            {/* Engine Type */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Engine Type</label>
              <input
                type="text"
                name="engineType"
                className="form-control"
                placeholder="e.g., VVT"
                value={formData.engineType}
                onChange={handlereInputChange}
              />
            </div>

            {/* Kilometer Driven */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Kilometer Driven</label>
              <input
                type="text"
                name="kilometerDriven"
                className={`form-control ${errors.kilometerDriven ? "is-invalid" : ""}`}
                placeholder="e.g., 25000"
                value={formData.kilometerDriven}
                onChange={handleChangeWithValidation}
              />
              {errors.kilometerDriven && (
                <div className="invalid-feedback">{errors.kilometerDriven}</div>
              )}
            </div>

            {/* Transmission */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Transmission Type</label>
              <select
                name="transmissionType"
                className="form-select"
                value={formData.transmissionType}
                onChange={handlereInputChange}
              >
                <option value="">Select</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Car Image */}
        <div className="col-md-4 mb-3">
          <input type="hidden" name="brandID" value={vehicle.brand?.id || ""} />
          <input type="hidden" name="modelID" value={vehicle.model?.id || ""} />
          <input
            type="hidden"
            name="fuelTypeID"
            value={vehicle.fuelType?.id || ""}
          />

          {savedCars ? (
            <>
              <img
                src={savedCars.model?.logo || "https://via.placeholder.com/50"}
                alt={savedCars.model?.name}
                style={{
                  width: 150,
                  height: 150,
                  objectFit: "contain",
                  backgroundColor: "#fff",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "10px",
                }}
              >
                <small style={{ fontSize: "12px", color: "#555" }}>
                  {savedCars.brand?.name}
                </small>
                <strong>{savedCars.model?.name}</strong>
              </div>
            </>
          ) : (
            <span style={{ textDecoration: "underline" }}>Choose Your Car</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingVehicleDetails;
