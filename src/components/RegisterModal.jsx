import React, { useEffect, useRef, useState } from "react";
import "./RegisterModal.css";

const RegisterModal = ({ isVisible, onClose, onBackToSignIn, onRegistered }) => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [altMobile, setAltMobile] = useState("");
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


    const handleRegister = (e) => {
        e.preventDefault();

        const savedUser = JSON.parse(localStorage.getItem("user"));
        const updatedUser = { ...savedUser, name: fullname };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        window.dispatchEvent(new Event("userProfileUpdated"));
        if (onRegistered) onRegistered(updatedUser); // Notify parent
        onClose();
    };

    return (
        <div className={`register-modal ${isVisible ? "visible" : "hidden"}`}>
            <div className="modal-content" ref={modalRef}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h5 className="mb-4">Create Account</h5>
                <form onSubmit={handleRegister}>
                    <div className="mb-3 text-start">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Full Name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="carbuddy@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label">Mobile</label>
                        <input
                            type="tel"
                            className="form-control"
                            placeholder="9876543210"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4 text-start">
                        <label className="form-label">Alternate Mobile</label>
                        <input
                            type="tel"
                            className="form-control"
                            placeholder="Optional"
                            value={altMobile}
                            onChange={(e) => setAltMobile(e.target.value)}
                        />
                    </div>

                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-primary">
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
