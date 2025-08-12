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

const HeaderTwo = () => {
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
  const navigate = useNavigate();

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
          localStorage.setItem("location", JSON.stringify(position.coords));
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
    <header className="nav-header header-layout2">
      <div className="header-top p-0">
        <div className="container">
          <div className="row justify-content-center justify-content-lg-between align-items-center gy-2">
            <div className="col-auto d-none d-lg-block">
              <div className="header-logo">
                <Link to="/">
                  <img src="/assets/img/MyCarBuddy-Logo1.png" alt="MyCarBuddy" width={180} />
                </Link>
              </div>
            </div>
            <div className="col-auto">
              <div className="header-grid-info">
                <ul>
                  <li>
                    <div className="icon">
                      <i className="fas fa-clock" />
                    </div>
                    <div className="header-grid-info-details">
                      <p>Sunday - Friday:</p>
                      <h6>9 am - 8 pm</h6>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-map-marker-alt" />
                    </div>
                    <div className="header-grid-info-details">
                      <p>6391 Elgin St. Celina, Delaware</p>
                      <h6>Kentucky </h6>
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
          <div className="container">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto header-navbar-logo">
                <div className="header-logo">
                  <Link to="/">
                    <img src="/assets/img/MyCarBuddy-Logo1.png" alt="Fixturbo" />
                  </Link>
                </div>
              </div>
              <div className="col-auto">
                <nav className="main-menu d-none d-lg-inline-block">
                  <ul>
                    <li >
                     <NavLink
                        to="/"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        Home
                      </NavLink>
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
                    <li >
                      <NavLink
                        to="/about"
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                       Services
                      </NavLink>
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
              <div className="col-auto d-xl-block d-none">
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
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu-wrapper  ${active && "body-visible"}`}>
          <div className="mobile-menu-area">
            <div className="mobile-logo">
              <Link to="/">
                <img src="assets/img/logo.svg" alt="Fixturbo" />
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
      </div>
    </header>
  );
};

export default HeaderTwo;
