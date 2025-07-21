import React, { useEffect, useRef, useState } from "react";
import "./SignInModal.css";

const SignIn = ({ isVisible, onClose, onRegister }) => {
    const [identifier, setIdentifier] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
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

    const handleSendOTP = (e) => {
        e.preventDefault();
        if (!identifier) return;
        console.log("Sending OTP to:", identifier);
        setOtpSent(true);
        // Call your API to send OTP here
    };

    const handleVerifyOTP = (e) => {
        e.preventDefault();
        console.log("Verifying OTP:", otp, "for", identifier);
        localStorage.setItem("user", JSON.stringify({ id: "123", name: null, identifier }));
         window.dispatchEvent(new Event("userProfileUpdated"));
        // Call your verify OTP logic
        onClose();
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

                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-primary">
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
