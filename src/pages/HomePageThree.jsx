import React, { useEffect, useRef, useState } from "react";
import HeaderOne from "./../components/HeaderOne";
// import HeaderTwo from "./../components/HeaderTwo";
import FaqAreaTwo from "../components/FaqAreaTwo";
import MarqueeOne from "../components/MarqueeOne";
import CTAAreaOne from "../components/CTAAreaOne";
import TestimonialOne from "../components/TestimonialOne";
import FooterAreaOne from "../components/FooterAreaOne";
// import SubscribeOne from "../components/SubscribeOne";
import Preloader from "../helper/Preloader";
import AboutFour from "../components/AboutFour";
import HeroSection from "../components/HeroSection";
import ChooseCarModal from "../components/ChooseCarModal";
import ServiceAreaTwo from "../components/ServiceAreaTwo";
import ProcessAreaTwo from "../components/ProcessAreaTwo";
import axios from "axios";
import { Helmet } from "react-helmet-async";


const HomePageThree = () => {
  let [active, setActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
   const [seoMeta, setSeoMeta] = useState(null);
  const serviceRef = useRef(null);
  const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;

  // Fetch SEO metadata from API using page_slug=home
  useEffect(() => {
    const fetchSeoData = async () => {

      try {
        const res = await axios.get(
          `${BaseURL}Seometa/page_slug?page_slug=home`
        );
        if (res.data) {
          setSeoMeta(res.data[0]);
        }
      } catch (error) {
        console.error("Error fetching SEO metadata:", error);
      }
    };

    fetchSeoData();
  }, []);

  useEffect(() => {
    setTimeout(() => setActive(false), 2000);
    // const selectedCar = localStorage.getItem("selectedCarType");
    // if (!selectedCar) setShowModal(true);
  }, []);

  useEffect(() => {
    const handleScrollToService = () => {
      if (serviceRef.current) {
        serviceRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("scrollToService", handleScrollToService);

    return () => {
      window.removeEventListener("scrollToService", handleScrollToService);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash === "#services") {
      setTimeout(() => {
        window.dispatchEvent(new Event("scrollToService"));
      }, 300);
    }
  }, []);

  return (
    <>
     {/* ✅ Dynamic SEO Meta Tags */}
      {seoMeta && (
        <Helmet>
          <title>{seoMeta.seo_title || "Home | MyCarBuddy"}</title>
          <meta name="description" content={seoMeta.seo_description || ""} />
          <meta name="keywords" content={seoMeta.seo_keywords || ""} />
        </Helmet>
      )}

      {/* Preloader */}
      {active === true && <Preloader />}

      {/* Header Two */}
      <HeaderOne />

      {/* Hero Three */}
      {/* <HeroThree /> */}
      <HeroSection />
      <ProcessAreaTwo />

      {/* Service Area Two */}
      <div ref={serviceRef}>
        <ServiceAreaTwo />
      </div>

      {/* Choose Car Modal */}
      <ChooseCarModal isVisible={showModal} onClose={() => setShowModal(false)}  />


      {/* Feature Area One */}
      <AboutFour />


      {/* CTA Area One */}
      <CTAAreaOne />

      {/* Faq Area Two */}
      <FaqAreaTwo />

{/* Testimonial One */}
      <TestimonialOne />

      {/* Marquee One */}

      <MarqueeOne />

      {/* TeamAreaThree */}
      {/* <TeamAreaThree /> */}



      

      {/* Blog Area Three */}
      {/* <BlogAreaThree /> */}

      {/* Subscribe One */}
      {/* <SubscribeOne /> */}

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default HomePageThree;
