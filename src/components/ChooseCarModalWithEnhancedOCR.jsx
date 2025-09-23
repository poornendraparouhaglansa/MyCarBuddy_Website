import React, { useEffect, useRef, useState } from "react";
import "./ChooseCarModalWithScanner.css";
import BrandPopup from "./BrandPopup";
import ModelPopup from "./ModelPopup";
import axios from "axios";
import { createWorker } from 'tesseract.js';

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

  // RC Scanner states
  const [rcImages, setRcImages] = useState({ front: null, back: null });
  const [rcImagePreviews, setRcImagePreviews] = useState({ front: null, back: null });
  const [isProcessingRC, setIsProcessingRC] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [useScanner, setUseScanner] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

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

  // RC Scanner Functions
  const handleRCImageUpload = (event, side) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const newImages = { ...rcImages, [side]: file };
      setRcImages(newImages);

      const reader = new FileReader();
      reader.onload = (e) => {
        const newPreviews = { ...rcImagePreviews, [side]: e.target.result };
        setRcImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const processRCImages = async () => {
    const { front, back } = rcImages;
    if (!front && !back) return;

    setIsProcessingRC(true);
    setOcrProgress(0);

    try {
      const worker = await createWorker('eng');

      worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-/ ',
      });

      let combinedText = '';

      // Process front image if available
      if (front) {
        const { data: { text: frontText } } = await worker.recognize(front);
        combinedText += frontText + ' ';
      }

      // Process back image if available
      if (back) {
        const { data: { text: backText } } = await worker.recognize(back);
        combinedText += backText + ' ';
      }

      await worker.terminate();

      console.log('Combined OCR Text:', combinedText);

      // Extract information from OCR text using API brands
      const extractedData = extractCarInfoFromOCR(combinedText, brands);
      setOcrResult(extractedData);

      if (extractedData) {
        await autoPopulateCarDetails(extractedData);
      }

    } catch (error) {
      console.error("OCR processing failed:", error);
      alert("Failed to process RC images. Please try again or use manual selection.");
    } finally {
      setIsProcessingRC(false);
      setOcrProgress(0);
    }
  };

  const extractCarInfoFromOCR = (ocrText, availableBrands = []) => {
    const text = ocrText.toLowerCase();

    // Use API brands if available, otherwise fallback to common brands
    let brandList = [];
    if (availableBrands && availableBrands.length > 0) {
      brandList = availableBrands.map(b => ({
        name: b.name.toLowerCase(),
        displayName: b.name,
        id: b.id
      }));
    } else {
      // Fallback to common brands if API data not available
      brandList = [
        'maruti', 'suzuki', 'hyundai', 'tata', 'mahindra', 'toyota', 'honda',
        'ford', 'volkswagen', 'nissan', 'renault', 'skoda', 'fiat', 'chevrolet',
        'audi', 'bmw', 'mercedes', 'jaguar', 'land rover', 'volvo', 'kia',
        'mg', 'jeep', 'isuzu', 'force', 'premier', 'hindustan', 'ambassador'
      ].map(name => ({ name: name.toLowerCase(), displayName: name, id: null }));
    }

    // Common fuel types
    const fuelTypes = ['petrol', 'diesel', 'cng', 'lpg', 'electric', 'hybrid'];

    // Find brand with comprehensive matching
    let detectedBrand = null;
    let matchedBrandId = null;
    let brandConfidence = 0;

    for (const apiBrand of brandList) {
      const brandName = apiBrand.name;

      // Exact match with API brand name
      if (text.includes(brandName)) {
        detectedBrand = apiBrand.displayName;
        matchedBrandId = apiBrand.id;
        brandConfidence = 1.0;
        break;
      }

      // Check for common variations and misspellings
      const variations = getBrandVariations(brandName);
      for (const variation of variations) {
        if (text.includes(variation)) {
          detectedBrand = apiBrand.displayName;
          matchedBrandId = apiBrand.id;
          brandConfidence = 0.8;
          break;
        }
      }

      if (detectedBrand) break;
    }

    // Find fuel type
    let detectedFuel = null;
    let fuelConfidence = 0;
    for (const fuel of fuelTypes) {
      if (text.includes(fuel)) {
        detectedFuel = fuel.charAt(0).toUpperCase() + fuel.slice(1);
        fuelConfidence = 1.0;
        break;
      }
    }

    // Extract registration number (common patterns)
    const regNumberPatterns = [
      /[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}/g,
      /[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}/g,
      /[A-Z]{3}[0-9]{4}/g
    ];

    let registrationNumber = null;
    for (const pattern of regNumberPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        registrationNumber = matches[0].toUpperCase();
        break;
      }
    }

    // Try to find model with comprehensive matching
    let detectedModel = null;
    let modelConfidence = 0;

    if (detectedBrand) {
      const brandLower = detectedBrand.toLowerCase();
      const brandIndex = text.indexOf(brandLower);
      if (brandIndex !== -1) {
        const afterBrand = text.substring(brandIndex + brandLower.length, brandIndex + brandLower.length + 150);

        // Common model patterns
        const modelPatterns = [
          // Look for model names (1-4 words after brand)
          /([a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+){0,3})/,
          // Look for specific model indicators
          /(?:model[:\s]+)([a-zA-Z0-9\s]+)/i,
          /(?:type[:\s]+)([a-zA-Z0-9\s]+)/i,
          /(?:variant[:\s]+)([a-zA-Z0-9\s]+)/i,
          // Look for common model names after brand
          /(?:[a-zA-Z]+\s+)([a-zA-Z0-9\s]{2,20})/
        ];

        for (const pattern of modelPatterns) {
          const match = afterBrand.match(pattern);
          if (match && match[1] && match[1].length > 2 && match[1].length < 30) {
            let model = match[1].trim();
            // Clean up common words
            model = model.replace(/\b(motor|company|india|ltd|pvt|limited|car|vehicle|auto|motor|co|ind)\b/gi, '').trim();
            if (model.length > 1) {
              detectedModel = model.charAt(0).toUpperCase() + model.slice(1);
              modelConfidence = 0.8;
              break;
            }
          }
        }
      }
    }

    // Extract owner name with comprehensive patterns
    let ownerName = null;
    const namePatterns = [
      /name[:\s]*([A-Z\s]{3,})/gi,
      /owner[:\s]*([A-Z\s]{3,})/gi,
      /([A-Z]{2,}\s+[A-Z]{2,})/g,
      // Look for patterns like "S/O" or "D/O" followed by name
      /(?:s\/o|d\/o|w\/o)[:\s]*([A-Z\s]{3,})/gi,
      // Look for address patterns that might contain name
      /^([A-Z\s]{5,30})/gm,
      // Look for name before address indicators
      /([A-Z\s]{3,})\s*(?:s\/o|d\/o|w\/o)/gi
    ];

    for (const pattern of namePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          let name = match.replace(/name[:\s]*|owner[:\s]*|s\/o[:\s]*|d\/o[:\s]*|w\/o[:\s]*/gi, '').trim();
          if (name.length > 2 && name.length < 50 && !name.match(/\d{4,}/)) {
            ownerName = name;
            break;
          }
        }
      }
      if (ownerName) break;
    }

    return {
      brand: detectedBrand,
      brandId: matchedBrandId,
      model: detectedModel,
      fuelType: detectedFuel,
      registrationNumber: registrationNumber,
      ownerName: ownerName,
      brandConfidence: brandConfidence,
      modelConfidence: modelConfidence,
      fuelConfidence: fuelConfidence,
      rawText: ocrText
    };
  };

  // Helper function to get brand variations and misspellings
  const getBrandVariations = (brandName) => {
    const variations = [];

    // Add common misspellings based on brand
    switch (brandName) {
      case 'maruti':
        variations.push('maruthi', 'maruti suzuki', 'maruti-suzuki', 'suzuki', 'maruti udyog');
        break;
      case 'hyundai':
        variations.push('hyndai', 'hundai', 'hyundai motor', 'hyundai motors');
        break;
      case 'tata':
        variations.push('tata motors', 'tata motor', 'telco');
        break;
      case 'mahindra':
        variations.push('mahindra & mahindra', 'm&m', 'mahindra mahindra', 'mahendra', 'mahinder');
        break;
      case 'toyota':
        variations.push('toyota kirloskar', 'toyota india', 'toyata');
        break;
      case 'honda':
        variations.push('honda cars', 'honda india', 'hond');
        break;
      case 'ford':
        variations.push('ford india', 'ford motors', 'frod');
        break;
      case 'volkswagen':
        variations.push('vw', 'volkswagon', 'volkswagen india', 'volkswagan');
        break;
      case 'nissan':
        variations.push('nissan motor', 'nissan india', 'nison');
        break;
      case 'renault':
        variations.push('renault india', 'renault nissan', 'renalt', 'renolt');
        break;
      case 'skoda':
        variations.push('skoda auto', 'skoda india', 'skod');
        break;
      case 'fiat':
        variations.push('fiat india', 'fiat automobiles', 'fiate');
        break;
      case 'chevrolet':
        variations.push('chevy', 'gm', 'general motors', 'chevrolate');
        break;
      case 'audi':
        variations.push('audi ag', 'audi india', 'aud');
        break;
      case 'bmw':
        variations.push('bmw india', 'bmw group', 'bmv');
        break;
      case 'mercedes':
        variations.push('mercedes-benz', 'benz', 'mercedes benz', 'mercedez', 'merceds');
        break;
      case 'jaguar':
        variations.push('jaguar land rover', 'jaguar india');
        break;
      case 'land rover':
        variations.push('landrover', 'lr', 'land rover india');
        break;
      case 'volvo':
        variations.push('volvo cars', 'volvo india');
        break;
      case 'kia':
        variations.push('kia motors', 'kia india');
        break;
      case 'mg':
        variations.push('mg motor', 'morris garages', 'mg india');
        break;
      case 'jeep':
        variations.push('jeep india', 'fca india');
        break;
      default:
        // For unknown brands, add some generic variations
        variations.push(brandName + ' motor', brandName + ' motors', brandName + ' india');
    }

    return variations;
  };

  const autoPopulateCarDetails = async (data) => {
    if (!data.brand) return;

    try {
      // Find matching brand
      const matchedBrand = brands.find(b =>
        b.name.toLowerCase().includes(data.brand.toLowerCase()) ||
        data.brand.toLowerCase().includes(b.name.toLowerCase())
      );

      if (matchedBrand) {
        setBrand(matchedBrand.id);
        await fetchModels(matchedBrand.id);

        // Find matching model if available
        if (data.model) {
          const matchedModel = models.find(m =>
            m.name.toLowerCase().includes(data.model.toLowerCase()) ||
            data.model.toLowerCase().includes(m.name.toLowerCase())
          );
          if (matchedModel) {
            setModel(matchedModel.id);
          }
        }

        // Find matching fuel type if available
        if (data.fuelType) {
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

  const resetScanner = () => {
    setRcImages({ front: null, back: null });
    setRcImagePreviews({ front: null, back: null });
    setOcrResult(null);
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

        {/* Bootstrap Grid Layout */}
        <div className="row">
          {/* Left Column - RC Scanner */}
          <div className="col-md-6">
            <div className="rc-scanner-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label mb-0">RC Scanner</label>
                <small className="text-muted">(Auto-detect)</small>
              </div>

              <div className="rc-upload-area">
                <div className="upload-instructions mb-3">
                  <p className="small text-muted">Upload front and back of your RC for best results</p>
                </div>

                <div className="dual-upload-area">
                  {/* Front RC Upload */}
                  <div className="upload-side">
                    <label className="side-label">Front Side</label>
                    {!rcImagePreviews.front ? (
                      <div
                        className="upload-zone"
                        onClick={() => document.getElementById('rc-front-input').click()}
                      >
                        <div className="upload-content">
                          <i className="fas fa-camera upload-icon"></i>
                          <p>Front RC</p>
                        </div>
                        <input
                          id="rc-front-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleRCImageUpload(e, 'front')}
                          style={{ display: 'none' }}
                        />
                      </div>
                    ) : (
                      <div className="image-preview-container">
                        <div className="image-preview">
                          <img src={rcImagePreviews.front} alt="RC Front Preview" />
                          <button
                            className="btn-close"
                            onClick={() => {
                              setRcImages({...rcImages, front: null});
                              setRcImagePreviews({...rcImagePreviews, front: null});
                            }}
                            aria-label="Remove front image"
                          ></button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Back RC Upload */}
                  <div className="upload-side">
                    <label className="side-label">Back Side</label>
                    {!rcImagePreviews.back ? (
                      <div
                        className="upload-zone"
                        onClick={() => document.getElementById('rc-back-input').click()}
                      >
                        <div className="upload-content">
                          <i className="fas fa-camera upload-icon"></i>
                          <p>Back RC</p>
                        </div>
                        <input
                          id="rc-back-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleRCImageUpload(e, 'back')}
                          style={{ display: 'none' }}
                        />
                      </div>
                    ) : (
                      <div className="image-preview-container">
                        <div className="image-preview">
                          <img src={rcImagePreviews.back} alt="RC Back Preview" />
                          <button
                            className="btn-close"
                            onClick={() => {
                              setRcImages({...rcImages, back: null});
                              setRcImagePreviews({...rcImagePreviews, back: null});
                            }}
                            aria-label="Remove back image"
                          ></button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scan Button */}
                {(rcImages.front || rcImages.back) && (
                  <div className="scan-controls">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={processRCImages}
                      disabled={isProcessingRC}
                    >
                      {isProcessingRC ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-robot me-2"></i>
                          Scan RC
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={resetScanner}
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>

              {/* OCR Results */}
              {ocrResult && (
                <div className="ocr-result mt-3 p-3 bg-light rounded">
                  <h6 className="text-success mb-2">Detected Information:</h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <small className="text-muted">Owner Name:</small>
                      <div className="fw-bold">{ocrResult.ownerName || 'Not detected'}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Reg. No:</small>
                      <div className="fw-bold">{ocrResult.registrationNumber || 'Not detected'}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Brand:</small>
                      <div className="fw-bold">{ocrResult.brand || 'Not detected'}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Model:</small>
                      <div className="fw-bold">{ocrResult.model || 'Not detected'}</div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Fuel Type:</small>
                      <div className="fw-bold">{ocrResult.fuelType || 'Not detected'}</div>
                    </div>
                  </div>
                  {ocrResult.rawText && (
                    <details className="mt-2">
                      <summary className="text-muted small">View extracted text</summary>
                      <pre className="text-xs mt-2 p-2 bg-white rounded border" style={{fontSize: '10px'}}>
                        {ocrResult.rawText}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Manual Selection (Original Design) */}
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
