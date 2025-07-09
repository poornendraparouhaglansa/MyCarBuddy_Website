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

const HomePageThree = () => {
  let [active, setActive] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);
  return (
    <>
      {/* Preloader */}
      {active === true && <Preloader />}

      {/* Header Two */}
      <HeaderOne />

      {/* Hero Three */}
      <HeroThree />

      {/* Feature Area One */}
      <FeatureAreaOne />

      {/* About Three */}
      <AboutThree />

      {/* Intro Area One */}
      <IntroAreaOne />

      {/* Service Area One */}
      <ServiceAreaOne />

      {/* Portfolio Two */}
      <PortfolioTwo />

      {/* Faq Area Two */}
      <FaqAreaTwo />

      {/* Marquee One */}

      <MarqueeOne />

      {/* TeamAreaThree */}
      <TeamAreaThree />

      {/* CTA Area One */}
      <CTAAreaOne />

      {/* Testimonial One */}
      <TestimonialOne />

      {/* Blog Area Three */}
      <BlogAreaThree />

      {/* Subscribe One */}
      <SubscribeOne />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default HomePageThree;
