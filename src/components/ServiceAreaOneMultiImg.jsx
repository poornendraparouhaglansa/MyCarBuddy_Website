import React from "react";
import { Link } from "react-router-dom";
import ServiceAreaTwo from "./ServiceAreaTwo";

const ServiceAreaOneMultiImg = () => {
  return (
    <div className="service-area-1 space overflow-hidden">
      <div className="container">
        <div className="row gy-4 justify-content-center">
          <ServiceAreaTwo />
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaOneMultiImg;
