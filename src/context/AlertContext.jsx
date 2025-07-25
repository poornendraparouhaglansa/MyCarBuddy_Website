import React, { createContext, useState, useCallback, useContext } from "react";
import CustomAlert from "../components/CustomAlert";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = useCallback((title, message, duration, type = "info") => {
        setAlert({ title, message, duration, type });
    }, []);

    const closeAlert = () => setAlert(null);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            {alert && (
                <CustomAlert
                    title={alert.title}
                    message={alert.message}
                    duration={alert.duration}
                    type={alert.type}
                    onClose={closeAlert}
                />
            )}
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);
