import React from 'react';
import { Link } from 'react-router-dom';
import HeaderOne from "../components/HeaderOne";
import FooterAreaOne from "../components/FooterAreaOne";

const NotFoundPage = () => {
  return (
    <>
      <HeaderOne />
      <main className="container" style={{ minHeight: '50vh' }}>
        <div className="row justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="col-md-8 text-center">
            <h1 className="display-5 mb-3">404 - Page Not Found</h1>
            <p className="text-muted mb-4">The page you are looking for doesn’t exist or was moved.</p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/" className="btn btn-primary px-4 py-3">Go Home</Link>
              <Link to="/service" className="btn btn-outline-primary px-4 py-3">Browse Services</Link>
            </div>
          </div>
        </div>
      </main>
      <FooterAreaOne />
    </>
  );
};

export default NotFoundPage;
