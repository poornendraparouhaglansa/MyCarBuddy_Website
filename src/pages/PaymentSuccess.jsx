import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Checking payment...");
  const [details, setDetails] = useState({ paymentLinkId: "", paymentId: "" });
  const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookingId = params.get("bookingId") || "";
    const paymentLinkId = params.get("payment_link_id") || params.get("paymentLinkId");
    const paymentId = params.get("payment_id") || params.get("paymentId");
    setDetails({ paymentLinkId: paymentLinkId || "", paymentId: paymentId || "" });

    if (paymentLinkId) {
      axios
        .get(`${BaseURL}Payments/verify`, {
          params: { paymentLinkId, paymentId, bookingId },
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          const v = (res?.data?.status || "").toString().toLowerCase();
          if (v === "paid" || v === "success" || v === "captured") {
            setStatus("Payment Successful ✅");
          } else if (v === "pending") {
            setStatus("Payment Pending ⏳");
          } else {
            setStatus("Payment Failed ❌");
          }
        })
        .catch(() => {
          setStatus("Payment verification failed ❌");
        });
    } else {
      setStatus("Invalid payment link ❌");
    }
  }, [location.search, BaseURL]);

  return (
    <>
      <HeaderOne />

      <div className="container py-5" style={{ minHeight: "60vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
              <div className="d-flex justify-content-center mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 72, height: 72, background: "#e8f7ef", color: "#28a745", fontSize: 32 }}
                >
                  <i className="bi bi-credit-card"></i>
                </div>
              </div>
              <h4 className="fw-bold mb-2">Car Service Payment</h4>
              <p className="mb-3 text-muted">{status}</p>

              {(details.paymentLinkId || details.paymentId) && (
                <div className="bg-light rounded-3 p-3 text-start small mb-3">
                  {details.paymentLinkId && (
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Payment Link ID</span>
                      <span className="fw-semibold">{details.paymentLinkId}</span>
                    </div>
                  )}
                  {details.paymentId && (
                    <div className="d-flex justify-content-between mt-2">
                      <span className="text-muted">Payment ID</span>
                      <span className="fw-semibold">{details.paymentId}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="d-flex justify-content-center gap-2 mt-2">
                <button className="btn btn-primary px-4 py-2" onClick={() => navigate("/profile?tab=mybookings")}>Go to My Bookings</button>
                <button className="btn btn-outline-secondary  px-4 py-2" onClick={() => navigate("/")}>Back to Home</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterAreaOne />
    </>
  );
};

export default PaymentSuccess;


