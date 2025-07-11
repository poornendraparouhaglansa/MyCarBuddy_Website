import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";
import { Link } from "react-router-dom";

const HeroThree = () => {

  const [showLocationModal, setShowLocationModal] = useState(true);
  const [location, setLocation] = useState(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
          setShowLocationModal(false);
        },
        (error) => {
          console.error("Location error:", error.message);
          setShowLocationModal(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setShowLocationModal(false);
    }
  };
  return (
    <div className="hero-wrapper hero-3" style={{ position: "relative" }}>

        {showLocationModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              position: "relative",
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "30px",
              width: "90%",
              maxWidth: "400px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
            }}>
              {/* ✕ Close Icon */}
              <button
                onClick={() => setShowLocationModal(false)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  background: "none",
                  border: "none",
                  fontSize: "22px",
                  color: "#888",
                  cursor: "pointer"
                }}
                aria-label="Close"
              >
                &times;
              </button>

              <img
                src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
                alt="Location Icon"
                style={{ width: 60, height: 60, marginBottom: 20 }}
              />
              <h2 style={{ marginBottom: 10 }}>Allow Location Access</h2>
              <p style={{ color: "#666", marginBottom: 25 }}>
                We use your location to show services near you.
              </p>
              <button
                onClick={handleGetLocation}
                style={{
                  backgroundColor: "#e60012",
                  color: "#fff",
                  padding: "10px 25px",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >
                Get Location
              </button>
            </div>
          </div>
        )}

      <div className="hero-3-slider global-carousel">
        <Swiper
          loop={true}
          modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          effect="fade"
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
        >
          <SwiperSlide>
            <div
              className="hero-slide"
              style={{
                backgroundImage: "url(assets/img/hero/hero_bg_3_1.png)",
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-xxl-6 col-xl-5 col-lg-6">
                    <div className="hero-style3">
                      <div className="hero-subtitle text-white" data-ani="slideinup" data-ani-delay="0s">
                        <span>
                          <img src="assets/img/hero/hero_shape_3.png" alt="Fixturbo" />
                          Welcome Fixturbo
                        </span>
                      </div>
                      <h1 className="hero-title text-white" data-ani="slideinup" data-ani-delay="0.1s">
                        Revive, Repair, Relish the Ride!
                      </h1>
                      <p className="hero-text text-white" data-ani="slideinup" data-ani-delay="0.2s">
                        Vestibulum rhoncus nisl ac gravida porta. Mauris eu sapien lacus. Etiam molestie
                        justo neque, in convallis massa tempus in.
                      </p>
                      <div className="btn-group" data-ani="slideinup" data-ani-delay="0.3s">
                        <Link to="/about" className="btn">
                          Learn More
                        </Link>
                        <div className="call-media-wrap">
                          <div className="icon">
                            <img src="assets/img/icon/phone-1.svg" alt="Fixturbo" />
                          </div>
                          <div className="media-body">
                            <h6 className="title text-white">Requesting A Call:</h6>
                            <h4 className="link">
                              <a className="text-white" href="tel:6295550129">
                                (629) 555-0129
                              </a>
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 align-self-center">
                    <div className="video-wrap text-lg-center" data-ani="slideinup" data-ani-delay="0.2s">
                      {/* <a
                        href="https://www.youtube.com/watch?v=P7fi4hP_y80"
                        className="play-btn style4 popup-video"
                      >
                        <i className="fas fa-solid fa-play" />
                      </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              className="hero-slide"
              style={{
                backgroundImage: "url(assets/img/hero/hero_bg_3_2.png)",
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-xxl-6 col-xl-5 col-lg-6">
                    <div className="hero-style3">
                      <div className="hero-subtitle text-white" data-ani="slideinup" data-ani-delay="0s">
                        <span>
                          <img src="assets/img/hero/hero_shape_3.png" alt="Fixturbo" />
                          Welcome Fixturbo
                        </span>
                      </div>
                      <h1 className="hero-title text-white" data-ani="slideinup" data-ani-delay="0.1s">
                        Smooth Rides, Seamless Repairs.
                      </h1>
                      <p className="hero-text text-white" data-ani="slideinup" data-ani-delay="0.2s">
                        Vestibulum rhoncus nisl ac gravida porta. Mauris eu sapien lacus. Etiam molestie
                        justo neque, in convallis massa tempus in.
                      </p>
                      <div className="btn-group" data-ani="slideinup" data-ani-delay="0.3s">
                        <Link to="/about" className="btn">
                          Learn More
                        </Link>
                        <div className="call-media-wrap">
                          <div className="icon">
                            <img src="assets/img/icon/phone-1.svg" alt="Fixturbo" />
                          </div>
                          <div className="media-body">
                            <h6 className="title text-white">Requesting A Call:</h6>
                            <h4 className="link">
                              <a className="text-white" href="tel:6295550129">
                                (629) 555-0129
                              </a>
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 align-self-center">
                    <div className="video-wrap text-lg-center" data-ani="slideinup" data-ani-delay="0.2s">
                      {/* <a
                        href="https://www.youtube.com/watch?v=P7fi4hP_y80"
                        className="play-btn style4 popup-video"
                      >
                        <i className="fas fa-solid fa-play" />
                      </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* ✅ Form Overlapping Both Slides (Fixed Bottom-Right) */}
      <div
        className="bg-white rounded shadow p-4"
        style={{
          position: "absolute",
          bottom: "200px",
          right: "150px",
          width: "420px",
          zIndex: 50,
        }}
      >
        <h5 className="mb-3 font-semibold">Book a Service</h5>
        <form className="space-y-3">
          <input
            type="text"
            placeholder="Your Name"
            className="form-control mb-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-2"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="form-control mb-3"
          />
          <button type="submit" className="btn btn-primary w-100">
            Request Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroThree;
