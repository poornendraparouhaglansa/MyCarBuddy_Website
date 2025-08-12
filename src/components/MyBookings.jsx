import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";

const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;
const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;
const ImageURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const bytes = CryptoJS.AES.decrypt(user.id, secretKey);
  const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);

  const handleBack = () => setSelectedBooking(null);

  useEffect(() => {
    try {
      axios
        .get(`${BaseURL}Bookings/${decryptedCustId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        })
       .then((res) => {
          let data = res.data;
           // If data is a string, parse it
            if (typeof data === "string") {
              try {
                data = JSON.parse(data);
              } catch (err) {
                console.error("Error parsing bookings JSON:", err);
                data = [];
              }
            }

            // Ensure it's an array
            if (Array.isArray(data) && data.length > 0) {
              setBookings(data);
            } else {
              setBookings([]);
            }
        })
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, []);

  return (
    <div className="container py-4">
      <h3 className="mb-4">My Bookings</h3>

      {!selectedBooking && (
        <div style={{ maxHeight: "75vh", overflowY: "auto" }}>
         {Array.isArray(bookings) && bookings.slice(0, visibleCount).map((booking) => (
            <div key={booking.BookingID} className="card shadow-sm mb-4 p-3 position-relative border-start border-1">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <small className="text-muted">Booking ID:</small>
                  <div className="fw-bold text-primary">#{booking.BookingTrackID}</div>
                </div>
                <div>
                  <small className="text-muted">Booking Status:</small>
                  <div className="fw-bold text-primary">
                    <span className="bg-warning px-2 py-1 rounded text-dark">{booking.BookingStatus}</span>
                  </div>
                </div>
                <button className="btn btn-primary px-3 py-1" onClick={() => setSelectedBooking(booking)}>
                  <i className="bi bi-eye"></i>
                </button>
              </div>

              <hr className="my-2" />

              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-calendar-event text-muted fs-5" />
                    <div>
                      <div className="small text-muted">Date</div>
                      <div className="fw-semibold">{booking.BookingDate}</div>
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
                      <div className="fw-semibold">{booking.CityName}, {booking.StateName}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

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
        <div className="card shadow-lg p-4">
          <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-outline-secondary px-3 py-1" onClick={handleBack}>
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>

          <h4>Booking Details</h4>
         <h5>
          {new Date(selectedBooking.BookingDate).toLocaleDateString("en-GB")} at {selectedBooking.TimeSlot}
        </h5>
          <p><i className="bi bi-geo-alt" /> {selectedBooking.CityName}, {selectedBooking.StateName}</p>

          {/* Customer Info */}
          <div className="row mb-3" style={{ border: "1px solid #ccc" , boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",  borderRadius: "8px"}}>
            <div className="col-md-5" style={{ borderRight: "1px solid #ccc" }}>
              <div className=" p-3">
                <h6 className="text-muted mb-1">Booked For</h6>
                <div className="fw-bold">
                  {selectedBooking.IsOthers ? selectedBooking.OthersFullName : selectedBooking.CustomerName}
                </div>
                <small>
                  {selectedBooking.IsOthers ? selectedBooking.OthersPhoneNumber : selectedBooking.PhoneNumber}
                </small>
                 <h6 className="text-muted mb-1">Address</h6>
                <div>{selectedBooking.FullAddress}, {selectedBooking.Pincode}</div>
              </div>
            </div>
            <div className="col-md-7">
              <div className=" ">
                <div className="row p-3">
              <div className="col-md-3" style={{ margin: ""}}>
                <img
                  src={`${ImageURL}${selectedBooking.VehicleImage}`}
                  alt="Vehicle"
                  className="img-fluid rounded"
                
                />
            </div>
            <div className="col-md-8">
              <div className=" p-3">
                <h6 className="text-muted mb-1">Vehicle Details</h6>
                <div className="mb-1"><strong>Number:</strong> {selectedBooking.VehicleNumber}</div>
                <div className="mb-1"><strong>Brand:</strong> {selectedBooking.BrandName}</div>
                <div className="mb-1"><strong>Model:</strong> {selectedBooking.ModelName}</div>
                <div><strong>Fuel:</strong> {selectedBooking.FuelTypeName}</div>
              </div>
            </div>
                </div>
                </div>
              {/* </div> */}
              {/* <div className="card p-3">
                <h6 className="text-muted mb-1">Address</h6>
                <div>{selectedBooking.FullAddress}, {selectedBooking.Pincode}</div>
              </div> */}
            </div>
          </div>


          {/* Packages */}
          <div className="row mt-3">
            {selectedBooking.Packages?.map((pkg, idx) => (
              <div key={idx} className="col-md-6 mb-3">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded bg-light d-flex align-items-center justify-content-center me-3"
                    style={{ width: 64, height: 64 }}
                  >
                    <i className="bi bi-box-seam fs-4 text-secondary"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{pkg.PackageName}</div>
                    <div className="text-muted small">{pkg.EstimatedDurationMinutes} mins</div>
                    <div className="text-muted small">
                      {pkg.Category?.SubCategories?.[0]?.Includes?.map((inc) =>(
                      <li key={inc.IncludeID}>{inc.IncludeName}</li>
                    ))}
                    </div>
                  </div>
                  {/* <div className="fw-bold text-success">₹{selectedBooking.PackagePrice}</div> */}
                </div>
              </div>
            ))}
          </div>

          <hr />

          <div className="row g-3">
            <div className="col-md-4">
              <div className="card p-3 border-left border-3 border-info">
                <h6 className="text-muted mb-1">Payment</h6>
                <span className={`fw-bold ${selectedBooking.PaymentStatus === 'Paid' ? 'text-success' : 'text-danger'}`}>
                  {selectedBooking.PaymentStatus || 'Pending'}
                </span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3 border-left border-3 border-warning">
                <h6 className="text-muted mb-1">Technician</h6>
                {selectedBooking.TechID ? (
                  <>
                    <div className="fw-bold">{selectedBooking.TechFullName}</div>
                    {/* <small>{selectedBooking.IsOthers ? selectedBooking.OthersPhoneNumber : selectedBooking.PhoneNumber}</small> */}
                    <div className="text-success mt-1">Assigned</div>
                  </>
                ) : (
                  <div className="text-muted fst-italic">Not assigned</div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3 border-left border-3 border-primary">
                <h6 className="text-muted mb-1">Booking Status</h6>
                <div className="text-muted">{selectedBooking.BookingStatus}</div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between border-top pt-3 mt-4">
            <div className="fw-bold">Total Amount</div>
            <div className="fw-bold text-primary">₹{selectedBooking.TotalPrice}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
