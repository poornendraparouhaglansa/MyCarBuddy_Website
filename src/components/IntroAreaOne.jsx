import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade } from "swiper";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
const IntroAreaOne = () => {
  return (
    <div
      className="intro-area-2 bg-overlay-2 space-bottom"
      style={{ backgroundImage: "url(assets/img/intro/bg-2.png)" }}
    >
      {/* fact area start */}
      <div className="fact-area">
        <div className="container">
          <div className="row gy-4 justify-content-center">
            <div className="col-lg-3 col-sm-6">
              <div className="single-fact-wrap">
                <div className="thumb">
                  <img src="assets/img/fact/1.png" alt="Fixturbo" />
                </div>
                <div className="details">
                  <h2>
                    <TrackVisibility once>
                      {({ isVisible }) =>
                        isVisible && (
                          <span className="counter-number">
                            <CountUp delay={0} start={0} end={2} />
                            K+
                          </span>
                        )
                      }
                    </TrackVisibility>
                  </h2>
                  <p>Products In Stock</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="single-fact-wrap">
                <div className="thumb">
                  <img src="assets/img/fact/2.png" alt="Fixturbo" />
                </div>
                <div className="details">
                  <h2>
                    <TrackVisibility once>
                      {({ isVisible }) =>
                        isVisible && (
                          <span className="counter-number">
                            <CountUp delay={0} start={0} end={3} />
                            M+
                          </span>
                        )
                      }
                    </TrackVisibility>
                  </h2>
                  <p>Happy Clients</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="single-fact-wrap">
                <div className="thumb">
                  <img src="assets/img/fact/3.png" alt="Fixturbo" />
                </div>
                <div className="details">
                  <h2>
                    <TrackVisibility once>
                      {({ isVisible }) =>
                        isVisible && (
                          <span className="counter-number">
                            <CountUp delay={0} start={0} end={255} />+
                          </span>
                        )
                      }
                    </TrackVisibility>
                  </h2>
                  <p>Professional Exparts</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="single-fact-wrap">
                <div className="thumb">
                  <img src="assets/img/fact/4.png" alt="Fixturbo" />
                </div>
                <div className="details">
                  <h2>
                    <TrackVisibility once>
                      {({ isVisible }) =>
                        isVisible && (
                          <span className="counter-number">
                            <CountUp delay={0} start={0} end={3} />
                            K+
                          </span>
                        )
                      }
                    </TrackVisibility>
                  </h2>
                  <p>Win Awards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* fact area end */}
      {/* intro area start */}
      <div className="container space-top">
        <div className="row global-carousel position-relative arrow-margin">
          <Swiper
            loop={true}
            navigation={{
              nextEl: ".slick-next",
              prevEl: ".slick-prev",
            }}
            spaceBetween={20}
            slidesPerGroup={1}
            speed={1000}
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000 }}
            className="mySwiper"
            modules={[FreeMode, Navigation, Thumbs, EffectFade]}
            breakpoints={{
              0: {
                slidesPerView: 1,
                navigation: false,
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
                <div className="single-intro-wrap">
                  <div className="thumb">
                    <img src="assets/img/intro/4.png" alt="Fixturbo" />
                  </div>
                  <div className="details">
                    <h3>Car Back Light</h3>
                    <p>120 kinds of automobile lights</p>
                    <Link className="btn" to="/shop">
                      Shop Now <i className="ri-arrow-right-line" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="single-intro-wrap">
                  <div className="thumb">
                    <img src="assets/img/intro/5.png" alt="Fixturbo" />
                  </div>
                  <div className="details">
                    <h3>Car Steering Wheel</h3>
                    <p>120 kinds of automobile lights</p>
                    <Link className="btn" to="/shop">
                      Shop Now <i className="ri-arrow-right-line" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="single-intro-wrap style-2">
                  <div className="thumb">
                    <img src="assets/img/intro/6.png" alt="Fixturbo" />
                  </div>
                  <div className="details">
                    <h3>Car Body &amp; Engine</h3>
                    <p>120 kinds of automobile lights</p>
                    <Link className="btn" to="/shop">
                      Shop Now <i className="ri-arrow-right-line" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="single-intro-wrap">
                  <div className="thumb">
                    <img src="assets/img/intro/4.png" alt="Fixturbo" />
                  </div>
                  <div className="details">
                    <h3>Car Back Light</h3>
                    <p>120 kinds of automobile lights</p>
                    <Link className="btn" to="/shop">
                      Shop Now <i className="ri-arrow-right-line" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="single-intro-wrap">
                  <div className="thumb">
                    <img src="assets/img/intro/5.png" alt="Fixturbo" />
                  </div>
                  <div className="details">
                    <h3>Car Steering Wheel</h3>
                    <p>120 kinds of automobile lights</p>
                    <Link className="btn" to="/shop">
                      Shop Now <i className="ri-arrow-right-line" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                <div className="single-intro-wrap style-2">
                  <div className="thumb">
                    <img src="assets/img/intro/6.png" alt="Fixturbo" />
                  </div>
                  <div className="details">
                    <h3>Car Body &amp; Engine</h3>
                    <p>120 kinds of automobile lights</p>
                    <Link className="btn" to="/shop">
                      Shop Now <i className="ri-arrow-right-line" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
          <div className="intro-arrow-button">
            <button type="button" className="slick-next  slick-arrow">
              <i className="fas fa-arrow-right"></i>
            </button>
            <button type="button" className="slick-prev slick-arrow">
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroAreaOne;
