import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaCar, FaUpload, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { useAlert } from "../context/AlertContext";
import SignIn from "./SignIn";
import { useCart } from "../context/CartContext";

const CarDamageAnalysis = () => {
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [result, setResult] = useState(null); // Changed to null to hold a structured object
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { showAlert } = useAlert();
    const [signInVisible, setSignInVisible] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [serviceList, setServiceList] = useState([]);
    const [selectedServices, setSelectedServices] = useState({}); // New state for selected services
    const BASE_URL = process.env.REACT_APP_CARBUDDY_BASE_URL;
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // IMPORTANT: It is strongly recommended to use environment variables for API keys.
    const genAI = new GoogleGenerativeAI("AIzaSyANYyBfF19iL8GMTGUwg_JTrwCBP-n8Ft0");
    // AIzaSyAjQkNYws_C4FaDg6JOK0EdRq3yxg-k-Q4

    useEffect(() => {
        async function getFormattedServiceList() {
            const apiUrl = `${BASE_URL}includes`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                if (data && Array.isArray(data.data)) {
                    const formattedList = data.data.map(item => ({
                        IncludeID: item.IncludeID,
                        IncludeName: item.IncludeName,
                        IncludePrice: item.IncludePrice
                    }));
                    setServiceList(formattedList);
                } else {
                    console.error('Error: Fetched service data is not an array. Response:', data);
                    setError("Could not load the list of repair services. The format was incorrect.");
                }
            } catch (error) {
                console.error('Failed to fetch car service data:', error);
                setError("Could not load the list of repair services. Analysis will proceed without suggestions.");
            }
        }
        getFormattedServiceList();
    }, []);

    const handleImagesChange = (event) => {
        const files = Array.from(event.target.files);
        setImages(files);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        previews.forEach((preview) => URL.revokeObjectURL(preview));
        setPreviews(newPreviews);
        setResult(null); // Reset result on new image upload
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleAnalyze = async () => {
        if (!user && user?.id !== "") {
            setSignInVisible(true);
            return;
        }
        if (images.length === 0) {
            setError("Please upload at least one image");
            return;
        }
        if (serviceList.length === 0) {
            setError("The list of repair services is still loading or failed to load. Please wait a moment and try again.");
            return;
        }
    
        setLoading(true);
        setError("");
        setResult(null);
        setSelectedServices({});
    
        let rawResponseText = ''; // New variable to hold the raw text response

        try {
            const imageParts = await Promise.all(
                images.map(async (image) => {
                    const base64Data = await convertToBase64(image);
                    return {
                        inlineData: {
                            mimeType: image.type,
                            data: base64Data,
                        },
                    };
                })
            );
    
            const serviceListJson = JSON.stringify(serviceList, null, 2);
    
            const prompt = `
            You are an expert car mechanic and damage assessor.
            
            **Task:**
            1. Analyze the provided images to identify all visible damages to the car.
            2. Based on the damage, recommend the necessary repair services from the list of available services provided below.
            3. Calculate the total cost based on the recommended services.
            
            **Available Services and Prices (JSON format):**
            ${serviceListJson}
            
            **Instructions for your response:**
            - Respond with a single JSON object. Do NOT include any other text or formatting outside of the JSON.
            - The JSON object must have three keys:
                - "summary": A short, one-paragraph summary of the identified damages.
                - "recommendedServices": An array of service objects. Each object must contain the exact "IncludeID", "IncludeName", and "IncludePrice" from the provided list.
                - "totalCost": A number representing the sum of all recommended service prices.
            - If no damage is visible or if none of the available services apply, the "recommendedServices" array should be empty and "totalCost" should be 0.
            - Do not suggest any services that are not in the provided JSON list.
            `;
    
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const generateParts = [{ text: prompt }, ...imageParts];
            const response = await model.generateContent(generateParts);
            rawResponseText = response.response.text();

            // Try direct parse first
            let parsedResult;
            try {
                parsedResult = JSON.parse(rawResponseText);
            } catch (_) {
                // Attempt to extract JSON from code fences or extra text
                const match = rawResponseText.match(/```(?:json)?\n([\s\S]*?)```/i) || rawResponseText.match(/\{[\s\S]*\}/);
                if (match) {
                    parsedResult = JSON.parse(match[1] || match[0]);
                } else {
                    throw new Error("Model did not return valid JSON");
                }
            }

            setResult(parsedResult);

            // Initialize selected services with all recommended services
            const initialSelected = {};
            if (parsedResult && parsedResult.recommendedServices) {
                // Ensure IncludePrice is numeric
                parsedResult.recommendedServices = parsedResult.recommendedServices.map(svc => ({
                    ...svc,
                    IncludePrice: typeof svc.IncludePrice === 'number' ? svc.IncludePrice : Number(svc.IncludePrice) || 0
                }));
                parsedResult.totalCost = typeof parsedResult.totalCost === 'number' ? parsedResult.totalCost : Number(parsedResult.totalCost) || 0;

                parsedResult.recommendedServices.forEach(service => {
                    initialSelected[service.IncludeID] = true;
                });
            }
            setSelectedServices(initialSelected);
        } catch (err) {
            // Log the raw response and the full error for debugging
            console.error("AI Response Parsing Error:", err);
            console.log("Raw AI Response (Check this for formatting issues):", rawResponseText);
            
            // Set a more helpful user-facing error message
            setError("The AI response was not in the correct format. Please check the browser console for details.");
        } finally {
            setLoading(false);
        }
    };
    
    // Function to handle checkbox changes
    const handleCheckboxChange = (serviceId) => {
        setSelectedServices(prevSelected => ({
            ...prevSelected,
            [serviceId]: !prevSelected[serviceId] // Toggle the boolean value
        }));
    };

    // Function to calculate the total cost of selected services
    const calculateSelectedTotal = () => {
        if (!result || !result.recommendedServices) return 0;
        return result.recommendedServices.reduce((total, service) => {
            if (selectedServices[service.IncludeID]) {
                const price = typeof service.IncludePrice === 'number' ? service.IncludePrice : Number(service.IncludePrice) || 0;
                return total + price;
            }
            return total;
        }, 0);
    };

    // Derive selected services objects
    const getSelectedServices = () => {
        if (!result || !result.recommendedServices) return [];
        return result.recommendedServices.filter(svc => !!selectedServices[svc.IncludeID]);
    };

    // Add to cart as a custom package with id 0
    const handleAddCustomPackageToCart = () => {
        const selected = getSelectedServices();
        if (!selected || selected.length === 0) {
            setError("Please select at least one service before adding to cart.");
            return;
        }
        const totalPrice = calculateSelectedTotal();
        const customPackage = {
            id: 0,
            title: "Custom Package",
            price: totalPrice,
            image: "",
        };
        addToCart(customPackage);
        navigate("/cart");
    };

    const handleCopySelected = async () => {
        try {
            const json = JSON.stringify(getSelectedServices(), null, 2);
            await navigator.clipboard.writeText(json);
            if (showAlert) {
                showAlert("Selected services copied to clipboard.");
            }
        } catch (e) {
            console.error("Copy failed", e);
        }
    };

    useEffect(() => {
        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [previews]);

    useEffect(() => {
        const handleUserUpdate = () => {
            setUser(JSON.parse(localStorage.getItem("user")));
        };
        window.addEventListener("userProfileUpdated", handleUserUpdate);
        return () => {
            window.removeEventListener("userProfileUpdated", handleUserUpdate);
        };
    }, []);

    return (
        <div>
            <div className="container-fluid">
                <div className="row mt-5 mb-5 justify-content-center">
                    {/* Left Side - Upload and Analysis Section */}
                    <div className="col-lg-5 d-flex flex-column justify-content-start">
                        {/* Upload Section */}
                        <div className="mb-4">
                            <h4
                                style={{
                                    color: "#116d6e",
                                    marginBottom: "20px",
                                    fontWeight: "600",
                                    textAlign: "center",
                                }}
                            >
                                <FaUpload style={{ marginRight: "10px" }} />
                                Upload Car Images
                            </h4>
                            <label htmlFor="image-upload"
                                style={{
                                    border: "3px dashed #116d6e",
                                    borderRadius: "20px",
                                    padding: "15px 20px",
                                    textAlign: "center",
                                    backgroundColor: "#f8f9fa",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    boxShadow: "inset 0 0 20px rgba(17, 109, 110, 0.1)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#e9ecef";
                                    e.currentTarget.style.boxShadow = "inset 0 0 30px rgba(17, 109, 110, 0.2)";
                                    e.currentTarget.style.transform = "scale(1.02)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                                    e.currentTarget.style.boxShadow = "inset 0 0 20px rgba(17, 109, 110, 0.1)";
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 10px 0" }}>
                                    Select multiple images for better analysis
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImagesChange}
                                    style={{ display: "none" }}
                                    id="image-upload"
                                />
                                <span
                                    style={{
                                        cursor: "pointer",
                                        color: "#116d6e",
                                        fontWeight: "600",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Choose Files
                                </span>
                            </label>
                        </div>
                        {/* Uploaded Images Preview */}
                        {previews.length > 0 && (
                            <div className="mb-4">
                                <h5 style={{ color: "#116d6e", marginBottom: "15px", fontWeight: "600" }}>
                                    <FaSearch style={{ marginRight: "8px" }} />
                                    Uploaded Images ({previews.length})
                                </h5>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "15px",
                                        maxHeight: "210px",
                                        overflowY: "auto",
                                        padding: "10px",
                                        background: "#f8f9fa",
                                        borderRadius: "10px",
                                    }}
                                >
                                    {previews.map((preview, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                position: "relative",
                                                borderRadius: "10px",
                                                overflow: "hidden",
                                                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                            }}
                                        >
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Analyze Button */}
                        <div className="text-center mb-4">
                            <button
                                onClick={handleAnalyze}
                                disabled={loading || images.length === 0}
                                className="btn style2 btn-contact px-4 py-2"
                                style={{
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 8px 25px rgba(17, 109, 110, 0.3)"
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading && images.length > 0) {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 12px 35px rgba(17, 109, 110, 0.4)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(17, 109, 110, 0.3)";
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <FaSearch style={{ marginRight: "10px" }} />
                                        Analyze Damage
                                    </>
                                )}
                            </button>
                        </div>
                        {/* Cart-like Selected Items List */}
                        {result && getSelectedServices().length > 0 && (
                            <div className="mb-4" style={{ background: "#fff", border: "1px solid #e9ecef", borderRadius: "12px", boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
                                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f3f5" }}>
                                    <h6 className="mb-0" style={{ color: "#116d6e", fontWeight: 700 }}>Selected Items</h6>
                                </div>
                                <div style={{ padding: "10px 12px" }}>
                                    <div style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '6px' }}>
                                        {getSelectedServices().map((svc, idx) => (
                                            <div key={svc.IncludeID} className="d-flex align-items-center justify-content-between" style={{ padding: "10px 6px", borderBottom: "1px dashed #eef2f3" }}>
                                                <div className="d-flex align-items-center" style={{ gap: "10px" }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                        width: '26px', height: '26px', borderRadius: '6px', background: '#e7f3f3', color: '#116d6e', fontWeight: 700
                                                    }}>{idx + 1}</span>
                                                    <div style={{ fontWeight: 500, color: '#223', maxWidth: '360px' }}>{svc.IncludeName}</div>
                                                </div>
                                                <div style={{ fontWeight: 600, color: '#116d6e' }}>₹{(typeof svc.IncludePrice === 'number' ? svc.IncludePrice : Number(svc.IncludePrice) || 0).toFixed(2)}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between" style={{ padding: "12px 6px 4px" }}>
                                        <div style={{ fontWeight: 700, color: '#223' }}>Subtotal</div>
                                        <div style={{ fontWeight: 800, color: '#0f6b6c' }}>₹{calculateSelectedTotal().toFixed(2)}</div>
                                    </div>
                                    <div className="text-end mt-3">
                                        <button
                                            className="btn btn-danger fw-bold px-4 py-2"
                                            onClick={handleAddCustomPackageToCart}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Error Message */}
                        {error && (
                            <div
                                style={{
                                    backgroundColor: "#f8d7da",
                                    color: "#721c24",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    border: "1px solid #f5c6cb",
                                    marginBottom: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <FaExclamationTriangle style={{ marginRight: "10px", fontSize: "1.2rem" }} />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                    {/* Right Side - Analysis Result or Placeholder */}
                    <div
                        className="col-lg-5 d-flex align-items-center justify-content-center position-relative"
                        style={{
                            background: "linear-gradient(135deg, rgb(83 157 154) 0%, rgb(17 110 112) 100%)",
                            borderRadius: "20px",
                            minHeight: "500px",
                            overflow: "hidden",
                        }}
                    >
                        {result ? (
                            // Show Analysis Report with Tickbox List
                            <div
                                style={{
                                    color: "white",
                                    padding: "20px",
                                    width: "100%",
                                    height: "100%",
                                    overflowY: "auto",
                                }}
                            >
                                <h5 style={{ marginBottom: "15px", fontWeight: "600", color: "white", textAlign: "center" }}>
                                    <FaCar style={{ marginRight: "8px" }} />
                                    Analysis Report
                                </h5>
                                <div
                                    style={{
                                        whiteSpace: "pre-wrap",
                                        fontSize: "0.95rem",
                                        lineHeight: "1.6",
                                        background: "rgba(255, 255, 255, 0.1)",
                                        padding: "15px",
                                        borderRadius: "10px"
                                    }}
                                >
                                    {/* Summary Paragraph */}
                                    <p>{result.summary}</p>
                                    <hr style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
                                    
                                    {/* Recommended Services Tickbox List */}
                                    <h6 className="mt-3 mb-3 fw-bold">Recommended Services</h6>
                                    {result.recommendedServices && result.recommendedServices.length > 0 ? (
                                        <div className="list-group" style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '6px' }}>
                                            {result.recommendedServices.map(service => (
                                                <label
                                                    key={service.IncludeID}
                                                    className="list-group-item d-flex justify-content-between align-items-center mb-2"
                                                    tabIndex={0}
                                                    role="checkbox"
                                                    aria-checked={!!selectedServices[service.IncludeID]}
                                                    style={{
                                                        backgroundColor: !!selectedServices[service.IncludeID] ? 'rgba(255, 255, 255, 0.32)' : 'rgba(255, 255, 255, 0.18)',
                                                        border: !!selectedServices[service.IncludeID] ? '1px solid rgba(255, 255, 255, 0.55)' : '1px solid rgba(255, 255, 255, 0.28)',
                                                        borderRadius: '10px',
                                                        color: 'white',
                                                        cursor: 'pointer',
                                                        padding: '10px 55px',
                                                        transition: 'all 0.2s ease',
                                                        backdropFilter: 'blur(2px)'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = !!selectedServices[service.IncludeID] ? 'rgba(226, 2, 2, 0.38)' : 'rgba(214, 16, 16, 0.28)';
                                                        e.currentTarget.style.border = !!selectedServices[service.IncludeID] ? '1px solid rgba(255,255,255,0.65)' : '1px solid rgba(255,255,255,0.4)';
                                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = !!selectedServices[service.IncludeID] ? 'rgba(255, 255, 255, 0.32)' : 'rgba(216, 29, 29, 0.18)';
                                                        e.currentTarget.style.border = !!selectedServices[service.IncludeID] ? '1px solid rgba(255, 255, 255, 0.55)' : '1px solid rgba(255, 255, 255, 0.28)';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                    }}
                                                >
                                                    <div className="form-check d-flex align-items-center" style={{ gap: '8px' }}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={!!selectedServices[service.IncludeID]}
                                                            onChange={() => handleCheckboxChange(service.IncludeID)}
                                                            onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.35)'; }}
                                                            onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                                                            style={{
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius: '5px',
                                                                backgroundColor: !!selectedServices[service.IncludeID] ? '#116d6e' : 'transparent',
                                                                borderColor: !!selectedServices[service.IncludeID] ? '#cfe9e9' : '#eaf6f6',
                                                                borderWidth: '2px',
                                                                accentColor: '#116d6e',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s ease',
                                                                boxShadow: !!selectedServices[service.IncludeID] ? 'inset 0 0 0 2px rgba(255,255,255,0.6)' : 'none'
                                                            }}
                                                        />
                                                        <span className="ms-1" style={{ fontWeight: 600, letterSpacing: '0.2px' }}>{service.IncludeName}</span>
                                                    </div>
                                                    <span
                                                        className="badge rounded-pill"
                                                        style={{
                                                            backgroundColor: '#116d6e',
                                                            color: 'white',
                                                            fontSize: '0.85rem',
                                                            padding: '6px 10px',
                                                            border: '1px solid rgba(255,255,255,0.25)'
                                                        }}
                                                    >
                                                        ₹{service.IncludePrice}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No specific services recommended at this time.</p>
                                    )}

                                    {/* Total Estimated Cost */}
                                    <div className="mt-4 text-end">
                                        <h5 className="fw-bold">
                                            Total Estimated Cost: 
                                            <span className="ms-2" style={{ color: '#ffeb3b' }}>
                                               ₹{calculateSelectedTotal().toFixed(2)}
                                            </span>
                                        </h5>
                                    </div>
                                    
                                </div>
                            </div>
                        ) : (
                            // Show Placeholder
                            <>
                                <div className="text-center text-white" style={{ zIndex: 2, padding: "20px" }}>
                                    <h2 className="fw-bold" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                                        AI Car Damage Analysis
                                    </h2>
                                    <p>Upload your car images and get an instant AI-powered damage assessment with repair suggestions.</p>
                                    <FaCar size={200} style={{ opacity: 0.8, marginTop: "30px" }} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/* Sign In Modal */}
            <SignIn isVisible={signInVisible} onClose={() => setSignInVisible(false)} />
        </div>
    );
};

export default CarDamageAnalysis;