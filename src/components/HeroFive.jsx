import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";
import { Link } from "react-router-dom";
const HeroFive = () => {
  return (
    <div className="hero-wrapper hero-5">
      <div className="hero-3-slider global-carousel">
        <Swiper
          modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
          effect="fade"
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
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
                    <div className="hero-style2">
                      <h1 className="hero-title text-white">
                        Highly Modified Car Repair system
                      </h1>
                      <p className="hero-text text-white">
                        Vestibulum rhoncus nisl ac gravida porta. Mauris eu
                        sapien lacus. Etiam molestie justo neque, in convallis
                        massa tempus in.
                      </p>
                      <div className="btn-group">
                        <Link to="/about" className="btn">
                          Learn About Us
                        </Link>
                        <Link to="/service" className="btn style-border">
                          Our Service
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 align-self-end">
                    <div className="hero-thumb text-lg-center">
                      <img
                        src="assets/img/testimonial/testimonial-1-2.png"
                        alt="Fixturbo"
                      />
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
                backgroundImage: "url(assets/img/hero/hero_bg_3_1.png)",
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-xxl-6 col-xl-5 col-lg-6">
                    <div className="hero-style2">
                      <h1 className="hero-title text-white">
                        The ProfessionalCar Repair system.
                      </h1>
                      <p className="hero-text text-white">
                        Vestibulum rhoncus nisl ac gravida porta. Mauris eu
                        sapien lacus. Etiam molestie justo neque, in convallis
                        massa tempus in.
                      </p>
                      <div className="btn-group">
                        <Link to="/about" className="btn">
                          Learn About Us
                        </Link>
                        <Link to="/service" className="btn style-border">
                          Our Service
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 align-self-end">
                    <div className="hero-thumb text-lg-center">
                      <img
                        src="assets/img/testimonial/testimonial-1-1.png"
                        alt="Fixturbo"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default HeroFive;
