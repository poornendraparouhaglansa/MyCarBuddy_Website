import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  StandaloneSearchBox
} from "@react-google-maps/api";

const libraries = ["places"];
const containerStyle = {
  width: "100%",
  height: "300px",
};

const BookingAddressDetails = ({
  formData,
  setFormData,
  handlereInputChange,
  states,
  cities,
  handleMapClick,
  // setSelectedSavedAddressID
}) => {
  const BaseURL = process.env.REACT_APP_CARBUDDY_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || "";
  const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;
  const bytes = CryptoJS.AES.decrypt(user.id, secretKey);
  const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);

  const [searchBox, setSearchBox] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          `${BaseURL}CustomerAddresses/custid?custid=${decryptedCustId || ""}`,
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );

        const formatted = response.data.map((addr) => ({
          id: addr.AddressID,
          address1: addr.AddressLine1,
          address2: `${addr.AddressLine2 || ""}, ${addr.Pincode}`,
          pincode: addr.Pincode,
          stateId: addr.StateID,
          stateName: addr.StateName,
          cityId: addr.CityID,
          cityName: addr.CityName,
          lat: addr.Latitude,
          lng: addr.Longitude,
        }));

        setSavedAddresses(formatted);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [BaseURL, user?.token]);

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();
    if (places && places.length > 0) {
      const { lat, lng } = places[0].geometry.location;
      handleMapClick(lat(), lng());
    }
  };

  // When user selects saved address → populate form
  const handleSavedAddressChange = (e) => {
    const selectedId = e.target.value;
   

    if (!selectedId){
      setFormData((prev) => ({
        ...prev,
        StateID: "",
        CityID: "",
        pincode: "",
        addressLine1: "",
        selectedSavedAddressID: "",
        mapLocation: {
          latitude: "",
          longitude: "",
        },
      }));
      return;
    };

    const addr = savedAddresses.find((a) => a.id.toString() === selectedId);
    if (addr) {
      setFormData((prev) => ({
        ...prev,
        StateID: addr.stateId,
        CityID: addr.cityId,
        pincode: addr.pincode,
        addressLine1: addr.address1,
        selectedSavedAddressID: selectedId,
        mapLocation: {
          latitude: addr.lat,
          longitude: addr.lng,
        },
      }));

      handleMapClick(addr.lat, addr.lng);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h5 className="mb-3 text-primary fw-bold">📦 Address</h5>

      {/* Map Search + Map */}
      {isLoaded && (
        <>
          <div className="mb-3">
            <StandaloneSearchBox
              onLoad={(ref) => setSearchBox(ref)}
              onPlacesChanged={onPlacesChanged}
            >
              <input
                type="text"
                placeholder="Search for location"
                className="form-control"
              />
            </StandaloneSearchBox>
          </div>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: formData.mapLocation.latitude,
              lng: formData.mapLocation.longitude,
            }}
            zoom={15}
            onClick={(e) => {
              if (!e || !e.latLng) return;
              handleMapClick(e.latLng.lat(), e.latLng.lng());
            }}
          >
            <Marker
              position={{
                lat: formData.mapLocation.latitude,
                lng: formData.mapLocation.longitude,
              }}
            />
          </GoogleMap>
        </>
      )}

      {/* Saved Address Dropdown */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Choose Saved Address</label>
        {savedAddresses.length > 0 ? (
          <select
            className="form-select"
            value={formData.selectedSavedAddressID}
            onChange={handleSavedAddressChange}
          >
            <option value="">Select Saved Address</option>
            {savedAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.address1}, {addr.cityName}, {addr.stateName}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-muted">No addresses are there</div>
        )}
      </div>

      {/* Form Fields */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <select
            className="form-select"
            name="StateID"
            value={formData.StateID}
            onChange={handlereInputChange}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.StateID} value={state.StateID}>
                {state.StateName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <select
            className="form-select"
            name="CityID"
            value={formData.CityID}
            onChange={handlereInputChange}
            disabled={!formData.StateID}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.CityID} value={city.CityID}>
                {city.CityName}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <input
            type="text"
            name="pincode"
            className="form-control"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handlereInputChange}
          />
        </div>
        <div className="col-md-12 mb-3">
          <textarea
            className="form-control"
            name="addressLine1"
            placeholder="Address Line 1"
            rows={1}
            value={formData.addressLine1}
            onChange={handlereInputChange}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default BookingAddressDetails;
