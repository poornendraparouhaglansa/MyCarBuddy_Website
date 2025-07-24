import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./RegisterModal.css";
import { useAlert } from "../context/AlertContext";

const RegisterModal = ({ isVisible, onClose, onBackToSignIn, onRegistered }) => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [altMobile, setAltMobile] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    const [errors, setErrors] = useState({});
    const modalRef = useRef();
    const BASE_URL = process.env.REACT_APP_CARBUDDY_BASE_URL;
    const { showAlert } = useAlert();

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

    const validate = () => {
        const newErrors = {};
        if (!fullname.trim()) newErrors.fullname = "Full name is required.";
        if (!email.trim()) newErrors.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format.";
        if (!mobile.trim()) newErrors.mobile = "Mobile number is required.";
        else if (!/^\d{10}$/.test(mobile)) newErrors.mobile = "Mobile must be 10 digits.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSendOtp = async () => {
        if (!/^\d{10}$/.test(mobile)) {
            showAlert("Enter valid 10-digit mobile number first");
            return;
        }

        const formData = new FormData();
        formData.append("phoneNumber", mobile);

        try {
            const res = await axios.post(`${BASE_URL}Customer/send-otp`, formData);
            console.log("OTP sent response:", res.data);
            if (res.data.success) {
                setIsOtpSent(true);
                showAlert("OTP sent to " + mobile);
            } else {
                showAlert(res.data.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            showAlert(error.response?.data?.message || "Something went wrong while sending OTP.");
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            showAlert("Enter valid 6-digit OTP");
            return;
        }

        const formData = new FormData();
        formData.append("phoneNumber", mobile);
        formData.append("otp", otp);

        try {
            const response = await axios.post(`${BASE_URL}Customer/verify-otp`, formData);
            console.log("OTP verification response:", response.data);

            if (response.data.success) {
                setIsVerified(true);
                setIsOtpSent(false); // optional: reset state
                setOtp(""); // clear input
                showAlert("Mobile verified");
            } else {
                showAlert(response.data.message || "Invalid OTP");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            showAlert("Something went wrong while verifying OTP.");
        }
    };


    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        formData.append("FullName", fullname);
        formData.append("PhoneNumber", mobile);
        formData.append("AlternateNumber", altMobile);
        formData.append("Email", email);
        if (profileImage) formData.append("ProfileImage", profileImage);
        // formData.append("IsActive", "true");

        try {
            const response = await axios.post(
                `${BASE_URL}Customer/register-customer`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            showAlert("Registration successful!");
            const updatedUser = {
                name: fullname,
                email,
                phone: mobile,
                altPhone: altMobile,
                image: imagePreview,
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.dispatchEvent(new Event("userProfileUpdated"));
            if (onRegistered) onRegistered(updatedUser);
            onClose();
        } catch (err) {
            console.error("Registration error:", err);
            showAlert(err.response?.data?.message || "Registration failed. Please try again."   );
        }
    };

    return (
        <div className={`register-modal ${isVisible ? "visible" : "hidden"}`}>
            <div className="register-modal-content" ref={modalRef}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h5 className="mb-4">Create Account</h5>
                <form onSubmit={handleRegister}>

                    <div className="register-row mb-3">
                        <div className="register-col text-start">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Full Name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />
                            {errors.fullname && <div className="text-danger">{errors.fullname}</div>}
                        </div>

                        <div className="register-col text-start">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="carbuddy@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <div className="text-danger">{errors.email}</div>}
                        </div>
                    </div>

                    {/* Mobile Field with Verify + OTP */}
                    <div className="mb-3 text-start">
                        <label className="form-label">Mobile</label>
                        <div className="mobile-otp-row">
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="9876543210"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                disabled={isVerified}
                            />

                            {!isVerified && !isOtpSent && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary btn-sm-20 "
                                    onClick={handleSendOtp}
                                >
                                    ➤
                                </button>
                            )}
                            {isOtpSent && !isVerified && (
                                <div className="d-flex gap-2 align-items-center">
                                    <input
                                        type="text"
                                        className="form-control otp-input"
                                        placeholder="OTP"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-success btn-sm-20"
                                        onClick={handleVerifyOtp}
                                    >
                                        ✓
                                    </button>
                                </div>
                            )}

                        </div>
                        {errors.mobile && <div className="text-danger">{errors.mobile}</div>}
                    </div>


                    <div className="row mb-3">
                        <div className="register-col text-start">
                            <label className="form-label">Alternate Mobile</label>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="Optional"
                                value={altMobile}
                                onChange={(e) => setAltMobile(e.target.value)}
                            />
                        </div>

                        <div className="register-col text-start">
                            <label className="form-label">Profile Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{ width: 50, height: 50, borderRadius: "50%", marginTop: 5 }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="text-center mb-3">
                        <button type="submit" className="btn btn-primary btn-sm" disabled={!isVerified}>
                            Register
                        </button>
                    </div>



                    <div className="text-center">
                        <span>Already have an account?</span>{" "}
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={onBackToSignIn}
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;
