import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import WeeklyCalendar from "./WeeklyCalender";
import { format } from "date-fns";
import { useAlert } from "../context/AlertContext";
import axios from "axios";
import SuccessFailureModal from "./SuccessFailureModal";
import BookingVehicleDetails from "./BookingVehicleDetails";
import BookingAddressDetails from "./BookingAddressDetails";
import CryptoJS from "crypto-js";



const SelectTimeSlotPage = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_CARBUDDY_BASE_URL;
  const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;
  const location = JSON.parse(localStorage.getItem("location")) || '{"lat": 17.385044, "lng": 78.486671}';
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || "";
    const bytes = CryptoJS.AES.decrypt(user.id, secretKey);
    const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);
    const { cartItems, clearCart } = useCart();
      cartItems.length === 0 && navigate("/cart");
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    isBookingForOthers: false,
    othersFullName: "",
    othersPhoneNumber: "",
    pincode: "",
    StateID: "",
    CityID: "",
    addressLine1: "",
    addressLine2: "",
    technicianNote: "",
    couponApplied: false,
    discountAmount: '', // example value
    appliedCouponCode: "",
    paymentMethod: "razorpay",
    savedAddresses: [],
    mapLocation: {
      latitude: location.latitude, // Default to Hyderabad
      longitude: location.longitude,
    },
    registrationNumber: "",
    yearOfPurchase: "",
  engineType: "",
  kilometerDriven: "",
  transmissionType: "",
   brandID: "",
  modelID: "",
  fuelTypeID: "",
  VehicleID: "",
});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [dateTouched, setDateTouched] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");

const [appliedCoupon, setAppliedCoupon] = useState(null); // Stores selected coupon
const [couponApplied, setCouponApplied] = useState(false); // Tracks applied status
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [modal, setModal] = useState({ show: false, type: "", message: "" });
  const addressRef = useRef(null);
  const paymentRef = useRef(null);

  const [pincode, setPincode] = useState("");


  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState("");

  // Saved Address
  const [selectedSavedAddressID, setSelectedSavedAddressID] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]); 
 

  const [showCalendar, setShowCalendar] = useState(true);

  const { showAlert } = useAlert();


useEffect(() => {
  if (selectedDate) {
    fetchTimeSlots(selectedDate);
  }
}, [selectedDate]);

    useEffect(() => {
      fetchCustomerDetails();
      const fetchStates = async () => {
        try {
          const response = await axios.get(`${baseUrl}State`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const activeStates = response.data.filter((s) => s.IsActive);
          setStates(activeStates);
        } catch (err) {
          console.error("Error fetching states:", err);
        }
      };

      fetchStates();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
     
      try {
        const response = await axios.get(`${baseUrl}City`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredCities = response.data.filter(
          (c) => c.StateID === parseInt(formData.StateID) && c.IsActive
        );
        setCities(filteredCities);
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };

    fetchCities();
  }, [formData.StateID , selectedState]);

  
  useEffect(() => {
    // handleMapClick(formData.mapLocation.latitude, formData.mapLocation.longitude);
    
    const car = localStorage.getItem("selectedCarDetails");
    if (car) {

      if(JSON.parse(car).VehicleID){
        try {
            const res = axios.get(`${baseUrl}CustomerVehicles/CustVehicleId?CustVehicleId=${JSON.parse(car).VehicleID}`);
          res.then((response) => {
            setSelectedVehicle(response.data);
            console.log("Selected :", response.data[0].TransmissionType);
            setFormData((prev) => ({
              ...prev,
              brandID: response.data[0].BrandID,
              modelID: response.data[0].ModelID,
              fuelTypeID: response.data[0].FuelTypeID,
              VehicleID: JSON.parse(car).VehicleID,
              registrationNumber: response.data[0].VehicleNumber,
              yearOfPurchase: response.data[0].YearOfPurchase,
              engineType: response.data[0].EngineType,
              kilometerDriven: response.data[0].KilometersDriven,
              transmissionType: response.data[0].TransmissionType
            }));
          });
          console.log("Selected fon:", formData);
        } catch (error) {
          console.error("Error fetching vehicle details:", error);
        }
      }else{
        setSelectedVehicle(JSON.parse(car));
        setFormData((prev) => ({
          ...prev,
          brandID: JSON.parse(car).brand.id,
          modelID: JSON.parse(car).model.id,
          fuelTypeID: JSON.parse(car).fuel.id,
          VehicleID: JSON.parse(car).VehicleID ? JSON.parse(car).VehicleID : "",
        }))
      }
      // setSelectedVehicle(JSON.parse(car));
      // setFormData((prev) => ({
      //   ...prev,
      //   brandID: JSON.parse(car).brand.id,
      //   modelID: JSON.parse(car).model.id,
      //   fuelTypeID: JSON.parse(car).fuel.id,
      //   VehicleID: JSON.parse(car).VehicleID ? JSON.parse(car).VehicleID : "",
      // }))
    }
    console.log("Selected Vehicle:", selectedVehicle);
  }, []);

  

const handleMapClick = async (lat, lng) => {

  const result = await reverseGeocode(lat, lng);
  console.log("Reverse Geocode Result", result);

  const stateName = result?.state?.toLowerCase?.();
  const cityName = result?.city?.toLowerCase?.();

  const matchedState = states.find(
    (s) => s.StateName?.replace(/\s+/g, '').toLowerCase() === stateName
  );
  const matchedCity = cities.find(
    (c) => c.CityName?.replace(/\s+/g, '').toLowerCase() === cityName
  );

   if (!matchedState) {
    // alert("Service is not available in your selected location.");
    return;
  }

  setFormData((prev) => ({
    ...prev,
    StateID: matchedState?.StateID || "",
    CityID: matchedCity?.CityID || "",
    pincode: result?.postalCode || "",
    addressLine1: result?.address || "",
    mapLocation: { latitude : lat, longitude : lng },
  }));

  if (matchedState) setSelectedState(matchedState.StateID);
  if (matchedCity) setSelectedCity(matchedCity.CityID);
  if (result?.postalCode) setPincode(result.postalCode);
  if (result?.address) setAddressLine1(result.address);
};



  const handleModalClose = () => {
    setModal({ show: false, type: "", message: "" });
    if (modal.type === "success") {
      navigate("/profile?tab=mybookings");
    }
  };

  const [morningSlots, setMorningSlots] = useState([]);
  const [afternoonSlots, setAfternoonSlots] = useState([]);
  const [eveningSlots, setEveningSlots] = useState([]);

  const isToday =
    format(new Date(), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

  const totalAmount = cartItems.reduce((sum, i) => sum + i.price, 0);

  const getBookingDateTime = () => {
    const [startTime] = selectedTime.split(" - "); // e.g., "3"
    const hour = parseInt(startTime);
    const isPM = selectedTime.includes("PM");
    const hour24 = isPM && hour !== 12 ? hour + 12 : hour;

    const combinedDate = new Date(selectedDate);
    combinedDate.setHours(hour24, 0, 0, 0);

    return format(combinedDate, "yyyy-MM-dd");
  };


const handlereInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  
  if (name === "StateID") {
   
    // Reset addressLine1 when state is changed
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
        addressLine1: "", // clear address
        pincode: "",
      };
    });
  }



  setFormData((prev) => {
    const updatedForm = {
      ...prev,
      [name]: type === "checkbox" ? checked : value, // ✅ correct handling
    };


      if(name === "CityID" || name === "pincode" || name === "addressLine1" || name === "mapLocation" || name === "StateID"){
        updateMapFromAddress(updatedForm); // trigger map update
      }
    return updatedForm;
  });
};

const updateMapFromAddress = async (form) => {
  const { addressLine1, pincode, CityID, StateID } = form;

  const city = cities.find(c => c.CityID === parseInt(CityID));
  const state = states.find(s => s.StateID === parseInt(StateID));

  const fullAddress = `${addressLine1 || ""}, ${pincode || ""}, ${city?.CityName?.replace(/\s+/g, '').toLowerCase() || ""}, ${state?.StateName?.replace(/\s+/g, '').toLowerCase() || ""}`;


  if (!fullAddress.trim()) return;
  console.log(fullAddress);

  try {
    const res = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: fullAddress,
        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      },
    });

    if (res.data.results && res.data.results[0]) {
      const { lat, lng } = res.data.results[0].geometry.location;
      console.log("Geocoded coordinates:", res.data.results[0]);
      setFormData((prev) => ({
        ...prev,
        mapLocation: { latitude: lat, longitude: lng },
      }));  
      // handleMapClick(lat, lng);
    }
  } catch (err) {
    console.error("Geocoding failed:", err);
  }
};


const fetchTimeSlots = async (selectedDate) => {
  try {
    const response = await axios.get(`${baseUrl}TimeSlot`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const timeSlots = response.data;

    // Filter active slots and sort by StartTime
    const sortedSlots = (timeSlots || [])
      .filter(slot => slot?.Status === true)
      .sort((a, b) => a.StartTime.localeCompare(b.StartTime));

    const categorized = {
      morning: [],
      afternoon: [],
      evening: [],
    };

    const now = new Date();
    const isToday =
      selectedDate &&
      new Date(selectedDate).toDateString() === now.toDateString();

    sortedSlots.forEach(({ StartTime, EndTime }) => {
      const [startHour, startMinute] = StartTime.split(":").map(Number);
      const [endHour, endMinute] = EndTime.split(":").map(Number);

      const startDate = new Date(selectedDate);
      startDate.setHours(startHour, startMinute, 0, 0);

      const endDate = new Date(selectedDate);
      endDate.setHours(endHour, endMinute, 0, 0);

      const isExpired = isToday && endDate <= now;

      const timeFormat = (date) =>
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

      const formatted = {
        label: `${timeFormat(startDate)} - ${timeFormat(endDate)}`,
        disabled: isExpired,
      };

      if (startHour < 12) {
        categorized.morning.push(formatted);
      } else if (startHour < 16) {
        categorized.afternoon.push(formatted);
      } else {
        categorized.evening.push(formatted);
      }
    });

    setMorningSlots(categorized.morning);
    setAfternoonSlots(categorized.afternoon);
    setEveningSlots(categorized.evening);
  } catch (err) {
    console.error("Error fetching time slots:", err);
  }
};


const fetchCustomerDetails = async () => {
   
    try {
        const response = await axios.get(
            `${baseUrl}Customer/Id?Id=${decryptedCustId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const customer = response.data[0] || {};
        setFormData((prev) => ({
            ...prev,
            fullName: customer.FullName || "",
            phone: customer.PhoneNumber || "",
            email: customer.Email || "",
        }));

    } catch (err) {
        console.error("Error fetching customer details:", err);
    }
};



  const handleContinue = async () => {
    console.log(formData);
    if (!selectedDate || !selectedTime) {
      showAlert("Please select a date and time slot.");
      return;
    }

    if (!formData.CityID || !formData.StateID || !formData.addressLine1.trim()) {
      showAlert("Please complete the address (state, city, and address).");
      return;
    }


    const payload = {
      custID: decryptedCustId,
      addressLine1: formData.addressLine1,
      addressLine2: '',
      stateID: Number(formData.StateID),
      cityID: Number(formData.CityID),
      pincode: formData.pincode,
      latitude: formData.mapLocation.latitude,
      longitude: formData.mapLocation.longitude,
      isDefault: true,
      createdBy: 1,
      isActive: true,
    };

    try {
      const res = await axios.post(`${baseUrl}CustomerAddresses`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        showAlert("success", "Address saved successfully!", 3000, "success");
        setShowCheckout(true);
        setTimeout(() => {
          paymentRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        showAlert("Failed to save address. Please try again.");
      }
    } catch (error) {
      console.error("Address save error:", error);
      showAlert("Error saving address. Please try again.");
    }
  };



  const loadRazorpay = (amount , data) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: amount * 100,
      currency: "INR",
      name: "MyCarBuddy",
      order_id: data.razorpay.orderID,
      description: "Payment for Car Services",
      image: "/assets/img/logo-yellow-01.png",
      handler: function (response) {
        console.log("Payment success:", response);
        clearCart();
        const res = axios.post(`${baseUrl}Bookings/confirm-Payment`, {
          bookingID : data.bookingID,
          amountPaid : amount,
          razorpayPaymentId : response.razorpay_payment_id,
          razorpaySignature : response.razorpay_signature,
          razorpayOrderId : response.razorpay_order_id
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if(res.success){
          setModal({
            show: true,
            type: "success",
            message: "Payment was successful.",
          });
        }
        else{
          setModal({
            show: true,
            type: "error",
            message: "Payment was cancelled or failed.",
          });
        }
        console.log(res);
      },
      theme: {
        color: "#ff0101ff",
      },
      modal: {
        ondismiss: function () {
          setModal({
            show: true,
            type: "error",
            message: "Payment was cancelled or failed.",
          });
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const CreateOrderID = async (id) => {
    try{
      const response = await axios.post(`${baseUrl}Bookings/create-order`, {
      BookingId : id
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      console.error("Error creating order ID:", response.data);
      return null;
    }
    }
    catch(err){
      console.error("Error creating order ID:", err);
      return null;
    }

  };

  const handleBookingSubmit = async () => {
    const token = user?.token;

    const bookingDateTime = getBookingDateTime();
    const packageIds = cartItems.map((item) => item.id).join(",");
    const packagePrice = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalPrice = packagePrice - (couponApplied.discountAmount || 0);

    if (
      ! decryptedCustId ||
      !formData.StateID  ||
      !formData.CityID ||
      !formData.pincode  ||
      !formData.addressLine1 ||
      !selectedDate ||
      !selectedTime ||
      cartItems.length === 0
    ) {
      showAlert("Please fill all required fields.");
      return;
    }
    

    // const formData = new FormData();
    console.log("Form Data:", formData);

    if(!formData.VehicleID){
      const saveCarResponse = await axios.post(`${baseUrl}CustomerVehicles/InsertCustomerVehicle`, {
        custID: decryptedCustId,
        brandID: formData.brandID,
        modelID: formData.modelID,
        fuelTypeID: formData.fuelTypeID,
        VehicleNumber: formData.registrationNumber,
        yearOfPurchase: formData.yearOfPurchase,
        engineType: formData.engineType,
        kilometersDriven: formData.kilometerDriven,
        transmissionType: formData.transmissionType,
        CreatedBy: decryptedCustId,
      });
      formData.VehicleID = saveCarResponse.data?.vehicleID;
      let selectedCar = JSON.parse(localStorage.getItem("selectedCarDetails")) || {};
      selectedCar.VehicleID = formData.VehicleID;
      localStorage.setItem("selectedCarDetails", JSON.stringify(selectedCar));
    }


    if (user?.name === "GUEST") {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("custID", decryptedCustId);
        formDataToSend.append("FullName", formData.fullName);
        formDataToSend.append("PhoneNumber", formData.phone);
        formDataToSend.append("Email", formData.email);
        formDataToSend.append("ProfileImageFile", '');
        formDataToSend.append("IsActive", true);

        await axios.post(`${baseUrl}Customer/update-customer`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.error("Guest registration error:", error);
      }
    }

    // formData.vehicleId = saveCarResponse.addressID;
    console.log("Form Data:", formData);
    const form = new FormData();
    form.append("custID", decryptedCustId);
    form.append("CustFullName", formData.fullName);
    form.append("CustPhoneNumber", formData.phone);
    form.append("CustEmail", formData.email);
    form.append("IsOthers", formData.isBookingForOthers);
    form.append("OthersFullName", formData.isBookingForOthers ? formData.othersFullName : "");
    form.append("OthersPhoneNumber", formData.isBookingForOthers ? formData.othersPhoneNumber : "");

    form.append("VechicleID", formData.VehicleID);
    form.append("BookingDate", bookingDateTime);
    form.append("TimeSlot", selectedTime);
    form.append("PackageIds", packageIds);
    form.append("PackagePrice", packagePrice);
    form.append("TotalPrice", totalPrice);
    form.append("PaymentMethod", paymentMethod);
    form.append("BookingFrom", "web");

    form.append("FullAddress", formData.addressLine1);
    form.append("StateID", formData.StateID);
    form.append("CityID", formData.CityID);
    form.append("Pincode", formData.pincode);

    form.append("Longitude", formData.mapLocation.longitude);
    form.append("Latitude", formData.mapLocation.latitude);
    form.append("Notes", formData.technicianNote);
    form.append("CouponCode", couponApplied ? formData.appliedCouponCode : "");
    form.append("DiscountAmount", totalAmount - getDiscountedTotal());

 
console.log("Form Data:", form);  

    try {
      const res = await axios.post(
        `${baseUrl}Bookings/insert-booking`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        showAlert(
          "success",
          "Booking submitted successfully!",
          3000,
          "success"
        );

        if (paymentMethod === "razorpay") {
          const amountToPay = getDiscountedTotal();
          loadRazorpay(amountToPay, res.data);
        } else {
            clearCart();
          navigate("/profile?tab=mybookings");
        }
      } else {
        showAlert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      showAlert("Error while booking. Please try again.");
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAC8UIiyDI55MVKRzNTHwQ9mnCnRjDymVo`
      );
      const data = await response.json();
      console.log("Reverse Geocode Response:", data);
      const addressComponents = data.results[0].address_components;

      const city =
        addressComponents.find((c) => c.types.includes("locality"))
          ?.long_name || "";
      const state =
        addressComponents.find((c) =>
          c.types.includes("administrative_area_level_1")
        )?.long_name || "";
      const postalCode =
        addressComponents.find((c) => c.types.includes("postal_code"))
          ?.long_name || "";
      const formattedAddress = data.results[0].formatted_address;

      return {
        city,
        state,
        postalCode,
        address: formattedAddress,
      };
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      return {};
    }
  };


  const handleSavedAddressChange = (e) => {
    const id = e.target.value;
    setSelectedSavedAddressID(id);

    const selected = savedAddresses.find((a) => a.id === id);
    if (selected) {
      setAddressLine1(selected.addressLine1);
      setAddressLine2(selected.addressLine2);
      setSelectedState(selected.stateID);
      setSelectedCity(selected.cityID);
      setPincode(selected.pincode);
    }
  };


  const [couponList, setCouponList] = useState([]);

useEffect(() => {
  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${baseUrl}Coupons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const now = new Date();

      const formatted = response.data
        .filter(coupon => {
          const from = new Date(coupon.ValidFrom);
          const till = new Date(coupon.ValidTill);
          return (
            coupon.Status &&
            from <= now && now <= till
          );
        })
        .map(coupon => ({
          id: coupon.CouponID,
          Code: coupon.Code,
          Description: coupon.Description,
          DiscountValue: coupon.DiscountValue,
          minAmount: coupon.MinBookingAmount,
          validTill: new Date(coupon.ValidTill),
          DiscountType: coupon.DiscountType,
        }));

      setCouponList(formatted);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  fetchCoupons();
}, []);


// const handleSelectCoupon = (coupon) => {
//   const minAmount = coupon.MinBookingAmount || 0;

//   if (totalAmount < minAmount) {
//     alert(`This coupon requires a minimum booking amount of ₹${minAmount}`);
//     return;
//   }

//   setAppliedCouponCode(coupon.Code);
//   setDiscountAmount(coupon.DiscountValue);
//   setCouponApplied(true);
//   setShowCouponPopup(false);
// };

const handleApplyCoupon = (coupon) => {
  const minAmount = coupon.MinBookingAmount || 0;

  if (totalAmount < minAmount) {
    alert(`This coupon requires a minimum booking amount of ₹${minAmount}`);
    return;
  }

  setAppliedCoupon(coupon);
  setCouponApplied(true);
  setShowCouponPopup(false);
};

const getDiscountedTotal = () => {
  if (!couponApplied) return totalAmount;

  const isPercentage = appliedCoupon.DiscountType === "percentage";
  const minAmount = appliedCoupon.MinBookingAmount || 0;

  if (totalAmount < minAmount) {
    // Do not apply coupon if total < minimum
    return totalAmount;
  }

  let discount = 0;

  if (isPercentage) {
    const percentage = parseFloat(appliedCoupon.DiscountValue) || 0;
    discount = (totalAmount * percentage) / 100;

    // Optional: Max discount cap
    if (appliedCoupon.MaxDisAmount && discount > appliedCoupon.MaxDisAmount) {
      discount = appliedCoupon.MaxDisAmount;
    }
  } else {
    discount = appliedCoupon.DiscountValue || 0;
  }

  setFormData((prev) => ({
     ...prev,
     appliedCouponCode: appliedCoupon.Code,
  }));

  return Math.max(0, totalAmount - discount);
};


  return (
    <div className="container py-4">
      <div className="row">
        {/* Left: Time Slot Selection */}
        <div className="col-md-8 border-end left-scrollable">
          <h5>Select Date and Time</h5>

          {showCalendar && (
            <>
              <WeeklyCalendar
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  fetchTimeSlots(date);
                  setSelectedTime("");
                  setDateTouched(true);
                }}
              />
              {/* )} */}

              <div className="mb-3">
                  <>
                    <strong>🌅 Morning</strong>
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      {morningSlots.map((slot, i) => (
                        <button
                          key={slot}
                          disabled={slot.disabled}
                          className={` ${
                            selectedTime === slot
                              ? "active"
                              : ""
                          } tab-pill  rounded-pill px-3 py-2`}
                          onClick={() => {
                                  if (!selectedDate) {
                                    showAlert("Please select a date before choosing a time slot.");
                                    return;
                                  }

                            setSelectedTime(slot.label);
                            setShowCalendar(false); // hide calendar after selecting time
                          }}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </>
              </div>

              <div className="mb-3">
                <strong>🌤️ Afternoon</strong>
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={slot}
                       disabled={slot.disabled}
                      className={` ${
                        selectedTime === slot
                          ? "active"
                          : ""
                      } tab-pill  rounded-pill px-3 py-2`}
                      onClick={() => {
                         if (!selectedDate) {
                                    showAlert("Please select a date before choosing a time slot.");
                                    return;
                                  }
                        setSelectedTime(slot.label);
                        setShowCalendar(false); // hide calendar after selecting time
                      }}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <strong>🌇 Evening</strong>
                <div className="d-flex gap-2 mt-2 flex-wrap">
                  {eveningSlots.map((slot) => (
                    <button
                      key={slot}
                       disabled={slot.disabled}
                      className={` ${
                        selectedTime === slot
                          ? "active"
                          : ""
                      } tab-pill  rounded-pill px-3 py-2`}
                      onClick={() => {
                         if (!selectedDate) {
                                    showAlert("Please select a date before choosing a time slot.");
                                    return;
                                  }
                        setSelectedTime(slot.label);
                        setShowCalendar(false); // hide calendar after selecting time
                      }}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {dateTouched && (
            <div className="mt-3">
              <div
                className="alert alert-success d-flex align-items-center justify-content-between gap-3"
                role="alert"
              >
                <div className="d-flex align-items-center gap-3">
                  <i className="bi bi-calendar-event fs-5 text-primary" />
                  <strong>
                    You selected: {format(selectedDate, "EEEE, dd MMMM")}
                    {selectedTime ? ` at ${selectedTime}` : " — Select a slot"}
                  </strong>
                </div>
                {/* Step 3: Edit icon */}
                <button
                  className="btn  px-3 py-2"
                  onClick={() => setShowCalendar(true)}
                >
                  <i className="bi bi-pencil-square" />
                </button>
              </div>
            </div>
          )}

          {selectedDate && selectedTime && !showAddressFields && (
            <div className="text-end mt-3">
              <button
                className="btn btn-danger px-4 py-2"
                onClick={() => {
                  setShowAddressFields(true);
                  setTimeout(() => {
                    addressRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              >
                Continue
              </button>
            </div>
          )}
          {showAddressFields && (
            <div
              ref={addressRef}
              className="border-start border-3 border-danger ps-3 pt-3 mt-4"
            >
              <div className="card shadow-sm p-4 mb-4">
                <h5 className="mb-3 text-primary fw-bold">
                  👤 Customer Information
                </h5>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handlereInputChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handlereInputChange}
                      readOnly
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <input
                      type="email"
                    name="email"
                      className="form-control"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handlereInputChange}
                    />
                  </div>
                </div>

                <div className="form-check mt-2 mb-3">
                  <input
                    type="checkbox"
                    name="isBookingForOthers"
                    className="form-check-input"
                    id="bookingForOthers"
                    checked={formData.isBookingForOthers}
                    value={formData.isBookingForOthers ? "true" : "false"}
                    onChange={handlereInputChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="bookingForOthers"
                  >
                    Booking for someone else?
                  </label>
                </div>

                {formData.isBookingForOthers && (
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        name="othersFullName"
                        className="form-control"
                        placeholder="Other Person's Full Name"
                        value={formData.othersFullName}
                        onChange={handlereInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input
                        type="tel"
                        name="othersPhoneNumber"
                        className="form-control"
                        placeholder="Other Person's Phone Number"
                        value={formData.othersPhoneNumber}
                        onChange={handlereInputChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              <BookingAddressDetails
                selectedSavedAddressID={selectedSavedAddressID}
                handleSavedAddressChange={handleSavedAddressChange}
                handlereInputChange={handlereInputChange}
                savedAddresses={savedAddresses}
                selectedState={selectedState}
                selectedCity={selectedCity}
                states={states}
                cities={cities}
                setSelectedState={setSelectedState}   // ✅ Add this
                setSelectedCity={setSelectedCity}     // ✅ Add this
                pincode={formData.pincode}
                setPincode={setPincode}
                addressLine1={formData.addressLine1}
                addressLine2={formData.addressLine2}
                setAddressLine1={setAddressLine1}
                setAddressLine2={setAddressLine2}
                handleMapClick={handleMapClick}
                formData={formData}
                />

              <BookingVehicleDetails
                vehicle={selectedVehicle}
                setVehicle={setSelectedVehicle}
                registrationNumber={formData.registrationNumber}
                setRegistrationNumber={setRegistrationNumber}
                allowCarSelection={true}
                formData={formData}
                setFormData={setFormData} 
                handlereInputChange={handlereInputChange}
              />

              <div className="row">
                <div className="text-end mt-3">
                  <button className="btn btn-danger" onClick={handleContinue}>
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {showCheckout && (
            <div ref={paymentRef} className="mt-5">
              {/* Technician Note */}
              <div className="card shadow p-4 mb-4">
                <h5 className="mb-3">Instructions for Technician</h5>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="E.g. Please call me before arriving, park near the main gate, etc."
                  value={formData.technicianNote}
                  onChange={handlereInputChange}
                  name="technicianNote"
                />
              </div>

              {/* Payment Method */}
              <div className="card shadow p-4 mb-4">
                {/* <h3 className="mb-4">Checkout</h3> */}

                <h5 className="mb-3">Select Payment Method</h5>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    id="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                  />
                  <label className="form-check-label" htmlFor="razorpay">
                    Razorpay/UPI/Credit/Debit Card
                  </label>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="payment"
                    id="COS"
                    checked={paymentMethod === "COS"}
                    onChange={() => setPaymentMethod("COS")}
                  />
                  <label className="form-check-label" htmlFor="COS">
                    Cash on Service
                  </label>
                </div>

                <div className="d-flex gap-3 mb-4">
                  <img
                    src="/assets/img/update-img/payment-method/01.png"
                    alt="visa"
                    width="50"
                  />
                  <img
                    src="/assets/img/update-img/payment-method/02.png"
                    alt="mastercard"
                    width="50"
                  />
                  <img
                    src="/assets/img/update-img/payment-method/03.png"
                    alt="paypal"
                    width="50"
                  />
                </div>

                <div className="text-end">
                  <button
                    className="btn btn-success btn-lg px-4 py-2"
                    onClick={handleBookingSubmit}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          )}
          <SuccessFailureModal
            show={modal.show}
            type={modal.type}
            message={modal.message}
            onClose={handleModalClose}
          />
        </div>

        {/* Right: Cart Items */}
        <div className="col-lg-4">
          <div className="cart-fixed">
            <div className="card p-4">
              <h5 className="mb-4">Services in Cart</h5>

              {cartItems.length === 0 ? (
                <p className="text-muted">No services in cart.</p>
              ) : (
                <div className="vstack gap-3">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="d-flex gap-3 align-items-center border-bottom pb-3"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="rounded"
                        style={{
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                        }}
                      />
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{item.title}</div>
                        <div className="text-muted small">{item.duration}</div>
                      </div>
                      <div className="fw-bold text-success text-nowrap">
                        ₹{item.price}
                      </div>
                    </div>
                  ))}
                  {/* <div className="d-flex justify-content-between pt-2 border-top mt-2">
                    <strong>Total</strong>
                    <strong className="text-primary">₹{totalAmount}</strong>
                  </div> */}

                 {(() => {
                      const discountedTotal = getDiscountedTotal();
                      const gstAmount = discountedTotal * 0.18;
                      const finalTotal = discountedTotal + gstAmount;

                      return (
                        <div className="d-flex justify-content-between pt-2 border-top mt-2">
                          <strong>Total (incl. 18% GST)</strong>
                          <div className="text-end">
                            <strong className="text-primary">₹{finalTotal.toFixed(2)}</strong>
                            <div className="small text-secondary">
                              <div>Base: ₹{discountedTotal.toFixed(2)}</div>
                              <div>GST (18%): ₹{gstAmount.toFixed(2)}</div>
                              {couponApplied && (
                                <div className="text-muted">
                                  (Saved ₹{(totalAmount - discountedTotal).toFixed(2)})
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                </div>
              )}
            </div>


            {/* Coupon Section */}
           <div className="card p-3 mt-3">
              <h6 className="text-teal fw-semibold mb-3">Get Discount</h6>

                      {!couponApplied ? (
                        <>
                          <div className="">
                            <div className="">
                              <button className="btn  btn-outline-primary  px-3 py-2" onClick={() => setShowCouponPopup(true)}>
                                View Coupons
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                              <i className="bi bi-tag-fill text-teal bg-light rounded-circle p-2"></i>
                              <div>
                                <div className="fw-medium">
                                  Hurray! You Saved ₹{(totalAmount - getDiscountedTotal()).toFixed(2)}
                                </div>
                              </div>
                            </div>
                            <div className="text-end">
                              <span className="text-primary fw-bold">{appliedCoupon.Code}</span><br />
                              <span className="text-muted">Applied</span><br />
                              <button
                                className="btn btn-outline-danger mt-1 px-2 py-1"
                                onClick={() => {
                                  setAppliedCoupon(null);
                                  setCouponApplied(false);
                                }}
                              >
                                Unapply
                              </button>
                            </div>
                          </div>

                      )}
                    </div>

                    {showCouponPopup && (
                      <div
                        className="position-absolute bottom-0 start-0 end-0 bg-white border-top shadow p-3"
                        style={{ zIndex: 1050, maxHeight: "60vh", overflowY: "auto" }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0">Available Coupons</h6>

                          <i className="bi bi-x-lg" onClick={() => setShowCouponPopup(false)}></i>
                          {/* <button className="btn btn-sm btn-outline-secondary" >
                          
                          </button> */}
                        </div>

                                  {couponList.map((coupon) => {
                      const daysLeft = Math.ceil((coupon.validTill - new Date()) / (1000 * 60 * 60 * 24));

                      return (
                        <div
                          key={coupon.id}
                          className="border rounded p-3 mb-2 d-flex justify-content-between align-items-start flex-wrap"
                        >
                          <div>
                            <div className="fw-bold">{coupon.Code}</div>
                            <div className="small text-muted">{coupon.Description}</div>

                            {/* ✅ Min booking amount note */}
                            {/* {coupon.MinBookingAmount && (
                              <div className="small text-danger mt-1">
                                Requires minimum booking of ₹{coupon.MinBookingAmount}
                              </div>
                            )} */}

                            {/* 🏷️ Expiring soon */}
                            {daysLeft <= 3 && (
                              <span className="badge bg-warning text-dark mt-2">Expiring Soon</span>
                            )}
                          </div>

                          <button
                            className="btn btn-primary mt-2 px-3 py-1"
                            onClick={() => handleApplyCoupon(coupon)}
                          >
                            Apply
                          </button>
                        </div>
                      );
                    })}

                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTimeSlotPage;
