import React from "react";

const Refund = () => {
  return (
    <div className="container py-5">
      <h2>Cancellation & Refund Policy</h2>
      <p>
        At <strong>My Car Buddy (GLANSA SOLUTIONS PRIVATE LIMITED)</strong>, we
        value our customers and follow a fair cancellation and refund policy to
        ensure transparency and satisfaction.
      </p>

      <ul>
        <li>
          Cancellations will be considered only if the request is made within{" "}
          <strong>7 days</strong> of placing the order/booking. However, the
          cancellation request may not be entertained if the service or order
          process has already been initiated.
        </li>
        <li>
          Cancellation requests are not accepted for perishable or consumable
          items (e.g., flowers, eatables). However, refund/replacement can be
          made if the customer establishes that the quality of the product or
          service delivered is not satisfactory.
        </li>
        <li>
          In case of damaged, defective, or unsatisfactory services/products,
          customers must report the same to our{" "}
          <strong>Customer Support Team</strong> within 7 days of receiving the
          service/product. The request will be verified by our merchant/partner
          before processing.
        </li>
        <li>
          If you feel the service/product delivered is not as shown or as per
          expectations, please contact our support team within 7 days. After
          review, our team will take an appropriate decision.
        </li>
        <li>
          For products/services covered under manufacturer warranty, complaints
          should be directed to the respective manufacturer.
        </li>
        <li>
          In case of <strong>approved refunds</strong> by My Car Buddy, the
          amount will be processed within <strong>3–5 business days</strong> to
          the original payment method.
        </li>
      </ul>

      <p className="mt-4">
        For any refund or cancellation related queries, please contact our {" "}
        <strong>My Car Buddy Support</strong> team with your info {" "}.
      </p>
    </div>
  );
};

export default Refund;
