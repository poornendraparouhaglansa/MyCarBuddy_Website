import React from "react";

const Privacy = () => {
  return (
    <div className="container py-5">
      <h2>Privacy Policy</h2>
      <p>
        At <strong>My Car Buddy</strong>, operated by{" "}
        <strong>Glansa Solutions Private Limited</strong>, we value your privacy
        and are committed to protecting your personal information. This policy
        explains how we collect, use, and safeguard your data when you use our
        app, website, and services.
      </p>
      <ul>
        <li>
          <strong>Information We Collect:</strong> We collect only the necessary
          details such as your name, contact information, vehicle details,
          location, and booking history to provide smooth service.
        </li>
        <li>
          <strong>Use of Information:</strong> Your information is used solely
          for booking confirmations, service delivery, customer support, and
          enhancing your experience with My Car Buddy.
        </li>
        <li>
          <strong>Data Security:</strong> All personal data is securely stored.
          Glansa Solutions does not sell, trade, or rent your personal
          information to third parties.
        </li>
        <li>
          <strong>Communication:</strong> We may contact you regarding booking
          updates, service reminders, special offers, or important notifications
          related to your account.
        </li>
        <li>
          <strong>Third-Party Services:</strong> In certain cases (such as
          payments, maps, or notifications), we may integrate trusted
          third-party services, but your data is shared only as required to
          complete the service.
        </li>
        <li>
          <strong>Cookies:</strong> Our website may use cookies to improve user
          experience, track preferences, and provide personalized content.
        </li>
        <li>
          <strong>Your Choices:</strong> You may opt out of promotional
          communications anytime by following unsubscribe instructions or
          contacting our support team.
        </li>
        <li>
          <strong>Policy Updates:</strong> This Privacy Policy may be updated
          periodically, and the latest version will always be available on our
          website/app.
        </li>
      </ul>
      <p className="mt-3">
        For any questions regarding this Privacy Policy, please contact{" "}
        <strong>Glansa Solutions Private Limited</strong> at{" "}
        <a href="mailto:info@glansa.com">info@glansa.com</a>.
      </p>
    </div>
  );
};

export default Privacy;
