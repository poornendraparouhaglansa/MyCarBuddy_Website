import React, { useState } from "react";
const PortfolioThree = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  const openLightbox = (src) => {
    setIsOpen(true);
    setImageSrc(src);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setImageSrc("");
  };

  let img = [
    "assets/img/gallery/1.png",
    "assets/img/gallery/2.png",
    "assets/img/gallery/3.png",
    "assets/img/gallery/4.png",
    "assets/img/gallery/5.png",
    "assets/img/gallery/6.png",
  ];
  return (
    <div className="portfolio-area-1 space overflow-hidden bg-smoke">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="title-area text-center">
              <span className="sub-title">Our Work</span>
              <h2 className="sec-title">Our Featured Gallery</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam
              </p>
            </div>
          </div>
        </div>
        <div className="row gy-30">
          {img.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div className="portfolio-thumb">
                <button
                  className="popup-image icon-btn"
                  onClick={() => openLightbox(item)}
                >
                  <i className="far fa-eye" />
                </button>
                <div>
                  <img src={item} alt="Thumbnail" />
                </div>
              </div>
              {isOpen && (
                <div className="custom-modal_popup">
                  <span className="close-button" onClick={closeLightbox}>
                    &times;
                  </span>
                  <img src={imageSrc} alt="Fullsize" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioThree;
