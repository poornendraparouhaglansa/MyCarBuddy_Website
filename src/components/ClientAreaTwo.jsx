import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade } from "swiper";
import { Link } from "react-router-dom";
const ClientAreaTwo = () => {
  return (
    <div
      className="client-bg-area-2"
      style={{ backgroundImage: "url(assets/img/bg/client-bg2-1.png)" }}
    >
      <div className="client-area-2 space text-center">
        <div className="container">
          <div className="row global-carousel">
            <Swiper
              loop={true}
              spaceBetween={20}
              slidesPerGroup={1}
              speed={1000}
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000 }}
              className="mySwiper"
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                992: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 5,
                },
                1400: {
                  slidesPerView: 5,
                },
              }}
            >
              <SwiperSlide>
                <div>
                  <div className="client-logo">
                    <Link to="/">
                      <img src="assets/img/client/1-1.png" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="client-logo">
                    <Link to="/">
                      <img src="assets/img/client/1-2.png" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="client-logo">
                    <Link to="/">
                      <img src="assets/img/client/1-3.png" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="client-logo">
                    <Link to="/">
                      <img src="assets/img/client/1-4.png" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="client-logo">
                    <Link to="/">
                      <img src="assets/img/client/1-5.png" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="client-logo">
                    <Link to="/">
                      <img src="assets/img/client/1-1.png" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="client-logo">
                    <Link to="/">
                      <img src="assets/img/client/1-2.png" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                {" "}
                <div>
                  <div className="client-logo">
                    <Link to="/">
                      <img src="assets/img/client/1-3.png" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="client-logo">
                    <Link to="/">
                      <img src="assets/img/client/1-4.png" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  <div className="client-logo">
                    <Link to="/">
                      <img src="assets/img/client/1-5.png" alt="Fixturbo" />
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
      {/*==============================
    Testimonial Area  
    ==============================*/}
      <div className="testimonial-area-2 overflow-hidden">
        <div className="container">
          <div className="row justify-content-end">
            <div className="col-lg-7">
              <div className="testiomonial-wrap-2 bg-title">
                <div className="title-area">
                  <span className="sub-title">CLIENTS REVIEWS</span>
                  <h2 className="sec-title text-white">WHAT OUR CLIENT SAYS</h2>
                </div>
                <div className="quote-icon">
                  <img src="assets/img/icon/quote2-1.svg" alt="Fixturbo" />
                </div>
                <div className="row global-carousel testi-slider-2">
                  <Swiper
                    loop={true}
                    navigation={{
                      nextEl: ".testimonial_R-button-next",
                      prevEl: ".testimonial_R-button-prev",
                    }}
                    spaceBetween={20}
                    slidesPerGroup={1}
                    speed={1000}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 6000 }}
                    modules={[FreeMode, Navigation, Thumbs, EffectFade]}
                    className="mySwiper"
                    breakpoints={{
                      0: {
                        slidesPerView: 1,
                      },
                      768: {
                        slidesPerView: 1,
                      },
                      992: {
                        slidesPerView: 1,
                      },
                      1200: {
                        slidesPerView: 1,
                      },
                      1400: {
                        slidesPerView: 1,
                      },
                    }}
                  >
                    <SwiperSlide>
                      <div>
                        <div className="testi-card style2">
                          <div className="testi-card_content">
                            <div className="testi-card-profile">
                              <div className="testi-profile_thumb">
                                <img
                                  src="assets/img/testimonial/testimonial-2-1.png"
                                  alt="Fixturbo"
                                />
                              </div>
                              <div className="testi-card-profile-details">
                                <h4 className="testi-profile-title">
                                  James Anderson{" "}
                                </h4>
                                <span className="testi-profile-desig">
                                  Software Engineer
                                </span>
                              </div>
                            </div>
                            <p className="testi-card_text">
                              Working with this company has been a game-changer
                              for my business. Their expertise and innovative
                              approach have helped us achieve remarkable
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div>
                        <div className="testi-card style2">
                          <div className="testi-card_content">
                            <div className="testi-card-profile">
                              <div className="testi-profile_thumb">
                                <img
                                  src="assets/img/testimonial/testimonial-2-1.png"
                                  alt="Fixturbo"
                                />
                              </div>
                              <div className="testi-card-profile-details">
                                <h4 className="testi-profile-title">
                                  James Anderson{" "}
                                </h4>
                                <span className="testi-profile-desig">
                                  Software Engineer
                                </span>
                              </div>
                            </div>
                            <p className="testi-card_text">
                              Working with this company has been a game-changer
                              for my business. Their expertise and innovative
                              approach have helped us achieve remarkable
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div>
                        <div className="testi-card style2">
                          <div className="testi-card_content">
                            <div className="testi-card-profile">
                              <div className="testi-profile_thumb">
                                <img
                                  src="assets/img/testimonial/testimonial-2-1.png"
                                  alt="Fixturbo"
                                />
                              </div>
                              <div className="testi-card-profile-details">
                                <h4 className="testi-profile-title">
                                  James Anderson{" "}
                                </h4>
                                <span className="testi-profile-desig">
                                  Software Engineer
                                </span>
                              </div>
                            </div>
                            <p className="testi-card_text">
                              Working with this company has been a game-changer
                              for my business. Their expertise and innovative
                              approach have helped us achieve remarkable
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div>
                        <div className="testi-card style2">
                          <div className="testi-card_content">
                            <div className="testi-card-profile">
                              <div className="testi-profile_thumb">
                                <img
                                  src="assets/img/testimonial/testimonial-2-1.png"
                                  alt="Fixturbo"
                                />
                              </div>
                              <div className="testi-card-profile-details">
                                <h4 className="testi-profile-title">
                                  James Anderson{" "}
                                </h4>
                                <span className="testi-profile-desig">
                                  Software Engineer
                                </span>
                              </div>
                            </div>
                            <p className="testi-card_text">
                              Working with this company has been a game-changer
                              for my business. Their expertise and innovative
                              approach have helped us achieve remarkable
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
                <div className="icon-box">
                  <button className="slick-arrow style3 default testimonial_R-button-next">
                    <i className="fas fa-arrow-left" />
                  </button>
                  <button className="slick-arrow style3 default testimonial_R-button-prev">
                    <i className="fas fa-arrow-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="testimonial-thumb-2">
          <img
            src="assets/img/normal/testimonial-thumb-2-1.png"
            alt="Fixturbo"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientAreaTwo;
