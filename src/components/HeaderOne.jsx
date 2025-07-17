import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SignIn from "./SignIn";
import RegisterModal from "./RegisterModal";
import { FaCarSide } from "react-icons/fa";
import ChooseCarModal from "./ChooseCarModal";

const HeaderOne = () => {
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [signInVisible, setSignInVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false);
  const [carModalVisible, setCarModalVisible] = useState(false);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const alreadyShown = localStorage.getItem("locationModalShown");
    if (!alreadyShown) {
      setShowLocationModal(true); // show only first time
    }

    // your scroll and menu logic remains unchanged...
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
      alert("Geolocation is not supported by this browser.");
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
                      <Link to="mailto:info@example.com">info@example.com</Link>
                    </li>
                    <li>
                      <i className="fas fa-map-marker-alt" />
                      6391 Elgin St. Celina, 10299
                    </li>
                    <li>
                      <i className="fas fa-clock" />
                      Sunday - Friday
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-auto">
                <div className="header-links ps-0">
                  <ul>
                    <li>
                      <div className="social-links">
                        <Link to="https://www.facebook.com/">
                          <i className="fab fa-facebook-f" />
                        </Link>
                        <Link to="https://www.instagram.com/">
                          <i className="fab fa-instagram" />
                        </Link>
                        <Link to="https://www.twitter.com/">
                          <i className="fab fa-twitter" />
                        </Link>
                        <Link to="https://www.linkedin.com/">
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
                        <Link to="/services">Services</Link>

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
                    <div className="header-grid-wrap">
                      <div className="simple-icon">
                        <svg
                          width={23}
                          height={22}
                          viewBox="0 0 23 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.4642 0.48653C10.3922 0.48653 9.39616 0.758532 8.47616 1.30253C7.55616 1.84653 6.82416 2.57853 6.28016 3.49853C5.73616 4.41853 5.46416 5.41453 5.46416 6.48653C5.46416 7.55853 5.73616 8.55453 6.28016 9.47453C6.82416 10.3945 7.55616 11.1265 8.47616 11.6705C9.39616 12.2145 10.3922 12.4865 11.4642 12.4865C12.5362 12.4865 13.5322 12.2185 14.4522 11.6825C15.3722 11.1465 16.1042 10.4185 16.6482 9.49853C17.1922 8.57853 17.4642 7.57453 17.4642 6.48653C17.4642 5.39853 17.1962 4.39453 16.6602 3.47453C16.1242 2.55453 15.3962 1.82653 14.4762 1.29053C13.5562 0.754532 12.5522 0.48653 11.4642 0.48653ZM11.4642 10.4945C10.7442 10.4945 10.0762 10.3145 9.46016 9.95453C8.84416 9.59453 8.35616 9.10653 7.99616 8.49053C7.63616 7.87453 7.45616 7.20653 7.45616 6.48653C7.45616 5.76653 7.63616 5.10253 7.99616 4.49453C8.35616 3.88653 8.84416 3.40253 9.46016 3.04253C10.0762 2.68253 10.7442 2.50253 11.4642 2.50253C12.1842 2.50253 12.8522 2.68253 13.4682 3.04253C14.0842 3.40253 14.5722 3.88653 14.9322 4.49453C15.2922 5.10253 15.4722 5.76653 15.4722 6.48653C15.4722 7.20653 15.2922 7.87453 14.9322 8.49053C14.5722 9.10653 14.0842 9.59453 13.4682 9.95453C12.8522 10.3145 12.1842 10.4945 11.4642 10.4945ZM0.976156 21.5105C1.28016 21.6385 1.57616 21.7665 1.86416 21.8945L1.88816 21.8225C1.90416 21.7745 1.93216 21.7305 1.97216 21.6905C2.01216 21.6505 2.08816 21.5425 2.20016 21.3665L2.36816 21.1025C2.65616 20.5905 3.19216 19.9585 3.97616 19.2065C4.82416 18.4065 5.80816 17.7745 6.92816 17.3105C8.28816 16.7665 9.79216 16.4945 11.4402 16.4945C13.0882 16.4945 14.6082 16.7825 16.0002 17.3585C17.0882 17.8065 18.0802 18.4225 18.9762 19.2065C19.6482 19.7985 20.1762 20.4305 20.5602 21.1025C20.6402 21.1985 20.7202 21.3265 20.8002 21.4865C20.8802 21.5985 20.9282 21.6705 20.9442 21.7025C20.9602 21.7345 20.9842 21.7665 21.0162 21.7985C21.0482 21.8305 21.0642 21.8545 21.0642 21.8705C21.0642 21.8865 21.0642 21.8945 21.0642 21.8945L21.9762 21.5105L22.8642 21.1025V21.0065C22.8642 20.9745 22.8482 20.9425 22.8162 20.9105C22.7842 20.8785 22.7602 20.8385 22.7442 20.7905C22.7282 20.7425 22.6802 20.6625 22.6002 20.5505C22.4562 20.3425 22.3442 20.1585 22.2642 19.9985C21.7042 19.1665 21.0722 18.4305 20.3682 17.7905C19.2962 16.8465 18.1202 16.1025 16.8402 15.5585C15.1922 14.8545 13.4322 14.5025 11.5602 14.5025C9.62416 14.5025 7.86416 14.8385 6.28016 15.5105C4.96816 16.0545 3.80016 16.8145 2.77616 17.7905C2.05616 18.4305 1.41616 19.1665 0.856156 19.9985L0.688156 20.2625C0.528156 20.5185 0.424156 20.6945 0.376156 20.7905C0.328156 20.8385 0.296156 20.8865 0.280156 20.9345L0.256156 21.0065V21.1025C0.192156 21.1025 0.160156 21.1105 0.160156 21.1265C0.160156 21.1425 0.224156 21.1745 0.352156 21.2225L0.976156 21.5105Z"
                            fill="#1B1F22"
                          />
                        </svg>
                      </div>
                      {/* <img src="assets/img/icon/chat.svg" alt="MyCarBuddy" /> */}
                      <div className="navbar-right-desc-details">
                        <span className="header-grid-text">Sign In</span>
                        <h6 className="header-grid-title">
                          <span
                            className="account-link"
                            onClick={() => setSignInVisible(true)}
                            style={{ cursor: "pointer", color: "#116d6e", textDecoration: "underline" }}
                          >
                            Account
                          </span>
                        </h6>

                      </div>
                      <div className="navbar-right-desc-details" style={{marginLeft:"6px"}}>
                        <span className="header-grid-text">Vehicle</span>
                        <h6 className="header-grid-title">
                          <span
                            className="account-link"
                            onClick={() => setCarModalVisible(true)}
                            style={{ cursor: "pointer", color: "#116d6e", display: "flex", alignItems: "center", gap: "10px" }}
                          >
                          Choose Your Car
                          </span>
                        </h6>
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
                      />
                      <ChooseCarModal
                        isVisible={carModalVisible}
                        onClose={() => setCarModalVisible(false)}
                      />
                    </div>
                  </div>
                </div>


              </div>
            </div>
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
