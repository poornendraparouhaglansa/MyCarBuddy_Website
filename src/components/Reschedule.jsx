import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlert } from "../context/AlertContext";

const Reschedule = () => {
  const [bookingId, setBookingId] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [reason, setReason] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [showReschedule, setShowReschedule] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;
  const API_BASE = process.env.REACT_APP_CARBUDDY_BASE_URL;

   const [showResumeForm, setShowResumeForm] = useState(false);
    const [resumeDate, setResumeDate] = useState("");
    const [resumeMorningSlots, setResumeMorningSlots] = useState([]);
    const [resumeAfternoonSlots, setResumeAfternoonSlots] = useState([]);
    const [resumeEveningSlots, setResumeEveningSlots] = useState([]);
    const [selectedResumeTimes, setSelectedResumeTimes] = useState([]);
    const [resumePaymentMethod, setResumePaymentMethod] = useState("");
    const [isSubmittingResume, setIsSubmittingResume] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("bookingId");
    if (id) {
      setBookingId(id);
      fetchBookingDetails(id);
    }
  }, [location.search]);

  useEffect(() => {
    if (bookingData) {
      const dateToUse = newDate || bookingData.BookingDate;
      if (dateToUse) {
        fetchResumeTimeSlots(dateToUse);
      }
    }
  }, [bookingData, newDate]);

  const fetchBookingDetails = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}Bookings/BookingId?Id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data) {
        setBookingData(res.data[0]);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      showAlert("Failed to load booking details.");
    }
  };

//   const fetchTimeSlots = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}TimeSlot`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTimeSlots(res.data || []);
//     } catch (error) {
//       console.error("Error fetching time slots:", error);
//     }
//   };

   const fetchResumeTimeSlots = async (dateStr) => {
      try {
        const res = await axios.get(`${API_BASE}TimeSlot`, {
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
        const isToday = dateStr && new Date(dateStr).toDateString() === now.toDateString();

        sorted.forEach(({ StartTime, EndTime }) => {
          const [sh, sm] = StartTime.split(":").map(Number);
          const [eh, em] = EndTime.split(":").map(Number);

          const startDate = new Date(dateStr);
          startDate.setHours(sh, sm, 0, 0);
          const endDate = new Date(dateStr);
          endDate.setHours(eh, em, 0, 0);

          // Check if slot is at least 2 hours from now
          const isExpired = isToday && endDate <= twoHoursLater;

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
    


    // const fetchResumeTimeSlots = async (dateStr) => {
    //   try {
    //     const res = await axios.get(`${BaseURL}TimeSlot`, {
    //       headers: {
    //         Authorization: `Bearer ${user?.token}`,
    //       },
    //     });
  
    //     const timeSlots = res.data || [];
    //     const sorted = timeSlots
    //       .filter((s) => s?.Status === true)
    //       .sort((a, b) => a.StartTime.localeCompare(b.StartTime));
  
    //     const categorized = { morning: [], afternoon: [], evening: [] };
  
    //     const now = new Date();
    //     const isToday = dateStr && new Date(dateStr).toDateString() === now.toDateString();
  
    //     sorted.forEach(({ StartTime, EndTime }) => {
    //       const [sh, sm] = StartTime.split(":").map(Number);
    //       const [eh, em] = EndTime.split(":").map(Number);
  
    //       const startDate = new Date(dateStr);
    //       startDate.setHours(sh, sm, 0, 0);
    //       const endDate = new Date(dateStr);
    //       endDate.setHours(eh, em, 0, 0);
    //       const isExpired = isToday && endDate <= now;
  
    //       const fmt = (d) =>
    //         d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    //       const label = `${fmt(startDate)} - ${fmt(endDate)}`;
  
    //       const slot = { label, disabled: isExpired };
    //       if (sh < 12) categorized.morning.push(slot);
    //       else if (sh < 16) categorized.afternoon.push(slot);
    //       else categorized.evening.push(slot);
    //     });
  
    //     setResumeMorningSlots(categorized.morning);
    //     setResumeAfternoonSlots(categorized.afternoon);
    //     setResumeEveningSlots(categorized.evening);
    //   } catch (err) {
    //     console.error("Error fetching time slots:", err);
    //   }
    // };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatTimeSlot = (slot) => {
    const [start, end] = slot.split(' - ');
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const handleReschedule = async () => {
    if (!newDate) {
      showAlert("Please select a new date.");
      return;
    }
    if (selectedResumeTimes.length === 0) {
      showAlert("Please select at least one time slot.");
      return;
    }

    const timeSlotsText = selectedResumeTimes.join(", ");
    const confirmed = window.confirm(`Are you sure you want to reschedule to ${newDate} at ${timeSlotsText}?`);

    if (!confirmed) return;

    try {
      await axios.post(`${API_BASE}Reschedules`, {
        bookingID: bookingId,
        reason: reason,
        oldSchedule: bookingData.BookingDate,
        newSchedule: newDate,
        timeSlot: selectedResumeTimes.join(", "),
        requestedBy: 1,
        Status: ''
      }, { headers: { Authorization: `Bearer ${token}` } });
      showAlert("success", "Booking rescheduled successfully!", 3000, "success");
      setShowReschedule(false);
      setNewDate("");
      setSelectedResumeTimes([]);
      setReason("");
      navigate("/profile?tab=mybookings");
    } catch (error) {
      showAlert("Failed to reschedule booking.");
      console.error(error);
    }
  };

  return (
    <div className="container py-4">
      {bookingData && showReschedule && (
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg p-4">
              <h4 className="mb-4">Reschedule Your Booking</h4>
              <div className="mb-3">
                <strong>Current Booking Date:</strong> {new Date(bookingData.BookingDate).toLocaleDateString()}
              </div>
              <div className="mb-3">
                <strong>Current Time Slot:</strong> {bookingData.TimeSlot}
              </div>
              <div className="mt-3">
                <label className="form-label mt-2">Reschedule Date :</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={newDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                {/* <label className="form-label mt-2">Time Slots :</label> */}

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

                <label className="form-label mt-2">Reschedule Reason</label>
                <textarea
                  className="form-control"
                  placeholder="Reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
                <button
                  className="btn btn-primary px-4 py-2 mt-3"
                  onClick={handleReschedule}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reschedule;
