import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";

const FaqAreaTwo = () => {
  return (
    <section className="faq-area-2 space mt-50">
      <div className="container mt-50 pt-50">
        <div className="row gx-60 flex-row-reverse">
          {/* Counter & Image Section */}
          <div className="col-xl-6">
            <div className="faq-thumb2 mb-xl-0 mb-50">
              {/* <div className="about-counter-grid jump">
                <img
                  src="assets/img/icon/faq2-counter-icon-1.svg"
                  alt="Car Service"
                />
                <div className="media-right">
                  <h3 className="about-counter">
                    <TrackVisibility once>
                      {({ isVisible }) =>
                        isVisible && (
                          <span className="counter-number">
                            <CountUp delay={0} start={0} end={250} />+
                          </span>
                        )
                      }
                    </TrackVisibility>
                  </h3>
                  <h4 className="about-counter-text">Cars Washed</h4>
                </div>
              </div> */}
                 <img src="assets/img/normal/faq-thumb-2-1.png" alt="Fixturbo"/>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="col-xl-6">
            <div className="title-area">
              <span className="sub-title">FAQ</span>
              <h2 className="sec-title">
                Your Car Wash Questions Answered{" "}
                <img
                  className="title-bg-shape"
                  src="assets/img/bg/title-bg-shape.png"
                  alt="Car Wash"
                />
              </h2>
            </div>

            <div className="accordion-area accordion" id="faqAccordion">
              {/* Question 1 */}
              <div className="accordion-card style2 active">
                <div className="accordion-header" id="collapse-item-1">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse-1"
                    aria-expanded="true"
                    aria-controls="collapse-1"
                  >
                    What’s included in the interior wash?
                  </button>
                </div>
                <div
                  id="collapse-1"
                  className="accordion-collapse collapse show"
                  aria-labelledby="collapse-item-1"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    <p className="faq-text">
                      Our interior wash includes vacuuming seats & carpets,
                      dashboard cleaning, door panel wipe-down, and window
                      cleaning for a spotless interior.
                    </p>
                  </div>
                </div>
              </div>

              {/* Question 2 */}
              <div className="accordion-card style2">
                <div className="accordion-header" id="collapse-item-2">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse-2"
                    aria-expanded="false"
                    aria-controls="collapse-2"
                  >
                    How is the exterior wash done?
                  </button>
                </div>
                <div
                  id="collapse-2"
                  className="accordion-collapse collapse"
                  aria-labelledby="collapse-item-2"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    <p className="faq-text">
                      We hand-wash your vehicle using premium shampoo,
                      high-pressure rinse, tire cleaning, and waxing for a shiny
                      finish that protects your paint.
                    </p>
                  </div>
                </div>
              </div>

              {/* Question 3 */}
              <div className="accordion-card style2">
                <div className="accordion-header" id="collapse-item-3">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse-3"
                    aria-expanded="false"
                    aria-controls="collapse-3"
                  >
                    How long does a complete wash take?
                  </button>
                </div>
                <div
                  id="collapse-3"
                  className="accordion-collapse collapse"
                  aria-labelledby="collapse-item-3"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    <p className="faq-text">
                      A full interior and exterior wash typically takes 45–60
                      minutes depending on the condition and size of your
                      vehicle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqAreaTwo;
