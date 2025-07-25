import React from "react";
import service from '../images/service-1-1.png'

const bookings = [
  {
    id: 1,
    date: "Monday, 21 July 2025",
    time: "2 - 3PM",
    address: "Hyderabad, Hyderabad",
    services: [
      {
        title: "High Performance AC Service",
        price: 3499,
        image: service,
        duration: "1 hr"
      },
      {
        title: "Regular AC Service",
        price: 2399,
        image: service,
        duration: "30 mins"
      }
    ]
  },
  {
    id: 2,
    date: "Wednesday, 23 July 2025",
    time: "4 - 5PM",
    address: "Flat 101, Jubilee Hills, Hyderabad",
    services: [
      {
        title: "Washing Machine Repair",
        price: 899,
        image: service,
        duration: "45 mins"
      }
    ]
  }
];

const MyBookings = () => {
  return (
    <div className="container py-4">
      <h3 className="mb-4">My Bookings</h3>

      {bookings.map((booking) => (
        <div key={booking.id} className="card shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <h5 className="fw-bold mb-1">{booking.date}</h5>
              <p className="mb-1"><i className="bi bi-clock" /> Time: <strong>{booking.time}</strong></p>
              <p className="mb-3"><i className="bi bi-geo-alt" /> Address: {booking.address}</p>
            </div>
            <div className="text-end">
              <span className="badge mb-2 bg-success fs-6">Confirmed</span>
            </div>
          </div>

          <hr />

          <div className="row">
            {booking.services.map((service, idx) => (
              <div key={idx} className="col-md-6 d-flex mb-3 align-items-center">
                <img
                  src={service.image}
                  alt={service.title}
                  className="rounded me-3"
                  style={{ width: "64px", height: "64px", objectFit: "cover" }}
                />
                <div className="flex-grow-1">
                  <div className="fw-semibold">{service.title}</div>
                  <div className="text-muted small">{service.duration}</div>
                </div>
                <div className="fw-bold text-success text-nowrap">₹{service.price}</div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between border-top pt-3 mt-2">
            <div className="fw-bold">Total</div>
            <div className="fw-bold text-primary">
              ₹{booking.services.reduce((total, item) => total + item.price, 0)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
