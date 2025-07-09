import React from "react";
import { Link } from "react-router-dom";

const ServiceDetails = () => {
  return (
    <div className="service-details-area space-top space-extra-bottom overflow-hidden">
      <div className="container">
        <div className="row gx-40 flex-row-reverse">
          <div className="col-xxl-8 col-lg-7">
            <div className="service-page-single">
              <div className="page-img mb-45">
                <img
                  src="assets/img/service/service-details1-1.png"
                  alt="Fixturbo"
                />
              </div>
              <div className="page-content">
                <h2 className="page-title">Affordable Car Repair Solutions</h2>
                <p className="mb-25">
                  Web designing in a powerful way of just not an only
                  professions, however, in a passion for our Company. We have to
                  a tendency to believe the idea that smart looking of any
                  websitet in on visitors.Web designing in a powerful way of
                  just not an only profession Web designing in a powerful way of
                  just not an only{" "}
                </p>
                <p className="mb-25">
                  Web designing in a powerful way of just not an only
                  professions, however, in a passion for our Company. We have to
                  a tendency to believe the idea that smart looking of any
                  websitet in on visitors
                </p>
                <h3 className="page-subtitle mb-15">
                  Trusted Car Repair Professionals
                </h3>
                <p className="mb-30">
                  Web designing in a powerful way of just not an only
                  professions, however, in a passion for our Company. We have to
                  a tendency to believe the idea that smart looking of any
                  websitet in on visitors.Web designing in a powerful way of
                  just not an only profession Web designing in a powerful way of
                  just not an only{" "}
                </p>
                <div className="row gy-30">
                  <div className="col-sm-6">
                    <div className="page-img">
                      <img
                        src="assets/img/service/service-details1-2.png"
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="page-img">
                      <img
                        src="assets/img/service/service-details1-3.png"
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </div>
                <div className="checklist style2 mt-35 mb-20">
                  <ul>
                    <li>
                      <i className="fas fa-angle-double-right" /> A car repair
                      is a service provided to fix any issues or damages with
                      your vehicle
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      It involves diagnosing the problem, repairing or replacing
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Trusted Car Repair Professionals et Your Car Fixed Right
                      Away
                    </li>
                    <li>
                      <i className="fas fa-angle-double-right" />
                      Quality Car Repair Services Affordable Car Repair
                      Solutions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-lg-5">
            <aside className="sidebar-area">
              <div className="widget widget_service-list">
                <h3 className="widget_title">All Services</h3>
                <ul>
                  <li>
                    <Link to="/blog">
                      <i className="fas fa-angle-double-right" />
                      Fast and Reliable Car Repair Design
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog">
                      <i className="fas fa-angle-double-right" />
                      Trusted Car Repair Professionals
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog">
                      <i className="fas fa-angle-double-right" />
                      Get Your Car Fixed Right Away
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog">
                      <i className="fas fa-angle-double-right" />
                      Quality Car Repair Services
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog">
                      <i className="fas fa-angle-double-right" />
                      Affordable Car Repair Solutions
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="widget widget_contact">
                <div className="widget-contact-wrap text-center">
                  <h3 className="widget_title">Contact Us</h3>
                  <p className="widget-contact-text">
                    It is a long established fact that a reader will be
                    distracted by the and readable content repair
                  </p>
                  <div className="icon">
                    <i className="fas fa-phone-alt" />
                  </div>
                  <p className="widget-contact-text">Need help?</p>
                  <h5>
                    <Link to="tel:80855510111">(808) 555-0111</Link>
                  </h5>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
