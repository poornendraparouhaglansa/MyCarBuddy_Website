import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/js/bootstrap.bundle.min";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.scss";
import { AlertProvider } from "./context/AlertContext";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
  <HelmetProvider>
    <AlertProvider>
      <App />
    </AlertProvider>
    </HelmetProvider>
  </>
);

reportWebVitals();
