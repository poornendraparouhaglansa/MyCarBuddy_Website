import React, { useEffect, useState } from "react";
import HeaderFive from "../components/HeaderFive";
import HeroSix from "../components/HeroSix";
import CategoryAreaOne from "../components/CategoryAreaOne";
import ProductAreaOne from "../components/ProductAreaOne";
import CTAAreaTwo from "../components/CTAAreaTwo";
import ProductAreaTwo from "../components/ProductAreaTwo";
import FaqAreaThree from "../components/FaqAreaThree";
import ClientAreaFour from "../components/ClientAreaFour";
import BlogAreaTwo from "../components/BlogAreaTwo";
import SubscribeTwo from "../components/SubscribeTwo";
import FooterAreaFour from "../components/FooterAreaFour";
import Preloader from "../helper/Preloader";

const HomePageSix = () => {
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

      {/* Header Five */}
      <HeaderFive />

      {/* Hero Six */}
      <HeroSix />

      {/* Category Area One */}
      <CategoryAreaOne />

      {/* Product Area One */}
      <ProductAreaOne />

      {/* CTA Area Two */}
      <CTAAreaTwo />

      {/* Product Area Two */}
      <ProductAreaTwo />

      {/* Faq Area three */}
      <FaqAreaThree />

      {/* Client Area Four */}
      <ClientAreaFour />

      {/* Blog Area Two */}
      <div className="space-top">
        <BlogAreaTwo />
      </div>

      {/* Subscribe Two */}
      <SubscribeTwo />

      {/* Footer Area Four */}
      <FooterAreaFour />
    </>
  );
};

export default HomePageSix;
