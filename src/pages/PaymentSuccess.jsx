import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Checking payment...");
  const [details, setDetails] = useState({
    bookingId: "",
    paymentLinkId: "",
    paymentLinkStatus: "",
    paymentId: "",
    referenceId: ""
  });
  const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookingId = params.get("bookingid") || params.get("bookingId") || "";
    const paymentLinkId = params.get("razorpay_payment_link_id") || params.get("payment_link_id") || "";
    const paymentLinkStatus = params.get("razorpay_payment_link_status") || "";
    const paymentId = params.get("razorpay_payment_id") || params.get("payment_id") || "";
    const referenceId = params.get("razorpay_payment_link_reference_id") || "";
    const signature = params.get("razorpay_signature") || "";

    setDetails({
      bookingId,
      paymentLinkId,
      paymentLinkStatus,
      paymentId,
      referenceId
    });

    if (!paymentLinkId) {
      setStatus("Invalid payment link ❌");
      return;
    }

    // Call backend callback with the exact Razorpay query params
    const callbackParams = {
      bookingid: bookingId,
      razorpay_payment_link_id: paymentLinkId,
      razorpay_payment_link_status: paymentLinkStatus,
      razorpay_payment_id: paymentId,
      razorpay_payment_link_reference_id: referenceId,
      razorpay_signature: signature,
    };

    const tryCallback = async () => {
      try {
        const url = `${BaseURL}Bookings/razorpay/callback`;
        console.log(url);
        const res = await axios.get(url, { params: callbackParams });
        const v = (paymentLinkStatus || res?.data?.status || "").toString().toLowerCase();
        if (["paid", "success", "captured"].includes(v)) {
          setStatus("Payment Successful ✅");
        } else if (v === "pending") {
          setStatus("Payment Pending ⏳");
        } else {
          setStatus("Payment Failed ❌");
        }
      } catch (e) {
        setStatus("Payment verification failed ❌");
      }
    };

    tryCallback();
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

              {(details.paymentLinkId || details.paymentId || details.referenceId) && (
                <div className="bg-light rounded-3 p-3 text-start small mb-3">
                  {details.bookingId && (
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Booking ID</span>
                      <span className="fw-semibold">{details.bookingId}</span>
                    </div>
                  )}
                  {details.paymentLinkId && (
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Payment Link ID</span>
                      <span className="fw-semibold">{details.paymentLinkId}</span>
                    </div>
                  )}
                  {details.paymentLinkStatus && (
                    <div className="d-flex justify-content-between mt-2">
                      <span className="text-muted">Link Status</span>
                      <span className="fw-semibold text-capitalize">{details.paymentLinkStatus}</span>
                    </div>
                  )}
                  {details.paymentId && (
                    <div className="d-flex justify-content-between mt-2">
                      <span className="text-muted">Payment ID</span>
                      <span className="fw-semibold">{details.paymentId}</span>
                    </div>
                  )}
                  {details.referenceId && (
                    <div className="d-flex justify-content-between mt-2">
                      <span className="text-muted">Reference ID</span>
                      <span className="fw-semibold">{details.referenceId}</span>
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


