// CartPage.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import RelatedPackagesSlider from "./RelatedPackagesSlider";
import { useAlert } from "../context/AlertContext";
import Swal from "sweetalert2";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const { showAlert } = useAlert();
  const [validatedItems, setValidatedItems] = useState(cartItems);
  const [validating, setValidating] = useState(false);
  const suppressAutoRemovalPromptRef = useRef(false);
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
            const subCatName = pkg?.SubCategoryName || "";
            const subCatId = pkg?.SubCategoryID;
            const isValueAdded = Number(subCatId) === 58 || /value\s*added/i.test(String(subCatName));
            return {
              ...item,
              title: pkg.PackageName ?? item.title,
              price: pkg.Serv_Off_Price ?? item.price,
              image: resolvedImage,
              isValueAdded,
            };
          } catch (e) {
            return item;
          }
        });

        const updated = await Promise.all(fetches);
        setValidatedItems(updated);

        // Enforce value-added only rule (< 300 auto-remove)
        const totalAmt = updated.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
        const nonValueAdded = updated.filter(i => !i.isValueAdded);
        const onlyValueAddedRemain = nonValueAdded.length === 0 && updated.length > 0;
        if (onlyValueAddedRemain && totalAmt < 300) {
          // If we just handled a user-confirmed removal that would cause this state,
          // skip prompting again.
          if (suppressAutoRemovalPromptRef.current) {
            suppressAutoRemovalPromptRef.current = false;
            setValidatedItems(updated);
            return;
          }
         
        } else {
          setValidatedItems(updated);
        }
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

  const handleRemoveFromCart = async (itemId, itemTitle) => {
    // Find the item to get its price
    const itemToRemove = validatedItems.find(item => item.id === itemId);
    const itemPrice = itemToRemove ? Number(itemToRemove.price) || 0 : 0;
    const currentTotal = total;
    const newTotal = currentTotal - itemPrice;
    
    // Check if removing this item will affect value-added services
    const remainingItems = validatedItems.filter(item => item.id !== itemId);
    const remainingValueAddedItems = remainingItems.filter(item => item.isValueAdded);
    const remainingNonValueAddedItems = remainingItems.filter(item => !item.isValueAdded);
    const onlyValueAddedRemain = remainingNonValueAddedItems.length === 0 && remainingValueAddedItems.length > 0;
    const willViolateRule = onlyValueAddedRemain && newTotal < 300;

    let confirmMessage = `Are you sure you want to remove "${itemTitle}" from your cart?`;
    let showWarning = false;

    if (willViolateRule) {
      showWarning = true;
      confirmMessage = `
        <div style="text-align: left;">
        
          <p style="margin: 0 0 8px;"> Removing this service will leave only value-added services totaling ₹${newTotal}, which is below the ₹300 minimum.</p>
          <p style="margin: 0 0 12px;">All remaining value-added services will be removed from your cart.</p>
          <p style="margin: 0;">Are you sure you want to proceed?</p>
        </div>
      `;
    } else if (itemPrice > 0) {
      confirmMessage = `Are you sure you want to remove "${itemTitle}" from your cart?`;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      html: confirmMessage,
      icon: showWarning ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: showWarning ? '#d33' : '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: showWarning ? 'Yes, remove and clear cart' : 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      focusCancel: true,
      width: showWarning ? '500px' : '400px',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom'
      }
    });

    if (result.isConfirmed) {
      // Prevent the validation effect from prompting again during this removal batch
      suppressAutoRemovalPromptRef.current = true;

      if (showWarning) {
        // Remove the selected item and all remaining value-added services immediately
        try { removeFromCart(itemId); } catch (_) {}
        remainingValueAddedItems.forEach((i) => {
          try { removeFromCart(i.id); } catch (_) {}
        });

        Swal.fire({
          title: 'Services Removed!',
          text: 'The service and all value-added services have been removed from your cart.',
          icon: 'info',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } else {
        // Standard single-item removal
        removeFromCart(itemId);
        Swal.fire({
          title: 'Removed!',
          text: `"${itemTitle}" has been removed from your cart.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
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
                {validatedItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      {/* <span >{cartItems.indexOf(item) + 1}</span> */}
                      <span >{index + 1}</span>
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
                        onClick={() => handleRemoveFromCart(item.id, item.title)}
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
