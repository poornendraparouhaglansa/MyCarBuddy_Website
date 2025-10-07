import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import "./RelatedPackagesSlider.css";

const RelatedPackagesSlider = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useCart();
  const BASE_URL = process.env.REACT_APP_CARBUDDY_BASE_URL;
  const baseUrlImage = process.env.REACT_APP_CARBUDDY_IMAGE_URL;

  useEffect(() => {
    const fetchRelatedPackages = async () => {
      if (cartItems.length === 0) return;

      try {
        // Get categoryId from the first cart item
        const categoryId = cartItems[0].categoryId || 1;

        // Fetch packages from the category
        const response = await axios.get(
          `${BASE_URL}PlanPackage/GetPlanPackagesByCategoryAndSubCategory?categoryId=${categoryId}&subCategoryId=&BrandId=&ModelId=&fuelTypeId=`
        );
        const formatted = response.data
          .filter((pkg) => pkg.IsActive === true)
          .filter((pkg) => pkg.SubCategoryID == 58)
          .filter((pkg) => !cartItems.some((item) => item.id === pkg.PackageID))
          .slice(0, 8) // Show at least 4, up to 8 packages
          .map((pkg) => ({
            id: pkg.PackageID,
            title: pkg.PackageName,
            description: pkg.SubCategoryName,
            image: `${baseUrlImage}${pkg.PackageImage}`,
            price: pkg.Serv_Off_Price,
            originalPrice: pkg.Serv_Reg_Price,
            includes: pkg.IncludeNames ? pkg.IncludeNames.split(",").map((i) => i.trim()) : [],
          }));
        setPackages(formatted);
      } catch (err) {
        console.error("Failed to fetch related packages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPackages();
  }, [BASE_URL, baseUrlImage, cartItems]);

  const handleAddToCart = (pkg) => {
    addToCart(pkg);
    toast.success("Service added to cart");
  };

  const slugify = (text) => {
    return text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  if (loading) {
    return (
      <div className="container my-4">
        <h4 className="mb-3">Value Added Services</h4>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return null;
  }

  // Group packages into chunks of 4
  const chunkedPackages = [];
  for (let i = 0; i < packages.length; i += 4) {
    chunkedPackages.push(packages.slice(i, i + 4));
  }

  return (
    <div className="container my-4 related-packages-container">
      <h4 className="mb-3">Value Added Services</h4>
      <div id="relatedPackagesCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {chunkedPackages.map((chunk, slideIndex) => (
            <div key={slideIndex} className={`carousel-item ${slideIndex === 0 ? "active" : ""}`}>
              <div className="row">
                {chunk.map((pkg) => (
                  <div key={pkg.id} className="col-md-3 mb-3">
                    <div className="card h-100 p-3">
                      <img
                        src={pkg.image}
                        className="card-img-top"
                        alt={pkg.title}
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">{pkg.title}</h6>
                        {/* <p className="card-text text-muted small">{pkg.description}</p> */}
                        <div className="mb-2">
                          <span className="text-success fw-bold">₹{pkg.price}</span>
                          {pkg.originalPrice && (
                            <span className="text-decoration-line-through text-muted ms-1 small">
                              ₹{pkg.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="mt-auto">
                          <button
                            className="btn btn-primary  px-4 py-2"
                            onClick={() => handleAddToCart(pkg)}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Custom Previous Button */}
        <button
          className="carousel-control-prev carousel-control-custom carousel-control-prev-custom"
          type="button"
          data-bs-target="#relatedPackagesCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-icon">‹</span>
          <span className="visually-hidden">Previous</span>
        </button>
        
        {/* Custom Next Button */}
        <button
          className="carousel-control-next carousel-control-custom carousel-control-next-custom"
          type="button"
          data-bs-target="#relatedPackagesCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-icon">›</span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default RelatedPackagesSlider;
