import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SignIn from "./SignIn";
import RegisterModal from "./RegisterModal";
import { FaCarSide } from "react-icons/fa";
import ChooseCarModal from "./ChooseCarModal";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import ProfileModal from "./ProfileModal";
import { useAlert} from "../context/AlertContext"

const HeaderOne = () => {
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [carModalVisible, setCarModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState(null);

  const [user, setUser] = useState(null);
  const [profileVisible, setProfileVisible] = useState(false);

  const { cartItems } = useCart();
  const itemCount = cartItems.length;
  const { showAlert } = useAlert();

  useEffect(() => {
    const alreadyShown = localStorage.getItem("locationModalShown");
    if (!alreadyShown) {
      setShowLocationModal(true); // show only first time
    }

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
        (position) => {
          setLocation(position.coords);
          localStorage.setItem("locationModalShown", "true");
          setShowLocationModal(false);
        },
        (error) => {
          console.error("Location error:", error.message);
          localStorage.setItem("locationModalShown", "true");
          setShowLocationModal(false);
        }
      );
    } else {
      showAlert("Geolocation is not supported by this browser.");
      localStorage.setItem("locationModalShown", "true");
      setShowLocationModal(false);
    }
  };

  const handleCloseModal = () => {
    localStorage.setItem("locationModalShown", "true");
    setShowLocationModal(false);
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
                    <li>
                      <i className="fas fa-map-marker-alt" />
                      Madhapur, Hyderabad, India
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
            <div className="header-navbar-logo mt-0">
              <Link to="/">
                <img src="/assets/img/logo-yellow-01.svg" alt="MyCarBuddy" />
              </Link>
            </div>
            <div className="container">
              <div className="row align-items-center justify-content-lg-start justify-content-between">
                <div className="col-auto d-xl-none d-block">
                  <div className="header-logo mt-0">
                    <Link to="/">
                      <img src="assets/img/logo-yellow-01.svg" alt="MyCarBuddy" />
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
                            setProfileVisible(true); // Show profile modal
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
                          Cart
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
            <div className="logo-bg" />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu-wrapper  ${active && "body-visible"}`}>
          <div className="mobile-menu-area">
            <div className="mobile-logo">
              <Link to="/">
                <img src="assets/img/logo-yellow-01.svg" alt="MyCarBuddy" />
              </Link>
              <button className="menu-toggle" onClick={mobileMenu}>
                <i className="fa fa-times" />
              </button>
            </div>
            <div className="mobile-menu">
              <ul id="offcanvas-navigation">
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Home</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Home 01
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/home-2"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Home 02
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/home-3"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Home 03
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/home-4"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Home 04
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/home-5"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Home 05
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/home-6"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Home 06
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={(navData) => (navData.isActive ? "active" : "")}
                  >
                    About
                  </NavLink>
                </li>
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Pages</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/team"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Team Page
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/team-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Team Details
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/shop"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Shop Page
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/shop-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Shop Details
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/cart"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Cart
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/checkout"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Checkout
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/wishlist"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Wishlist
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Project</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/project"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Projects
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/project-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Project Details
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Service</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/service"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Service
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/service-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Service Details
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Shop</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/shop"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Shop
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/shop-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Shop Details
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/cart"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Cart
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/checkout"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Checkout
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/wishlist"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Wishlist
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li className="menu-item-has-children submenu-item-has-children">
                  <Link to="#">Blog</Link>
                  <ul className="sub-menu submenu-class">
                    <li>
                      <NavLink
                        to="/blog"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Blog
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/blog-details"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Blog Details
                      </NavLink>
                    </li>
                  </ul>
                </li>
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
