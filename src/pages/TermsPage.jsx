import React, { useEffect, useState } from "react";
import HeaderOne from "../components/HeaderOne";

import FooterAreaOne from "../components/FooterAreaOne";
import Breadcrumb from "../components/Breadcrumb";
import Terms from "../components/Terms";
import Preloader from "../helper/Preloader";

const TermsPage = () => {
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
      <Breadcrumb title={"Terms"} />

      {/* Contact Area */}
      <Terms />

      {/* Footer Area One */}
      <FooterAreaOne />
    </>
  );
};

export default TermsPage;
