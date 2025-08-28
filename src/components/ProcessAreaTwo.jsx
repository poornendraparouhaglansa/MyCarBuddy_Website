import React from "react";
import { Link } from "react-router-dom";

const ProcessAreaTwo = () => {
  return (
    <div
      className="process-area-2 space-top pb-0 bg-smoke"
      // style={{ backgroundImage: "url(assets/img/bg/process2-bg.png)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-5 col-lg-7">
            <div className="title-area text-center">
              <h3 className="sub-title">Why Choose Us?</h3>
              <h2 className="sec-title text-dark">
                Miles Of Smiles, One Repair At A Time{" "}
                <img
                  className="title-bg-shape shape-center"
                  src="assets/img/bg/title-bg-shape2.png"
                  alt="MyCarBuddy"
                />
              </h2>
            </div>
          </div>
        </div>
        <div className="row gy-4 gx-90 justify-content-center">
          <div className="col-lg-4 col-md-6 process-card-wrap2 mt-0">
            <div className="process-card style2 mt-0">
              {/* <div className="process-card-number">STEP 1</div> */}
              <h4 className="process-card-title text-dark">Doorstep Service</h4>
              <p className="process-card-text text-dark">
                Our mechanic comes to your location—home, office, or roadside—
                saving you time and effort.
              </p>
              {/* <Link to="/service-details" className="link-btn style2">
                Read More <i className="fas fa-arrow-right" />
              </Link> */}
            </div>
          </div>
          <div className="col-lg-4 col-md-6 process-card-wrap2 mt-0">
            <div className="process-card style2 mt-0">
              {/* <div className="process-card-number">STEP 2</div> */}
              <h4 className="process-card-title text-dark">Trusted Professionals</h4>
              <p className="process-card-text text-dark">
                Skilled, verified, and reliable experts ensure your car is in
                safe hands every time.
              </p>
              {/* <Link to="/service-details" className="link-btn style2">
                Read More <i className="fas fa-arrow-right" />
              </Link> */}
            </div>
          </div>
          <div className="col-lg-4 col-md-6 process-card-wrap2 mt-0">
            <div className="process-card style2 mt-0">
              {/* <div className="process-card-number">STEP 3</div> */}
              <h4 className="process-card-title text-dark mt-0">Hassle-Free & Complete Care</h4>
              <p className="process-card-text text-dark">
                Easy booking, transparent pricing, and full maintenance—from
                quick fixes to complete care.
              </p>
              {/* <Link to="/service-details" className="link-btn style2">
                Read More <i className="fas fa-arrow-right" />
              </Link> */}
            </div>
          </div>
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8 text-center text-white">
            <p>
              At My Car Buddy, your comfort and your car’s health are our top
              priorities. We don’t just service cars—we bring peace of mind to
              your driveway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessAreaTwo;
