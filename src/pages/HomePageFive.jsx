import React, { useEffect, useState } from "react";
import HeaderFour from "../components/HeaderFour";
import HeroFive from "../components/HeroFive";
import ServiceAreaThree from "../components/ServiceAreaThree";
import AboutOne from "../components/AboutOne";
import ServiceAreaFour from "../components/ServiceAreaFour";
import WhyChooseUsTwo from "../components/WhyChooseUsTwo";
import PortfolioThree from "../components/PortfolioThree";
import IntroAreaTwo from "../components/IntroAreaTwo";
import TeamAreaFour from "../components/TeamAreaFour";
import ClientAreaThree from "../components/ClientAreaThree";
import BlogAreaTwo from "../components/BlogAreaTwo";
import FooterAreaThree from "../components/FooterAreaThree";
import Preloader from "../helper/Preloader";

const HomePageFive = () => {
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

      {/* Header Four */}
      <HeaderFour />

      {/* Hero Five */}
      <HeroFive />

      {/* Service Area Three */}
      <ServiceAreaThree />

      {/* About One */}
      <AboutOne />

      {/* Service Area Four */}
      <ServiceAreaFour />

      {/* Why Choose Us Two */}
      <WhyChooseUsTwo />

      {/* Portfolio Three */}
      <PortfolioThree />

      {/* Intro Area Two */}
      <IntroAreaTwo />

      {/* Team Area Four */}
      <TeamAreaFour />

      {/* ClientAreaThree */}
      <ClientAreaThree />

      {/* BlogAreaTwo */}
      <div className="space-top">
        <BlogAreaTwo />
      </div>

      {/* Footer Area Three */}
      <FooterAreaThree />
    </>
  );
};

export default HomePageFive;
