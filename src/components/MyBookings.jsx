import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const bytes = CryptoJS.AES.decrypt(user.id, secretKey);
    const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);
  const location = useLocation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const [showCancelSection, setShowCancelSection] = useState(false);
  const [technicianRating, setTechnicianRating] = useState(0);
  const [cancelReasons, setCancelReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [otherChecked, setOtherChecked] = useState(false);
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);
  const [serviceQuality, setServiceQuality] = useState(0);
  const [feedbackExists, setFeedbackExists] = useState(false);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [resumeDate, setResumeDate] = useState('');
  const [resumePaymentMethod, setResumePaymentMethod] = useState('');
  const [selectedResumeTimes, setSelectedResumeTimes] = useState([]);
  const [resumeMorningSlots, setResumeMorningSlots] = useState([]);
  const [resumeAfternoonSlots, setResumeAfternoonSlots] = useState([]);
  const [resumeEveningSlots, setResumeEveningSlots] = useState([]);
  const [isSubmittingResume, setIsSubmittingResume] = useState(false);

  const handleBack = () => {
    setSelectedBooking(null);
  };

  
  

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const currentTab = searchParams.get("tab");

    fetchBookings();

    // Add event listener for notificationReceived event
    const handleNotification = () => {
      fetchBookings();
    };
    window.addEventListener('notificationReceived', handleNotification);

    return () => {
      window.removeEventListener('notificationReceived', handleNotification);
    };
  }, []); // 👀 Watch for URL search param changes

  // Define filteredBookings before using it in useEffect
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = booking.BookingTrackID
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || booking.BookingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const threshold = 100; // Load more when 100px from bottom
      
      if (scrollHeight - scrollTop <= clientHeight + threshold) {
        if (visibleCount < filteredBookings.length && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate loading delay for better UX
          setTimeout(() => {
            setVisibleCount(prev => prev + 3);
            setIsLoadingMore(false);
          }, 500);
        }
      }
    };

    const scrollContainer = document.querySelector('.bookings-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [visibleCount, filteredBookings.length, isLoadingMore]);



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

  // Request Refund handler
  const handleRequestRefund = async () => {
    if (!selectedBooking) return;
    try {
      const payload = {
        bookingID: selectedBooking.BookingID,
        isRefunded: true,
      };
      const res = await axios.put(`${BaseURL}Payments`, payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        showAlert("Refund requested successfully.");
        // Optimistically update local state
        setSelectedBooking((prev) => (
          prev
            ? {
                ...prev,
                BookingStatus: prev.BookingStatus === "Cancelled" ? prev.BookingStatus : "Refunded",
                Payments: Array.isArray(prev.Payments)
                  ? [
                      {
                        ...prev.Payments[0],
                        isRefunded: true,
                      },
                      ...prev.Payments.slice(1),
                    ]
                  : prev.Payments,
              }
            : prev
        ));
        setBookings((prev) =>
          prev.map((b) =>
            b.BookingID === selectedBooking.BookingID
              ? { ...b, BookingStatus: b.BookingStatus === "Cancelled" ? b.BookingStatus : "Refunded" }
              : b
          )
        );
      } else {
        showAlert("Failed to request refund. Please try again.");
      }
    } catch (err) {
      console.error("Refund request error:", err);
      showAlert("Error while requesting refund. Please try again.");
    }
  };

  // Populate payment method for resume when opening details
  useEffect(() => {
    if (selectedBooking) {
      setResumePaymentMethod(selectedBooking?.paymentMethod || "");
    }
  }, [selectedBooking]);

  // Fetch TimeSlots for resume form
  const fetchResumeTimeSlots = async (dateStr) => {
    try {
      const res = await axios.get(`${BaseURL}TimeSlot`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const timeSlots = res.data || [];
      const sorted = timeSlots
        .filter((s) => s?.Status === true)
        .sort((a, b) => a.StartTime.localeCompare(b.StartTime));

      const categorized = { morning: [], afternoon: [], evening: [] };

      const now = new Date();
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      const isToday = dateStr && new Date(dateStr).toDateString() === twoHoursLater.toDateString();

      sorted.forEach(({ StartTime, EndTime }) => {
        const [sh, sm] = StartTime.split(":").map(Number);
        const [eh, em] = EndTime.split(":").map(Number);

        const startDate = new Date(dateStr);
        startDate.setHours(sh, sm, 0, 0);
        const endDate = new Date(dateStr);
        endDate.setHours(eh, em, 0, 0);
        const isExpired = isToday && startDate <= twoHoursLater;

        const fmt = (d) =>
          d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        const label = `${fmt(startDate)} - ${fmt(endDate)}`;

        const slot = { label, disabled: isExpired };
        if (sh < 12) categorized.morning.push(slot);
        else if (sh < 16) categorized.afternoon.push(slot);
        else categorized.evening.push(slot);
      });

      setResumeMorningSlots(categorized.morning);
      setResumeAfternoonSlots(categorized.afternoon);
      setResumeEveningSlots(categorized.evening);
    } catch (err) {
      console.error("Error fetching time slots:", err);
    }
  };

  useEffect(() => {
    if (showResumeForm && resumeDate) {
      fetchResumeTimeSlots(resumeDate);
    }
  }, [showResumeForm, resumeDate]);

  const handleOpenResume = () => {
    setShowCancelSection(false);
    setShowResumeForm(true);
    setSelectedResumeTimes([]);
    // Default date to today if empty
    if (!resumeDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      setResumeDate(`${yyyy}-${mm}-${dd}`);
    }
  };

  const handleResumeSubmit = async () => {
    if (!selectedBooking) return;
    if (!resumeDate || selectedResumeTimes.length === 0 || !resumePaymentMethod) {
      showAlert("Please select date, at least one timeslot and payment method.");
      return;
    }

    try {
      setIsSubmittingResume(true);
      const form = new FormData();
      form.append("BookingTrackID", selectedBooking.BookingTrackID);
      form.append("BookingDate", resumeDate);
      form.append("TimeSlot", selectedResumeTimes.join(","));
      form.append("PaymentMethod", resumePaymentMethod);
      form.append("BookingFrom", "web");
      form.append("CouponAmount", selectedBooking.CouponAmount);
      form.append("GSTAmount", selectedBooking.GSTAmount);
      form.append("TotalAmount", selectedBooking.TotalPrice)

      const res = await axios.put(`${BaseURL}Bookings/update-booking`, form, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        // alert("Booking resumed successfully!");

        if (resumePaymentMethod === "razorpay") {
          const finalTotal = (selectedBooking.TotalPrice + selectedBooking.GSTAmount - selectedBooking.CouponAmount).toFixed(2);
          loadRazorpay(finalTotal, res.data);
        } else {
          showAlert("success", "Booking resumed successfully!", 3000, "success");
          setShowResumeForm(false);
          setSelectedBooking(null);
          fetchBookings();
       
        }

      } else {
        showAlert("Failed to resume booking. Please try again.");
      }
    } catch (err) {
      console.error("Error resuming booking:", err);
      showAlert("Error while resuming booking. Please try again.");
    } finally {
      setIsSubmittingResume(false);
    }
  };

  const loadRazorpay = (amount, data) => {

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: amount * 100,
      currency: "INR",
      name: "MyCarBuddy a product by Glansa Solutions Pvt. Ltd.",
      order_id: data.razorpay.orderID,
      description: "Payment for Car Services",
      image: "/assets/img/MyCarBuddy-Logo1.png",
      handler: function (response) {
        console.log("Payment success:", response);
      },
      prefill: {
        name: selectedBooking.CustFullName,
        email: selectedBooking.CustEmail,
        contact: selectedBooking.CustPhoneNumber,
      },
      theme: {
        color: "#1890ae",
      },
      modal: {
        ondismiss: function () {
  
          axios.put(
            `${BaseURL}Bookings/booking-status`,
            {
              bookingID: data.bookingID,
              bookingStatus: "Failed",
            },
            {
              headers: {
                // Authorization: `Bearer ${token}`,
              },
            }
          );

          showAlert("success", "Payment was cancelled or failed.", 3000, "success");
          setShowResumeForm(false);
          setSelectedBooking(null);
          fetchBookings();
          // setPaymentStatus("error");
          // setPaymentMessage("Payment was cancelled or failed.");
          // setShowPaymentModal(true);
          // clearCart();
        },
      },
    };
 const rzp = new window.Razorpay(options);
  rzp.open();
};
  

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
       
        setShowCancelSection(false);
       
       if(selectedBooking.paymentMethod === 'Razorpay' || selectedBooking.paymentMethod === 'razorpay'){
         showAlert("Booking cancellation submitted successfully. Please wait for refund.");
       }
       else{
         showAlert("Booking cancellation submitted successfully.");
       }

      //       const res_refund = await axios.post(`${BaseURL}Refund/Refund`, {
      //         paymentId: selectedBooking.TransactionID,
      //         amount: selectedBooking.TotalPrice + selectedBooking.GSTAmount - selectedBooking.CouponAmount
      //       },
      //       {
      //         headers: {
      //           Authorization: `Bearer ${user?.token}`,
      //           "Content-Type": "application/json",
      //         },
      //       }
      //       );

      //       if(res_refund.status === 200 ){
      //         if(res_refund.data.status === 'success'){
      //            setShowCancelSection(false);
      //           showAlert("Refund has been initiated");
      //         }
      //       }
      //   }
      //   else{
      //       setShowCancelSection(false);
      //   }
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

// Skeleton Loading Component
const BookingSkeleton = () => {
  return (
    <div className="card shadow-sm mb-4 position-relative border-start border-1" style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
      {/* Header Skeleton */}
      <div
        className="d-flex justify-content-between align-items-start mb-2 p-3"
        style={{ backgroundColor: "#136d6e" }}
      >
        <div>
          <div className="placeholder-glow">
            <span className="placeholder col-3 bg-light" style={{ height: "12px" }}></span>
          </div>
          <div className="placeholder-glow mt-2">
            <span className="placeholder col-4 bg-light" style={{ height: "16px" }}></span>
          </div>
        </div>
        <div>
          <div className="placeholder-glow">
            <span className="placeholder col-3 bg-light" style={{ height: "12px" }}></span>
          </div>
          <div className="placeholder-glow mt-2">
            <span className="placeholder col-6 bg-warning" style={{ height: "20px" }}></span>
          </div>
        </div>
        <div className="placeholder-glow">
          <span className="placeholder col-2 bg-light" style={{ height: "32px", width: "60px" }}></span>
        </div>
      </div>

      {/* Timeline Skeleton */}
      <div className="timeline-container p-3">
        <div className="d-flex justify-content-between">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="text-center">
              <div className="placeholder-glow">
                <span 
                  className="placeholder bg-secondary rounded-circle d-block mx-auto" 
                  style={{ width: "30px", height: "30px" }}
                ></span>
              </div>
              <div className="placeholder-glow mt-2">
                <span className="placeholder col-6 bg-light" style={{ height: "10px" }}></span>
              </div>
              <div className="placeholder-glow mt-1">
                <span className="placeholder col-4 bg-light" style={{ height: "8px" }}></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Info Skeleton */}
      <div className="row g-3 p-3">
        <div className="col-md-4">
          <div className="d-flex align-items-center gap-2">
            <div className="placeholder-glow">
              <span className="placeholder bg-light rounded" style={{ width: "20px", height: "20px" }}></span>
            </div>
            <div className="flex-grow-1">
              <div className="placeholder-glow">
                <span className="placeholder col-3 bg-light" style={{ height: "10px" }}></span>
              </div>
              <div className="placeholder-glow mt-1">
                <span className="placeholder col-4 bg-light" style={{ height: "12px" }}></span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="d-flex align-items-center gap-2">
            <div className="placeholder-glow">
              <span className="placeholder bg-light rounded" style={{ width: "20px", height: "20px" }}></span>
            </div>
            <div className="flex-grow-1">
              <div className="placeholder-glow">
                <span className="placeholder col-3 bg-light" style={{ height: "10px" }}></span>
              </div>
              <div className="placeholder-glow mt-1">
                <span className="placeholder col-5 bg-light" style={{ height: "12px" }}></span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="d-flex align-items-center gap-2">
            <div className="placeholder-glow">
              <span className="placeholder bg-light rounded" style={{ width: "20px", height: "20px" }}></span>
            </div>
            <div className="flex-grow-1">
              <div className="placeholder-glow">
                <span className="placeholder col-3 bg-light" style={{ height: "10px" }}></span>
              </div>
              <div className="placeholder-glow mt-1">
                <span className="placeholder col-6 bg-light" style={{ height: "12px" }}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


  return (
    <div className="container py-4">
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          .placeholder-glow .placeholder {
            animation: pulse 1.5s ease-in-out infinite;
          }
        `}
      </style>
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
        <div className="bookings-scroll-container" style={{ maxHeight: "75vh", overflowY: "auto" }}>
   {isLoading ? (
     // Show skeleton loading
     <>
       <BookingSkeleton />
       <BookingSkeleton />
       <BookingSkeleton />
     </>
   ) : Array.isArray(filteredBookings) && filteredBookings.length > 0 ? (
  filteredBookings.slice(0, visibleCount).map((booking) => {
   const tracking = Array.isArray(booking.TechnicianTracking) ? booking.TechnicianTracking[0] : {};

    const statusTimeline = [
      { label: "Booking Created", date: booking.BookingDate },
      { label: "Buddy Assigned", date: booking.TechAssignDate },
      { label: "Buddy Started", date: tracking?.JourneyStartedAt },
      { label: "Buddy Reached", date: tracking?.ReachedAt },
      { label: "Buddy Started", date: tracking?.ServiceStartedAt },
      { label: "Buddy Completed", date: tracking?.ServiceEndedAt },
    ];

    return (
      <div
        key={booking.BookingID}
        className="card shadow-sm mb-4 position-relative border-start border-1"
      >
        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-start mb-2 p-3"
          style={{ backgroundColor: "#136d6e" }}
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
            ...(booking.BookingStatus === "Failed"
              ? [{ label: "Failed", date: new Date() }]
              : []),
            ...(booking.Payments === null
              ? [{ label: "Resume", date: new Date() }]
              : []),
          ].map((step, index, array) => {
            const isCompleted = !!step.date;
            return (
              <div
                key={index}
                className={`timeline-step ${isCompleted ? "completed" : ""} ${step.label === "Cancelled" ? "cancelled" : ""} ${step.label === "Failed" ? "failed" : ""}`}
              >
                <div
                  className={`circle ${step.label === "Cancelled" ? "circle-cancel" : ""} ${step.label === "Failed" ? "circle-failed" : ""}`}
                  style={{
                    backgroundColor: step.label === "Cancelled" ? "#a93b2a" : step.label === "Failed" ? "#a93b2a" : ""
                  }}
                >
                  {step.label === "Cancelled" ? "✕" : step.label === "Failed" ? "✕" : isCompleted ? "✓" : index + 1}
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

     {booking?.Payments ? (
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
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-clock-history text-muted fs-5 mt-1" />
              <div>
                <div className="small text-muted">Time</div>
                <div className="fw-semibold">
                  {booking.TimeSlot && booking.TimeSlot.includes(',') ? (
                    // Multiple time slots - display each on a new line
                    <div>
                      {booking.TimeSlot.split(',').map((timeSlot, index) => (
                        <div key={index} className="mb-1">
                          {timeSlot.trim()}
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Single time slot
                    booking.TimeSlot || "N/A"
                  )}
                </div>
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

        {booking?.Payments
        ? (
          booking.BookingStatus !== "Completed" &&
          booking.BookingStatus !== "Cancelled" &&
          booking.BookingStatus !== "Refunded" &&
          booking.BookingStatus !== "Failed" &&
          !showCancelSection ? (
          <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
            <div>Need a different time? Go ahead and reschedule your booking.</div>
            <button
                  className="tab-pill pill border-warning text-warning px-3 py-1"
                  onClick={() => navigate(`/reschedule?bookingId=${booking.BookingID}`)}
                >
                  Reschedule
            </button>
          </div>
        ) : null
        ) : null}

        </div>
     ) : (
      <>
        <div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">
          <div>Your payment is pending. Please resume your booking to complete the payment.</div>
          <button
            className="btn btn-primary px-3 py-1"
            onClick={() => { setSelectedBooking(booking); handleOpenResume(); }}
          >
            Resume Booking
          </button>
        </div>
      </>
     )}
       
      </div>
    );
  })
) : (
  <div className="text-center py-5">
    <h5>No bookings found</h5>
    <p className="text-muted">Try changing your filter.</p>
  </div>
)}

          {/* Infinite scroll loading indicator */}
          {isLoadingMore && (
            <div className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading more bookings...</span>
              </div>
              <div className="mt-2 text-muted">Loading more bookings...</div>
            </div>
          )}
          
          {/* End of results indicator */}
          {visibleCount >= filteredBookings.length && filteredBookings.length > 0 && (
            <div className="text-center py-3">
              <div className="text-muted">
                <i className="bi bi-check-circle me-2"></i>
                You've reached the end of your bookings
              </div>
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
      {new Date(selectedBooking.BookingDate).toLocaleDateString("en-GB")} • {
        selectedBooking.TimeSlot && selectedBooking.TimeSlot.includes(',') ? (
          // Multiple time slots - display with line breaks
          <span>
            {selectedBooking.TimeSlot.split(',').map((timeSlot, index) => (
              <span key={index}>
                {timeSlot.trim()}
                {index < selectedBooking.TimeSlot.split(',').length - 1 && <br />}
              </span>
            ))}
          </span>
        ) : (
          // Single time slot
          selectedBooking.TimeSlot || "N/A"
        )
      }
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
    selectedBooking.BookingStatus !== "Failed" &&
    !showCancelSection ? (
      <div className="d-flex gap-2">
        {/* <button
          className="tab-pill pill border-warning text-warning px-3 py-1"
          onClick={() => navigate(`/reschedule?bookingId=${selectedBooking.BookingID}`)}
        >
          Reschedule
        </button> */}
        <button
          className="tab-pill pill border-danger text-danger px-3 py-1"
          onClick={() => openCancelModal()}
        >
          Cancel
        </button>
      </div>
    ) : (
      (() => {
        const bookingDate = new Date(selectedBooking.BookingDate);
        const now = new Date();
        const diffInDays = Math.floor((now - bookingDate) / (1000 * 60 * 60 * 24));

        return diffInDays <= 7 &&
               selectedBooking.BookingStatus !== "Cancelled" &&
               selectedBooking.Payments !== null &&
               selectedBooking.Payments?.isRefunded === false ? (
          <div className="d-flex gap-2">
            {/* <button
              className="tab-pill pill border-warning text-warning px-3 py-1"
              onClick={() => navigate(`/reschedule?bookingId=${selectedBooking.BookingID}`)}
            >
              Reschedule
            </button> */}
            {/* <button
              className="tab-pill pill border-success text-success px-3 py-1"
              onClick={handleRequestRefund}
            >
              Request for Refund
            </button> */}
          </div>
        ) : (
          selectedBooking.BookingStatus !== "Completed" &&
          selectedBooking.BookingStatus !== "Cancelled" &&
          selectedBooking.BookingStatus !== "Failed" &&
          selectedBooking.BookingStatus !== "Refunded" ? (
            <button
              className="tab-pill pill border-warning text-warning px-3 py-1"
              onClick={() => navigate(`/reschedule?bookingId=${selectedBooking.BookingID}`)}
            >
              Reschedule
            </button>
          ) : null
        );
      })()
    )
  ) : (
     selectedBooking.BookingStatus !== "Failed" &&
      selectedBooking.BookingStatus !== "Completed" &&
      selectedBooking.BookingStatus !== "Cancelled" &&
       selectedBooking.BookingStatus !== "Refunded" &&
    !showResumeForm && (
      <div className="d-flex gap-2">
        {/* <button
          className="tab-pill pill border-warning text-warning px-3 py-1"
          onClick={() => navigate(`/reschedule?bookingId=${selectedBooking.BookingID}`)}
        >
          Reschedule
        </button> */}
        <button
          className="tab-pill pill border-primary text-primary px-3 py-1"
          onClick={handleOpenResume}
        >
          Resume booking
        </button>
      </div>
    )
  )}

</div>

    {/* Resume Booking Form or Details */}
    {showResumeForm ? (
      <div className="border rounded-4 p-3 mb-4">
        <h6 className="mb-3">Resume booking</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Select date</label>
            <input
              type="date"
              className="form-control"
              value={resumeDate}
               min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setResumeDate(e.target.value);
                setSelectedResumeTimes([]);
              }}
            />
          </div>
          <div className="col-md-8">
            <label className="form-label">Payment method</label>
            <div className="d-flex align-items-center gap-4 mt-1">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="resumePaymentMethod"
                  id="pm-razorpay"
                  value="razorpay"
                  checked={resumePaymentMethod === "razorpay"}
                  onChange={(e) => setResumePaymentMethod(e.target.value)}
                />
                <label className="form-check-label" htmlFor="pm-razorpay">razorpay</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="resumePaymentMethod"
                  id="pm-cos"
                  value="COS"
                  checked={resumePaymentMethod === "COS"}
                  onChange={(e) => setResumePaymentMethod(e.target.value)}
                />
                <label className="form-check-label" htmlFor="pm-cos">COS</label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="form-label">Select time slots (multi-select)</label>
          <div className="row">
            <div className="col-md-4">
              <div className="fw-semibold mb-2">Morning</div>
              {resumeMorningSlots.length === 0 && <div className="text-muted small">No slots</div>}
              {resumeMorningSlots.map((s) => (
                <div className="form-check" key={`m-${s.label}`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`m-${s.label}`}
                    disabled={s.disabled}
                    checked={selectedResumeTimes.includes(s.label)}
                    onChange={(e) => {
                      setSelectedResumeTimes((prev) =>
                        e.target.checked
                          ? [...prev, s.label]
                          : prev.filter((x) => x !== s.label)
                      );
                    }}
                  />
                  <label className="form-check-label" htmlFor={`m-${s.label}`}>{s.label}</label>
                </div>
              ))}
            </div>
            <div className="col-md-4">
              <div className="fw-semibold mb-2">Afternoon</div>
              {resumeAfternoonSlots.length === 0 && <div className="text-muted small">No slots</div>}
              {resumeAfternoonSlots.map((s) => (
                <div className="form-check" key={`a-${s.label}`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`a-${s.label}`}
                    disabled={s.disabled}
                    checked={selectedResumeTimes.includes(s.label)}
                    onChange={(e) => {
                      setSelectedResumeTimes((prev) =>
                        e.target.checked
                          ? [...prev, s.label]
                          : prev.filter((x) => x !== s.label)
                      );
                    }}
                  />
                  <label className="form-check-label" htmlFor={`a-${s.label}`}>{s.label}</label>
                </div>
              ))}
            </div>
            <div className="col-md-4">
              <div className="fw-semibold mb-2">Evening</div>
              {resumeEveningSlots.length === 0 && <div className="text-muted small">No slots</div>}
              {resumeEveningSlots.map((s) => (
                <div className="form-check" key={`e-${s.label}`}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`e-${s.label}`}
                    disabled={s.disabled}
                    checked={selectedResumeTimes.includes(s.label)}
                    onChange={(e) => {
                      setSelectedResumeTimes((prev) =>
                        e.target.checked
                          ? [...prev, s.label]
                          : prev.filter((x) => x !== s.label)
                      );
                    }}
                  />
                  <label className="form-check-label" htmlFor={`e-${s.label}`}>{s.label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-outline-secondary px-4 py-2" onClick={() => setShowResumeForm(false)} disabled={isSubmittingResume}>Cancel</button>
            <button className="btn btn-primary px-4  py-2" onClick={handleResumeSubmit} disabled={isSubmittingResume}>
              {isSubmittingResume ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    ) : (
    <>
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
    {selectedBooking?.Payments?.[0]?.PaymentStatus || "Pending"}
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
    </>
    )}

  </div>
)}



    </div>
  );





};

export default MyBookings;
