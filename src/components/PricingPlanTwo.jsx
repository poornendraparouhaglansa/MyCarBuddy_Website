import React from "react";
import { Link } from "react-router-dom";

const PricingPlanTwo = () => {
  return (
    <div className="pricing-area-2 space">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-7">
            <div className="title-area text-center">
              <span className="sub-title">Investment Plan</span>
              <h2 className="sec-title">
                Empowering Your Wealth Investment With Us{" "}
                <img
                  className="title-bg-shape shape-center"
                  src="assets/img/bg/title-bg-shape.png"
                  alt="Fixturbo"
                />
              </h2>
            </div>
          </div>
        </div>
        <div className="row gy-4 justify-content-center">
          <div className="col-lg-4 col-md-6">
            <div className="pricing-card style2">
              <div className="pricing-card-icon-wrap">
                <div className="pricing-card_icon">
                  <img src="assets/img/icon/picing-icon_2-1.svg" alt="Fixturbo" />
                </div>
                <h4 className="pricing-card_title">Silver Plan</h4>
              </div>
              <div className="pricing-card-details">
                <h3 className="pricing-card_price">MIN 500/USD</h3>
                <h6 className="pricing-card_currency">1.00/USD</h6>
                <div className="checklist style2">
                  <ul>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Stoke Market
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Every Day
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Return Account 30%
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      For 15 days
                    </li>
                  </ul>
                </div>
                <Link className="btn" to="/about">
                  Get This Plan
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="pricing-card style2 pricing-card-active">
              <div className="pricing-card-icon-wrap">
                <div className="pricing-card_icon">
                  <img src="assets/img/icon/picing-icon_2-2.svg" alt="Fixturbo" />
                </div>
                <h4 className="pricing-card_title">Gold Plan</h4>
              </div>
              <div className="pricing-card-details">
                <h3 className="pricing-card_price">MIN 600/USD</h3>
                <h6 className="pricing-card_currency">1.00/USD</h6>
                <div className="checklist style2">
                  <ul>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Stoke Market
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Every Day
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Return Account 30%
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      For 15 days
                    </li>
                  </ul>
                </div>
                <Link className="btn" to="/about">
                  Get This Plan
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="pricing-card style2">
              <div className="pricing-card-icon-wrap">
                <div className="pricing-card_icon">
                  <img src="assets/img/icon/picing-icon_2-3.svg" alt="Fixturbo" />
                </div>
                <h4 className="pricing-card_title">Platinum Plan</h4>
              </div>
              <div className="pricing-card-details">
                <h3 className="pricing-card_price">MIN 1000/USD</h3>
                <h6 className="pricing-card_currency">1.00/USD</h6>
                <div className="checklist style2">
                  <ul>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Stoke Market
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Every Day
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Return Account 30%
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      For 15 days
                    </li>
                  </ul>
                </div>
                <Link className="btn" to="/about">
                  Get This Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlanTwo;
