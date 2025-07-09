import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";
import { Link } from "react-router-dom";
const ServiceAreaThree = () => {
  return (
    <div className="service-area-2 space-bottom position-relative z-index-common">
      <div className="container">
        <div className="row gy-4 justify-content-center">
          <div className="col-xxl-5 col-xl-6">
            <div className="service-form-wrap">
              <h3>Car Parts For Any Car</h3>
              <form className="default-form-wrap">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-group m-0">
                      <select
                        name="subject"
                        id="subject"
                        className="form-select"
                        defaultValue={"Choose"}
                      >
                        <option value="Choose">Choose Service</option>
                        <option value="Construction">Auto Repair</option>
                        <option value="Real Estate">Car Repair</option>
                        <option value="Industry">Automotive</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group m-0">
                      <select
                        name="subject"
                        id="subject"
                        className="form-select"
                        defaultValue={"Choose"}
                      >
                        <option value="Choose">Choose Model</option>
                        <option value="Construction">TOYOTA</option>
                        <option value="Real Estate">SUZUKI</option>
                        <option value="Industry">TATA</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group m-0">
                      <select
                        name="subject"
                        id="subject"
                        className="form-select"
                        defaultValue={"Choose"}
                      >
                        <option value="Choose">Choose Year</option>
                        <option value="Construction">1999</option>
                        <option value="Real Estate">2000</option>
                        <option value="Industry">2001</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group m-0">
                      <select
                        name="subject"
                        id="subject"
                        className="form-select"
                        defaultValue={"Choose"}
                      >
                        <option value="Choose">Choose Location</option>
                        <option value="Construction">California</option>
                        <option value="Real Estate">New York</option>
                        <option value="Industry">Abu Dhabi</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group m-0">
                      <select
                        name="subject"
                        id="subject"
                        className="form-select"
                        defaultValue={"Choose"}
                      >
                        <option value="Choose">Choose Location</option>
                        <option value="Construction">California</option>
                        <option value="Real Estate">New York</option>
                        <option value="Industry">Abu Dhabi</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <button type="submit" className="btn style2 m-0 w-100">
                      Search Inventory
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-xxl-7 col-xl-6">
            <div className="row global-carousel service-client-slider">
              <Swiper
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                spaceBetween={20}
                slidesPerGroup={1}
                speed={1000}
                pagination={{ clickable: true }}
                className="mySwiper"
                modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  992: {
                    slidesPerView: 3,
                  },
                  1200: {
                    slidesPerView: 3,
                  },
                  1400: {
                    slidesPerView: 3,
                  },
                }}
              >
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src="assets/img/client/1.png" alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src="assets/img/client/2.png" alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src="assets/img/client/3.png" alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src="assets/img/client/4.png" alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src="assets/img/client/5.png" alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div>
                    <div className="client-logo">
                      <Link to="#">
                        <img src="assets/img/client/3.png" alt="Fixturbo" />
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaThree;
