import React, { useEffect, useRef, useState } from "react";
import "./ChooseCarModal.css";
import BrandPopup from "./BrandPopup";
import ModelPopup from "./ModelPopup";
import axios from "axios";

const ChooseCarModal = ({ isVisible, onClose, onCarSaved }) => {
	const BASE_URL = process.env.REACT_APP_CARBUDDY_BASE_URL;
	const [selectionMethod, setSelectionMethod] = useState("registration"); // default to registration
	const [registrationNumber, setRegistrationNumber] = useState("");
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
	const [isProcessingReg, setIsProcessingReg] = useState(false);
	const [regResult, setRegResult] = useState(null);
	const modalRef = useRef();
	const imageBaseURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;
	const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;

	useEffect(() => {
		const fetchBrands = async () => {
			setLoadingBrands(true);
			try {
				const token = JSON.parse(localStorage.getItem("user"))?.token;
				const response = await axios.get(`${BASE_URL}VehicleBrands/GetVehicleBrands`, {
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
					const fileName = path.split("/").pop();
					return `${imageBaseURL}${path.startsWith("/") ? path.slice(1) : path}`;
				};
				const filteredModels = response.data
					.filter((m) => m.BrandID === brandId && m.IsActive)
					.map((m) => ({
						id: m.ModelID,
						name: m.ModelName,
						logo: getImageUrl(m.VehicleImage),
					}));

				setModels(filteredModels);
				return filteredModels; // return models so callers don't rely on async state
			} else {
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
					.filter((f) => f.IsActive)
					.map((f) => {
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
			// Use the actual API endpoint
			const response = await axios.get(
				`${BaseURL}CustomerVehicles/VehicleNumber?VehicleNumber=${encodeURIComponent(registrationNumber.trim())}`
			);

			if (response.data && Array.isArray(response.data) && response.data.length > 0) {
				const vehicleData = response.data[0];
				
				// Extract and format the data
				const extractedData = {
					registrationNumber: vehicleData.VehicleNumber,
					brand: vehicleData.BrandName || 'Not detected',
					model: vehicleData.ModelName || 'Not detected',
					fuelType: vehicleData.FuelTypeName || 'Not detected',
					yearOfPurchase: vehicleData.YearOfPurchase || 'Not detected',
					engineType: vehicleData.EngineType || 'Not detected',
					kilometersDriven: vehicleData.KilometersDriven || 'Not detected',
					transmissionType: vehicleData.TransmissionType || 'Not detected',
					brandID: vehicleData.BrandID,
					modelID: vehicleData.ModelID,
					fuelTypeID: vehicleData.FuelTypeID,
					brandLogo: vehicleData.BrandLogo,
					vehicleImage: vehicleData.VehicleImage,
					rawData: vehicleData
				};

				setRegResult(extractedData);
				await autoPopulateFromVehicleData(extractedData);
			} else {
				alert("Vehicle registration number not found or invalid");
				setRegResult(null);
			}

		} catch (error) {
			console.error("Registration lookup failed:", error);
			alert("Failed to lookup registration number. Please try again or use manual selection.");
		} finally {
			setIsProcessingReg(false);
		}
	};

	// Auto-populate car details from vehicle data
	const autoPopulateFromVehicleData = async (data) => {
		try {
			// Set brand directly using BrandID if available
			if (data.brandID) {
				setBrand(data.brandID);
				
				// Fetch models for the brand
				const loadedModels = await fetchModels(data.brandID);
				
				// Set model directly using ModelID if available
				if (data.modelID) {
					setModel(data.modelID);
					
					// Update the models state to include the vehicle image from API
					if (data.vehicleImage) {
						const updatedModels = loadedModels.map(model => {
							if (model.id === data.modelID) {
								return {
									...model,
									logo: `${imageBaseURL}${data.vehicleImage.startsWith("/") ? data.vehicleImage.slice(1) : data.vehicleImage}`
								};
							}
							return model;
						});
						setModels(updatedModels);
					}
				}
			}

			// Set fuel type directly using FuelTypeID if available
			if (data.fuelTypeID) {
				setFuel(data.fuelTypeID);
			}

			// Fallback to name matching if IDs are not available
			if (!data.brandID && data.brand && data.brand !== 'Not detected') {
				const brandName = data.brand;
				const matchedBrand = brands.find(b =>
					b.name.toLowerCase().includes(brandName.toLowerCase()) ||
					brandName.toLowerCase().includes(b.name.toLowerCase())
				);

				if (matchedBrand) {
					setBrand(matchedBrand.id);
					const loadedModels = await fetchModels(matchedBrand.id);

					if (data.model && data.model !== 'Not detected') {
						const modelName = data.model.toLowerCase();
						const searchList = Array.isArray(loadedModels) && loadedModels.length ? loadedModels : models;
						const matchedModel = searchList.find(m =>
							m.name.toLowerCase().includes(modelName) ||
							modelName.includes(m.name.toLowerCase())
						);

						if (matchedModel) {
							setModel(matchedModel.id);
						}
					}
				}
			}

			// Fallback fuel type matching
			if (!data.fuelTypeID && data.fuelType && data.fuelType !== 'Not detected') {
				const matchedFuel = fuels.find(f =>
					f.name.toLowerCase().includes(data.fuelType.toLowerCase()) ||
					data.fuelType.toLowerCase().includes(f.name.toLowerCase())
				);
				if (matchedFuel) {
					setFuel(matchedFuel.id);
				}
			}
		} catch (error) {
			console.error("Failed to auto-populate car details:", error);
		}
	};

	// Reset registration scanner
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
			...(selectionMethod === 'registration' && regResult ? {
				ownerName: regResult.owner || '',
				registrationNumber: regResult.registrationNumber || '',
				manufactured: regResult.manufactured || ''
			} : {})
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
		// localStorage.removeItem("cartItems");
		//reload page
		window.location.reload();

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

	// Reusable manual selection section
	const ManualSelection = () => (
		<>
			{/* Manual Selection Section */}
			<div className="mb-4 mt-4">
				<label className="form-label">Choose Brand & Model</label>
				<div className="d-flex gap-3 flex-wrap justify-content-center">
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
					<div className="d-flex gap-3 flex-wrap justify-content-center">
						{fuels.map((f) => (
							<div
								key={f.id}
								className={`text-center px-2 py-2 border rounded shadow-sm ${fuel === f.id ? "border-primary" : ""
									}`}
								style={{ cursor: "pointer", width: 100 }}
								onClick={() => setFuel(f.id)}
							>
								<img src={f.image} alt={f.name} style={{ width: "40px", height: "40px", objectFit: "contain" }} />
								<small className="d-block mt-1">{f.name}</small>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);

	return (
		<div className={`choose-car-modal ${isVisible ? "visible" : "hidden"}`}>
			<div className={`modal-content ${regResult && selectionMethod === "registration" ? "modalWidth" : ""}`} ref={modalRef}>
				<button className="modal-close" onClick={onClose}>
					×
				</button>
				<h6>Select Your Car Type</h6>

				{/* Selection Method Dropdown */}
				<div className="mb-4">
					<label className="form-label">Selection Method</label>
					<select className="form-select" value={selectionMethod} onChange={(e) => setSelectionMethod(e.target.value)}>
						<option value="registration">Registration Number</option>
						<option value="manual">Manual Selection</option>
					</select>
				</div>

				<form onSubmit={handleSubmit}>
					{selectionMethod === "registration" ? (
						<div className="d-flex flex-column flex-md-row gap-3">
							{/* Left: search and manual selection */}
							<div className="flex-grow-1">
								{/* Registration Number Input */}
								<div className="mb-4">
									<label className="form-label">Enter Vehicle Registration Number</label>
									<div className="input-group">
										<input
											type="text"
											className="form-control"
											value={registrationNumber}
											onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
											placeholder="e.g. TS15FH4090"
											style={{ textTransform: 'uppercase' }}
										/>
										<button
											type="button"
											className="btn  px-3 py-2 line-none"
											onClick={lookupRegistrationNumber}
											disabled={isProcessingReg || !registrationNumber.trim()}
										>
											{isProcessingReg ? (
												<>
													<span className="spinner-border spinner-border-sm me-2" role="status"></span>
													Searching...
												</>
											) : (
												<>
													<i className="fas fa-search me-2"></i>
													Search
												</>
											)}
										</button>
									</div>
									<div className="form-text">
										Enter your vehicle registration number to automatically fetch car details
									</div>
								</div>

								{regResult && (
								<div className="bg-light rounded border">
									<div className="p-3 sticky-top bg-light border-bottom">
										<h6 className="text-success mb-0">Vehicle Information</h6>
									</div>
									<div className="p-3">
										<div className="row g-2">
											<div className="col-6 col-md-3">
												<small className="text-muted d-block">Reg. No:</small>
												<div className="fw-bold">{regResult.registrationNumber}</div>
											</div>
											<div className="col-6 col-md-3">
												<small className="text-muted d-block">Brand:</small>
												<div className="fw-bold">{regResult.brand}</div>
											</div>
											<div className="col-6 col-md-3">
												<small className="text-muted d-block">Model:</small>
												<div className="fw-bold">{regResult.model}</div>
											</div>
											<div className="col-6 col-md-3">
												<small className="text-muted d-block">Fuel Type:</small>
												<div className="fw-bold">{regResult.fuelType}</div>
											</div>
										</div>
										
										{(regResult.yearOfPurchase || regResult.engineType || regResult.transmissionType) && (
											<div className="row g-2 mt-2">
												{regResult.yearOfPurchase && regResult.yearOfPurchase !== 'Not detected' && (
													<div className="col-6 col-md-4">
														<small className="text-muted d-block">Year:</small>
														<div className="fw-bold">{regResult.yearOfPurchase}</div>
													</div>
												)}
												{regResult.engineType && regResult.engineType !== 'Not detected' && (
													<div className="col-6 col-md-4">
														<small className="text-muted d-block">Engine:</small>
														<div className="fw-bold">{regResult.engineType}</div>
													</div>
												)}
												{regResult.transmissionType && regResult.transmissionType !== 'Not detected' && (
													<div className="col-6 col-md-4">
														<small className="text-muted d-block">Transmission:</small>
														<div className="fw-bold">{regResult.transmissionType}</div>
													</div>
												)}
											</div>
										)}

										<div className="mt-3 text-center">
											<button
												type="button"
												className="btn btn-outline-secondary px-3 py-2"
												onClick={resetRegScanner}
											>
												<i className="fas fa-redo me-2"></i>
												Search For Different Vehicle
											</button>
										</div>
									</div>
								</div>
							)}

								{/* Always show manual adjustment after a successful search */}
								{regResult && <ManualSelection />}
							</div>

							{/* Right: results panel */}
						
						</div>
					) : (
						<ManualSelection />
					)}



					{/* Buttons */}
					<div className="d-flex justify-content-center gap-2 modal-actions">
						<button type="button" className="btn btn-light py-2 px-4" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="btn btn-primary py-2 px-4">
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
					loading={loadingModels}
				/>
			)}
		</div>
	);
};

export default ChooseCarModal;
