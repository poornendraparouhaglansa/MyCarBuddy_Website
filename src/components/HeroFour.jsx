import React from "react";
import { Link } from "react-router-dom";

const HeroFour = () => {
  return (
    <div
      className="hero-wrapper hero-4"
      id="hero"
      style={{ backgroundImage: "url(assets/img/hero/banner1.png)" }}
    >
      <div className="hero-shape4-1">
        <img
          className="shape-position shape1"
          src="assets/img/hero/shape1.png"
          alt="Fixturbo"
        />
        <img
          className="shape-position shape2"
          src="assets/img/hero/shape2.png"
          alt="Fixturbo"
        />
        <img
          className="shape-position shape3"
          src="assets/img/hero/shape3.png"
          alt="Fixturbo"
        />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xxl-6 col-xl-5 col-lg-8">
            <div className="hero-style4">
              <span className="sub-title text-white">Growth Accelerator</span>
              <h1 className="hero-title text-white">
                Explore The Latest Collection
              </h1>
              <p className="hero-text text-white">
                Vestibulum rhoncus nisl ac gravida porta. Mauris eu sapien
                lacus. Etiam molestie justo neque, in convallis massa tempus in.
              </p>
              <div className="btn-group">
                <Link to="/about" className="btn">
                  Learn More
                </Link>
                <Link to="/service" className="btn style-border">
                  Our Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroFour;
