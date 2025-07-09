import React from "react";
import { Link } from "react-router-dom";

const IntroAreaTwo = () => {
  return (
    <div
      className="intro-area-2 space mt-0"
      style={{
        backgroundImage: "url(assets/img/intro/bg.png)",
        backgroundSize: "cover",
      }}
    >
      <div className="container">
        <div className="row gy-30 justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="single-intro-wrap style2">
              <span className="bg-border" />
              <div className="thumb">
                <img src="assets/img/intro/1.png" alt="Fixturbo" />
              </div>
              <div className="details">
                <h3>Looking For A Car Part’s?</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link className="btn style-border3" to="/service">
                  Buy Part’s <i className="fas fa-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="single-intro-wrap style2">
              <span className="bg-border" />
              <div className="thumb">
                <img src="assets/img/intro/2.png" alt="Fixturbo" />
              </div>
              <div className="details">
                <h3>Want To Sell A Car Part’s?</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link className="btn style-border3" to="/service">
                  Sell Your Part’s <i className="fas fa-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="single-intro-wrap style2">
              <span className="bg-border" />
              <div className="thumb">
                <img src="assets/img/intro/3.png" alt="Fixturbo" />
              </div>
              <div className="details">
                <h3>Book A Car Repair?</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link className="btn style-border3" to="/service">
                  Book Services <i className="fas fa-arrow-right ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroAreaTwo;
