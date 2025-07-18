import React, { useRef, useState } from "react";
import "./ServiceCards.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaSnowflake, FaCarBattery, FaCarSide, FaPaintRoller, FaMagic, FaShower, FaTools, FaGasPump } from "react-icons/fa";
import servicetwo from '../../src/images/service-2.png';
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const categories = [
  { id: 1, name: "AC Service", icon: <FaSnowflake /> },
  { id: 2, name: "Batteries", icon: <FaCarBattery /> },
  { id: 3, name: "Tyres & Wheels", icon: <FaCarSide /> },
  { id: 4, name: "Painting", icon: <FaPaintRoller /> },
  { id: 5, name: "Detailing", icon: <FaMagic /> },
  { id: 6, name: "Car Spa", icon: <FaShower /> },
  { id: 7, name: "Repairs", icon: <FaTools /> },
  { id: 8, name: "Fuel Delivery", icon: <FaGasPump /> },
  { id: 9, name: "AC Service", icon: <FaSnowflake /> },
  { id: 10, name: "Batteries", icon: <FaCarBattery /> },
  { id: 11, name: "Tyres & Wheels", icon: <FaCarSide /> },
  { id: 12, name: "Painting", icon: <FaPaintRoller /> },
];

const services = [
  {
    id: 101,
    title: "Regular AC Service",
    duration: "Takes 4 hours",
    price: 2399,
    originalPrice: 3199,
    includes: [
      "AC Vent Cleaning",
      "AC Gas (upto 400 gms)",
      "AC Filter Cleaning",
      "AC Inspection",
      "Condenser Cleaning",
    ],
    image: servicetwo,
    tag: "FREE AC UNIT INSPECTION",
    categoryId: 1,
  },
  {
    id: 102,
    title: "High Performance AC Service",
    duration: "Takes 8 Hours",
    price: 3499,
    originalPrice: 4999,
    includes: [
      "AC Vent Cleaning",
      "Dashboard Removing Refitting",
      "AC Gas (Upto 600gms)",
      "AC Leak Test",
      "Dashboard Cleaning",
    ],
    image: servicetwo,
    tag: "FREE AC GAS",
    categoryId: 1,
  },
];

export default function ServiceCards() {
  const id = useParams();
  const [activeTab, setActiveTab] = useState(categories[0]);
  const navigate = useNavigate();
  const scrollRef = useRef();

  const { cartItems, addToCart } = useCart();


  const scroll = (direction) => {
    if (direction === "left") {
      scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
    } else {
      scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
    }
  };

  const filteredServices = services.filter(s => s.categoryId === activeTab.id);


  return (
    <div className="container my-4">
      <div className="d-flex align-items-center position-relative mb-4">
        <button className="arrow-btn left" onClick={() => scroll("left")}>&lt;</button>
        <div className="scrollable-tabs" ref={scrollRef}>
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`tab-pill ${cat.id === activeTab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              <span className="icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
        <button className="arrow-btn right" onClick={() => scroll("right")}>&gt;</button>
      </div>

      {/* Services */}
      <div className="row">
        {filteredServices.map(service => {
          const isInCart = cartItems.some(i => i.id === service.id);
          return (
            <div key={service.id} className="col-md-12 mb-4">
              <div
                className="card shadow-sm service-card-horizontal"
                onClick={() => navigate(`/servicedetails/${service.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="row g-0">
                  <div className="col-md-3 position-relative">
                    <img
                      src={service.image}
                      className="img-fluid h-100 object-fit-cover"
                      alt={service.title}
                    />
                    <span className="tag-label">{service.tag}</span>
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title">{service.title}</h5>
                        <span className="text-muted small">{service.duration}</span>
                      </div>
                      <ul className="list-unstyled small mb-3 mt-2">
                        {service.includes.map((item, idx) => (
                          <li key={idx}>✔ {item}</li>
                        ))}
                      </ul>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted text-decoration-line-through">
                            ₹{service.originalPrice}
                          </div>
                          <div className="fw-bold text-success">₹{service.price}</div>
                        </div>
                        {isInCart ? (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={(e) => {
                              e.stopPropagation(); // prevent card click
                              navigate("/cart");
                            }}
                          >
                            ✔ View Cart
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(service);
                              toast.success("Service added to cart");
                            }}
                          >
                            + ADD TO CART
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        )}
      </div>
    </div>
  );
}
