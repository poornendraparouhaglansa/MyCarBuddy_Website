import React, { useEffect, useRef, useState } from "react";
import "./SignInModal.css";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useAlert } from "../context/AlertContext";
import CryptoJS from "crypto-js";

const SignIn = ({ isVisible, onClose, onRegister }) => {
    const [identifier, setIdentifier] = useState("");
    // const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const baseUrl = process.env.REACT_APP_CARBUDDY_BASE_URL;
    const imageBaseURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;
    const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;
    const { showAlert } = useAlert();

    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isVisible, onClose]);

    useEffect(() => {
    if (isVisible) {
        // Reset form when modal opens
        setOtpSent(false);
        setIdentifier("");
        setOtp("");
    }
}, [isVisible]);

    const getDeviceId = () => {
        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            deviceId = uuidv4(); // Generate a new UUID
            localStorage.setItem("deviceId", deviceId);
        }
        return deviceId;
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!identifier) return;
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}Auth/send-otp`, { loginId: identifier });
            setOtpSent(true);
        } catch (error) {
            console.error("Error sending OTP:", error);
            showAlert("Error", "Failed to send OTP. Please try again.", 3000, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        const deviceId = getDeviceId();
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}Auth/verify-otp`, {
                loginId: identifier,
                otp,  
                deviceToken: "web-token",
                deviceId
            });
            console.log("OTP verification response:", response.data.custID);
          
            localStorage.setItem("user", JSON.stringify({
            id: CryptoJS.AES.encrypt(response.data?.custID.toString(), secretKey).toString(),
            name: response.data?.name || 'GUEST',
            token: response.data?.token
            }));
            getVehicleList(response.data?.custID);
            window.dispatchEvent(new Event("userProfileUpdated"));
            onClose();
        } catch (error) {
            console.error("Error verifying OTP:", error);
            showAlert("Error", "Invalid OTP. Please try again.", 3000, "error");
        } finally {
            setLoading(false);
        }
    };


const getVehicleList = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.id || !userData.token) return;
    const bytes = CryptoJS.AES.decrypt(userData.id, secretKey);
    const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);

    const res = await axios.get(`${baseUrl}CustomerVehicles/CustId?CustId=${decryptedCustId}`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });

    const vehicleList = res.data;
    console.log("Vehicle list:", vehicleList);

    const primaryCar = vehicleList.find((car) => car.IsPrimary === true);

    if (primaryCar) {
      const selectedCarDetails = {
        brand: {
          id: primaryCar.BrandID,
          name: primaryCar.BrandName,
          logo: `${imageBaseURL}${primaryCar.BrandLogo}`,
        },
        model: {
          id: primaryCar.ModelID,
          name: primaryCar.ModelName,
          logo: `${imageBaseURL}${primaryCar.VehicleImage}`,
        },
        fuel: {
          id: primaryCar.FuelTypeID,
          name: primaryCar.FuelTypeName,
          logo: `${imageBaseURL}${primaryCar.FuelImage}`,
        },
        VehicleID: primaryCar.VehicleID,
      };

      localStorage.setItem("selectedCarDetails", JSON.stringify(selectedCarDetails));
      window.dispatchEvent(new Event("userProfileUpdated"));
    } else {
      console.warn("No primary car found.");
    }
  } catch (err) {
    console.error("Error fetching vehicle list:", err);
  }
};

    return (
        <div className={`sign-in-modal ${isVisible ? "visible" : "hidden"}`}>
            <div className="modal-content" ref={modalRef}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h5 className="mb-4">Welcome Back</h5>
                <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
                    <div className="mb-3 text-start">
                        <label className="form-label">Mobile Number</label>
                        <div className="input-group">
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="form-control"
                                placeholder="Enter mobile number"
                                value={identifier}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    if (value.length <= 10) setIdentifier(value);
                                }}
                                maxLength={10}
                                required
                            />
                            {otpSent && (
                                <div className="input-group-append">
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={loading}
                                        className="btn btn-outline-secondary"
                                        title="Resend OTP"
                                        style={{ padding: "12px 17px" }}
                                    >
                                        <i className="fas fa-redo"></i>
                                    </button>
                                </div>
                            )}

                          
                        </div>
                    </div>

                       {otpSent && (
                                <div className="mb-3 text-start">
                                        <label className="form-label">Enter OTP</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                    <div className="text-center mb-3">
                        <button type="submit" className={`btn btn-primary btn-sm ${loading ? "disabled" : ""}`}>
                            {loading ? "Sending..." : otpSent ? "Verify OTP" : "Send OTP"   }
                        </button>
                    </div>

                    {/* <div className="text-center">
                        <span>Don’t have an account?</span>{" "}
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={onRegister}
                        >
                            Register
                        </button>
                    </div> */}
                </form>
            </div>
        </div>
    );
};

export default SignIn;
