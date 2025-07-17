import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
import { Link } from "react-router-dom";

const AboutFour = () => {
  return (
    <div className="about-area-2 bg-smoke space-top">
      <div className="container">
        <div className="row">
          <div className="col-xxl-7 col-xl-6">
            <div className="about-thumb2 mb-40 mb-xl-0">
              <div className="about-img-1">
                <img src="assets/img/normal/about_2-1.png" alt="Fixturbo" />
              </div>
              <div className="about-img-2">
                <img src="assets/img/normal/about_2-2.png" alt="Fixturbo" />
              </div>
              <div className="about-counter-wrap jump-reverse">
                <img src="assets/img/icon/about_icon2-1.svg" alt="Fixturbo" />
                <h3 className="about-counter">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number">
                          <CountUp delay={0} start={0} end={5} />
                          k+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h3>
                <h4 className="about-counter-text">Trusted Customer</h4>
              </div>
              <div className="about-year-wrap2 movingX">
                <div className="about-year-grid-wrap">
                  <div className="icon">
                    <img
                      src="assets/img/icon/about_icon2-2.png"
                      alt="Fixturbo"
                    />
                  </div>
                  <h3 className="about-counter">
                    <TrackVisibility once>
                      {({ isVisible }) =>
                        isVisible && (
                          <span className="counter-number">
                            <CountUp delay={0} start={0} end={10} />
                            k+
                          </span>
                        )
                      }
                    </TrackVisibility>
                  </h3>
                </div>
                <h4 className="about-year-text">Years Of Experiences</h4>
              </div>
            </div>
          </div>
          <div className="col-xxl-5 col-xl-6">
            <div className="about-content-wrap">
              <div className="title-area mb-30">
                <span className="sub-title">Know About Us</span>
                <h2 className="sec-title">
                 Professional Car Service You Can Trust
                </h2>
                <p className="sec-text">
                  At MyCarBuddy, we specialize in providing reliable, professional, and convenient car care solutions right at your doorstep. Whether it's a quick interior clean or a complete service package, our skilled technicians are trained to handle every detail with precision and care.
                </p>
              </div>
             <div className="col-xl-auto col-lg-6">
                  <div className="checklist">
                    <ul>
                      <li>
                        <i className="fas fa-check-circle" />
                       Interior & Exterior Car Wash
                      </li>
                      <li>
                        <i className="fas fa-check-circle" />A car repair is a
                        Waterless Eco-Friendly Wash
                      </li>
                      <li>
                        <i className="fas fa-check-circle" />
                        AC & Engine Deep Cleaning
                      </li>
                      <li>
                        <i className="fas fa-check-circle" />
                        Quick and Efficient Car Service
                      </li>
                    </ul>
                  </div>
                </div>
                 <div className="btn-wrap mt-20 font-bold">
                    <Link to="/about" className="  mt-xl-0 mt-20 my-0 font-weight-bold">
                      Read More <i className="fas fa-arrow-right ms-2" />
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutFour;
