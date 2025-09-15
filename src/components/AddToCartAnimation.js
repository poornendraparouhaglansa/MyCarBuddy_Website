import React, { useEffect, useState } from "react";
import "./AddToCartAnimation.css";

const AddToCartAnimation = ({ trigger, startPosition, endPosition, onAnimationEnd }) => {
  const [animating, setAnimating] = useState(false);
  const [style, setStyle] = useState({});

  useEffect(() => {
    if (trigger) {
      setStyle({
        top: startPosition.top,
        left: startPosition.left,
        opacity: 1,
        transform: "scale(1) rotate(0deg)",
        position: "fixed",
        zIndex: 1000,
        pointerEvents: "none",
        transition: "all 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      });
      setAnimating(true);

      // Start animation to end position after a short delay
      setTimeout(() => {
        setStyle((prev) => ({
          ...prev,
          top: endPosition.top,
          left: endPosition.left,
          opacity: 0,
          transform: "scale(0.3) rotate(360deg)",
        }));
      }, 100);

      // End animation after transition duration
      setTimeout(() => {
        setAnimating(false);
        if (onAnimationEnd) onAnimationEnd();
      }, 1300);
    }
  }, [trigger, startPosition, endPosition, onAnimationEnd]);

  if (!animating) return null;

  return (
    <div className="add-to-cart-animation" style={style}>
      {/* <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" fill="currentColor"/>
        <path d="M9 8H11V17H9V8ZM13 8H15V17H13V8Z" fill="currentColor"/>
      </svg> */}

      <svg fill="#000000" width="30px" height="30px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M92.16 194.56H256c11.311 0 20.48-9.169 20.48-20.48S267.311 153.6 256 153.6H92.16c-11.311 0-20.48 9.169-20.48 20.48s9.169 20.48 20.48 20.48z"/><path d="M153.6 92.16V256c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48V92.16c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48zm694.872 298.379h91.75c11.311 0 20.48-9.169 20.48-20.48s-9.169-20.48-20.48-20.48h-91.75c-11.311 0-20.48 9.169-20.48 20.48s9.169 20.48 20.48 20.48z"/><path d="M873.867 324.184v91.75c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48v-91.75c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48zM204.8 481.28h614.4c45.243 0 81.92 36.677 81.92 81.92v133.12c0 45.243-36.677 81.92-81.92 81.92H204.8c-45.243 0-81.92-36.677-81.92-81.92V563.2c0-45.243 36.677-81.92 81.92-81.92zm0 40.96c-22.622 0-40.96 18.338-40.96 40.96v133.12c0 22.622 18.338 40.96 40.96 40.96h614.4c22.622 0 40.96-18.338 40.96-40.96V563.2c0-22.622-18.338-40.96-40.96-40.96H204.8zm84.327 294.38v55.204c0 19.9-15.918 35.963-35.451 35.963h-5.437c-19.533 0-35.451-16.063-35.451-35.963v-55.439c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48v55.439c0 42.439 34.173 76.923 76.411 76.923h5.437c42.238 0 76.411-34.484 76.411-76.923V816.62c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48zm523.335 0v55.204c0 19.9-15.918 35.963-35.451 35.963h-5.437c-19.533 0-35.451-16.063-35.451-35.963v-55.439c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48v55.439c0 42.439 34.173 76.923 76.411 76.923h5.437c42.238 0 76.411-34.484 76.411-76.923V816.62c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48z"/><path d="M340.125 626.349c0 28.273-22.927 51.2-51.2 51.2s-51.2-22.927-51.2-51.2c0-28.273 22.927-51.2 51.2-51.2s51.2 22.927 51.2 51.2zm447.227 0c0 28.273-22.927 51.2-51.2 51.2s-51.2-22.927-51.2-51.2c0-28.273 22.927-51.2 51.2-51.2s51.2 22.927 51.2 51.2zm-365.246 20.48h180.46c11.311 0 20.48-9.169 20.48-20.48s-9.169-20.48-20.48-20.48h-180.46c-11.311 0-20.48 9.169-20.48 20.48s9.169 20.48 20.48 20.48zm345.569-150.164H257.877v-163.84c0-56.556 45.844-102.4 102.4-102.4h304.998c56.556 0 102.4 45.844 102.4 102.4v163.84zM358.4 276.48c-33.932 0-61.44 27.508-61.44 61.44v139.284h430.08V337.92c0-33.932-27.508-61.44-61.44-61.44H358.4z"/></svg>
    </div>
  );
};

export default AddToCartAnimation;
