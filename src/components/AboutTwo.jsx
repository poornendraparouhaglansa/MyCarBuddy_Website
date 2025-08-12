import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";

const AboutTwo = () => {
  return (
    <div className="space-top">
      <div className="container">
        <div className="row">
          {/* Images & Counters */}
          <div className="col-xxl-7 col-xl-6">
            <div className="about-thumb2 mb-40 mb-xl-0">
              <div className="about-img-1">
                <img src="assets/img/normal/about_2-1.png" alt="CarBuddy" />
              </div>
              <div className="about-img-2">
                <img src="assets/img/normal/about_2-2.png" alt="CarBuddy" />
              </div>
              <div className="about-counter-wrap jump-reverse">
                <img src="assets/img/icon/about_icon2-1.svg" alt="CarBuddy" />
                <h3 className="about-counter">
                  <TrackVisibility once>
                    {({ isVisible }) =>
                      isVisible && (
                        <span className="counter-number">
                          <CountUp delay={0} start={0} end={5000} />+
                        </span>
                      )
                    }
                  </TrackVisibility>
                </h3>
                <h4 className="about-counter-text">Happy Customers Served</h4>
              </div>
              <div className="about-year-wrap2 movingX">
                <div className="about-year-grid-wrap">
                  <div className="icon">
                    <img src="assets/img/icon/about_icon2-2.png" alt="CarBuddy" />
                  </div>
                  <h3 className="about-counter">
                    <span className="counter-number">5</span>+
                  </h3>
                </div>
                <h4 className="about-year-text">Years of Car Care Experience</h4>
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="col-xxl-5 col-xl-6">
            <div className="about-content-wrap">
              <div className="title-area mb-30">
                <span className="sub-title">Know About Us</span>
                <h2 className="sec-title">
                  At-Home Interior & Exterior Car Wash Experts{" "}
                  <img
                    className="title-bg-shape shape-center"
                    src="assets/img/bg/title-bg-shape.png"
                    alt="CarBuddy"
                  />
                </h2>
                <p className="sec-text">
                  At <strong>CarBuddy</strong>, we make car washing convenient by
                  bringing professional-grade interior and exterior cleaning right
                  to your doorstep. No queues, no waiting — just premium, eco-friendly
                  car care while you relax at home or work. Our trained experts ensure
                  every inch of your car is spotless, fresh, and shining like new.
                </p>
              </div>

              {/* Feature 1 */}
              <div className="about-feature-wrap style-shadow">
                <div className="icon">
                  <img src="assets/img/icon/about_icon2-3.svg" alt="CarBuddy" />
                </div>
                <div className="about-feature-wrap-details">
                  <h5 className="about-feature-title">Premium Interior Wash</h5>
                  <p className="about-feature-text">
                    Deep vacuuming, dashboard polishing, door panel cleaning, and
                    streak-free window cleaning for a fresh and comfortable ride.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="about-feature-wrap style-shadow">
                <div className="icon">
                  <img src="assets/img/icon/about_icon2-4.svg" alt="CarBuddy" />
                </div>
                <div className="about-feature-wrap-details">
                  <h5 className="about-feature-title">Shiny Exterior Finish</h5>
                  <p className="about-feature-text">
                    Gentle hand wash, high-pressure rinse, tire cleaning, and wax
                    protection to keep your car looking brand new — right in your
                    driveway.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTwo;
