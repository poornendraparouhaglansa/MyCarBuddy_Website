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
			// const response = await fetch('https://api.attestr.com/api/v2/public/checkx/rc', {
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		'Authorization': 'Basic T1gwUzZJLWpyRUliT0FzU0phLjViNDU0MTE4YTkwYzJmMDhlNTcxNzFiYmUzZmE1ZTUwOmNmYzY4YjkwMDU2OTEyZjRmNTM2M2FkNGZiY2RhNzgwZmU1MmZhNmJjNWNlODIwNQ=='
			// 	},
			// 	body: JSON.stringify({
			// 		reg: registrationNumber.trim()
			// 	})
			// });

			// const data = await response.json();
			            const data = {
			  "valid": true,
			  "status": "ACTIVE",
			  "registered": "04-11-2024",
			  "owner": "ERUMALLA PRADEEP",
			  "masked": null,
			  "ownerNumber": "1",
			  "father": null,
			  "currentAddress": "H NO:2-104,KATTALINGAMPETA,MALLIAL,VEMULAWADA,RAJANNA,CHANDURTHY,505307",
			  "permanentAddress": "H NO:2-104,KATTALINGAMPETA,MALLIAL,VEMULAWADA,RAJANNA,CHANDURTHY,505307",
			  "mobile": null,
			  "category": "LMV",
			  "categoryDescription": "Motor Car(LMV)",
			  "chassisNumber": "MBHZCDESKRH169194",
			  "engineNumber": "Z12EP1069172",
			  "makerDescription": "MARUTI SUZUKI INDIA LTD",
			  "makerModel": "MARUTI SWIFT VXI 1.2L ISS 5MT",
			  "makerVariant": null,
			  "bodyType": "30",
			  "fuelType": "PETROL",
			  "colorType": "LUSTER BLUE",
			  "normsType": "Not Available",
			  "fitnessUpto": "03-11-2039",
			  "financed": true,
			  "lender": "ICICI BANK LTD",
			  "insuranceProvider": "LIBERTY GENERAL INSURANCE LIMITED",
			  "insurancePolicyNumber": "201150010124850229800000",
			  "insuranceUpto": "25-10-2027",
			  "manufactured": "08/2024",
			  "rto": "RTA RAJANNA, TELANGANA",
			  "cubicCapacity": "1197.00",
			  "grossWeight": "1355",
			  "wheelBase": "2450",
			  "unladenWeight": "760",
			  "cylinders": "3",
			  "seatingCapacity": "5",
			  "sleepingCapacity": "0",
			  "standingCapacity": "0",
			  "pollutionCertificateNumber": null,
			  "pollutionCertificateUpto": null,
			  "permitNumber": null,
			  "permitIssued": null,
			  "permitFrom": null,
			  "permitUpto": null,
			  "permitType": null,
			  "taxUpto": "LTT",
			  "taxPaidUpto": "LTT",
			  "nationalPermitNumber": null,
			  "nationalPermitIssued": null,
			  "nationalPermitFrom": null,
			  "nationalPermitUpto": null,
			  "blacklistStatus": null,
			  "nocDetails": null,
			  "challanDetails": null,
			  "nationalPermitIssuedBy": null,
			  "commercial": false,
			  "exShowroomPrice": null,
			  "nonUseStatus": null,
			  "nonUseFrom": null,
			  "nonUseTo": null,
			  "blacklistDetails": null
			}

			if ((data.valid === 1 || data.valid === true) && (data.category?.toLocaleUpperCase().includes("LMV") || data.categoryDescription?.toLocaleUpperCase().includes("CAR"))) {
				// Extract and format the data
				const extractedData = {
					registrationNumber: registrationNumber.trim(),
					brand: data.makerDescription || 'Not detected',
					model: data.makerModel || 'Not detected',
					fuelType: data.fuelType || 'Not detected',
					manufactured: data.manufactured || 'Not detected',
					owner: data.owner || 'Not detected',
					color: data.colorType || 'Not detected',
					chassisNumber: data.chassisNumber || 'Not detected',
					engineNumber: data.engineNumber || 'Not detected',
					status: data.status || 'Not detected',
					rawData: data
				};

				setRegResult(extractedData);
				await autoPopulateFromRegData(extractedData);
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

	// Auto-populate car details from registration data
	const autoPopulateFromRegData = async (data) => {
		if (!data.brand || data.brand === 'Not detected') return;

		try {
			const brandName = data.brand;

			// Match Brand
			const matchedBrand = brands.find(b =>
				b.name.toLowerCase().includes(brandName.toLowerCase()) ||
				brandName.toLowerCase().includes(b.name.toLowerCase())
			);

			if (matchedBrand) {
				setBrand(matchedBrand.id);

				// Fetch models for the brand and use the returned list to match
				const loadedModels = await fetchModels(matchedBrand.id);

				// Now we can match the model using the freshly loaded list
				if (data.model && data.model !== 'Not detected') {
					const modelName = data.model.toLowerCase();
					const searchList = Array.isArray(loadedModels) && loadedModels.length ? loadedModels : models;
					const matchedModel = searchList.find(m =>
						m.name.toLowerCase().includes(modelName) ||
						modelName.includes(m.name.toLowerCase())
					);

					if (matchedModel) {
						setModel(matchedModel.id);
					} else {
						console.warn("No exact model match found for:", data.makerModel);
					}
				}

				// Match Fuel Type
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
								<div className="bg-light rounded border" style={{  }}>
									<div className="p-3 sticky-top bg-light border-bottom"><h6 className="text-success mb-0">Vehicle Information</h6></div>
									<div className="p-3">
										<div className="row g-2">
											<div className="col-4">
												<small className="text-muted d-block">Reg. No:</small>
												<div className="fw-bold">{regResult.registrationNumber}</div>
											</div>
											<div className="col-4">
												<small className="text-muted d-block">Owner:</small>
												<div className="fw-bold">{regResult.owner}</div>
											</div>
											<div className="col-4">
												<small className="text-muted d-block">Manufactured:</small>
												<div className="fw-bold">{regResult.manufactured}</div>
											</div>
										</div>

										<div className="mt-3 text-center">
											<button
												type="button"
												className="btn btn-outline-secondary px-3 py-2 "
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
