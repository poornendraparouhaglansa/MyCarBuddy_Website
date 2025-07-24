import React, { createContext, useState, useCallback, useContext } from "react";
import CustomAlert from "../components/CustomAlert";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);

    const showAlert = useCallback((title, message, duration) => {
        setAlert({ title, message, duration });
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
                    onClose={closeAlert}
                />
            )}
        </AlertContext.Provider>
    );
};

export const useAlert = () => useContext(AlertContext);
