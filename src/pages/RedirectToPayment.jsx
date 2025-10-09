import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

export default function RedirectToPayment() {
  const { encodedUrl } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (encodedUrl) {
      const decodedUrl = decodeURIComponent(encodedUrl);
      const params = new URLSearchParams(location.search);
      const fallback = params.get("fallback"); // optional fallback

      try {
        // Prefer replace so back button does not return to the redirect page
        window.location.replace(decodedUrl);
      } catch (err) {
        if (fallback) {
          window.location.replace(decodeURIComponent(fallback));
        } else {
          // last resort: open in same tab via assign
          try {
            window.location.assign(decodedUrl);
          } catch (e) {
            alert("Unable to open payment link.");
          }
        }
      }
    }
  }, [encodedUrl, location.search]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Redirecting to Secure Payment...</h2>
    </div>
  );
}


