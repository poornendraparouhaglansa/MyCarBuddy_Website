import React, { useState } from 'react';
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";
import CarDamageAnalysis from '../components/CarDamageAnalysis';

const CarDamageAnalysisPage = () => {
  const [showDamageAnalysis, setShowDamageAnalysis] = useState(true);

  return (
    <>
      <HeaderOne />
       <CarDamageAnalysis />
      <FooterAreaOne />
    </>
  );
};

export default CarDamageAnalysisPage;
