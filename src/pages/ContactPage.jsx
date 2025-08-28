import React, { useEffect, useState } from "react";
import HeaderOne from "../components/HeaderOne";

import FooterAreaOne from "../components/FooterAreaOne";
import Breadcrumb from "../components/Breadcrumb";
import SubscribeOne from "../components/SubscribeOne";
import ContactArea from "../components/ContactArea";
import Preloader from "../helper/Preloader";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  let [active, setActive] = useState(true);
    const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;
    const [seoMeta, setSeoMeta] = useState(null);

      useEffect(() => {
    const fetchSeoData = async () => {

      try {
        const res = await axios.get(
          `${BaseURL}Seometa/page_slug?page_slug=contact`
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
    setTimeout(function () {
      setActive(false);
    }, 2000);
  }, []);
  return (
    <>
     {/* Dynamic SEO Meta Tags */}
              {seoMeta && (
                <Helmet>
                  <title>{seoMeta.seo_title || "Contact | MyCarBuddy"}</title>
                  <meta name="description" content={seoMeta.seo_description || ""} />
                  <meta name="keywords" content={seoMeta.seo_keywords || ""} />
                </Helmet>
              )}
      {/* Preloader */}
      {active === true && <Preloader />}

      {/* Header one */}
      <HeaderOne />

      {/* Breadcrumb */}
      <Breadcrumb title={"Contact"} />

      {/* Contact Area */}
      <ContactArea />

      {/* Subscribe One */}
      {/* <SubscribeOne /> */}

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default ContactPage;
