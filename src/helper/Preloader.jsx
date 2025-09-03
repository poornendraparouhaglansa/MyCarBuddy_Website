import React from "react";

const Preloader = () => {
  return (
    <>
      {/* Preloader Start*/}
      <div className="preloader ">
        <div className="preloader-inner">
          {/* <span className="loader" /> */}
          {/* add loader gif */}
          <img src="assets/img/loader.gif" alt="loader" />
        </div>
      </div>
    </>
  );
};

export default Preloader;
