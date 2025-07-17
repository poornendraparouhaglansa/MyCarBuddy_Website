import React, { useEffect, useRef, useState } from "react";
import "./SignInModal.css";

const SignIn = ({ isVisible, onClose, onRegister, onForgotPassword }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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


    const handleSignIn = (e) => {
        e.preventDefault();
        // Replace with actual sign-in logic
        console.log("Signing in with:", { email, password });
        onClose();
    };

    return (
        <div className={`sign-in-modal ${isVisible ? "visible" : "hidden"}`}>
            <div className="modal-content" ref={modalRef}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h5 className="mb-4">Welcome Back</h5>
                <form onSubmit={handleSignIn}>
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
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* <div className="mb-3 text-end">
                        <button
                            type="button"
                            className="btn btn-link p-0"
                            onClick={onForgotPassword}
                        >
                            Forgot Password?
                        </button>
                    </div> */}

                    <div className="d-grid mb-3">
                        <button type="submit" className="btn btn-primary">
                            Sign In
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
