import React, { useEffect, useState } from "react";
import HeaderOne from "./../components/HeaderOne";
import HeroThree from "../components/HeroThree";
import FeatureAreaOne from "../components/FeatureAreaOne";
import AboutThree from "../components/AboutThree";
import IntroAreaOne from "../components/IntroAreaOne";
import ServiceAreaOne from "../components/ServiceAreaOne";
import PortfolioTwo from "../components/PortfolioTwo";
import FaqAreaTwo from "../components/FaqAreaTwo";
import MarqueeOne from "../components/MarqueeOne";
import TeamAreaThree from "../components/TeamAreaThree";
import CTAAreaOne from "../components/CTAAreaOne";
import TestimonialOne from "../components/TestimonialOne";
import BlogAreaThree from "../components/BlogAreaThree";
import FooterAreaOne from "../components/FooterAreaOne";
import SubscribeOne from "../components/SubscribeOne";
import Preloader from "../helper/Preloader";
import AboutFour from "../components/AboutFour";
import HeroFive from "../components/HeroFive";
import HeroSection from "../components/HeroSection";
import ChooseCarModal from "../components/ChooseCarModal";
import ServiceAreaTwo from "../components/ServiceAreaTwo";


const HomePageThree = () => {
  let [active, setActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
useEffect(() => {
    setTimeout(() => setActive(false), 2000);

    const selectedCar = localStorage.getItem("selectedCarType");
    if (!selectedCar) setShowModal(true);
  }, []);
  return (
    <>
      {/* Preloader */}
      {active === true && <Preloader />}

      {/* Header Two */}
      <HeaderOne />

      {/* Hero Three */}
      {/* <HeroThree /> */}
      <HeroSection/>

       {/* Service Area Two */}
      <ServiceAreaTwo />

      {/* Choose Car Modal */}
      <ChooseCarModal isVisible={showModal} onClose={() => setShowModal(false)} />

        {/* Reopen button */}
      {!showModal && (
        <button
  style={{
    position: "fixed",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 998,
    padding: "10px 0px",
    borderRadius: "8px 0 0 8px",
    background: "#ed1c24",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    writingMode: "vertical-rl", // Note: camelCase in inline styles
    textOrientation: "mixed",   // Also camelCase
  }}
  onClick={() => setShowModal(true)}
>
  Choose Car
</button>

      )}


      {/* Feature Area One */}
       <AboutFour />

       
       {/* CTA Area One */}
      <CTAAreaOne />

      {/* About Three */}
      {/* <AboutThree /> */}

      {/* Intro Area One */}
      {/* <IntroAreaOne /> */}

      {/* Service Area One */}
      {/* <ServiceAreaOne /> */}


      {/* Portfolio Two */}
      {/* <PortfolioTwo /> */}

      {/* Faq Area Two */}
      <FaqAreaTwo />

      {/* Marquee One */}

      <MarqueeOne />

      {/* TeamAreaThree */}
      {/* <TeamAreaThree /> */}

     

      {/* Testimonial One */}
      <TestimonialOne />

      {/* Blog Area Three */}
      {/* <BlogAreaThree /> */}

      {/* Subscribe One */}
      <SubscribeOne />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default HomePageThree;
