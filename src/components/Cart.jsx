// CartPage.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, i) => sum + i.price, 0);

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
      <h3 className="mb-4">Your Cart</h3>

      {cartItems.length === 0 ? (
        <div className="alert alert-info">No services in cart yet.</div>
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
                {
                cartItems.map((item) => (
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
                    <td>₹{item.price}</td>
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
