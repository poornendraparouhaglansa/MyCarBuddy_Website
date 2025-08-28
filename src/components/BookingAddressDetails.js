import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  StandaloneSearchBox
} from "@react-google-maps/api";
import Select from "react-select";

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

  const cityOptions = cities.map((city) => ({
  value: city.CityID,
  label: city.CityName,
}));

console.log(cityOptions,'cityOptions');

  

  // Fetch saved addresses
  useEffect(() => {
    console.log(formData.mapLocation.latitude,'sdfsd');
    console.log(formData.mapLocation.longitude,'sdfsd');
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          `${BaseURL}CustomerAddresses/custid?custid=${decryptedCustId || ""}`,
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );

        if(response.data.length > 0){
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
        }

       

      
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
         
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
                lat: formData.mapLocation.latitude
                  ? parseFloat(formData.mapLocation.latitude)
                  : 17.385044,
                lng: formData.mapLocation.longitude
                  ? parseFloat(formData.mapLocation.longitude)
                  : 78.486671,
              }}
            zoom={15}
            onClick={(e) => {
              if (!e || !e.latLng) return;
              handleMapClick(e.latLng.lat(), e.latLng.lng());
            }}
          >
            <Marker
              position={{
                  lat: formData.mapLocation.latitude
                    ? parseFloat(formData.mapLocation.latitude)
                    : 17.385044,
                  lng: formData.mapLocation.longitude
                    ? parseFloat(formData.mapLocation.longitude)
                    : 78.486671,
                }}
            />
          </GoogleMap>

           <div className="mb-3 mt-3">
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

        </>
      )}

      {/* Saved Address Dropdown */}
        {savedAddresses.length > 0 ? (
     <div className="mb-3">
  <label className="form-label fw-semibold">Choose Saved Address</label>

    <select
      className="form-select"
      value={formData.selectedSavedAddressID}
      onChange={handleSavedAddressChange}
      style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
    >
      <option value="">Select Saved Address</option>
      {savedAddresses.map((addr) => {
        const fullAddress = `${addr.address1}, ${addr.cityName}, ${addr.stateName}`;
        const truncated = fullAddress.length > 30 ? fullAddress.slice(0, 30) + "..." : fullAddress;
        return (
          <option key={addr.id} value={addr.id} title={fullAddress}>
            {truncated}
          </option>
        );
      })}
    </select>

</div>
  ) : (
    ""
  )}

      {/* Form Fields */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">State <span className="text-danger">*</span></label>
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
          <label className="form-label fw-semibold">City <span className="text-danger">*</span></label>
          <input
            type="text"
            name="CityName"
            className="form-control"
            placeholder="City"
            value={formData.CityName}
            onChange={handlereInputChange}
            // disabled={!formData.StateID}
          />
          <input type="hidden" name="CityID" value={formData.CityID} />
          {/* <Select
            classNamePrefix="select"
            isSearchable
            placeholder="Select City"
            options={cities.map((c) => ({ value: c.CityID, label: c.CityName }))}
            value={
              cities.find((c) => c.CityID === formData.CityID)
                ? { value: formData.CityID, label: cities.find((c) => c.CityID === formData.CityID).CityName }
                : null
            }
            onChange={(option) =>
              handlereInputChange({
                target: { name: "CityID", value: option ? option.value : "" },
              })
            }
            isDisabled={!formData.StateID}
          /> */}
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Pincode <span className="text-danger">*</span></label>
          <input
            type="text"
            name="pincode"
            className="form-control"
            placeholder="Pincode"
            value={formData.pincode}
            maxLength={6} // Restricts to 6 characters
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
              if (value.length <= 6) {
                handlereInputChange({ target: { name: "pincode", value } });
              }
            }}
          />
        </div>
        <div className="col-md-12 mb-3">
          <label className="form-label fw-semibold">Address <span className="text-danger">*</span></label>
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
