import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
const TeamDetails = () => {
  return (
    <div className="team-details-area space">
      <div className="container">
        <div className="single-team-details">
          <div className="team-about-card">
            <div className="row g-lg-0">
              <div className="col-lg-6">
                <div className="team-about-card_img">
                  <img
                    className="w-100"
                    src="assets/img/team/team-details.png"
                    alt="team "
                  />
                </div>
              </div>
              <div className="col-lg-6 align-self-center">
                <div className="team-about-card_box">
                  <h3 className="team-about-card_title">Biography</h3>
                  <div className="skill-feature position-relative">
                    <h3 className="skill-feature_title">Design</h3>
                    <ProgressBar
                      bgColor="#E8092E"
                      height="15px"
                      completed={70}
                      labelSize="12px"
                      maxCompleted={100}
                      animateOnRender={true}
                      transitionDuration={"2s"}
                    />
                  </div>
                  <div className="skill-feature position-relative">
                    <h3 className="skill-feature_title">Driving</h3>
                    <ProgressBar
                      bgColor="#E8092E"
                      height="15px"
                      completed={90}
                      labelSize="12px"
                      maxCompleted={100}
                      animateOnRender={true}
                      transitionDuration={"2s"}
                    />
                  </div>
                  <div className="skill-feature position-relative">
                    <h3 className="skill-feature_title">Service Car</h3>
                    <ProgressBar
                      bgColor="#E8092E"
                      height="15px"
                      completed={50}
                      labelSize="12px"
                      maxCompleted={100}
                      animateOnRender={true}
                      transitionDuration={"2s"}
                    />
                  </div>
                  <p>
                    This category focuses on the design and construction of
                    buildings and the This category focuses on the design and
                    construction of buildings and arrangement of furniture and
                    decorative elements within themarrangement
                  </p>
                  <p className="mb-n2">
                    This category focuses on the design and construction of
                    buildings and the This category focuses on the design and
                    construction of buildings
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row gy-40">
            <div className="col-lg-4">
              <div className="team-details-wrap">
                <h4 className="team-details-wrap-title">Fahad Bhuiyan</h4>
                <h6 className="team-details-wrap-desig">Manager</h6>
                <p className="team-details-wrap-text mb-30">
                  This category focuses on the design construction of buildings
                  and the This a category focuses on the design and construction
                  of buildings
                </p>
                <div className="team-details-wrap_info">
                  <span className="icon">
                    <i className="fas fa-map-marker-alt" />
                  </span>
                  <p>
                    Burmsille Street, MN 55337, <br />
                    United States
                  </p>
                </div>
                <div className="team-details-wrap_info">
                  <span className="icon">
                    <i className="fas fa-phone-alt" />
                  </span>
                  <p>
                    <a href="tel:11234567890">+(1) 123 456 7890</a> <br />{" "}
                    <a href="tel:10927564321">+(1) 098 765 4321</a>
                  </p>
                </div>
                <div className="team-details-wrap_info">
                  <span className="icon">
                    <i className="fas fa-envelope" />
                  </span>
                  <p>
                    <a href="mailto:info@fixturbo.com">info@fixturbo.com</a>{" "}
                    <br />{" "}
                    <a href="mailto:info.example@fixturbo.com">
                      info.example@fixturbo.com
                    </a>
                  </p>
                </div>
                <div className="social-btn style4 mt-35">
                  <a href="https://facebook.com/">
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a href="https://twitter.com/">
                    <i className="fab fa-twitter" />
                  </a>
                  <a href="https://instagram.com/">
                    <i className="fab fa-instagram" />
                  </a>
                  <a href="https://pinterest.com/">
                    <i className="fab fa-pinterest" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="team-contact-wrap">
                <h3 className="mt-n1 mb-30 page-subtitle">Contact Form</h3>
                <form
                  action="mail.php"
                  method="POST"
                  className="appointment-form ajax-contact"
                >
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          id="name"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="email"
                          id="email"
                          placeholder="Email Address"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-12">
                    <textarea
                      placeholder="Message here.."
                      id="contactForm"
                      className="form-control"
                      defaultValue={""}
                    />
                  </div>
                  <div className="form-btn col-12">
                    <button className="btn style2">
                      Send Now <i className="fas fa-arrow-right ms-2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
