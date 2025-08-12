import React, { useEffect, useRef, useState } from "react";
import Car from "../images/car.avif";
import axios from "axios";
import BrandPopup from "./BrandPopup"; 
import CryptoJS from "crypto-js";

const MyCarList = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const baseUrl = process.env.REACT_APP_CARBUDDY_BASE_URL;
  const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;
  const bytes = CryptoJS.AES.decrypt(user.id, secretKey);
  const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);

  const [primaryCarId, setPrimaryCarId] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewCar, setViewCar] = useState(null); 


    const BASE_URL = process.env.REACT_APP_CARBUDDY_BASE_URL;
    const IMAGE_BASE_URL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;
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
    const imageBaseURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;
    const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;

  const [carList, setCarList] = useState([]);

  const [formData, setFormData] = useState({
    brandID: "",
    modelID: "",
    fuelTypeID: "",
    registrationNumber: "",
    yearOfPurchase: "",
    engineType: "",
    kilometerDriven: "",
    transmissionType: "",
  });

  useEffect(() => {
    fetchMYCars();
  }, []);

  const fetchMYCars = async () => {
    try {
    
        const response = await axios.get(`${baseUrl}CustomerVehicles/CustId?CustId=${decryptedCustId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); 
          setCarList(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
        // alert("Failed to load cars. Please try again later.");
    }
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

  
  const fetchModels = async (brandId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.get(`${BASE_URL}VehicleModels/GetListVehicleModel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data?.status && Array.isArray(response.data.data)) {
        const getImageUrl = (path) => {
          if (!path) return "https://via.placeholder.com/100?text=No+Image";
          const fileName = path.split('/').pop();
          return  `${imageBaseURL}${path.startsWith("/") ? path.slice(1) : path}`;
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

  const handleModelSelect = (id) => {
    setModel(id);
    setShowModelPopup(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCar = async () => {
    try {
      await axios.post(`${baseUrl}CustomerVehicles/InsertCustomerVehicle`, {
        custID: decryptedCustId,
        brandID: formData.brandID,
        modelID: formData.modelID,
        fuelTypeID: formData.fuelTypeID,
        VehicleNumber: formData.registrationNumber,
        yearOfPurchase: formData.yearOfPurchase,
        engineType: formData.engineType,
        kilometersDriven: formData.kilometerDriven,
        transmissionType: formData.transmissionType,
        CreatedBy: decryptedCustId,
      });

      alert("Car added successfully");
      setShowAddForm(false);
      // reload or update carList if needed
    } catch (error) {
      console.error("Failed to add car", error);
      alert("Failed to add car");
    }
  };

    const handleSetPrimary = async (id) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_CARBUDDY_BASE_URL}Customervehicles/primary-vehicle?VehicleID=${id}&CustId=${decryptedCustId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
  
        );
        const updatedVehicles = carList.map((car) => ({
          ...car,
          IsPrimary: car.VehicleID === id,
        }));

        // Find the selected car
            const selectedCar = updatedVehicles.find((car) => car.VehicleID === id);

            // Extract brand, model, and fuel from the selected car directly
            const selectedCarDetails = {
            brand: {
                id: selectedCar.BrandID,
                name: selectedCar.BrandName,
                logo: `${imageBaseURL}${selectedCar.BrandLogo}`,
              },
              model: {
                id: selectedCar.ModelID,
                name: selectedCar.ModelName,
                logo: `${imageBaseURL}${selectedCar.VehicleImage}`,
              },
              fuel: {
                id: selectedCar.FuelTypeID,
                name: selectedCar.FuelTypeName,
                logo: `${imageBaseURL}${selectedCar.FuelImage}`,
              },
            };

            // Store in localStorage
            localStorage.setItem("selectedCarDetails", JSON.stringify(selectedCarDetails));
        setCarList(updatedVehicles);
      } catch (error) {
        console.error("Error setting primary address:", error);
      }
    }; 

  // 📍 View mode
  if (viewCar) {
    return (
      <div className="container py-4">
 
  <div className="card p-4 shadow-sm">
    
    <div className="d-flex justify-content-end mb-4">
         <button className="btn btn-primary mb-3 px-3 py-2" onClick={() => setViewCar(null)}>
            <i className="bi bi-arrow-left" /> 
        </button>
    </div>
    <div className="text-center mb-3">
     <div className="d-flex justify-content-center gap-4">
            <div className="" >
                <img
                src={`${IMAGE_BASE_URL}${viewCar.VehicleImage}`}
                alt={viewCar.ModelName}
                className="img-fluid rounded"
                style={{ maxWidth: "180px", objectFit: "contain" }}
                />
                <h5 className="text-center">{viewCar.ModelName}</h5>
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <img
                    src={`${IMAGE_BASE_URL}${viewCar.FuelImage}`}
                    alt={viewCar.FuelTypeName}
                     className="img-fluid rounded"
                    style={{ maxWidth: "20px", objectFit: "contain" }}
                    />
                     <h5 className="text-center mb-0">{viewCar.FuelTypeName}</h5>
                </div>
                 {/* <div className="d-flex justify-content-center align-items-center gap-2">
                    <img
                    src={`${IMAGE_BASE_URL}${viewCar.BrandLogo}`}
                    alt={viewCar.FuelTypeName}
                     className="img-fluid rounded"
                    style={{ maxWidth: "20px", objectFit: "contain" }}
                    />
                     <h5 className="text-center mb-0">{viewCar.BrandName}</h5>
                </div>
                 */}
            </div>

            <div>
                  <ul className="list-group list-group-flush mt-3">
                        <li className="list-group-item">
                            <strong>Vehicle No:</strong> {viewCar.VehicleNumber}
                        </li>


                        <li className="list-group-item">
                            <strong>Engine Type:</strong> {viewCar.EngineType}
                        </li>
                        <li className="list-group-item">
                            <strong>Transmission:</strong> {viewCar.TransmissionType}
                        </li>
                        <li className="list-group-item">
                            <strong>Kilometers Driven:</strong> {viewCar.KilometersDriven}
                        </li>
                        <li className="list-group-item">
                            <strong>Year of Purchase:</strong> {viewCar.YearOfPurchase}
                        </li>
                        </ul>
            </div>
            

        </div>
      </div>

  
  </div>
</div>

    );
  }

  // 📍 Add Form mode
  if (showAddForm) {
    return (
      <div className="container py-4">
        <h4 className="fw-bold mb-4">Add New Car</h4>

       
        <div className="row g-3">
          {/* all input fields same as before */}

          <div
                onClick={() => {
                  setShowBrandPopup(true);
                }}
                className={`rounded shadow-sm text-center p-3 car-box ${brand ? "border-primary border-2" : "border"
                  } bg-white hover-shadow`}
                style={{
                  width: 120,
                  height: 120,
                  cursor: "pointer",
                  transition: "0.3s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="fw-semibold small mb-2 text-dark">Brand</div>
                {brand ? (
                  <img
                    src={brands.find((b) => b.id === brand)?.logo}
                    alt="Brand Logo"
                    style={{ width: 70, height: 70, objectFit: "contain" }}
                  />
                ) : (
                  <div className="text-muted small">Choose</div>
                )}
              </div>

          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Brand ID" name="brandID" value={formData.brandID} onChange={handleInputChange} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Model ID" name="modelID" value={formData.modelID} onChange={handleInputChange} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Fuel Type ID" name="fuelTypeID" value={formData.fuelTypeID} onChange={handleInputChange} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Year of Purchase" name="yearOfPurchase" value={formData.yearOfPurchase} onChange={handleInputChange} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Engine Type" name="engineType" value={formData.engineType} onChange={handleInputChange} />
          </div>
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Kilometers Driven" name="kilometerDriven" value={formData.kilometerDriven} onChange={handleInputChange} />
          </div>
          <div className="col-md-6">
            <select className="form-select" name="transmissionType" value={formData.transmissionType} onChange={handleInputChange}>
              <option value="">Select Transmission</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
        </div>
        <div className="mt-4 d-flex gap-3 justify-content-center">
          <button className="btn btn-success px-4 py-2" onClick={handleSaveCar}>Save</button>
          <button className="btn btn-secondary px-4 py-2" onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  // 📍 Car list mode
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">My Cars</h4>
        {/* <button className="btn btn-outline-primary d-flex align-items-center gap-2 px-3 py-2" onClick={() => setShowAddForm(true)}>
          <i className="bi bi-plus-circle" />
        </button> */}
      </div>

      <div className="row g-4">
        {carList.map((car) => {
          const isPrimary = car.VehicleID === primaryCarId;

          return (
            <div className="col-md-4" key={car.VehicleID}>
                
              <div className={`border rounded shadow-sm h-100 p-3 d-flex flex-column ${isPrimary ? "border-primary" : ""}`}>
                 <div className="d-flex justify-content-center mb-3">
                        {/* <i className={`bi ${isPrimary ? "bi-star-fill text-warning" : "bi-star"} fs-5 cursor-pointer`} title="Toggle Primary" role="button"  /> */}
                        <span className={`${car.IsPrimary ? "tab-pill active" : "tab-pill "}  px-2 py-0`}   onClick={() => handleSetPrimary(car.VehicleID)} style={{ lineHeight: "1.5", fontSize: "13px"}}>Primary</span>
                       
                </div> 
                <div className="row">
                    <div className="col-md-6 text-center mb-3"> 
                        <img src={`${IMAGE_BASE_URL}${car.VehicleImage}`} alt={car.modelName} className="mb-3 rounded w-100"  />
                    </div>
                    <div className="col-md-6">
                        <div className="text-muted small mb-2"><b>Model : </b>{car.ModelName}</div>
                        <div className="text-muted small mb-2"><b>FuelType : </b>{car.FuelTypeName}</div>
                       <div className="text-end">
                        <i className="bi bi-eye text-primary fs-5 cursor-pointer" title="View" role="button" onClick={() => setViewCar(car)} />
                         <i className="bi bi-trash text-danger fs-5 cursor-pointer" title="Delete" role="button" onClick={() => alert("Delete Car Coming Soon")} />
                        
                        </div>
                    </div>
                    
                </div>
              </div>
            </div>
          );
        })}
      </div>

      
            {showBrandPopup && (
              <BrandPopup
                brands={brands}
                selected={brand}
                onSelect={handleBrandSelect}
                onClose={() => setShowBrandPopup(false)}
              />
            )}

            

    </div>
  );
};

export default MyCarList;
