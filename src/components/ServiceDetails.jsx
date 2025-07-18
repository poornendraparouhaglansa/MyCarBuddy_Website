import React from "react";
import { Link, useParams } from "react-router-dom";
import HeaderOne from "./HeaderOne";
import Breadcrumb from "./Breadcrumb";
import FooterAreaOne from "./FooterAreaOne";
import SubscribeOne from "./SubscribeOne";
import servicetwo from '../../src/images/service-1-3.png';

export const services = [
  {
    id: 101,
    title: "Regular Car Service",
    duration: "Takes 4 hours",
    price: 2399,
    originalPrice: 3199,
    includes: [
      "AC Vent Cleaning",
      "AC Gas (upto 400 gms)",
      "AC Filter Cleaning",
      "AC Inspection",
      "Condenser Cleaning",
    ],
    image: servicetwo,
    categoryId: 1,
  },
  {
    id: 102,
    title: "High Performance AC Service",
    duration: "Takes 8 hours",
    price: 3499,
    originalPrice: 4999,
    includes: [
      "Dashboard Refitting",
      "Leak Test",
      "Full AC Cleaning",
      "Gas Top-Up",
    ],
    image: servicetwo,
    categoryId: 1,
  },
  {
    id: 103,
    title: "Regular AC Service",
    duration: "Takes 4 hours",
    price: 2399,
    originalPrice: 3199,
    includes: [
      "AC Vent Cleaning",
      "AC Gas (upto 400 gms)",
      "AC Filter Cleaning",
      "AC Inspection",
      "Condenser Cleaning",
    ],
    image: servicetwo,
    categoryId: 1,
  },
  {
    id: 104,
    title: "High Performance AC Service",
    duration: "Takes 8 hours",
    price: 3499,
    originalPrice: 4999,
    includes: [
      "Dashboard Refitting",
      "Leak Test",
      "Full AC Cleaning",
      "Gas Top-Up",
    ],
    image: servicetwo,
    categoryId: 1,
  },
];


const ServiceDetails = () => {
  const { id } = useParams();
  const service = services.find(s => s.id === parseInt(id));
  const categoryServices = services.filter(s => s.categoryId === service.categoryId && s.id !== service.id);

  if (!service) {
    return <div className="container mt-5"><h4>Service not found</h4></div>;
  }
  return (
    <>
      <HeaderOne />
      <Breadcrumb title={"Service Details Inner"} />
      <div className="service-details-area py-5">
        <div className="container">
          <div className="row gx-5 flex-row">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className="service-page-single">
                <div className="page-img mb-4">
                  <img src={service.image} className="img-fluid rounded" alt={service.title} />
                </div>
                <div className="page-content">
                  <h2 className="page-title">{service.title}</h2>
                  <p className="text-muted mb-3">{service.duration}</p>
                  <p>Web designing in a powerful way of just not an only professions, however, in a passion for our Company. We have to a tendency to believe the idea that smart looking of any websitet in on visitors.Web designing in a powerful way of just not an only profession Web designing in a powerful way of just not an only</p>
                  <p className="mb-3">
                    This service includes everything your car needs to stay in top shape. Below is the full list of included items:
                  </p>

                  <h4 className="mt-4 mb-2">Included in this service:</h4>
                  <ul className="list-group mb-4">
                    {service.includes.map((item, idx) => (
                      <li key={idx} className="list-group-item">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-1 mb-3">Customer Comments</h4>

                  <div className="bg-light p-3 rounded mb-3">
                    <p className="mb-1 fw-semibold">Sourav Behuria</p>
                    <p className="mb-1">⭐⭐⭐⭐☆ (4/5)</p>
                    <small className="text-muted">“Very professional and quick service. My AC is now cooling perfectly.”</small>

                    <div className="bg-white p-2 mt-3 border-start border-4 border-success rounded">
                      <p className="mb-1 fw-semibold text-success">Admin Reply</p>
                      <small className="text-muted">“Thank you for your feedback, Sourav! We're happy to hear your AC is performing well.”</small>
                    </div>
                  </div>

                  <div className="bg-light p-3 rounded mb-3">
                    <p className="mb-1 fw-semibold">Rohit Sharma</p>
                    <p className="mb-1">⭐⭐⭐☆☆ (3/5)</p>
                    <small className="text-muted">“Service was okay but the pickup was a bit late.”</small>

                    <div className="bg-white p-2 mt-3 border-start border-4 border-success rounded">
                      <p className="mb-1 fw-semibold text-success">Admin Reply</p>
                      <small className="text-muted">“Thanks for your honest review, Rohit. We'll ensure timely pickup in the future.”</small>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h5 className="mb-2">Leave a Comment</h5>
                    <textarea
                      className="form-control mb-2"
                      rows="4"
                      placeholder="Write your comment here..."
                    ></textarea>
                    <button className="btn btn-primary">Submit</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <aside className="sidebar-area">
                <div className="widget widget_service-list mb-4">
                  <h4 className="widget_title mb-3">Other Services</h4>
                  <ul className="list-group">
                    {categoryServices.map(s => (
                      <li key={s.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <Link to={`/servicedetails/${s.id}`}>{s.title}</Link>
                        <span className="badge bg-success">₹{s.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="widget widget_contact bg-light p-3 rounded text-center">
                  <h5 className="widget_title mb-2">Need Help?</h5>
                  <p className="text-muted mb-2">Have questions about this service?</p>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem enim veniam, quasi incidunt odio magni dolorem cumque quo aperiam, quisquam eius. Quidem nam provident fuga facere quisquam deserunt voluptas consequuntur?</p>
                  <div className="icon fs-3 mb-2 text-primary">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <h5><Link to="tel:80855510111">(808) 555-0111</Link></h5>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
      <SubscribeOne />
      <FooterAreaOne />
    </>
  );
};

export default ServiceDetails;
