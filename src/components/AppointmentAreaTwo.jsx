import React from "react";

const AppointmentAreaTwo = () => {
  return (
    <div
      className="appointment-area-2 bg-smoke overflow-hidden"
      style={{ backgroundImage: "url(assets/img/bg/appointment-bg2-1.png)" }}
    >
      <div className="container">
        <div className="row gx-0">
          <div className="col-xl-7">
            <div className="space">
              <div className="appointment-form-wrap bg-white">
                <div className="title-area">
                  <span className="sub-title">Send a request</span>
                  <h2 className="sec-title">Our One-Stop Car Repair Shop</h2>
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
                          className="form-control style-border"
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
                          className="form-control style-border"
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
                          className="form-control style-border"
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
                          className="form-select style-border"
                          defaultValue={"Choose"}
                        >
                          <option value="Choose" >
                            Choose a Option
                          </option>
                          <option value="Construction">Auto Repair</option>
                          <option value="Real Estate">Car Repair</option>
                          <option value="Industry">Automotive</option>
                        </select>
                        <i className="fas fa-angle-down" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-12">
                    <textarea
                      placeholder="Message here.."
                      id="contactForm"
                      className="form-control style-border"
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
          <div className="col-xl-5 d-xl-block d-none">
            <div className="appointment-thumb-2">
              <img
                src="assets/img/normal/appointment-thumb-2-1.png"
                alt="img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentAreaTwo;
