import React from "react";
import { Link } from "react-router-dom";

const SubscribeOne = () => {
  return (
    <div className="container">
      <div
        className="footer-top-1 bg-theme"
        style={{ backgroundImage: "url(/assets/img/bg/footer-top-bg1-1.png)" }}
      >
        <div className="footer-logo">
          <Link to="/">
            <img src="/assets/img/MyCarBuddy-Logo1.png" alt="MyCarBuddy"  width={"200px"}/>
          </Link>
        </div>
        <div className="call-media-wrap">
          <div className="icon">
            <img src="/assets/img/icon/phone-1.svg" alt="MyCarBuddy" />
          </div>
          <div className="media-body">
            <h6 className="title text-white">Requesting A Call:</h6>
            <h4 className="link">
              <a className="text-white" href="tel:9885653865">
                +91 98856 53865
              </a>
            </h4>
          </div>
        </div>
        <div className="social-btn">
          <a href="https://www.facebook.com/people/Mycarbuddyin/61578291056729/?sk=about_details" target="_blank">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="https://www.instagram.com/mycarbuddy.in/" target="_blank">
            <i className="fab fa-instagram" />
          </a>
           <a href="https://www.linkedin.com/company/mycarbuddy/" target="_blank">
            <i className="fab fa-linkedin" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubscribeOne;
