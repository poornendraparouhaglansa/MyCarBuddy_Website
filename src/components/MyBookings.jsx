import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;
const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;
const ImageURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { showAlert } = useAlert();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [serviceQuality, setServiceQuality] = useState(0);
  const [technicianRating, setTechnicianRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  // New states for cancel section and reasons
  const [showCancelSection, setShowCancelSection] = useState(false);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [otherChecked, setOtherChecked] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const bytes = CryptoJS.AES.decrypt(user.id, secretKey);
  const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);

  const handleBack = () => {
    if (showCancelSection) {
      setShowCancelSection(false);
    } else {
      setSelectedBooking(null);
    }
  };
  const location = useLocation();
  const [feedbackExists, setFeedbackExists] = useState(false);

  // Fetch cancel reasons for modal
  useEffect(() => {
    const fetchCancelReasons = async () => {
      try {
        const res = await axios.get(`${BaseURL}AfterServiceLeads`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          }
        });
        if (res.status === 200 && Array.isArray(res.data)) {
          const filteredReasons = res.data.filter(reason => reason.ReasonType === 'Cancel');
          setCancelReasons(filteredReasons);
        }
      } catch (error) {
        console.error("Error fetching cancel reasons:", error);
      }
    };
    fetchCancelReasons();
  }, [user?.token]);

      const fetchBookings = async () => {
      try {
        const res = await axios.get(`${BaseURL}Bookings/${decryptedCustId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        });

        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setBookings(data);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const currentTab = searchParams.get("tab");


    fetchBookings();
  }, []); // 👀 Watch for URL search param changes



useEffect(() => {
    const fetchFeedback = async () => {
      if (!selectedBooking) return;

      try {
        const { CustID, TechID, BookingID } = selectedBooking;
        const response = await axios.get(`${BaseURL}Feedback/feedback`, {
          params: {
            custId: CustID,
            techId: TechID,
            bookingId: BookingID,
          },
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200 && response.data) {
          console.log("Feedback data:", response.data[0].ServiceReview);
          setFeedback(response.data[0].ServiceReview || "");
          setTechnicianRating(parseInt(response.data[0].TechRating) || 0);
          setServiceQuality(parseInt(response.data[0].ServiceRating) || 0);
          setFeedbackExists(true);
        }
      } catch (error) {
        console.error("Error fetching existing feedback:", error);
      }
    };

    fetchFeedback();
  }, [selectedBooking]);

const handleCancel = async (bookingId ,paymentMethod, transactionID , type ,Amount) => {
  if (!window.confirm("Are you sure you want to cancel this booking?")) {
    return;
  }

  try {
    const res = await axios.post(`${BaseURL}TechnicianTracking/UpdateTechnicianTracking`, {
        bookingId: bookingId,
        actionType: type
    }
    ,
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
        "Content-Type": "application/json",
      },
    }
    );
if(paymentMethod === 'Razorpay' || paymentMethod === 'razorpay'){
  alert("Refund has been initiated");
    const res_refund = await axios.post(`${BaseURL}Refund/Refund`, {
      paymentId: transactionID,
      amount: Amount
    },
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
        "Content-Type": "application/json",
      },
    }
    );

    if(res_refund.status === 200 ){
      if(res_refund.data.status === 'success'){
         showAlert("Refund has been initiated");
      }
    }
  }

  if(res.status === 200){

    if(type === 'Cancelled'){
      showAlert("Booking has been cancelled");  
    }
    
  
  };
} catch (error) {
    console.error("Error cancelling booking:", error);
  }
}

// New function to handle showing cancel section
const openCancelModal = () => {
  setShowCancelSection(true);
  setSelectedReason('');
  setOtherReason('');
  setOtherChecked(false);
};

  // New function to handle submitting cancellation with reason
  const submitCancellation = async () => {
    if (!selectedReason && !otherChecked) {
      alert("Please select a reason or choose 'Other' and provide a reason.");
      return;
    }
    if (otherChecked && !otherReason.trim()) {
      alert("Please provide a reason in the text area.");
      return;
    }

    const reasonToSend = otherChecked ? otherReason.trim() : selectedReason;

    try {
      const payload = {
        bookingID: selectedBooking.BookingID,
        cancelledBy: decryptedCustId || '',
        reason: reasonToSend,
        refundStatus: 'Pending'
      };

      const response = await axios.post(`${BaseURL}Cancellations`, payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        showAlert("Booking cancellation submitted successfully.");
       
       if(selectedBooking.paymentMethod === 'Razorpay' || selectedBooking.paymentMethod === 'razorpay'){

            const res_refund = await axios.post(`${BaseURL}Refund/Refund`, {
              paymentId: selectedBooking.TransactionID,
              amount: selectedBooking.TotalPrice + selectedBooking.GSTAmount - selectedBooking.CouponAmount
            },
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
                "Content-Type": "application/json",
              },
            }
            );

            if(res_refund.status === 200 ){
              if(res_refund.data.status === 'success'){
                 setShowCancelSection(false);
                showAlert("Refund has been initiated");
              }
            }
        }
        else{
            setShowCancelSection(false);
        }
        setBookings(prevBookings => prevBookings.map(booking =>
          booking.BookingID === selectedBooking.BookingID ? {...booking, BookingStatus: 'Cancelled'} : booking
        ));
        setSelectedBooking(prev => ({...prev, BookingStatus: 'Cancelled'}));
      } else {
        alert("Failed to submit cancellation. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting cancellation:", error);
      alert("Something went wrong while submitting cancellation.");
    }
  };

const filteredBookings = bookings.filter((booking) => {
  const matchesSearch = booking.BookingTrackID
    ?.toString()
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" || booking.BookingStatus === statusFilter;

  return matchesSearch && matchesStatus;
});


const handleSubmitReview = async (bookingID) => {
  try {
    const payload = {
      bookingID: bookingID,
      custID: selectedBooking.CustID, // from selected booking
      techID: selectedBooking.TechID, // from selected booking
      techReview: '',
      serviceReview: feedback,
      techRating: String(technicianRating), // convert to string
      serviceRating: String(serviceQuality)  // convert to string
    };

    const response = await axios.post(`${BaseURL}Feedback`, payload, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      alert("Feedback submitted successfully!");
    } else {
      alert("Failed to submit feedback. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting feedback:", error);
    alert("Something went wrong while submitting feedback.");
  }
};


  const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="d-flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onRatingChange(star)}
          style={{
            cursor: "pointer",
            color: star <= rating ? "gold" : "#ccc",
            fontSize: "1.5rem",
            marginRight: "5px",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};


  return (
    <div className="container py-4">
      <h6 className="mb-4">My Bookings</h6>

      <div className="d-flex justify-content-between gap-3 mb-3">
  {/* Search by Track ID */}
  <input
    type="text"
    className="form-control"
    placeholder="Search by Booking Track ID"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ maxWidth: "250px" }}
  />

  {/* Booking Status Filter */}
  <select
    className="form-select"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    style={{ maxWidth: "200px" }}
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="Completed">Completed</option>
    <option value="Cancelled">Cancelled</option>
    <option value="ServiceStarted">ServiceStarted</option>
  </select>
</div>

      {!selectedBooking && (
        <div style={{ maxHeight: "75vh", overflowY: "auto" }}>
   {Array.isArray(filteredBookings) && filteredBookings.length > 0 ? (
  filteredBookings.slice(0, visibleCount).map((booking) => {
    const statusTimeline = [
      { label: "Booking Created", date: booking.BookingDate },
      { label: "Technician Assigned", date: booking.TechAssignDate },
      { label: "Technician Started", date: booking.JourneyStartedAt },
      { label: "Technician Reached", date: booking.ReachedAt },
      { label: "Service Started", date: booking.ServiceStartedAt },
      { label: "Service Completed", date: booking.ServiceEndedAt },
    ];

    return (
      <div
        key={booking.BookingID}
        className="card shadow-sm mb-4 position-relative border-start border-1"
      >
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-start mb-2 p-3"
          style={{ backgroundColor: "#2d9c9cff" }}
        >
          <div>
            <small className="text-white">Booking ID:</small>
            <div className="fw-bold text-white">
              #{booking.BookingTrackID}
            </div>
          </div>
          <div>
            <small className="text-white">Booking OTP:</small>
            <div className="fw-bold text-primary">
              <span className="bg-warning px-2 py-1 rounded text-dark">
                {booking.BookingOTP}
              </span>
            </div>
          </div>
          <button
            className="btn btn-yellow px-3 py-1"
            onClick={() => setSelectedBooking(booking)}
          >
            <i className="bi bi-eye"></i>
          </button>
        </div>

        {/* Timeline */}
        <div className="timeline-container">
          {[
            ...statusTimeline,
            ...(booking.BookingStatus === "Cancelled"
              ? [{ label: "Cancelled", date: new Date() }]
              : []),
          ].map((step, index, array) => {
            const isCompleted = !!step.date;
            return (
              <div
                key={index}
                className={`timeline-step ${isCompleted ? "completed" : ""} ${step.label === "Cancelled" ? "cancelled" : ""}`}
              >
                <div
                  className={`circle ${step.label === "Cancelled" ? "circle-cancel" : ""}`}
                  style={{
                    backgroundColor: step.label === "Cancelled" ? "#a93b2a" : ""
                  }}
                >
                  {step.label === "Cancelled" ? "✕" : isCompleted ? "✓" : index + 1}
                </div>
                <div className="label">{step.label}</div>
                <div className="date">
                  {step.date
                    ? new Date(step.date).toLocaleDateString("en-GB")
                    : ""}
                </div>
                {index !== array.length - 1 && <div className="line" />}
              </div>
            );
          })}
        </div>

        {/* Booking Info */}
        <div className="row g-3 p-3">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-calendar-event text-muted fs-5" />
              <div>
                <div className="small text-muted">Date</div>
                <div className="fw-semibold">
                  {booking.BookingDate
                    ? new Date(booking.BookingDate).toLocaleDateString("en-GB")
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-clock-history text-muted fs-5" />
              <div>
                <div className="small text-muted">Time</div>
                <div className="fw-semibold">{booking.TimeSlot}</div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-geo-alt text-muted fs-5" />
              <div>
                <div className="small text-muted">Location</div>
                <div className="fw-semibold">
                  {booking.CityName}, {booking.StateName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  })
) : (
  <div className="text-center py-5">
    <h5>No bookings found</h5>
    <p className="text-muted">Try changing your filter.</p>
  </div>
)}

          {visibleCount < bookings.length && (
            <div className="text-center">
              <button className="btn btn-outline-primary mb-4 px-4 py-2" onClick={() => setVisibleCount(visibleCount + 3)}>
                Load More
              </button>
            </div>
          )}
        </div>
      )}

     {selectedBooking && (
  <div className="card shadow-lg p-4 rounded-4">
    {/* Back Button */}
    <div className="d-flex justify-content-end mb-4">
      <button
        className="btn btn-outline-secondary d-flex align-items-center gap-2  px-3 py-1"
        onClick={handleBack}
      >
        <i className="bi bi-arrow-left"></i> Back
      </button>

      
    </div>

    {/* Header */}
    <div className="mb-4 d-flex justify-content-between align-items-start">
  <div>
    <h4 className="fw-bold mb-1">Booking Details</h4>
    <p className="text-muted mb-0">
      {new Date(selectedBooking.BookingDate).toLocaleDateString("en-GB")} • {selectedBooking.TimeSlot}
    </p>
    <p className="text-secondary small mb-0">
      <i className="bi bi-geo-alt me-1" />
      {selectedBooking.CityName}, {selectedBooking.StateName}
    </p>
  </div>

{selectedBooking?.Payments 
  ? (
    selectedBooking.BookingStatus !== "Completed" &&
    selectedBooking.BookingStatus !== "Cancelled" &&
    selectedBooking.BookingStatus !== "Refunded" &&
    !showCancelSection ? (
      <button
        className="tab-pill pill border-danger text-danger px-3 py-1"
        onClick={() => openCancelModal()}
      >
        Cancel
      </button>
    ) : (
      (() => {
        const bookingDate = new Date(selectedBooking.BookingDate);
        const now = new Date();
        const diffInDays = Math.floor((now - bookingDate) / (1000 * 60 * 60 * 24));

        return diffInDays <= 7 && selectedBooking.BookingStatus !== "Cancelled" ? (
          <button
            className="tab-pill pill border-success text-success px-3 py-1"
            onClick={() =>
              openCancelModal()
            }
          >
            Request for Refund
          </button>
        ) : null;
      })()
    )
  ) : null}

</div>

    {/* Customer & Vehicle Info */}
    <div className="row g-3 mb-4">
      {/* Customer Info */}
      <div className="col-md-5">
        <div className="border rounded-4 p-3 h-100">
          <h6 className="text-uppercase text-muted mb-2">User Details</h6>
          <div className="fw-bold fs-6">
            {selectedBooking.IsOthers ? selectedBooking.OthersFullName : selectedBooking.CustomerName}
          </div>
          <div className="text-muted small">
            {selectedBooking.IsOthers ? selectedBooking.OthersPhoneNumber : selectedBooking.PhoneNumber}
          </div>
          <hr />
          <h6 className="text-uppercase text-muted mb-2">Address</h6>
          <div className="small">
            {selectedBooking.FullAddress}, {selectedBooking.Pincode}
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="col-md-7">
        <div className="border rounded-4 p-3 h-100 d-flex gap-3">
          <img
            src={`${ImageURL}${selectedBooking.VehicleImage}`}
            alt="Vehicle"
            className="img-fluid rounded-3"
            style={{ width: 150, height: "auto", objectFit: "cover" }}
          />
          <div>
            <h6 className="text-uppercase text-muted mb-2">Vehicle Details</h6>
            <div className="small"><strong>Number:</strong> {selectedBooking.VehicleNumber}</div>
            <div className="small"><strong>Brand:</strong> {selectedBooking.BrandName}</div>
            <div className="small"><strong>Model:</strong> {selectedBooking.ModelName}</div>
            <div className="small"><strong>Fuel:</strong> {selectedBooking.FuelTypeName}</div>
          </div>
        </div>
      </div>
    </div>

    {/* Packages */}
    {selectedBooking.Packages?.length > 0 && (
      <div className="mb-4">
        <h5 className="fw-semibold mb-3">Included Packages</h5>
        <div className="row g-3">
          {selectedBooking.Packages.map((pkg, idx) => (
            <div key={idx} className="col-md-6">
              <div className="border rounded-4 p-3 d-flex gap-3">
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                  style={{ width: 56, height: 56 }}
                >
                  <i className="bi bi-box-seam fs-5 text-secondary"></i>
                </div>
                <div>
                  <div className="fw-semibold">{pkg.PackageName}</div>
                  <ul className="text-muted small mb-0 mt-1">
                    {pkg.Category?.SubCategories?.[0]?.Includes?.map((inc) => (
                      <li key={inc.IncludeID}>{inc.IncludeName}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Booking Meta Info */}
    <div className="row g-3 mb-4">
      {/* Payment */}
      <div className="col-md-4">
        <div className="card p-3 border-0 shadow-sm rounded-4">
  <h6 className="text-uppercase text-muted mb-2">Payment</h6>
  <span
    className={`fw-bold ${
      selectedBooking?.Payments?.[0]?.PaymentStatus === "Success" 
        ? "text-success" 
        : "text-danger"
    }`}
  >
    {selectedBooking?.Payments?.[0]?.PaymentStatus || "Failed"}
  </span>
</div>
      </div>

      {/* Technician */}
      <div className="col-md-4">
        <div className="card p-3 border-0 shadow-sm rounded-4">
          <h6 className="text-uppercase text-muted mb-2">Technician</h6>
          {selectedBooking.TechID ? (
            <>
              <div className="fw-bold">
                {selectedBooking.TechFullName} ({selectedBooking.TechPhoneNumber})
              </div>
              <div className="text-success small mt-1">Assigned</div>
            </>
          ) : (
            <div className="text-muted fst-italic">Not assigned</div>
          )}
        </div>
      </div>

      {/* Booking Status */}
      {selectedBooking.BookingStatus !== "Pending" && (
        <div className="col-md-4">
          <div className="card p-3 border-0 shadow-sm rounded-4">
            <h6 className="text-uppercase text-muted mb-2">Booking Status</h6>
            <div className="fw-semibold">{selectedBooking.BookingStatus}</div>
          </div>
        </div>
      )}
    </div>

    {/* Amount Summary */}
    <div className="border-top pt-4">
      <div className="d-flex justify-content-end mb-2">
        <div className="me-4 fw-semibold">Amount</div>
        <div className="fw-bold text-primary">
          ₹{selectedBooking.TotalPrice.toFixed(2)}
        </div>
      </div>
      <div className="d-flex justify-content-end mb-2">
        <div className="me-4 fw-semibold">GST (18%)</div>
        <div className="fw-bold text-primary">
          ₹{selectedBooking.GSTAmount.toFixed(2)}
        </div>
      </div>
      {selectedBooking.CouponAmount > 0 && (
        <div className="d-flex justify-content-end mb-2">
          <div className="me-4 fw-semibold">Coupon</div>
          <div className="fw-bold text-danger">
            -₹{selectedBooking.CouponAmount.toFixed(2)}
          </div>
        </div>
      )}
      <hr />
      <div className="d-flex justify-content-end">
        <div className="me-4 fw-bold fs-5">Total</div>
        <div className="fw-bold text-success fs-5">
          ₹{(selectedBooking.TotalPrice + selectedBooking.GSTAmount - selectedBooking.CouponAmount).toFixed(2)}
        </div>
      </div>
    </div>

    {/* Cancel Section Overlay */}
    {showCancelSection && (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255,255,255,0.95)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '1rem',
      }}>
        <div className="border rounded-3 p-4 bg-white shadow" style={{ minWidth: 350, maxWidth: 500 }}>
          <h6 className="text-danger">Cancel Booking</h6>
          <form>
            {cancelReasons.map((reason) => (
              <div className="form-check" key={reason.ID}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="cancelReason"
                  id={`reason-${reason.ID}`}
                  value={reason.Reason}
                  checked={selectedReason === reason.Reason && !otherChecked}
                  onChange={() => {
                    setSelectedReason(reason.Reason);
                    setOtherChecked(false);
                  }}
                />
                <label className="form-check-label" htmlFor={`reason-${reason.ID}`}>
                  {reason.Reason}
                </label>
              </div>
            ))}
            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="radio"
                name="cancelReason"
                id="reason-other"
                checked={otherChecked}
                onChange={() => {
                  setOtherChecked(true);
                  setSelectedReason('');
                }}
              />
              <label className="form-check-label" htmlFor="reason-other">
                Other
              </label>
            </div>
            {otherChecked && (
              <textarea
                className="form-control mt-2"
                rows="3"
                placeholder="Please specify your reason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            )}
          </form>
          <div className="d-flex justify-content-end mt-3">
            <button type="button" className="btn btn-secondary me-2 px-4 py-2" onClick={() => setShowCancelSection(false)}>Close</button>
            <button type="button" className="btn btn-danger px-4 py-2" onClick={submitCancellation}>Submit</button>
          </div>
        </div>
      </div>
    )}

    {/* Review Section (only if not cancelling) */}
    {!showCancelSection && selectedBooking.BookingStatus === "Completed" && (
      <div className="review-card border rounded-3 p-4 mt-4">
        <h6 className="text-primary">Rate Your Experience</h6>
        {/* Service Quality */}
        <div className="mb-3">
          <label className="fw-bold">Service Quality</label>
          <p className="small text-muted">How satisfied were you with the overall service?</p>
          <StarRating rating={serviceQuality} onRatingChange={setServiceQuality} />
        </div>
        {/* Technician Rating */}
        <div className="mb-3">
          <label className="fw-bold">Technician </label>
          <p className="small text-muted">How would you rate the professionalism and expertise?</p>
          <StarRating rating={technicianRating} onRatingChange={setTechnicianRating} />
        </div>
        {/* Feedback */}
        <div className="mb-3">
          <label className="fw-bold">Your Feedback</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Share your thoughts to help us improve"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        {feedbackExists ? (
          ''
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => handleSubmitReview(selectedBooking.BookingID)}
          >
            Submit Review
          </button>
        )}
      </div>
    )}

  </div>
)}



    </div>
  );





};

export default MyBookings;
