import React from "react";

const ProcessAreaOne = () => {
  return (
    <section className="process-area-1 space position-relative">
      <div className="portfolio-shape-img shape-mockup d-lg-block d-none">
        <img
          className="about1-shape-img-1 spin"
          src="/assets/img/normal/about_shape1-2.svg"
          alt="Car Wash"
        />
        <img
          className="about1-shape-img-2 spin2"
          src="/assets/img/normal/about_shape1-1.svg"
          alt="Car Wash"
        />
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="title-area text-center">
              <span className="sub-title">Our Work Process</span>
              <h2 className="sec-title">
                Simple Steps to a Spotless Car at Your Doorstep
              </h2>
            </div>
          </div>
        </div>
        <div className="row gy-30">
          {/* Step 1 */}
          <div className="col-lg-4 process-card-wrap">
            <div className="process-card">
              <div className="process-card-icon">
                <img src="/assets/img/icon/process-icon-1-1.svg" alt="Booking" />
              </div>
              <h4 className="process-card-title">Book Your Service</h4>
              <p className="process-card-text">
                Schedule your interior or exterior wash online or via phone.
                Choose a time and location that’s most convenient for you —
                home, office, or anywhere.
              </p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="col-lg-4 process-card-wrap">
            <div className="process-card process-card-center">
              <div className="process-card-icon">
                <img src="/assets/img/icon/process-icon-1-2.svg" alt="Cleaning" />
              </div>
              <h4 className="process-card-title">We Come to You</h4>
              <p className="process-card-text">
                Our fully equipped mobile team arrives with eco-friendly
                products and professional tools to give your car a gentle yet
                thorough wash.
              </p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="col-lg-4 process-card-wrap">
            <div className="process-card">
              <div className="process-card-icon">
                <img src="/assets/img/icon/process-icon-1-3.svg" alt="Shine" />
              </div>
              <h4 className="process-card-title">Enjoy the Shine</h4>
              <p className="process-card-text">
                Sit back and relax while we make your car sparkle inside and
                out. We leave you with a fresh, spotless, and protected vehicle
                ready to impress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessAreaOne;
