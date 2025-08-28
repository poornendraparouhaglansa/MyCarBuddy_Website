import React , { useEffect , useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import HeaderOne from "./HeaderOne";
import Breadcrumb from "./Breadcrumb";
import FooterAreaOne from "./FooterAreaOne";
import SubscribeOne from "./SubscribeOne";
import axios from "axios";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import ChooseCarModal from "./ChooseCarModal";

const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;
const ImageURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;


const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const { cartItems, addToCart } = useCart();
  const [services, setServices] = React.useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
      const [showCarModal, setShowCarModal] = useState(false);
      const [allServices, setAllServices] = useState([]);

      const selectedCarDetails = JSON.parse(localStorage.getItem("selectedCarDetails"));
  let brandId;
  let modelId;
  let fuelId;
  if (selectedCarDetails) {
    brandId = selectedCarDetails.brand?.id;
    modelId = selectedCarDetails.model?.id;
    fuelId = selectedCarDetails.fuel?.id;

    console.log({ brandId, modelId, fuelId });
  } else {
    console.log("No car selected yet.");
  }



  useEffect(() => {
    const loadSelectedCar = () => {
      const saved = localStorage.getItem("selectedCarDetails");
      if (saved) {
        try {
          setSelectedCar(JSON.parse(saved));
        } catch (err) {
          console.error("Error parsing selected car", err);
        }
      } else {
        setSelectedCar(null);
      }
    };
  
    loadSelectedCar();
  
    // Listen to custom event triggered after login
    const handleProfileUpdate = () => {
      loadSelectedCar();
    };
  
    window.addEventListener("userProfileUpdated", handleProfileUpdate);
  
    return () => {
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
    };
  }, []);
  

  useEffect(() => {
         const fetchPackages = async () => {
      try {
        const response = await axios.get(
          `${BaseURL}PlanPackage/GetPlanPackagesByCategoryAndSubCategory`
        );
                 
//         if (Array.isArray(response)) {
//  console.log("Fetched packages:", );
setAllServices(response.data);

         const formatted = response.data
  .filter(pkg => pkg.PackageID === parseInt(id))
  .map(pkg => {
    const hours = pkg.EstimatedDurationMinutes
      ? pkg.EstimatedDurationMinutes // 1 decimal place
      : null;

    return {
      id: pkg.PackageID,
      title: pkg.PackageName,
       banners: pkg.BannerImage
      ? pkg.BannerImage.split(",").map(img => `${ImageURL}${img.trim()}`)
      : [],
      image: `${ImageURL}${pkg.PackageImage}`,
      tag: "Featured Package",
      duration: pkg.EstimatedDurationMinutes ? `${pkg.EstimatedDurationMinutes} ` : "N/A",
      price: pkg.Serv_Off_Price,
      originalPrice: pkg.Serv_Reg_Price,
      includes: pkg.IncludeNames
        ? pkg.IncludeNames.split(",").map(i => i.trim())
        : [],
      BrandId: "",
      ModelId: "",
      isActive: pkg.IsActive,
      EstimatedDurationMinutes: pkg.EstimatedDurationMinutes,
      EstimatedDurationHours: hours, // Keep hours separately too if needed
      Description: pkg.Description,
      categoryId: pkg.CategoryID,
    };
  });


            setServices(formatted);
        

        // } else {
        //   setPackages([]);
        // }
      } catch (err) {
        console.error("Failed to fetch packages", err);
      }
    };

    fetchPackages();
  }, [id]);



  const service = services.find(s => s.id === parseInt(id));

  if (!service) {
    return '';
  }

  const categoryServices = allServices.filter(s => s.CategoryID === service.categoryId && s.PackageID !== service.id);
  console.log(categoryServices);

  const isInCart = cartItems.some((i) => i.id === service.id);

  return (
    <>
      <div className="service-details-area py-5">
        <div className="container">
          <div className="row gx-5 flex-row">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className="service-page-single">
                <div className="page-img mb-4">
                  <div className="d-flex1">
                    <div className="w-100">
                     <div
                          id="serviceCarousel"
                          className="carousel slide mb-4"
                          data-bs-ride="carousel"
                          data-bs-interval="3000"  // 3 seconds
                        >
                          <div className="carousel-inner">
                            {service.banners.map((img, idx) => (
                              <div
                                className={`carousel-item ${idx === 0 ? "active" : ""}`}
                                key={idx}
                              >
                                <img
                                  src={img}
                                  className="d-block w-100 rounded"
                                  alt={`${service.title} ${idx + 1}`}
                                  style={{ objectFit: "cover", height: "400px" }}
                                />
                              </div>
                            ))}
                          </div>

                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#serviceCarousel"
                            data-bs-slide="prev"
                          >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>

                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#serviceCarousel"
                            data-bs-slide="next"
                          >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </div>

                    </div>

                    <div className="w-50 d-flex flex-row justify-content-end gap-2">
                      {/* <i className="bi bi-clock-fill text-muted">  </i> */}
                      {/* <p className="mb-0 fw-regular text-muted"> {service.duration}</p> */}
                    </div>
                  </div>
                  

                  <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{ backgroundColor: '#f1f1f1' }}>

                   {selectedCar ? (
                      <>
                    <h5 className="mb-0 fw-bold text-dark">₹ {service.price}</h5>
                     {isInCart ? (
                          <button
                            className="btn style-border2"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/cart");
                            }}
                          >
                            ✔ View Cart
                          </button>
                        ) : (
                          <button className="btn btn-danger fw-bold"  onClick={(e) => {
                              e.stopPropagation();
                              addToCart(service);
                              toast.success("Service added to cart");
                            }}>
                      + ADD TO CART
                    </button>
                    
                        )}
                        </>
                        ) : (
                      <>
                        <div className="text-muted fst-italic mb-2">Select your car to see price</div>
                        <button
                          className="btn style-border2 px-4 py-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCarModal(true);
                          }}
                        >
                          Choose Your Car
                        </button>
                      </>
                    )}
                    
                  </div>
                </div>



                <div className="page-content">
                  <h2 className="page-title">{service.title}</h2>
                  <p className="text-muted mb-3">{service.duration}</p>
                 <p>
                  {service.Description}
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

                  {/* <h4 className="mt-1 mb-3">Customer Comments</h4>

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
                  </div> */}
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
                        <Link to={`/servicedetails/${s.PackageID}`}>{s.PackageName}</Link>
                        {/* <span className="badge bg-success">₹{s.price}</span> */}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="widget widget_contact bg-light p-3 rounded text-center">
                  <h5 className="widget_title mb-2">Need Help?</h5>
                  <p className="text-muted mb-2">Have questions about this service?</p>
                  <p>At <strong>My Car Buddy</strong>, powered by{" "}
                <strong>Glansa Solutions Pvt. Ltd.</strong>, we aim to make your car
                care experience seamless and worry-free. Whether you need assistance
                with booking, payments, service updates, or technical support, our team
                is ready to help.</p>
                  <div className="icon fs-3 mb-2 text-primary">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <h5><Link to="tel:9885653865">+91 98856 53865</Link></h5>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <ChooseCarModal
        isVisible={showCarModal}
        onClose={() => {
          setShowCarModal(false);
          const saved = localStorage.getItem("selectedCarDetails");
          if (saved) {
            try {
              setSelectedCar(JSON.parse(saved));
            } catch (err) {
              console.error("Error parsing selected car", err);
            }
          }
        }}
        onCarSaved={(car) => setSelectedCar(car)}
      />
      </div>
      {/* <SubscribeOne /> */}
    </>
  );
};

export default ServiceDetails;
