// src/components/HeroSection.jsx
import React from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Environment } from "@react-three/drei";
// import { motion } from "framer-motion";
// import CarModel from "./CarModel";
// import ParticlesBg from "./ParticlesBg";

const HeroSection = () => {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px 60px",
        // backgroundColor: "#ffffff",
        backgroundImage: `url("assets/img/hero/hero_bg.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Background curve */}
       {/* <svg
        viewBox="0 0 350 600"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          zIndex: 0,
        }}
      >
        <path
          d="M800,0 C700,200 600,350 400,450 C200,550 0,400 0,200 C0,0 150,-50 400,0 C650,50 800,-50 800,0 Z"
          fill="#fdf3e7"
        />
      </svg> */}

      {/* Floating particles */}
      {/* <ParticlesBg /> */}

      {/* Left content */}
            <div
        style={{
          flex: "1 1 400px",
          zIndex: 2,
          paddingLeft: "50px",
        }}
      >
         <div className="hero-style3 row">
          <div className="col-md-6">
             <div className="hero-subtitle text-white" data-ani="slideinup" data-ani-delay="0s">
                                <span>
                                  <img src="assets/img/hero/hero_shape_3.png" alt="MyCarBuddy" />
                                  Welcome MyCarBuddy
                                </span>
                              </div>
                              <h1 className="hero-title text-white" data-ani="slideinup" data-ani-delay="0.1s">
                               Premium Car Care at Your Doorstep
                              </h1>
                              <p className="hero-text text-white" data-ani="slideinup" data-ani-delay="0.2s">
                               Hygiene. Shine. Satisfaction. Book our expert service now.
                              </p>
                              <div className="btn-group" data-ani="slideinup" data-ani-delay="0.3s">
                                {/* <Link to="/about" className="btn">
                                  Learn More
                                </Link> */}
                                <div className="call-media-wrap">
                                  <div className="icon">
                                    <img src="/assets/img/icon/phone-1.svg" alt="MyCarBuddy" />
                                  </div>
                                  <div className="media-body">
                                    <h6 className="title text-white">Requesting A Call:</h6>
                                    <h4 className="link">
                                      <a className="text-white" href="tel:9885653865">
                                        +91 98856 53865
                                      </a>
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
            {/* <img src="/assets/img/hero/carwash.png" alt="Car Wash" className="hero-image"  /> */}

          </div>
          </div>
          


                             

      </div>
       
      {/* 3D Car Model */}
       {/* <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                flex: "1 1 400px",
                height: "400px",
                maxWidth: "600px",
                zIndex: 2,
              }}
            >
              <Canvas camera={{ position: [3, 2, 5] }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                <Environment preset="sunset" />
                <OrbitControls enableZoom={false} enableRotate={false} />
                <CarModel />
              </Canvas>
            </motion.div> */}
    </section>
  );
};

export default HeroSection;
