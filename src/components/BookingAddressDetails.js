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
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const cityInputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const cityOptions = cities
    .map((city) => ({
      value: city.CityID,
      label: city.CityName,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

console.log(cityOptions,'cityOptions');

  // Get current location and update form fields
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Update map location in formData
          setFormData((prev) => ({
            ...prev,
            mapLocation: {
              latitude: lat,
              longitude: lng,
            },
          }));

          // Reverse geocode to get address details
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const addressComponents = data.results[0].address_components;

              const cityComp = addressComponents.find((c) =>
                c.types.includes("locality")
              );
              const stateComp = addressComponents.find((c) =>
                c.types.includes("administrative_area_level_1")
              );
              const postalCodeComp = addressComponents.find((c) =>
                c.types.includes("postal_code")
              );
              const streetComp = addressComponents.find((c) =>
                c.types.includes("route")
              );

              setFormData((prev) => ({
                ...prev,
                CityName: cityComp ? cityComp.long_name : "",
                StateID: stateComp ? prev.StateID : "",
                pincode: postalCodeComp ? postalCodeComp.long_name : "",
                addressLine1: streetComp ? streetComp.long_name : "",
              }));

              // Optionally, you can update StateID by matching with states list
              if (stateComp) {
                const matchedState = states.find(
                  (s) =>
                    s.StateName.replace(/\s+/g, "").toLowerCase() ===
                    stateComp.long_name.replace(/\s+/g, "").toLowerCase()
                );
                if (matchedState) {
                  setFormData((prev) => ({
                    ...prev,
                    StateID: matchedState.StateID,
                  }));
                }
              }
            }
          } catch (error) {
            console.error("Error reverse geocoding current location:", error);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, [setFormData, states]);

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
              floorNumber: addr.FloorNumber || "",
              area: addr.Area || "",
            }));
          setSavedAddresses(formatted);
        }






      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [BaseURL, user?.token]);


  // Filter cities based on user input
  useEffect(() => {
    if (formData.CityName && formData.CityName.length > 0) {
      const filtered = cities.filter((city) =>
        city.CityName.toLowerCase().includes(formData.CityName.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setFilteredCities([]);
      setShowCitySuggestions(false);
    }
  }, [formData.CityName, cities]);

  // Handle city selection from dropdown
  const handleCitySelect = (city) => {
    setFormData((prev) => ({
      ...prev,
      CityName: city.CityName,
      CityID: city.CityID,
    }));
    setShowCitySuggestions(false);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target)) {
        setShowCitySuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        floorNumber: "",
        area: "",
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
        floorNumber: addr.floorNumber || "",
        area: addr.area || "",
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
          <Select
            name="CityID"
            value={formData.CityID ? cityOptions.find(option => option.value.toString() === formData.CityID.toString()) : null}
            onChange={(selectedOption) => {
              const selectedCity = cities.find(c => c.CityID.toString() === selectedOption?.value?.toString());
              handlereInputChange({
                target: {
                  name: "CityID",
                  value: selectedOption?.value || ""
                }
              });
              // Also update CityName
              if (selectedCity) {
                setFormData(prev => ({
                  ...prev,
                  CityName: selectedCity.CityName
                }));
              }
            }}
            options={cityOptions}
            isDisabled={!formData.StateID}
            placeholder="Select City"
            isSearchable={true}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (provided, state) => ({
                ...provided,
                border: '1px solid #ced4da',
                borderRadius: '0.375rem',
                minHeight: '38px',
                height: '38px',
                fontSize: '14px',
                '&:hover': {
                  borderColor: '#adb5bd'
                },
                boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' : provided.boxShadow,
                borderColor: state.isFocused ? '#80bdff' : provided.borderColor
              }),
              valueContainer: (provided) => ({
                ...provided,
                height: '36px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
              }),
              input: (provided) => ({
                ...provided,
                margin: '0px',
                padding: '0px',
              }),
              placeholder: (provided) => ({
                ...provided,
                color: '#6c757d',
                margin: '0px',
                fontSize: '14px',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: '#495057',
                margin: '0px',
                fontSize: '14px',
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                height: '36px',
              }),
              indicatorSeparator: (provided) => ({
                ...provided,
                display: 'none',
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                padding: '8px',
              })
            }}
          />
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
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Floor Number</label>
          <input
            type="text"
            name="floorNumber"
            className="form-control"
            placeholder="e.g., Ground Floor, 1st Floor, 2nd Floor"
            value={formData.floorNumber}
            onChange={handlereInputChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Area</label>
          <input
            type="text"
            name="area"
            className="form-control"
            placeholder="e.g., Banjara Hills, Jubilee Hills, HITEC City"
            value={formData.area}
            onChange={handlereInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingAddressDetails;
