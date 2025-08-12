import React, { useEffect, useRef, useState } from "react";
import "./ProfileModal.css";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ isVisible, onClose, onRegister }) => {
    const [user, setUser] = useState(null);
    const modalRef = useRef();
    const navigation = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) setUser(JSON.parse(saved));
    }, [isVisible]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
        };
        if (isVisible) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isVisible]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        onClose();
        navigation('/');
        window.location.reload();        
    };

    return (
        <div className={`profile-modal ${isVisible ? "visible" : "hidden"}`}>
            <div className="modal-content" ref={modalRef}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h5 className="mb-4">Your Profile</h5>
                {user ? (
                    <>
                        {/* <p><strong>ID:</strong> {user.identifier}</p> */}
                        <p><strong>Name:</strong> {user.name || "Not Registered"}</p>

                        {/* {!user.name && (
                            <button className="btn btn-outline-primary mt-3" onClick={onRegister}>
                                Complete Registration
                            </button>
                        )} */}

                        {/* {user.name && (  */}
                           <div className="d-flex justify-content-center gap-2 mt-3">
                             <button
                                className="btn btn-outline-secondary mt-3 px-4 py-2"
                                onClick={() => {
                                    onClose(); 
                                    window.location.href = "/profile"; 
                                }}
                            >
                                View Profile
                            </button>
                        {/* )} */}

                        <button className="btn btn-light mt-3  px-4 py-2" onClick={handleLogout}>
                            Logout
                        </button>
                           </div>
                    </>
                ) : (
                    <p>User not logged in.</p>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;
