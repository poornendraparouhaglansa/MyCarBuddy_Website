import React, { useEffect, useRef, useState } from "react";
import "./ServiceCards.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaSnowflake, FaCarBattery, FaCarSide, FaPaintRoller, FaMagic, FaShower, FaTools, FaGasPump } from "react-icons/fa";
import servicetwo from '../../src/images/service-2.png';
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function ServiceCards() {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [packages, setPackages] = useState([]);
  const [categoryName, setCategoryName] = useState("");
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
          setSubcategories(subRes.data);
          setActiveTab(subRes.data[0]?.SubCategoryID || null);
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
            duration: "",
            price: pkg.serv_Off_Price,
            originalPrice: pkg.serv_Reg_Price,
            includes: [],
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
            <div key={pkg.id} className="col-md-12 mb-4">
              <div
                className="card shadow-sm service-card-horizontal"
                onClick={() => navigate(`/servicedetails/${pkg.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="row g-0">
                  <div className="col-md-3 position-relative">
                    <img
                      src={pkg.image}
                      className="img-fluid h-100 object-fit-cover"
                      alt={pkg.title}
                    />
                    <span className="tag-label">{pkg.tag}</span>
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h5 className="card-title">{pkg.title}</h5>
                        {pkg.duration && (
                          <span className="text-muted small">{pkg.duration}</span>
                        )}
                      </div>
                      <ul className="list-unstyled small mb-3 mt-2">
                        {pkg.includes.map((item, idx) => (
                          <li key={idx}>✔ {item}</li>
                        ))}
                      </ul>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="text-muted text-decoration-line-through">
                            ₹{pkg.originalPrice}
                          </div>
                          <div className="fw-bold text-success">₹{pkg.price}</div>
                        </div>
                        {isInCart ? (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/cart");
                            }}
                          >
                            ✔ View Cart
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(pkg);
                              toast.success("Service added to cart");
                            }}
                          >
                            + ADD TO CART
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
