// CartPage.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, i) => sum + i.price, 0);

  const navigate = useNavigate();

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
                  <th>Service</th>
                  <th>Price</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
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
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="text-end fw-bold" colSpan={1}>
                    Total
                  </td>
                  <td className="fw-bold text-success">₹{total}</td>
                </tr>
              </tbody>
            </table>
          </div>


          {cartItems.length > 0 && (
            <div className="d-flex justify-content-end mt-4">
              <Link to="/selecttimeslot" className="btn btn-danger btn-lg">
                Select Time Slot
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
