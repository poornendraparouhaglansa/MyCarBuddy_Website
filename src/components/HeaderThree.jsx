import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const HeaderThree = () => {
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);

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
  return (
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
          <div className="header-navbar-logo">
            <Link to="/">
              <img src="assets/img/logo-white.svg" alt="Fixturbo" />
            </Link>
          </div>
          <div className="container">
            <div className="row align-items-center justify-content-lg-start justify-content-between">
              <div className="col-auto d-xl-none d-block">
                <div className="header-logo">
                  <Link to="/">
                    <img src="assets/img/logo-white.svg" alt="Fixturbo" />
                  </Link>
                </div>
              </div>
              <div className="col-auto">
                <nav className="main-menu d-none d-lg-inline-block">
                  <ul>
                    <li className="menu-item-has-children">
                      <Link to="#">Home</Link>
                      <ul className="sub-menu">
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
                        className={(navData) =>
                          navData.isActive ? "active" : ""
                        }
                      >
                        About Us
                      </NavLink>
                    </li>
                    <li className="menu-item-has-children">
                      <Link to="#">Services</Link>
                      <ul className="sub-menu">
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
                    <li className="menu-item-has-children">
                      <Link to="#">Projects</Link>
                      <ul className="sub-menu">
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
                            Projects Details
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                    <li className="menu-item-has-children">
                      <Link to="#">Blog</Link>
                      <ul className="sub-menu">
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
                    <li className="menu-item-has-children">
                      <Link to="#">Pages</Link>
                      <ul className="sub-menu">
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
                <div className="header-button">
                  <div className="navbar-right-desc d-xxl-flex d-none">
                    <img src="assets/img/icon/chat.svg" alt="Fixturbo" />
                    <div className="navbar-right-desc-details">
                      <h6 className="title">Need help?</h6>
                      <Link className="link" to="tel:+2590256215">
                        (307) 555-0133
                      </Link>
                    </div>
                  </div>
                  <Link to="/about" className="btn style-border3">
                    Get A Quote <i className="fas fa-arrow-right ms-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="logo-bg" />
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

export default HeaderThree;
