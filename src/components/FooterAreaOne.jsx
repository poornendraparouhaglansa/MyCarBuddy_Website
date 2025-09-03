import React from "react";
import { Link } from "react-router-dom";
import Chatbot from "./Chatbot";

const FooterAreaOne = () => {
  return (
    <footer
      className="footer-wrapper footer-layout1 "
      // style={{ backgroundImage: "url(assets/img/bg/footer-bg1-1.png)" }}
      style={{ backgroundColor: "url(assets/img/bg/footer-top-bg1-1.png)" }}
    >
      {/* <Chatbot/> */}
      <div className="container">
        <div className="widget-area p-4">
          <div className="col-md-12 text-center">
               <img src="/assets/img/MyCarBuddy-Logo1.webp" alt="MyCarBuddy"  width={"300px"}/>
          </div>
          <div className="row justify-content-between">

            

            <div className="col-md-3 ">
              <div className="widget widget_nav_menu footer-widget text-center">
                <h3 className="widget_title">Company</h3>
                <div className="menu-all-pages-container">
                  <ul className="menu d-inline-block">
                    <li>
                      <Link to="/about">About</Link>
                    </li>
                    <li>
                      <Link  to="/service">Services</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6 ">
              <div className="widget footer-widget widget-newsletter">
                <h3 className="widget_title">About</h3>
             
                <p className="footer-text ">
                At My Car Buddy, we make car care effortless by bringing professional services straight to your doorstep. No more waiting at garages or service centers. Our expert mechanics and technicians come to you, whenever and wherever you need them.
                </p>
                
              </div>
            </div>

            <div className="col-md-3 ">
              <div className="widget footer-widget text-center">
                <h3 className="widget_title">Contact</h3>
                <div className="widget-contact">
                  <p>
                  <Link to="tel:7075243939">+91 70752 43939</Link><br /> <Link to="tel:9885653865"> +91 98856 53865</Link>
                  </p>
                  <p>
                    <Link to="mailto:info@mycarbuddy.in">info@mycarbuddy.in</Link>
                  </p>
                  <p>
                   Unit #B1, Second Floor Spaces & More Business Park,<br></br> Madhapur #3 D.No# 1-89/A/8, C/2, Vittal Rao Nagar Rd, Madhapur,  Hyderabad India, 500081
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
                <Link to="/refund-cancellation">Cancellation & Refund Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterAreaOne;
