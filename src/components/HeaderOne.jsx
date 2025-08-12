import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import RegisterModal from "./RegisterModal";
import { FaCarSide } from "react-icons/fa";
import ChooseCarModal from "./ChooseCarModal";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import ProfileModal from "./ProfileModal";
import { useAlert} from "../context/AlertContext";
import axios from "axios";

const API_URL = process.env.REACT_APP_CARBUDDY_BASE_URL;

const HeaderOne = () => {
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [carModalVisible, setCarModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState(null);

  const [locationText, setLocationText] = useState("Fetching location...");
  const [isServiceAvailable, setIsServiceAvailable] = useState(null);

  const [user, setUser] = useState(null);
  const [profileVisible, setProfileVisible] = useState(false);

  const { cartItems } = useCart();
  const itemCount = cartItems.length;
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    const alreadyShown = localStorage.getItem("locationModalShown");
    if (!alreadyShown) {
      setShowLocationModal(true);
      // auto trigger
    }
 handleGetLocation();
    // your scroll and menu logic remains unchanged...
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("selectedCarDetails");
    if (saved) {
      try {
        setSelectedCar(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing saved car", err);
      }
    }
  }, []);

  useEffect(() => {
    const loadUser = () => {
      const saved = localStorage.getItem("user");
      if (saved) {
        setUser(JSON.parse(saved));
      }

      const carData = localStorage.getItem("selectedCarDetails");
        if (carData) {
          setSelectedCar(JSON.parse(carData));
        }
    };

    loadUser();

    window.addEventListener("userProfileUpdated", loadUser);
    return () => window.removeEventListener("userProfileUpdated", loadUser);
  }, []);


  useEffect(() => {
    var offCanvasNav = document.getElementById("offcanvas-navigation");
    var offCanvasNavSubMenu = offCanvasNav.querySelectorAll(".sub-menu");

    for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
      offCanvasNavSubMenu[i].insertAdjacentHTML(
        "beforebegin",
        "<span class='mean-expand-class'>+</span>"
      );
    }

    var menuExpand = offCanvasNav.querySelectorAll(".mean-expand-class");
    var numMenuExpand = menuExpand.length;

    function sideMenuExpand() {
      if (this.parentElement.classList.contains("active") === true) {
        this.parentElement.classList.remove("active");
      } else {
        for (let i = 0; i < numMenuExpand; i++) {
          menuExpand[i].parentElement.classList.remove("active");
        }
        this.parentElement.classList.add("active");
      }
    }

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener("click", sideMenuExpand);
    }
    window.onscroll = () => {
      if (window.pageYOffset < 150) {
        setScroll(false);
      } else if (window.pageYOffset > 150) {
        setScroll(true);
      }
      return () => (window.onscroll = null);
    };
  }, []);

  const mobileMenu = () => {
    setActive(!active);
  };

const handleGetLocation = () => {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = position.coords;
        setLocation(coords);
        localStorage.setItem("location", JSON.stringify(coords));
        localStorage.setItem("locationModalShown", "true");
        setShowLocationModal(false);

        const result = await getCityAndStateFromCoords(coords.latitude, coords.longitude);
        if (result) {
          const { city, state } = result;
          setLocationText(`${city}, ${state}`);

          try {
            const token = localStorage.getItem("token"); // adjust if you're storing token differently

            const res = await axios.get(`${API_URL}State`);

            const states = res.data;
            const matched = states.find(
              (s) => s.StateName.toLowerCase() === state.toLowerCase() && s.IsActive
            );

            if (matched) {
              setIsServiceAvailable(true);
            } else {
              setIsServiceAvailable(false);
              showAlert("Service is not available in your state.");
            }
          } catch (err) {
            console.error("State API error:", err);
            setIsServiceAvailable(false);
            showAlert("Failed to verify service availability.");
          }
        }
      },
      (error) => {
        console.error("Location error:", error.message);
        setLocationText("Location not found");
        setIsServiceAvailable(false);
        localStorage.setItem("locationModalShown", "true");
        setShowLocationModal(false);
      }
    );
  } else {
    showAlert("Geolocation is not supported by this browser.");
    setLocationText("Location unavailable");
    setIsServiceAvailable(false);
    localStorage.setItem("locationModalShown", "true");
    setShowLocationModal(false);
  }
};


  const handleCloseModal = () => {
    localStorage.setItem("locationModalShown", "true");
    setShowLocationModal(false);
  };

  const getCityAndStateFromCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await response.json();
    const { city, state } = data.address;
    return { city, state };
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return null;
  }
};

  return (
    <>
      <header className="nav-header header-layout1">
        <div className="header-top">
          <div className="container">
            <div className="row justify-content-center justify-content-lg-between align-items-center gy-2">
              <div className="col-auto d-none d-lg-block">
                <div className="header-links">
                  <ul>
                    <li>
                      <i className="fas fa-envelope" />
                      <Link to="mailto:info@example.com">carbuddy@example.com</Link>
                    </li>
                   <li onClick={handleGetLocation} style={{ cursor: "pointer" }}>
                        <i className="fas fa-map-marker-alt" />
                        {isServiceAvailable === false ? (
                          <span className="text-danger">Service not available at your location</span>
                        ) : (
                          locationText || "Detecting location..."
                        )}
                      </li>
                    <li>
                      <i className="fas fa-clock" />
                      Monday - Sunday
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-auto">
                <div className="header-links ps-0">
                  <ul>
                    <li>
                      <div className="social-links">
                        <Link to="">
                          <i className="fab fa-facebook-f" />
                        </Link>
                        <Link to="">
                          <i className="fab fa-instagram" />
                        </Link>
                        <Link to="">
                          <i className="fab fa-twitter" />
                        </Link>
                        <Link to="">
                          <i className="fab fa-linkedin" />
                        </Link>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`sticky-wrapper ${scroll && "sticky"}`}>
          {/* Main Menu Area */}
          <div className="menu-area">
            {/* <div className="header-navbar-logo ">
              <Link to="/">
                <img src="/assets/img/MyCarBuddy-Logo1.png" alt="MyCarBuddy" />
              </Link>
            </div> */}
            <div className="container">
              <div className="row align-items-center justify-content-lg-start justify-content-between">
                <div className="col-auto d-block">
                  <div className="header-logo1 ">
                    <Link to="/">
                      <img src="/assets/img/MyCarBuddy-Logo1.png" alt="MyCarBuddy" width={200} />
                    </Link>
                  </div>
                </div>
                <div className="col-auto">
                  <nav className="main-menu d-none d-lg-inline-block">
                    <ul>
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                      <li>
                        <NavLink
                          to="/about"
                          className={(navData) =>
                            navData.isActive ? "active" : ""
                          }
                        >
                          About Us
                        </NavLink>
                      </li>
                      <li>
                        <Link
                          to="/"
                          onClick={(e) => {
                            e.preventDefault();
                            if (window.location.pathname !== "/") {
                              window.location.href = "/#scroll-to-service";
                            } else {
                              window.dispatchEvent(new Event("scrollToService"));
                            }
                          }}
                        >
                          Services
                        </Link>
                      </li>

                      <li>
                        <NavLink
                          to="/contact"
                          className={(navData) =>
                            navData.isActive ? "active" : ""
                          }
                        >
                          Contact
                        </NavLink>
                      </li>
                    </ul>
                  </nav>
                  <div className="navbar-right d-inline-flex d-lg-none">
                    <button
                      type="button"
                      className="menu-toggle icon-btn"
                      onClick={mobileMenu}
                    >
                      <i className="fas fa-bars" />
                    </button>
                  </div>
                </div>
                <div className="col-auto ms-auto d-xl-block d-none">
                  <div className="navbar-right-desc">
                    <div
                      className="header-grid-wrap"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "36px",
                        padding: "8px 0",
                        fontFamily: "Segoe UI, sans-serif",
                      }}
                    >
                      <div
                        className="navbar-right-desc-details"
                        style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", cursor: "pointer" }}
                        onClick={() => {
                          if (user && (user.name || user.identifier)) {
                           navigate("/profile");
                          } else {
                            setSignInVisible(true); // Show sign-in modal
                          }
                        }}
                      >
                        <span className="header-grid-text" style={{ fontSize: "13px", color: "#555", marginBottom: "2px" }}>
                          {user?.name || user?.identifier ? "Hello," : "Sign In"}
                        </span>
                        <h6
                          className="header-grid-title"
                          style={{ fontSize: "15px", fontWeight: 600, color: "#116d6e", textDecoration: "underline" }}
                        >
                          {user?.name || user?.identifier || "Account"}
                        </h6>
                      </div>


                      <div
                        className="navbar-right-desc-details"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          cursor: "pointer",
                        }}
                        onClick={() => setCarModalVisible(true)}
                      >
                        {!selectedCar && (
                          <span
                            className="header-grid-text"
                            style={{ fontSize: "13px", color: "#666", marginBottom: "2px" }}
                          >
                            Vehicle
                          </span>
                        )}
                        <h6
                          className="header-grid-title"
                          style={{ fontSize: "15px", fontWeight: 600, color: "#116d6e" }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {selectedCar ? (
                              <>
                                <img
                                  src={selectedCar.model?.logo || "https://via.placeholder.com/50"}
                                  alt={selectedCar.model?.name}
                                  style={{
                                    width: 40,
                                    height: 40,
                                    objectFit: "contain",
                                    backgroundColor: "#fff",
                                  }}
                                />
                                <div style={{ display: "flex", flexDirection: "column", marginTop: '10px' }}>
                                  <small style={{ fontSize: "12px", color: "#555" }}>
                                    {selectedCar.brand?.name}
                                  </small>
                                  <strong>{selectedCar.model?.name}</strong>
                                </div>
                              </>
                            ) : (
                              <span style={{ textDecoration: "underline" }}>Choose Your Car</span>
                            )}
                          </span>
                        </h6>
                      </div>

                      <div
                        className="navbar-right-desc-details"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span className="header-grid-text" style={{ visibility: "hidden" }}>
                          {/* Cart */}
                        </span>
                        <Link to="/cart" title="Go to Cart" style={{ color: "#116d6e", position: "relative" }}>
                          <FaShoppingCart size={22} />
                          {itemCount > 0 && (
                            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                              {itemCount}
                            </span>
                          )}
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            <SignIn
              isVisible={signInVisible}
              onClose={() => setSignInVisible(false)}
              onRegister={() => {
                setSignInVisible(false);
                setRegisterVisible(true);
              }}
              onForgotPassword={() => {
                setSignInVisible(false);
              }}
            />
            <RegisterModal
              isVisible={registerVisible}
              onClose={() => setRegisterVisible(false)}
              onBackToSignIn={() => {
                setRegisterVisible(false);
                setSignInVisible(true);
              }}
              onRegistered={(updatedUser) => {
                setRegisterVisible(false);
                setUser(updatedUser);
              }}
            />
            <ChooseCarModal
              isVisible={carModalVisible}
              onClose={() => {
                setCarModalVisible(false);
                const saved = localStorage.getItem("selectedCarDetails");
                if (saved) setSelectedCar(JSON.parse(saved));
              }}
              onCarSaved={(car) => setSelectedCar(car)}
            />
            <ProfileModal
              isVisible={profileVisible}
              onClose={() => setProfileVisible(false)}
              onRegister={() => {
                setProfileVisible(false);
                setRegisterVisible(true);
              }}
            />
            {/* <div className="logo-bg" /> */}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu-wrapper  ${active && "body-visible"}`}>
          <div className="mobile-menu-area">
            <div className="mobile-logo">
              <Link to="/">
                <img src="/assets/img/MyCarBuddy-Logo1.png" alt="MyCarBuddy" />
              </Link>
              <button className="menu-toggle" onClick={mobileMenu}>
                <i className="fa fa-times" />
              </button>
            </div>
            <div className="mobile-menu">
              <ul id="offcanvas-navigation">
                <li >
                  <Link to="#">Home</Link>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={(navData) => (navData.isActive ? "active" : "")}
                  >
                    About
                  </NavLink>
                </li>
               
                <li >
                  <Link to="#">Service</Link>
                </li>

                {user?.id && (
                  <li>
                    <NavLink
                      to="/profile"
                      className={(navData) => (navData.isActive ? "active" : "")}
                    >
                      Profile
                    </NavLink>
                  </li>
                )}


                <li>
                  <NavLink
                    to="/contact"
                    className={(navData) => (navData.isActive ? "active" : "")}
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {showLocationModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            position: "relative",
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "10px",
            width: "90%",
            maxWidth: "350px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
          }}>
            {/* ✕ Close Icon */}
            <button
              onClick={handleCloseModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "22px",
                color: "#888",
                cursor: "pointer"
              }}
              aria-label="Close"
            >
              &times;
            </button>

            <img
              src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
              alt="Location Icon"
              style={{ width: 40, height: 40, marginBottom: 20, marginTop: 20 }}
            />
            <h4 style={{ marginBottom: 10 }}>Allow Location Access</h4>
            <p style={{ color: "#666", marginBottom: 25 }}>
              We use your location to show services near you.
            </p>
            <button
              onClick={handleGetLocation}
              style={{
                backgroundColor: "#e60012",
                color: "#fff",
                padding: "5px 15px",
                border: "none",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              Get Location
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderOne;
