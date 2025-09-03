import React, { useEffect, useRef, useState } from "react";
import "./ServiceCards.css";
import { useNavigate, useParams } from "react-router-dom";
// import { FaSnowflake, FaCarBattery, FaCarSide, FaPaintRoller, FaMagic, FaShower, FaTools, FaGasPump } from "react-icons/fa";
// import servicetwo from '../../src/images/service-2.png';
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
                 
//         if (Array.isArray(response)) {
//  console.log("Fetched packages:", );
          const formatted = response.data.filter(pkg => pkg.IsActive === true).map(pkg => ({
            id: pkg.PackageID,
            title: pkg.PackageName,
            description: pkg.SubCategoryName,
            image: `${baseUrlImage}${pkg.PackageImage}`,
            tag: "Featured Package",
            duration: "4 Hrs Taken",
            price: pkg.Serv_Off_Price,
            originalPrice: pkg.Serv_Reg_Price,
            includes: pkg.IncludeNames ? pkg.IncludeNames.split(',').map(i => i.trim()) : [],
            BrandId: '',
            ModelId: '',
            isActive: pkg.IsActive,
          }));

          setPackages(formatted);
          console.log("Fetched packages:", formatted);

        // } else {
        //   setPackages([]);
        // }
      } catch (err) {
        console.error("Failed to fetch packages", err);
      }
    };

    fetchPackages();
  }, [BASE_URL, baseUrlImage, categoryId, activeTab, brandId, modelId, fuelId]);

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

  return (
    <div className="container my-4">
      {categoryName && (
        <h4 className="mb-3 text-uppercase fw-bold">{categoryName}</h4>
      )}
      <div className="d-flex align-items-center position-relative mb-4">
        <button className="arrow-btn left" onClick={() => scroll("left")}><i className="fa fa-arrow-left"></i></button>
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
        <button className="arrow-btn right" onClick={() => scroll("right")}><i className="fa fa-arrow-right"></i></button>
      </div>

      {/* Services */}
      <div className="row">
        {packages.length === 0 && (
          <p className="text-muted">No packages available for this subcategory.</p>
        )}
        {packages.map((pkg) => {
          const isInCart = cartItems.some((i) => i.id === pkg.id);
          return (
           
            <>
              <div className="col-md-6 mb-4">
                <div class="pricing-card">
                  <div class="pricing-card-price-wrap" onClick={() => navigate(`/servicedetails/${pkg.id}`)} style={{ cursor: "pointer" }}>

                  <div className="pricing-card-price-wrap position-relative" onClick={() => navigate(`/servicedetails/${pkg.id}`)} style={{ cursor: "pointer" }}>
                    {/* <div className="pricing-badge">
                      10% OFF
                    </div> */}
                    <div className="pricing-card_icon">
                      <img
                        src={pkg.image}
                        className="img-fluid rounded service-img"
                        alt={pkg.title}
                      />
                    </div>
                  </div>


                  
                  </div>
                  <div class="pricing-card-details">
                    <h4 class="pricing-card_title">{pkg.title}</h4>
                    <div class="checklist style2">
                      <ul className="list-unstyled small mb-2">
                       {pkg.includes.slice(0, 5).map((item, idx) => (
                            <li key={idx}>
                              <i className="fas fa-angle-right"></i> {item}
                            </li>
                          ))}
                          {pkg.includes.length > 3 && (
                            <li>
                              <a
                                href={`/servicedetails/${pkg.id}`}
                                className="text-danger text-decoration-underline"
                              >
                                View More
                              </a>
                            </li>
                          )}
                      </ul>
                    </div>

                    {selectedCar ? (
                      <>
                    {/* <h3 class="pricing-card_price"><span class="currency">₹{pkg.price}</span></h3> */}
                       <div className="ribbon">₹{pkg.price}
                         <p><div className="text-muted1 text-decoration-line-through">₹{pkg.originalPrice}</div></p>
                       </div>
                       
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
                        <div className="text-muted fst-italic mb-2">Select your car to see price</div>
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
