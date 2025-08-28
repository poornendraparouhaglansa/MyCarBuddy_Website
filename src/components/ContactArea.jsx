import React from "react";

const ContactArea = () => {
  return (
    <>
      <div className="contact-area space">
        <div className="container">
          <div className="row gy-4 justify-content-center">
            <div className=" col-lg-4 col-md-6">
              <div className="contact-info">
                <div className="contact-info_icon">
                  <i className="fas fa-map-marker-alt" />
                </div>
                <h6 className="contact-info_title">Address</h6>
                <p className="contact-info_text">
                  Unit # B1, Second Floor Spaces & More Business Park, Madhapur #3 D.No# 1-89/A/8, C/2,
                </p>
                <p className="contact-info_text"> Vittal Rao Nagar Rd, Madhapur, Telangana 500081 </p>
              </div>
            </div>
            <div className=" col-lg-4 col-md-6">
              <div className="contact-info">
                <div className="contact-info_icon">
                  <i className="fas fa-phone-alt" />
                </div>
                <h6 className="contact-info_title">Phone Number</h6>
                <p className="contact-info_text">
                  <a href="tel:9885653865">+91 98856 53865</a>
                </p>
                <p className="contact-info_text">
                  {/* <a href="tel:01254693326">01254693326</a> */}
                </p>
              </div>
            </div>
            {/* <div className="col-xxl-3 col-lg-4 col-md-6">
              <div className="contact-info">
                <div className="contact-info_icon">
                  <i className="fas fa-clock" />
                </div>
                <h6 className="contact-info_title">Opening</h6>
                <p className="contact-info_text">Sun-10AM To 5PM</p>
                <p className="contact-info_text">Thurs-9AM To 8PM</p>
              </div>
            </div> */}
            <div className=" col-lg-4 col-md-6">
              <div className="contact-info">
                <div className="contact-info_icon">
                  <i className="fas fa-envelope" />
                </div>
                <h6 className="contact-info_title">E-mail</h6>
                <p className="contact-info_text">
                  <a href="mailto:info@glansa.com">
                    info@glansa.com
                  </a>
                </p>
                <p className="contact-info_text">
                  {/* <a href="mailto:nafiz 0121@gmail.com">nafiz 0121@gmail.com</a> */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-bottom">
        <div className="container">
          <div className="map-sec">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60902.88409628053!2d78.31117294863282!3d17.439109100000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9a3e6c6874dd%3A0x7abfee772aee3875!2sGlansa%20Solutions!5e0!3m2!1sen!2sin!4v1756129461537!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              title="address"
              height={"250"}
              width={"100%"}
            />
          </div>
        </div>
      </div>
      <div className="space-bottom d-none">
        <div className="container">
          <div className="row flex-row-reverse">
            <div className="col-lg-6 text-lg-end">
              <div className="faq-thumb2 mb-xl-0 mb-50">
                <div className="about-counter-grid jump">
                  <img
                    src="assets/img/icon/faq2-counter-icon-1.svg"
                    alt="MyCarBuddy"
                  />
                  <div className="media-right">
                    <h3 className="about-counter">
                      <span className="counter-number">250</span>+
                    </h3>
                    <h4 className="about-counter-text">Services we provide</h4>
                  </div>
                </div>
                <img src="assets/img/normal/faq-thumb-2-1.png" alt="MyCarBuddy" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="contact-form-wrap p-0">
                <div className="title-area">
                  <span className="sub-title">Contact form</span>
                  <h2 className="sec-title">Car Repair The Best Services</h2>
                </div>
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
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          name="number"
                          id="number"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <select
                          name="subject"
                          id="subject"
                          className="form-select"
                          defaultValue={"Choose"}
                        >
                          <option value="Choose">Choose a Option</option>
                          <option value="Construction">Auto Repair</option>
                          <option value="Real Estate">Car Repair</option>
                          <option value="Industry">Automotive</option>
                        </select>
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
                      Appointment Now <i className="fas fa-arrow-right ms-2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactArea;
