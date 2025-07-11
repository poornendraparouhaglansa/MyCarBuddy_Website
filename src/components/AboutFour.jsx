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
                  Non Leo Libero Amet The Maecenas Gravida
                </h2>
                <p className="sec-text">
                  A car repair is a service provided to fix any issues or
                  damages with a your vehicle. It involves diagnosing the
                  problem, repairing or replacing the necessary parts, and
                  ensuring that the car
                </p>
              </div>
             <div className="col-xl-auto col-lg-6">
                  <div className="checklist">
                    <ul>
                      <li>
                        <i className="fas fa-check-circle" />
                        Professional Car Repair Services
                      </li>
                      <li>
                        <i className="fas fa-check-circle" />A car repair is a
                        service provided to fix
                      </li>
                      <li>
                        <i className="fas fa-check-circle" />
                        Get Your Car Fixed Right Away Car Repair{" "}
                      </li>
                      <li>
                        <i className="fas fa-check-circle" />
                        Quick and Efficient Car Repairs
                      </li>
                    </ul>
                  </div>
                </div>
                 <div className="btn-wrap mt-20">
                    <Link to="/about" className="btn style2 mt-xl-0 mt-20">
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
