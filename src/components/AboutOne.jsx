import React from "react";
import { Link } from "react-router-dom";

const AboutOne = () => {
  return (
    <div className="about-area-1 space-bottom ">
      <div className="about1-shape-img shape-mockup">
        <img
          className="about1-shape-img-1 spin"
          src="assets/img/normal/about_shape1-2.svg"
          alt="Fixturbo"
        />
        <img
          className="about1-shape-img-2 spin2"
          src="assets/img/normal/about_shape1-1.svg"
          alt="Fixturbo"
        />
      </div>
      <div className="container">
        <div className="row gx-60 align-items-center">
          <div className="col-xl-6">
            <div className="about-thumb1 mb-40 mb-xl-0">
              <div className="about-img-1">
                <img src="/assets/img/normal/about_1-1.png" alt="Fixturbo" />
              </div>
              <div className="about-img-2">
                <img src="/assets/img/normal/about_1-2.png" alt="Fixturbo" />
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="about-content-wrap">
              <div className="title-area me-xl-5 mb-20">
                <span className="sub-title">Know About Us</span>
                <h2 className="sec-title">
                  Where Expertise Meets Every Engine
                </h2>
                <p className="sec-text">
                  Et purus duis sollicitudin dignissim habitant. Egestas nulla
                  quis venenatis cras sed eu massa eu faucibus. Urna fusce
                </p>
              </div>
              <div className="row gy-4 justify-content-xl-between justify-content-end align-items-center flex-row-reverse">
                <div className="col-lg-auto">
                  <div className="about-year-wrap">
                    <div
                      className="about-year-mask-wrap"
                      style={{
                        maskImage: "url(assets/img/bg/about_counter-bg1-1.png)",
                      }}
                    >
                      <img src="assets/img/icon/about_icon1-1.svg" alt="Fixturbo" />
                      <h3 className="about-year-wrap-title">
                        <span className="counter-number">25</span>+
                      </h3>
                      <p className="about-year-wrap-text">
                        Years of experience
                      </p>
                    </div>
                  </div>
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

export default AboutOne;
