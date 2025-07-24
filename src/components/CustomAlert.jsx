import React, { useEffect } from "react";
import "./CustomAlert.css";

const CustomAlert = ({ title, message, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className="custom-alert-backdrop">
            <div className="custom-alert">
                <div className="custom-alert-header">
                    <span>{title}</span>
                    <button className="custom-alert-close" onClick={onClose}>×</button>
                </div>
                {message && <div className="custom-alert-body">{message}</div>}
            </div>
        </div>
    );
};

export default CustomAlert;
