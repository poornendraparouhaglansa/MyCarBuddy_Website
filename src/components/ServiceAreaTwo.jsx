import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ServiceAreaTwo = () => {
  const BASE_URL = process.env.REACT_APP_CARBUDDY_BASE_URL;
  const ImageURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}Category`);
        if ( Array.isArray(response.data)) {
          const activeCategories = response.data.filter(cat => cat.IsActive);

          const formatted = activeCategories.map((cat) => ({
            id: cat.CategoryID,
            title: cat.CategoryName,
            description: cat.Description || "No description provided.",
            image: `${ImageURL}${cat.ThumbnailImage}`,
            icon: `${ImageURL}${cat.IconImage}`,
          }));

          setServices(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="service-area-2 space overflow-hidden">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="title-area text-center">
              <span className="sub-title">Our Services</span>
              <h2 className="sec-title">
                Trusted Car Repair the Professionals{" "}
                <img
                  className="title-bg-shape shape-center"
                  src="assets/img/bg/title-bg-shape.png"
                  alt="Fixturbo"
                />
              </h2>
            </div>
          </div>
        </div>
      </div>

      {services.length === 2 ? (
        <div className="container">
          <div className="counter-area-1 space-bottom">
            <div className="row gx-0 align-items-center justify-content-center gap-3">
              {services.map((service) => (
                <div key={service.id} className="col-lg-5">
                  <div
                    className="counter-checklist-wrap"
                    style={{ backgroundImage: `url(${service.image})` }}
                  >
                    <div className="call-media-wrap">
                      <div className="icon">
                        <img src={service.icon} alt="icon" />
                      </div>
                      <div className="media-body">
                        <h4 className="link">
                          <Link className="text-white" to={`/service-details/${service.id}`}>
                            {service.title}
                          </Link>
                        </h4>
                        <p className="service-card_text text-white mt-2">
                          {service.description}
                        </p>
                      </div>

                    </div>
                    <div className="checklist style-white mb-50">
                      <div className="btn-wrap mt-20">
                        <Link className="btn style4 px-4 py-2" to={`/service-details/${service.id}`}>
                      Book Service <i className="fas fa-arrow-right ms-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="row gy-4 justify-content-center">
            {services.map((service) => (
              <div key={service.id} className="col-lg-4">
                <Link className=" " to={`/service-details/${service.id}`}>
                  <div
                    className="counter-checklist-wrap"
                    style={{ backgroundImage: `url(${service.image})` }}
                  >
                    <div className="call-media-wrap">
                      <div className="icon">
                        <img src={service.icon} alt="icon" />
                      </div>
                      <div className="media-body">
                        <h4 className="link">
                          <Link className="text-white" to={`/service-details/${service.id}`}>
                            {service.title}
                          </Link>
                        </h4>
                        <p className="service-card_text text-white mt-2">
                          {service.description}
                        </p>
                      </div>

                    </div>
                    <div className="checklist style-white mb-50">
                      <div className="btn-wrap mt-20">
                        <Link className="btn style4 px-4 py-2" to={`/service-details/${service.id}`}>
                          Book Service <i className="fas fa-arrow-right ms-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  </Link>
                </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAreaTwo;
