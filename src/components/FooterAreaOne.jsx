import React from "react";
import { Link } from "react-router-dom";

const FooterAreaOne = () => {
  return (
    <footer
      className="footer-wrapper footer-layout1"
      style={{ backgroundImage: "url(assets/img/bg/footer-bg1-1.png)" }}
    >
      <div className="container">
        <div className="widget-area">
          <div className="col-md-12 text-center">
               <img src="/assets/img/MyCarBuddy-Logo1.png" alt="MyCarBuddy"  width={"300px"}/>
          </div>
          <div className="row justify-content-between">

            

            <div className="col-md-3 col-xl-auto">
              <div className="widget widget_nav_menu footer-widget">
                <h3 className="widget_title">Company</h3>
                <div className="menu-all-pages-container">
                  <ul className="menu">
                    <li>
                      <Link to="/about">About</Link>
                    </li>
                    <li>
                      <Link to="/terms">Services</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-auto">
              <div className="widget footer-widget widget-newsletter">
                <h3 className="widget_title">About</h3>
             
                <p className="footer-text ">
                 At CarBuddy, we bring the car spa to your doorstep.
No more waiting in queues or driving to a car wash center — we specialize in interior and exterior car washing right at your home, so you can relax while we make your car shine.
                </p>
                
              </div>
            </div>

            <div className="col-md-3 col-xl-auto">
              <div className="widget footer-widget">
                <h3 className="widget_title">Contact</h3>
                <div className="widget-contact">
                  <p>
                    <Link to="tel:888123456765">(+91) 123 456 765</Link>
                  </p>
                  <p>
                    <Link to="mailto:infoname@mail.com">carbuddy@example.com</Link>
                  </p>
                  <p>
                    Madhapur, Hyderabad <br /> India, 500081
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <div className="copyright-wrap">
        <div className="container">
          <div className="row gy-3 justify-content-md-between justify-content-center">
            <div className="col-auto align-self-center">
              <p className="copyright-text text-center">
                © <Link to="#">MyCarBuddy</Link> 2025 | All Rights Reserved
              </p>
            </div>
            <div className="col-auto">
              <div className="footer-links">
                <Link to="/terms">Terms &amp; Condition</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/refund">Refund Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterAreaOne;
