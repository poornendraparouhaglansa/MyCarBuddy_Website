import React, { useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

const AddressTab = ({ custID = 0 }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
       const user = JSON.parse(localStorage.getItem("user")) || {};
     const token = user?.token || "";
      const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;
      const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;
      const bytes = CryptoJS.AES.decrypt(user.id, secretKey);
      const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);

  useEffect(() => {
  
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          `${BaseURL}CustomerAddresses/custid?custid=${decryptedCustId || ''}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        const formatted = response.data.map((addr) => ({
          id: addr.AddressID,
          name: "Saved Address",
          phone: "", // API doesn't include phone, use empty or attach if available
          address1: addr.AddressLine1,
          address2: `${addr.AddressLine2 || ""}, ${addr.Pincode}`,
          isPrimary: addr.IsPrimary,
          lat: addr.Latitude,
          lng: addr.Longitude,
        }));

        setAddresses(formatted);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [decryptedCustId]);

  const handleSetPrimary = async (id) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_CARBUDDY_BASE_URL}CustomerAddresses/primary-address?AddressId=${id}&CustId=${decryptedCustId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isPrimary: addr.id === id,
      }));
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error setting primary address:", error);
    }
  };    

  const handleBack = () => {
    setSelectedAddress(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">📍 Your Addresses</h5>
      </div>

      {!selectedAddress ? (
        <div className="row">
          {addresses.map((addr) => (
            <div key={addr.id} className="col-md-6 mb-4">
              <div
                className={`card h-100 shadow-sm border-0 ${
                  addr.isPrimary ? "bg-light border-start border-danger border-3" : ""
                }`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{addr.name}</h6>
                      <small className="text-muted">{addr.phone}</small>
                    </div>
                    <div className="text-end">
                        <i
                           className={`bi ${addr.isPrimary ? "bi-star-fill bg-warning text-white" : "bi-star"} fs-6 me-2 p-1 rounded-circle`}
                          role="button"
                          onClick={() => handleSetPrimary(addr.id)}
                          title="Set as Primary"
                        ></i>
                      <i
                        className="bi bi-eye text-primary fs-5 me-2"
                        role="button"
                        onClick={() => setSelectedAddress(addr)}
                        title="View"
                      ></i>
                      {/* <i className="bi bi-pencil text-secondary fs-5 me-2" role="button" title="Edit"></i> */}
                      <i className="bi bi-trash text-danger fs-5" role="button" title="Delete"></i>
                    </div>
                  </div>
                  <hr />
                  <p className="mb-1">{addr.address1}</p>
                  <p className="mb-0">{addr.address2}</p>
                  {/* {addr.isPrimary && (
                    <span className="badge bg-danger mt-2">Primary</span>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-4 shadow-sm ">
           <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-outline-secondary px-3 py-1" onClick={handleBack}>
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>
          <h5 className="mb-2">{selectedAddress.name}</h5>
          <p className="mb-1">📞 {selectedAddress.phone}</p>
          <p className="mb-1">🏠 {selectedAddress.address1}</p>
          <p className="mb-3">📍 {selectedAddress.address2}</p>
          <div className="ratio ratio-16x9 rounded overflow-hidden border">
            <iframe
              src={`https://maps.google.com/maps?q=${selectedAddress.lat},${selectedAddress.lng}&z=15&output=embed`}
              allowFullScreen
              loading="lazy"
              title="Google Map"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressTab;
