import React, { useEffect, useState } from "react";
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";
import Breadcrumb from "../components/Breadcrumb";
import Privacy from "../components/Privacy";
import Preloader from "../helper/Preloader";

const PrivacyPage = () => {
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

      {/* Header one */}
      <HeaderOne />

      {/* Breadcrumb */}
      <Breadcrumb title={"Privacy"} />

      {/* Contact Area */}
      <Privacy />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default PrivacyPage;
