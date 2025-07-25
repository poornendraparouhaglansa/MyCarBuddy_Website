import React, { useEffect, useRef, useState } from "react";
import "./ServiceCards.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaSnowflake, FaCarBattery, FaCarSide, FaPaintRoller, FaMagic, FaShower, FaTools, FaGasPump } from "react-icons/fa";
import servicetwo from '../../src/images/service-2.png';
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import axios from "axios";
import ChooseCarModal from "./ChooseCarModal";

export default function ServiceCards() {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [packages, setPackages] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCar, setSelectedCar] = useState(null);
  const [showCarModal, setShowCarModal] = useState(false);
  const navigate = useNavigate();
  const scrollRef = useRef();
  const BASE_URL = process.env.REACT_APP_CARBUDDY_BASE_URL;
  const baseUrlImage = process.env.REACT_APP_CARBUDDY_IMAGE_URL;

  const { cartItems, addToCart } = useCart();

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
    const fetchCategoryAndSubcategories = async () => {
      try {
        const [subRes, catRes] = await Promise.all([
          axios.get(`${BASE_URL}SubCategory1/subcategorybycategoryid?categoryid=${categoryId}`),
          axios.get(`${BASE_URL}Category`)
        ]);

        if (Array.isArray(subRes.data)) {
          const activeSubcategories = subRes.data.filter(sub => sub.IsActive === true);
          setSubcategories(activeSubcategories);
          setActiveTab(activeSubcategories[0]?.SubCategoryID || null);
        }

        if (catRes.data?.status && Array.isArray(catRes.data.data)) {
          const matchedCategory = catRes.data.data.find(
            (cat) => cat.CategoryID.toString() === categoryId
          );
          if (matchedCategory) {
            setCategoryName(matchedCategory.CategoryName);
          }
        }
      } catch (err) {
        console.error("Error fetching category or subcategories", err);
      }
    };

    fetchCategoryAndSubcategories();
  }, [categoryId]);


  useEffect(() => {
    const fetchPackages = async () => {
      if (!activeTab) return;
      try {
        const response = await axios.get(
          `${BASE_URL}PlanPackage/GetPlanPackagesByCategoryAndSubCategory?categoryId=${categoryId}&subCategoryId=${activeTab}&BrandId=${brandId || ''}&ModelId=${modelId || ''}&fuelTypeId=${fuelId || ''}`
        );
        if (Array.isArray(response.data)) {
          const formatted = response.data.map(pkg => ({
            id: pkg.packageID,
            title: pkg.packageName,
            description: pkg.subCategoryName,
            image: `${baseUrlImage}${pkg.packageImage}`,
            tag: "Featured Package",
            duration: "4 Hrs Taken",
            price: pkg.serv_Off_Price,
            originalPrice: pkg.serv_Reg_Price,
            includes: pkg.includeNames ? pkg.includeNames.split(',').map(i => i.trim()) : [],
            BrandId: '',
            ModelId: '',
          }));
          setPackages(formatted);
          console.log("Fetched packages:", response.data);

        } else {
          setPackages([]);
        }
      } catch (err) {
        console.error("Failed to fetch packages", err);
      }
    };

    fetchPackages();
  }, [categoryId, activeTab]);

  useEffect(() => {
    setPackages([]);
  }, [activeTab]);


  const scroll = (direction) => {
    const container = scrollRef.current;
    const tabWidth = container?.firstChild?.offsetWidth || 150;
    const scrollAmount = tabWidth + 12;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("selectedCarDetails");
    if (saved) {
      try {
        setSelectedCar(JSON.parse(saved));
      } catch (err) {
        console.error("Error parsing selected car", err);
      }
    }
  }, []);

  return (
    <div className="container my-4">
      {categoryName && (
        <h4 className="mb-3 text-uppercase fw-bold">{categoryName}</h4>
      )}
      <div className="d-flex align-items-center position-relative mb-4">
        <button className="arrow-btn left" onClick={() => scroll("left")}>&lt;</button>
        <div className="scrollable-tabs" ref={scrollRef}>
          {subcategories.map((sub) => (
            <div
              key={sub.SubCategoryID}
              className={`tab-pill ${activeTab?.toString() === sub.SubCategoryID.toString() ? "active" : ""}`}
              onClick={() => setActiveTab(sub.SubCategoryID)}
            >
              <span>{sub.SubCategoryName}</span>
            </div>
          ))}
        </div>
        <button className="arrow-btn right" onClick={() => scroll("right")}>&gt;</button>
      </div>

      {/* Services */}
      <div className="row">
        {packages.length === 0 && (
          <p className="text-muted">No packages available for this subcategory.</p>
        )}
        {packages.map((pkg) => {
          const isInCart = cartItems.some((i) => i.id === pkg.id);
          return (
            // <div key={pkg.id} className="col-md-12 mb-4">
            //   <div
            //     className="card shadow-sm service-card-horizontal px-3 py-3"
            //     onClick={() => navigate(`/servicedetails/${pkg.id}`)}
            //     style={{ cursor: "pointer" }}
            //   >
            //     <div className="row g-0 align-items-center">
            //       {/* LEFT: Image */}
            //       <div className="col-md-2 d-flex align-items-center justify-content-center position-relative">
            //         <img
            //           src={pkg.image}
            //           className="img-fluid rounded"
            //           alt={pkg.title}
            //           style={{ height: '120px', objectFit: 'cover' }}
            //         />
            //         <span className="tag-label">{pkg.tag}</span>
            //       </div>

            //       {/* RIGHT: Info */}
            //       <div className="col-md-10 ps-4">
            //         <div className="d-flex justify-content-between align-items-start">
            //           <div>
            //             <h5 className="fw-bold mb-1">{pkg.title}</h5>
            //             <div className="text-muted small mb-2">
            //               • {pkg.shortWarranty} &nbsp;&nbsp;• {pkg.longWarranty}
            //             </div>
            //           </div>
            //           {pkg.duration && (
            //             <div className="text-muted small">
            //               <i className="bi bi-clock me-1" /> {pkg.duration}
            //             </div>
            //           )}
            //         </div>

            //         {/* Feature List */}
            //         <div className="row">
            //           <div className="col-md-6">
            //             <ul className="list-unstyled small mb-2">
            //               {pkg.includes.slice(0, 3).map((item, idx) => (
            //                 <li key={idx}>✅ {item}</li>
            //               ))}
            //             </ul>
            //           </div>
            //           <div className="col-md-6">
            //             <ul className="list-unstyled small mb-2">
            //               {pkg.includes.slice(3, 5).map((item, idx) => (
            //                 <li key={idx}>✅ {item}</li>
            //               ))}
            //             </ul>
            //           </div>
            //         </div>

            //         {/* View all */}
            //         {pkg.includes.length > 5 && (
            //           <div className="mb-2">
            //             <span className="text-success small fw-semibold">+ {pkg.includes.length - 5} more View All</span>
            //           </div>
            //         )}

            //         {/* Price & Button */}
            //         <div className="d-flex justify-content-between align-items-center">
            //           {selectedCar ? (
            //             <>
            //               <div>
            //                 <div className="text-muted text-decoration-line-through">₹{pkg.originalPrice}</div>
            //                 <div className="fw-bold fs-5 text-dark">₹{pkg.price}</div>
            //               </div>
            //               {isInCart ? (
            //                 <button
            //                   className="btn btn-success btn-sm px-4"
            //                   onClick={(e) => {
            //                     e.stopPropagation();
            //                     navigate("/cart");
            //                   }}
            //                 >
            //                   ✔ View Cart
            //                 </button>
            //               ) : (
            //                 <button
            //                   className="btn btn-outline-danger btn-sm px-4"
            //                   onClick={(e) => {
            //                     e.stopPropagation();
            //                     addToCart(pkg);
            //                     toast.success("Service added to cart");
            //                   }}
            //                 >
            //                   + ADD TO CART
            //                 </button>
            //               )}
            //             </>
            //           ) : (
            //             <>
            //               <div className="text-muted fst-italic">Select your car to see price</div>
            //               <button
            //                 className="btn btn-outline-primary btn-sm px-4"
            //                 onClick={(e) => {
            //                   e.stopPropagation();
            //                   setShowCarModal(true);
            //                 }}
            //               >
            //                 Choose Your Car
            //               </button>
            //             </>
            //           )}
            //         </div>
            //       </div>
            //     </div>
            //   </div>
            // </div>
            <>
              <div className="col-md-6">
                <div class="pricing-card">
                  <div class="pricing-card-price-wrap" onClick={() => navigate(`/servicedetails/${pkg.id}`)} style={{ cursor: "pointer" }}>

                    <div class="pricing-card_icon">
                      {/* <img src="assets/img/icon/picing-icon_1-1.svg" alt="Fixturbo" /> */}
                      <img
                        src={pkg.image}
                        className="img-fluid rounded"
                        alt={pkg.title}
                        style={{ height: '120px', objectFit: 'cover' }}
                      />
                    </div>
                    <h3 class="pricing-card_price"><span class="currency">₹{pkg.price}</span></h3>
                    <h6><div className="text-muted text-decoration-line-through">₹{pkg.originalPrice}</div></h6>
                  </div>
                  <div class="pricing-card-details">
                    <h4 class="pricing-card_title">Car Care Clinic</h4>
                    <div class="checklist style2">
                      <ul>
                        <li><i class="fas fa-angle-right"></i>Expert Car Repair Specialists</li>
                        <li><i class="fas fa-angle-right"></i>Profession Car Repair Service</li>
                        <li><i class="fas fa-angle-right"></i>Quick and Efficient Car Repair</li>
                        <li><i class="fas fa-angle-right"></i>Trusted Car Repair</li>
                      </ul>
                    </div>

                    {selectedCar ? (
                      <>

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
                          <button
                            className="btn style-border2 "
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(pkg);
                              toast.success("Service added to cart");
                            }}
                          >
                            + ADD TO CART
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="text-muted fst-italic">Select your car to see price</div>
                        <button
                          className="btn style-border2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCarModal(true);
                          }}
                        >
                          Choose Your Car
                        </button>
                      </>
                    )}
                    {/* <a class="btn style-border2" href="/about">Start now <i class="fas fa-arrow-right ms-2"></i></a> */}

                  </div>
                </div>

              </div>
            </>
          );
        })}
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
  );
}
