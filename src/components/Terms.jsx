import React from "react";

const Terms = () => {
  return (
    <div className="container py-5">
      <h2>Terms & Conditions</h2>
      <p>
        By accessing or using our services, you agree to be bound by these terms.
        Please read them carefully.
      </p>
      <ul>
        <li>Users must provide accurate information during registration or booking.</li>
        <li>All bookings are subject to availability.</li>
        <li>We reserve the right to refuse service or cancel bookings without prior notice.</li>
        <li>Prices may change without notice due to operational reasons.</li>
        <li>Disputes, if any, shall be governed by Indian laws.</li>
      </ul>
    </div>
  );
};

export default Terms;