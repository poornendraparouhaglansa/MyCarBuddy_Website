import React, { useContext } from "react";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cartItems } = useCart();

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* Payment Options Section */}
        <div className="col-lg-8">
          <div className="card shadow p-4">
            <h3 className="mb-4">Checkout</h3>

            <h5 className="mb-3">Select Payment Method</h5>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="radio"
                name="payment"
                id="razorpay"
                defaultChecked
              />
              <label className="form-check-label" htmlFor="razorpay">
                Razorpay/ UPI/ Credit/ Debit Card
              </label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="payment"
                id="cod"
              />
              <label className="form-check-label" htmlFor="cod">
                Cash on Delivery
              </label>
            </div>

            <div className="d-flex gap-3 mb-4">
              <img src="/assets/img/update-img/payment-method/01.png" alt="visa" width="50" />
              <img src="/assets/img/update-img/payment-method/02.png" alt="mastercard" width="50" />
              <img src="/assets/img/update-img/payment-method/03.png" alt="paypal" width="50" />
            </div>

            <div className="text-end">
              <button className="btn btn-success btn-lg">Confirm Payment</button>
            </div>
          </div>
        </div>

        {/* Service Summary Section */}
        <div className="col-lg-4">
          <div className="card shadow p-4">
            <h5 className="mb-4">Services in Cart</h5>

            {cartItems.length === 0 ? (
              <p className="text-muted">No services in cart.</p>
            ) : (
              <div className="vstack gap-3">
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex gap-3 align-items-center border-bottom pb-3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rounded"
                      style={{ width: "64px", height: "64px", objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{item.title}</div>
                      <div className="text-muted small">{item.duration}</div>
                    </div>
                    <div className="fw-bold text-success text-nowrap">₹{item.price}</div>
                  </div>
                ))}
                <div className="d-flex justify-content-between pt-2 border-top mt-2">
                  <strong>Total</strong>
                  <strong className="text-primary">₹{totalAmount}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
