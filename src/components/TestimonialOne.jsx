import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs, EffectFade, Autoplay } from "swiper";
const TestimonialOne = () => {
  return (
    <div
      className="testimonial-area-1 overflow-hidden pt-2"
      style={{ backgroundImage: "url(assets/img/bg/testimonial-bg1-1.png)" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="space">
              <div className="title-area">
                <span className="sub-title">Clients testimonial</span>

                <h2 className="sec-title text-white">
                  Car Repair The Best Services
                </h2>
              </div>
              <div className="row global-carousel testi-slider-1">
                <Swiper
                  loop={true}
                  navigation={{
                    nextEl: ".testimonialOne-button-next",
                    prevEl: ".testimonialOne-button-prev",
                  }}
                  spaceBetween={20}
                  slidesPerGroup={1}
                  speed={1000}
                  autoplay={{ delay: 6000 }}
                  pagination={true}
                  className="mySwiper"
                  modules={[FreeMode, Navigation, Thumbs, EffectFade, Autoplay]}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                    },
                    500: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 1,
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
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                                Ravi Kumar
                              </h4>
                              <span className="testi-profile-desig">
                                IT Professional
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src="assets/img/icon/quote1-1.svg"
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                           I went for an oil change at My Car Buddy and the service was super smooth. 
                           The team explained which oil would be best for my car and finished the work quickly. 
                           I could feel the difference in performance right after driving out. Great experience overall.

                          </p>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => {
                              const fillColor = i < 4 ? "#ffc107" : "#e4e5e9";
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: fillColor }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                               Priya Reddy
                              </h4>
                              <span className="testi-profile-desig">
                                College Student
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src="assets/img/icon/quote1-1.svg"
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                            I usually don’t bother with fancy car washes, but My Car Buddy was worth it. 
                            They cleaned every corner, including the seats and dashboard. My car looked shiny on the outside and smelled fresh inside. 
                            Definitely recommending them to my friends.
                          </p>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => {
                              const fillColor = i < 4 ? "#ffc107" : "#e4e5e9";
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: fillColor }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                                Sandeep Varma
                              </h4>
                              <span className="testi-profile-desig">
                               Businessman
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src="assets/img/icon/quote1-1.svg"
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                            My Swift had an ugly dent on the left door. 
                            The technicians at My Car Buddy repaired it so neatly that you can’t even tell there was damage. 
                            The paint finish is excellent and matches the rest of the car perfectly. 
                            I’m impressed with their attention to detail.
                          </p>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => {
                              const fillColor = i < 5 ? "#ffc107" : "#e4e5e9";
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: fillColor }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  
                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                                Meghana
                              </h4>
                              <span className="testi-profile-desig">
                                Homemaker
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src="assets/img/icon/quote1-1.svg"
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                            I spend a lot of time in my car, so the interiors had become messy. 
                            After My Car Buddy’s deep cleaning service, the seats and floor mats looked spotless. 
                            Even the coffee stains were gone and the car smelled fresh. 
                            It felt like stepping into a new car again.

                          </p>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => {
                              const fillColor = i < 4 ? "#ffc107" : "#e4e5e9";
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: fillColor }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>

                   <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                               Anjali Sharma
                              </h4>
                              <span className="testi-profile-desig">
                                Teacher
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src="assets/img/icon/quote1-1.svg"
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                           Went in for a regular check-up at My Car Buddy and I liked how professional the staff was. 
                           They inspected everything carefully and told me exactly what needed attention. 
                           No unnecessary repairs were suggested, which gave me confidence in their honesty. 
                           I’ll be going back for sure.


                          </p>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => {
                              const fillColor = i < 4 ? "#ffc107" : "#e4e5e9";
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: fillColor }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  
                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                               Naveen
                              </h4>
                              <span className="testi-profile-desig">
                                Marketing Executive
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src="assets/img/icon/quote1-1.svg"
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                            Got both oil and filters changed at My Car Buddy in under an hour. 
                            They used good quality parts and explained how often I should replace them. 
                            My car’s engine runs smoother now and I noticed a slight improvement in mileage too. 
                            Very satisfied with their service.

                          </p>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => {
                              const fillColor = i < 4 ? "#ffc107" : "#e4e5e9";
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: fillColor }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                                Arjun
                              </h4>
                              <span className="testi-profile-desig">
                              Software Engineer
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src="assets/img/icon/quote1-1.svg"
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                            My car broke down suddenly while going to work, and I was stressed. 
                            Called My Car Buddy and they arrived quickly. 
                            They diagnosed the issue on the spot and fixed it, saving me from towing hassles. 
                            Really thankful for their quick and professional help.

                          </p>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => {
                              const fillColor = i < 5 ? "#ffc107" : "#e4e5e9";
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: fillColor }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  
                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                                Divya
                              </h4>
                              <span className="testi-profile-desig">
                                MBA Student
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src="assets/img/icon/quote1-1.svg"
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                            Booked the full service package at My Car Buddy, which included oil change, car wash, and a few minor repairs. 
                            Everything was done neatly and on time. My car now feels brand new—smooth drive, shiny look, and fresh interiors. 
                            Truly value for money service.

                          </p>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => {
                              const fillColor = i < 4 ? "#ffc107" : "#e4e5e9";
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: fillColor }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                                Kiran Rao
                              </h4>
                              <span className="testi-profile-desig">
                                Software Developer
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src="assets/img/icon/quote1-1.svg"
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                            I usually don’t have time to take my car to the garage for cleaning because of my busy schedule. 
                            My Car Buddy’s doorstep car wash was a lifesaver—they came home, cleaned everything thoroughly, and my car looked spotless. 
                            Super convenient and totally worth it!"

                          </p>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => {
                              const fillColor = i < 4 ? "#ffc107" : "#e4e5e9";
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: fillColor }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div>
                      <div className="testi-card">
                        <div className="testi-card_content">
                          <div className="testi-card-profile">
                            <div className="testi-card-profile-details">
                              <h4 className="testi-profile-title">
                                Manoj
                              </h4>
                              <span className="testi-profile-desig">
                               Business Traveler
                              </span>
                            </div>
                            <div className="quote-icon">
                              <img
                                src="assets/img/icon/quote1-1.svg"
                                alt="Fixturbo"
                              />
                            </div>
                          </div>
                          <p className="testi-card_text">
                           My car broke down while I was returning from out of the city, and there were no service stations nearby.
                            I immediately opened the My Car Buddy app and booked roadside service. 
                            Their team reached quickly and fixed the issue—such an amazing service, truly a lifesaver when you’re stuck!"

                          </p>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => {
                              const fillColor = i < 4 ? "#ffc107" : "#e4e5e9";
                              return (
                                <i
                                  key={i}
                                  className="fas fa-star"
                                  style={{ color: fillColor }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>

                <div className="testimonialOne arrow">
                  <div className=" testimonialOne-button-next testimonialOne-button">
                    <i className="fas fa-arrow-left"></i>
                  </div>
                  <div className=" testimonialOne-button-prev testimonialOne-button">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialOne;
