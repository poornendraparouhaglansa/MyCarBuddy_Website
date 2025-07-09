import React, { useEffect, useState } from "react";
import HeaderThree from "../components/HeaderThree";
import HeroFour from "../components/HeroFour";
import ServiceAreaTwo from "../components/ServiceAreaTwo";
import AboutFour from "../components/AboutFour";
import PortfolioTwo from "../components/PortfolioTwo";
import ProcessAreaTwo from "../components/ProcessAreaTwo";
import CTAAreaTwo from "../components/CTAAreaTwo";
import PricingPlanTwo from "../components/PricingPlanTwo";
import ClientAreaThree from "../components/ClientAreaThree";
import FaqAreaTwo from "../components/FaqAreaTwo";
import BlogAreaTwo from "../components/BlogAreaTwo";
import SubscribeOne from "../components/SubscribeOne";
import FooterAreaOne from "../components/FooterAreaOne";
import Preloader from "../helper/Preloader";

const HomePageFour = () => {
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

      {/* Header Three */}
      <HeaderThree />

      {/* Hero Four */}
      <HeroFour />

      {/* Service Area Two */}
      <ServiceAreaTwo />

      {/* About Four */}
      <AboutFour />

      {/* Portfolio Two */}
      <PortfolioTwo />

      {/* Process Area Two */}
      <ProcessAreaTwo />

      {/* CTA Area Two */}
      <CTAAreaTwo />

      {/* Pricing Plan Two */}
      <PricingPlanTwo />

      {/* Client Area three */}
      <ClientAreaThree />

      {/* Faq Area Two */}
      <FaqAreaTwo />

      {/* Blog Area Two */}
      <BlogAreaTwo />

      {/* Subscribe One */}
      <SubscribeOne />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default HomePageFour;
