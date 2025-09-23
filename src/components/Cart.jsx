// CartPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import RelatedPackagesSlider from "./RelatedPackagesSlider";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const [validatedItems, setValidatedItems] = useState(cartItems);
  const [validating, setValidating] = useState(false);
  const API_BASE = process.env.REACT_APP_CARBUDDY_BASE_URL || "https://api.mycarsbuddy.com/api/";
  const IMAGE_BASE = process.env.REACT_APP_CARBUDDY_IMAGE_URL || "https://api.mycarsbuddy.com/";

  useEffect(() => {
    const validatePrices = async () => {
      try {
        setValidating(true);
        const selectedCarDetails = JSON.parse(localStorage.getItem("selectedCarDetails"));
        if (!selectedCarDetails?.brand?.id || !selectedCarDetails?.model?.id || !selectedCarDetails?.fuel?.id) {
          setValidatedItems(cartItems);
          return;
        }

        const brandId = selectedCarDetails.brand.id;
        const modelId = selectedCarDetails.model.id;
        const fuelTypeId = selectedCarDetails.fuel.id;

        const fetches = cartItems.map(async (item) => {
          const url = `${API_BASE}PlanPackage/GetPlanPackagesByCategoryAndSubCategory?BrandId=${brandId}&ModelId=${modelId}&fuelTypeId=${fuelTypeId}&packageId=${item.id}`;
          try {
            const res = await axios.get(url);
            const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            if (!Array.isArray(list) || list.length === 0) return item;
            const pkg = list.find((p) => String(p.PackageID) === String(item.id)) || list[0];
            const imagePath = pkg?.BannerImage || "";
            const resolvedImage = imagePath ? `${IMAGE_BASE}${imagePath.startsWith("/") ? imagePath.slice(1) : imagePath}` : item.image;
            return {
              ...item,
              title: pkg.PackageName ?? item.title,
              price: pkg.Serv_Off_Price ?? item.price,
              image: resolvedImage,
            };
          } catch (e) {
            return item;
          }
        });

        const updated = await Promise.all(fetches);
        setValidatedItems(updated);
      } finally {
        setValidating(false);
      }
    };

    validatePrices();
  }, [cartItems]);

  const total = validatedItems.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

  const navigate = useNavigate();

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  
  useEffect(() => {
    const handleUserChange = () => {
      setIsLoggedIn(!!localStorage.getItem("user"));
    };

    window.addEventListener("userProfileUpdated", handleUserChange);
    return () => {
      window.removeEventListener("userProfileUpdated", handleUserChange);
    };
  }, []);

  const handleSelectSlot = () => {
    if (isLoggedIn) {
      navigate("/selecttimeslot");
    } else {
      setShowSignInModal(true);
    }
  };

  return (
    <div className="container py-4">
      {/* <h3 className="mb-4">Your Cart</h3> */}

      {validatedItems.length === 0 ? (
        <div className=" no-services-cart" style={{ textAlign: "center" }}>
          <img src="/assets/img/nocart.png" alt="No Cart" style={{ maxWidth: "200px", marginBottom: "20px" }} />
          <h4>Your Garage  is empty</h4>
          <p>Looks like you haven't added any services yet. Start exploring and add your favorite services to the cart!</p>
          <button
            className="btn btn-primary mt-3 px-4 py-2"
            onClick={() => window.location.href = "/service"}
          >
            Book Service
          </button>
        </div>
      ) : (
        <>
          <div className="table-responsive mb-4">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Service</th>
                  <th>Price</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {validatedItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span >{cartItems.indexOf(item) + 1}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                          className="me-3"
                        />
                        <strong>{item.title}</strong>
                      </div>
                    </td>
                    <td>
                      {validating ? (
                        <span className="text-muted">Validating...</span>
                      ) : (
                        <>₹{item.price}</>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm-icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="text-end fw-bold" colSpan={2}>
                    Total
                  </td>
                  <td className="fw-bold text-success">₹{total}</td>
                </tr>
              </tbody>
            </table>
          </div>


          {cartItems.length > 0 && (
            <div className="d-flex justify-content-end mt-4">
              <button onClick={handleSelectSlot} className="btn btn-danger btn-lg px-4 py-2">
                Check Out
              </button>
            </div>
          )}

          {/* Related Packages Slider */}
          {cartItems.length > 0 && <RelatedPackagesSlider />}
        </>
      )}
      <SignIn
        isVisible={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onRegister={() => {
          setShowSignInModal(false);
        }}
      />
    </div>
  );
};

export default CartPage;
