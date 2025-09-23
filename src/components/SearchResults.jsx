import React, { useEffect, useState } from "react";
import "./ServiceCards.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import axios from "axios";
import ChooseCarModal from "./ChooseCarModal";
import AddToCartAnimation from "./AddToCartAnimation";

const SkeletonLoader = () => {
  return (
    <div className="container my-4">
      <div className="row">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="col-md-6 mb-4">
            <div className="pricing-card">
              <div className="pricing-card-price-wrap">
                <div className="skeleton-card-image" style={{ width: "100%", height: 200, backgroundColor: "#e0e0e0", borderRadius: "0.5rem" }}></div>
              </div>
              <div className="pricing-card-details">
                <div className="skeleton-card-title mb-2" style={{ width: "80%", height: 24, backgroundColor: "#e0e0e0", borderRadius: "0.25rem" }}></div>
                <div className="skeleton-card-list mb-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="skeleton-list-item mb-1" style={{ width: "90%", height: 16, backgroundColor: "#e0e0e0", borderRadius: "0.25rem" }}></div>
                  ))}
                </div>
                <div className="skeleton-card-price mb-2" style={{ width: "60px", height: 20, backgroundColor: "#e0e0e0", borderRadius: "0.25rem" }}></div>
                <div className="skeleton-card-button" style={{ width: "120px", height: 36, backgroundColor: "#e0e0e0", borderRadius: "0.25rem" }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchResults = ({ searchTerm }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showCarModal, setShowCarModal] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [animationStartPos, setAnimationStartPos] = useState({ top: 0, left: 0 });
  const [animationEndPos, setAnimationEndPos] = useState({ top: 0, left: 0 });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_CARBUDDY_BASE_URL;
  const baseUrlImage = process.env.REACT_APP_CARBUDDY_IMAGE_URL;

  const { cartItems, addToCart, removeFromCart } = useCart();

  const selectedCarDetails = JSON.parse(localStorage.getItem("selectedCarDetails"));
  let brandId, modelId, fuelId;
  if (selectedCarDetails) {
    brandId = selectedCarDetails.brand?.id;
    modelId = selectedCarDetails.model?.id;
    fuelId = selectedCarDetails.fuel?.id;
  }

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) return;
      setLoading(true);
      setPage(1);
      setHasMore(true);
      try {
        const response = await axios.get(
          `${BASE_URL}PlanPackage/GetPlanPackagesByCategoryAndSubCategory?searchTerm=${encodeURIComponent(searchTerm)}&page=1&pageSize=10`
        );

        const formatted = response.data.filter(pkg => pkg.IsActive === true).map(pkg => ({
          id: pkg.PackageID,
          title: pkg.PackageName,
          description: pkg.SubCategoryName,
          image: `${baseUrlImage}${pkg.PackageImage}`,
          price: pkg.Serv_Off_Price,
          originalPrice: pkg.Serv_Reg_Price,
          includes: pkg.IncludeNames ? pkg.IncludeNames.split(',').map(i => i.trim()) : [],
        }));

        setPackages(formatted);
        setHasMore(formatted.length === 10); // Assuming pageSize=10
      } catch (err) {
        console.error("Failed to fetch search results", err);
        setPackages([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm, BASE_URL, baseUrlImage]);

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}PlanPackage/GetPlanPackagesByCategoryAndSubCategory?searchTerm=${encodeURIComponent(searchTerm)}&page=${page + 1}&pageSize=10`
      );

      const formatted = response.data.filter(pkg => pkg.IsActive === true).map(pkg => ({
        id: pkg.PackageID,
        title: pkg.PackageName,
        description: pkg.SubCategoryName,
        image: `${baseUrlImage}${pkg.PackageImage}`,
        price: pkg.Serv_Off_Price,
        originalPrice: pkg.Serv_Reg_Price,
        includes: pkg.IncludeNames ? pkg.IncludeNames.split(',').map(i => i.trim()) : [],
      }));

      setPackages(prev => [...prev, ...formatted]);
      setPage(prev => prev + 1);
      setHasMore(formatted.length === 10);
    } catch (err) {
      console.error("Failed to load more results", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, page, searchTerm]);

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

    window.addEventListener("userProfileUpdated", loadSelectedCar);
    return () => window.removeEventListener("userProfileUpdated", loadSelectedCar);
  }, []);

  const handleAddToCartClick = (e, pkg) => {
    e.stopPropagation();

    const rect = e.target.getBoundingClientRect();
    const startPos = { top: rect.top, left: rect.left };

    const cartIcon = document.getElementById("GotoCart");
    let endPos = { top: window.innerHeight - 50, left: window.innerWidth - 50 };
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      endPos = { top: cartRect.top, left: cartRect.left };
    }

    setAnimationStartPos(startPos);
    setAnimationEndPos(endPos);
    setAnimationTrigger(true);

    addToCart(pkg);
    toast.success("Service added to cart");
  };

  const handleAnimationEnd = () => {
    setAnimationTrigger(false);
  };

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <div className="container my-4">
      <h4 className="mb-3">Search Results for "{searchTerm}"</h4>

      {loading ? (
        <SkeletonLoader />
      ) : packages.length === 0 ? (
        <p className="text-muted">No packages found for "{searchTerm}".</p>
      ) : (
        <div className="row">
          {packages.map((pkg) => {
            const isInCart = cartItems.some((i) => i.id === pkg.id);
            return (
              <div key={pkg.id} className="col-md-6 mb-4">
                <div className="pricing-card">
                  <div
                    className="pricing-card-price-wrap position-relative"
                    onClick={() => navigate(`/servicedetails/${slugify(pkg.title)}/${pkg.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="pricing-card_icon">
                      <img
                        src={pkg.image}
                        className="img-fluid rounded service-img"
                        alt={pkg.title}
                      />
                    </div>
                  </div>
                  <div className="pricing-card-details">
                    <h4 className="pricing-card_title">{pkg.title}</h4>
                    <div className="checklist style2">
                      <ul className="list-unstyled small mb-2">
                        {pkg.includes.slice(0, 4).map((item, idx) => (
                          <li key={idx}>
                            <i className="fas fa-angle-right"></i> {item}
                          </li>
                        ))}
                        {pkg.includes.length > 4 && (
                          <li>
                            <a
                              href={`/servicedetails/${slugify(pkg.title)}/${pkg.id}`}
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
                        <div className="ribbon">
                          ₹{pkg.price}
                          <p>
                            <div className="text-muted1 text-decoration-line-through">
                              ₹{pkg.originalPrice}
                            </div>
                          </p>
                        </div>

                        {isInCart ? (
                          <>
                            <button
                              className="btn style-border2"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/cart");
                              }}
                            >
                              ✔ View Cart
                            </button>
                            <button
                              className="btn style-border2 ml-5"
                              onClick={() => removeFromCart(pkg.id)}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn style-border2"
                            onClick={(e) => handleAddToCartClick(e, pkg)}
                          >
                            + ADD TO CART
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="text-muted fst-italic mb-2">
                          Select your car to see price
                        </div>
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
      <AddToCartAnimation
        trigger={animationTrigger}
        startPosition={animationStartPos}
        endPosition={animationEndPos}
        onAnimationEnd={handleAnimationEnd}
      />
    </div>
  );
};

export default SearchResults;
