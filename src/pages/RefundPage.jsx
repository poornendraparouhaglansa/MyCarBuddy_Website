import React, { useEffect, useState } from "react";
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";
import Breadcrumb from "../components/Breadcrumb";
import Refund from "../components/Refund";
import Preloader from "../helper/Preloader";

const RefundPage = () => {
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
      <Breadcrumb title={"Refund"} />

      {/* Contact Area */}
      <Refund />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default RefundPage;
