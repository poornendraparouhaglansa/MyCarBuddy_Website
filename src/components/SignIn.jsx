import React, { useEffect, useRef, useState } from "react";
import "./SignInModal.css";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useAlert } from "../context/AlertContext";

const SignIn = ({ isVisible, onClose, onRegister }) => {
    const [identifier, setIdentifier] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const baseUrl = process.env.REACT_APP_CARBUDDY_BASE_URL;

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
        console.log("Sending OTP to:", identifier);
        try {
            const response = await axios.post(`${baseUrl}Auth/send-otp`, { loginId: identifier });
            console.log("OTP sent response:", response.data);
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
        console.log("Verifying OTP:", otp, "for", identifier);
        try {
            const response = await axios.post(`${baseUrl}Auth/verify-otp`, {
                loginId: identifier,
                otp,
                deviceToken: "web-token",
                deviceId
            });
            console.log("OTP verification response:", response.data);
            localStorage.setItem("user", JSON.stringify({
                id: response.data?.custID,
                name: response.data?.name || null,
                identifier,
                token: response.data?.token
            }));
            const userCarKey = `selectedCar_${identifier}`;
            const userCar = localStorage.getItem(userCarKey);
            if (userCar) {
                localStorage.setItem("selectedCarDetails", userCar);
            }
            window.dispatchEvent(new Event("userProfileUpdated"));
            onClose();
        } catch (error) {
            console.error("Error verifying OTP:", error);
            showAlert("Error", "Invalid OTP. Please try again.", 3000, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`sign-in-modal ${isVisible ? "visible" : "hidden"}`}>
            <div className="modal-content" ref={modalRef}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h5 className="mb-4">Welcome Back</h5>
                <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
                    <div className="mb-3 text-start">
                        <label className="form-label">Mobile Number or Email</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter mobile number or email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
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
                        <button type="submit" className="btn btn-primary btn-sm">
                            {otpSent ? "Verify OTP" : "Send OTP"}
                        </button>
                    </div>

                    <div className="text-center">
                        <span>Don’t have an account?</span>{" "}
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={onRegister}
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
