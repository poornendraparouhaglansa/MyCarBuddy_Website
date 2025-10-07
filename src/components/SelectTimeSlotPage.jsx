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
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token || "";
  const { cartItems, clearCart } = useCart();
  const [validatedItems, setValidatedItems] = useState(cartItems);
  const [validatingPrices, setValidatingPrices] = useState(false);
  const apiBase = process.env.REACT_APP_CARBUDDY_BASE_URL || "https://api.mycarsbuddy.com/api/";
  const imageBase = process.env.REACT_APP_CARBUDDY_IMAGE_URL || "https://api.mycarsbuddy.com/";
  // cartItems.length === 0 && navigate("/cart");
  const [step, setStep] = useState(1);
  const baseUrl = process.env.REACT_APP_CARBUDDY_BASE_URL;
  const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;
  const location =
    JSON.parse(localStorage.getItem("location")) ||
    '{"latitude": 17.385044, "longitude": 78.486671}';
  let decryptedCustId = null;
  if (cartItems.length > 0) {
    const bytes =
      cartItems.length > 0 ? CryptoJS.AES.decrypt(user.id, secretKey) : null;
    decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);
  }

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
    CityID: "79",
    CityName: "",
    addressLine1: "",
    addressLine2: "",
    floorNumber: "",
    area: "",
    technicianNote: "",
    couponApplied: false,
    CouponAmount: "", // example value
    appliedCouponCode: "",
    paymentMethod: "COS",
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
    selectedSavedAddressID: "",
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimes, setSelectedTimes] = useState([]);
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
  const geocodeDebounceRef = useRef(null);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [registrationNumber, setRegistrationNumber] = useState("");

  // Saved Address
  const [savedAddresses, setSavedAddresses] = useState([]);

  const [showCalendar, setShowCalendar] = useState(true);

  const { showAlert } = useAlert();


  const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentMessage, setPaymentMessage] = useState("");
const [paymentStatus, setPaymentStatus] = useState(""); // "success" or "failed"
const [isCheckingNextDate, setIsCheckingNextDate] = useState(false);

  const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  const handleTimeSlotToggle = (timeSlot) => {
    if (!selectedDate) {
      showAlert("Please select a date before choosing a time slot.");
      return;
    }
    
    setSelectedTimes(prev => {
      if (prev.includes(timeSlot)) {
        // Remove the time slot if it's already selected
        return prev.filter(time => time !== timeSlot);
      } else {
        // Add the time slot if it's not selected
        return [...prev, timeSlot];
      }
    });
    setShowCalendar(false); // hide calendar after selecting time
  };

  const ensureVehicleSaved = async () => {
    if (formData.VehicleID) return true;
    try {
      const saveCarResponse = await axios.post(
        `${baseUrl}CustomerVehicles/InsertCustomerVehicle`,
        {
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
        }
      );
      const apiData = saveCarResponse?.data || {};
      if (apiData?.status === false || apiData?.vehicleID === -1) {
        const errorMessage = apiData?.message || "Unable to save vehicle. Please check details.";
        showAlert(errorMessage);
        return false;
      }
      const newVehicleId = apiData?.vehicleID;
      if (!newVehicleId) throw new Error("Vehicle ID missing in response");
      setFormData((prev) => ({ ...prev, VehicleID: newVehicleId }));
      let selectedCar = JSON.parse(localStorage.getItem("selectedCarDetails")) || {};
      selectedCar.VehicleID = newVehicleId;
      localStorage.setItem("selectedCarDetails", JSON.stringify(selectedCar));
      return true;
    } catch (error) {
      console.error("Error inserting customer vehicle:", error);
      showAlert("Error saving vehicle details. Please try again.");
      return false;
    }
  };

  const handleNext = async () => {
     scrollToTop();
    if (step === 1 && selectedTimes.length === 0) {
      showAlert("Please select at least one time slot.");
      return;
    }
    if (step === 2) {
      if (!formData.fullName || !formData.phone || !formData.email) {
        showAlert("Please fill contact details.");
        return;
      }

      if (
        !formData.CityName ||
        !formData.pincode ||
        !formData.StateID ||
        !formData.addressLine1.trim()
      ) {
        showAlert("Please complete the address (state, city, pincode, and address).");

        return;
      }

        if (!formData.selectedSavedAddressID) {
        handleContinue();
      }

    }
    if (step === 3) {
      if (!formData.registrationNumber || !formData.yearOfPurchase) {
        showAlert("Please enter car registration number and year of purchase.");
        return;
      }
      const saved = await ensureVehicleSaved();
      if (!saved) return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

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

  const fetchCities = async (Pincode) => {
      try {
        const response = await axios.get(`${baseUrl}City`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If StateID is provided, filter cities by state
        let filteredCities = response.data;
        if (formData.StateID) {
          filteredCities = response.data.filter(
            (c) => c.StateID === parseInt(formData.StateID) && c.IsActive
          );
        } else {
          // If no StateID, show all active cities
          filteredCities = response.data.filter((c) => c.IsActive);
        }

        setCities(filteredCities);

        // If Pincode is provided, find matching city
        if (Pincode !== undefined && Pincode !== null && Pincode !== "") {
          const matchedCity = response.data.filter(
            (c) => Number(c.Pincode) === Number(Pincode) && c.IsActive
          );

          if (matchedCity.length === 0) {
            showAlert("Service is not available in your selected location.");
            setFormData((prev) => ({
              ...prev,
              StateID: "",
              CityID: "79",
              pincode: "",
              addressLine1: "",
              CityName: "",
              area:""
            }));
            return;
          }

          // If we found a matching city by pincode, update the form
          if (matchedCity.length > 0) {
            const city = matchedCity[0];
            setFormData((prev) => ({
              ...prev,
              StateID: city.StateID.toString(),
              CityID: city.CityID.toString(),
              CityName: city.CityName,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };


  useEffect(() => {
    

    fetchCities();
  }, [formData.StateID, selectedState]);

 useEffect(() => {
  const carData = localStorage.getItem("selectedCarDetails");
  if (!carData) return;

  const parsedCar = JSON.parse(carData);
  const vehicleId = parsedCar.VehicleID;

  if (vehicleId) {
    axios
      .get(`${baseUrl}CustomerVehicles/CustVehicleId?CustVehicleId=${vehicleId}`)
      .then((response) => {
        if (response.data?.length > 0) {
          const vehicle = response.data[0];
          setSelectedVehicle(vehicle);
          setFormData((prev) => ({
            ...prev,
            brandID: vehicle.BrandID,
            modelID: vehicle.ModelID,
            fuelTypeID: vehicle.FuelTypeID,
            VehicleID: vehicleId,
            registrationNumber: vehicle.VehicleNumber,
            yearOfPurchase: vehicle.YearOfPurchase,
            engineType: vehicle.EngineType,
            kilometerDriven: vehicle.KilometersDriven,
            transmissionType: vehicle.TransmissionType,
          }));
        } else {
          console.warn(`Vehicle with ID ${vehicleId} not found. Falling back to stored car data.`);
          setSelectedVehicle(parsedCar);
        }
      })
      .catch((error) => {
        console.error("Error fetching vehicle details:", error);
        setSelectedVehicle(parsedCar);
      });
  } else {
    // Fallback for manually added car (not yet in DB)
    setSelectedVehicle(parsedCar);
    setFormData((prev) => ({
      ...prev,
      brandID: parsedCar.brand?.id,
      modelID: parsedCar.model?.id,
      fuelTypeID: parsedCar.fuel?.id,
      VehicleID: "",
    }));
  }
}, []);


  const handleMapClick = async (lat, lng) => {
    const result = await reverseGeocode(lat, lng);
    console.log("Reverse Geocode Result", result);

    const stateName = result?.state?.toLowerCase?.();
    const cityName = result?.city?.toLowerCase?.();
    const Pincode = result?.postalCode?.toLowerCase?.();

    const matchedState = states.find(
      (s) => s.StateName?.replace(/\s+/g, "").toLowerCase() === stateName
    );

    
    const matchedCity = cities.find((c) => Number(c.Pincode) === Number(Pincode) && c.IsActive);

    fetchCities(Pincode);

    if (!matchedState) {
      // alert("Service is not available in your selected location.");
      showAlert("Service is not available in your selected location.");

      setFormData((prev) => ({
        ...prev,
        StateID: "",
        CityID: "79",
        pincode: "",
        addressLine1: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      StateID: matchedState?.StateID || "",
      CityID: matchedCity?.CityID || "0",
      CityName: matchedCity?.CityName || "",
      pincode: result?.postalCode || "",
      addressLine1: result?.address || "",
      mapLocation: { latitude: lat, longitude: lng },
    }));

    if (matchedState) setSelectedState(matchedState.StateID);
    if (matchedCity) setSelectedCity(matchedCity.CityID);
    if (result?.postalCode) setPincode(result.postalCode);
    // Do not overwrite typed address; only set if empty
    if (result?.address) {
      setFormData((prev) => ({
        ...prev,
        addressLine1: prev.addressLine1?.trim() ? prev.addressLine1 : result.address,
      }));
    }
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

  // Validate item prices from API based on selected car details
  useEffect(() => {
    const validate = async () => {
      try {
        setValidatingPrices(true);
        const selectedCarDetails = JSON.parse(localStorage.getItem("selectedCarDetails"));
        if (!selectedCarDetails?.brand?.id || !selectedCarDetails?.model?.id || !selectedCarDetails?.fuel?.id) {
          setValidatedItems(cartItems);
          return;
        }

        const brandId = selectedCarDetails.brand.id;
        const modelId = selectedCarDetails.model.id;
        const fuelTypeId = selectedCarDetails.fuel.id;

        const updated = await Promise.all(
          cartItems.map(async (item) => {
            const url = `${apiBase}PlanPackage/GetPlanPackagesByCategoryAndSubCategory?BrandId=${brandId}&ModelId=${modelId}&fuelTypeId=${fuelTypeId}&packageId=${item.id}`;
            try {
              const res = await axios.get(url);
              const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
              if (!Array.isArray(list) || list.length === 0) return item;
              const pkg = list.find((p) => String(p.PackageID) === String(item.id)) || list[0];
              const imagePath = pkg?.BannerImage || "";
              const resolvedImage = imagePath ? `${imageBase}${imagePath.startsWith("/") ? imagePath.slice(1) : imagePath}` : item.image;
              return {
                ...item,
                title: pkg.PackageName ?? item.title,
                price: pkg.Serv_Off_Price ?? item.price,
                image: resolvedImage,
              };
            } catch (e) {
              return item;
            }
          })
        );

        setValidatedItems(updated);
      } finally {
        setValidatingPrices(false);
      }
    };

    validate();
  }, [cartItems]);

  const totalAmount = validatedItems.reduce((sum, i) => sum + (Number(i.price) || 0), 0);

  const getBookingDateTime = () => {
    // For multiple time slots, we'll use the first selected time slot for the date
    if (selectedTimes.length === 0) return format(selectedDate, "yyyy-MM-dd");
    
    const firstTimeSlot = selectedTimes[0];
    const [startTime] = firstTimeSlot.split(" - "); // e.g., "3"
    const hour = parseInt(startTime);
    const isPM = firstTimeSlot.includes("PM");
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

      if (
        name === "pincode" ||
        name === "mapLocation" ||
        name === "StateID"
      ) {
        // Immediate triggers
        if (name === "pincode" && value.length === 6) {
          updateMapFromAddress(updatedForm);
          fetchCities(value);
        } else if (name === "StateID") {
          updateMapFromAddress(updatedForm);
        }
      }
      return updatedForm;
    });
  };

  const updateMapFromAddress = async (form) => {

    const { addressLine1, pincode, StateID , CityName } = form;

    const state = states.find((s) => s.StateID === parseInt(StateID));
    // const city = cities.find((c) => c.CityID === parseInt(CityID));
    const city = CityName;

    // Avoid geocoding until pincode is complete (6 digits) if it's present
    if (pincode && String(pincode).length !== 6) {
      return;
    }

    const fullAddress = `${addressLine1 || ""}, ${pincode || ""}, ${
      city?.replace(/\s+/g, "").toLowerCase() || ""
    }, ${state?.StateName?.replace(/\s+/g, "").toLowerCase() || ""}`;
    console.log(pincode);
    if (!fullAddress.trim()) return;
    console.log(fullAddress);

    try {
      const res = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: fullAddress,
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          },
        }
      );

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

  const findNextAvailableDate = async (currentDate) => {
    if (isCheckingNextDate) return; // Prevent infinite loops
    
    setIsCheckingNextDate(true);
    const maxDaysToCheck = 7; // Check up to 7 days ahead
    let nextDate = new Date(currentDate);
    
    for (let i = 1; i <= maxDaysToCheck; i++) {
      nextDate.setDate(nextDate.getDate() + 1);
      
      try {
        const response = await axios.get(`${baseUrl}TimeSlot`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const timeSlots = response.data;
        const sortedSlots = (timeSlots || [])
          .filter((slot) => slot?.Status === true)
          .sort((a, b) => a.StartTime.localeCompare(b.StartTime));

        const now = new Date();
        const nowPlusTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const isToday = new Date(nextDate).toDateString() === nowPlusTwoHours.toDateString();
        
        let hasAvailableSlots = false;

        for (const { StartTime } of sortedSlots) {
          const [startHour, startMinute] = StartTime.split(":").map(Number);
          const startDate = new Date(nextDate);
          startDate.setHours(startHour, startMinute, 0, 0);
          
          const isExpired = isToday && startDate <= nowPlusTwoHours;
          
          if (!isExpired) {
            hasAvailableSlots = true;
            break;
          }
        }

        if (hasAvailableSlots) {
          setSelectedDate(new Date(nextDate));
           showAlert("Garage is closed on the selected date. Automatically moved to the next available date.", "info");
          setIsCheckingNextDate(false);
          return;
        }
      } catch (err) {
        console.error("Error checking date availability:", err);
      }
    }
    
    // If no available date found in the next 7 days
    showAlert("No available time slots found in the next 7 days. Please try again later.", "warning");
    setIsCheckingNextDate(false);
  };

  const fetchTimeSlots = async (selectedDate) => {
    try {
      const response = await axios.get(`${baseUrl}TimeSlot`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const timeSlots = response.data;

      // Filter active slots and sort by StartTime
      const sortedSlots = (timeSlots || [])
        .filter((slot) => slot?.Status === true)
        .sort((a, b) => a.StartTime.localeCompare(b.StartTime));

      const categorized = {
        morning: [],
        afternoon: [],
        evening: [],
      };

      const now  = new Date();
      const nowPlusTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      // const now = new Date();
      const isToday =
        selectedDate &&
        new Date(selectedDate).toDateString() === nowPlusTwoHours.toDateString();

      let allSlotsDisabled = true;

      sortedSlots.forEach(({ StartTime, EndTime }) => {
        const [startHour, startMinute] = StartTime.split(":").map(Number);
        const [endHour, endMinute] = EndTime.split(":").map(Number);

        const startDate = new Date(selectedDate);
        startDate.setHours(startHour, startMinute, 0, 0);

        const endDate = new Date(selectedDate);
        endDate.setHours(endHour, endMinute, 0, 0);

        // const isExpired = isToday && endDate <= now;
        const isExpired = isToday && startDate <= nowPlusTwoHours;

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

        // If any slot is not disabled, then not all slots are disabled
        if (!isExpired) {
          allSlotsDisabled = false;
        }

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

      // If all slots are disabled, find the next available date
      if (allSlotsDisabled && sortedSlots.length > 0 && !isCheckingNextDate) {
        findNextAvailableDate(selectedDate);
      }
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
    const payload = {
      custID: decryptedCustId,
      addressLine1: formData.addressLine1,
      addressLine2: "",
      stateID: Number(formData.StateID),
      cityID: Number(formData.CityID),
      pincode: formData.pincode,
      floorNumber: formData.floorNumber,
      area: formData.area,
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

        setFormData((prev) => ({
          ...prev,
          selectedSavedAddressID: "added",
        }));

        // setShowCheckout(true);
        // setTimeout(() => {
        //   paymentRef.current?.scrollIntoView({ behavior: "smooth" });
        // }, 100);
      } else {
        showAlert("Failed to save address. Please try again.");
      }
    } catch (error) {
      console.error("Address save error:", error);
      showAlert("Error saving address. Please try again.");
    }
  };

 const loadRazorpay = (amount, data) => {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY,
    amount: amount * 100,
    currency: "INR",
    name: "MyCarBuddy a product by Glansa Solutions Pvt. Ltd.",
    order_id: data.razorpay.orderID,
    description: "Payment for Car Services",
    image: "/assets/img/MyCarBuddy-Logo1.png",
    handler: function (response) {
      console.log("Payment success:", response);

      // Show a modal indicating processing
      setPaymentStatus("processing");
      setPaymentMessage("Please wait... your booking is being processed.");
      setShowPaymentModal(true);

      // Wait for 5 seconds before calling confirm-payment
      setTimeout(async () => {
        try {
          const res = await axios.post(
            `${baseUrl}Bookings/confirm-Payment`,
            {
              bookingID: data.bookingID,
              amountPaid: amount,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              razorpayOrderId: response.razorpay_order_id,
              paymentMode: "Razorpay",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res?.data?.success || res?.status === 200) {
            setPaymentStatus("success");
            setPaymentMessage("Payment was successful!");
            clearCart();
          } else {
            setPaymentStatus("error");
            setPaymentMessage("Payment failed! Please try again.");
            clearCart();
          }
        } catch (error) {
          console.error(error);
          setPaymentStatus("error");
          setPaymentMessage("Payment failed! Please try again.");
          clearCart();
        }
      }, 5000); // 5 seconds delay
    },
    theme: {
      color: "#1890ae",
    },
    prefill: {
      name: formData.fullName,
      email: formData.email,
      contact: formData.phone,
    },
    modal: {
      ondismiss: function () {

        axios.put(
          `${baseUrl}Bookings/booking-status`,
          {
            bookingID: data.bookingID,
            bookingStatus: "Failed",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPaymentStatus("error");
        setPaymentMessage("Payment was cancelled or failed.");
        setShowPaymentModal(true);
        clearCart();
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  // const CreateOrderID = async (id) => {
  //   try {
  //     const response = await axios.post(
  //       `${baseUrl}Bookings/create-order`,
  //       {
  //         BookingId: id,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status !== 200) {
  //       console.error("Error creating order ID:", response.data);
  //       return null;
  //     }
  //   } catch (err) {
  //     console.error("Error creating order ID:", err);
  //     return null;
  //   }
  // };

  const handleBookingSubmit = async () => {
    const token = user?.token;

    const bookingDateTime = getBookingDateTime();
    const packageIds = validatedItems.map((item) => item.id).join(",");
    const packagePrice = validatedItems.map((item) => item.price).join(",");

    if (
      !decryptedCustId ||
      !formData.StateID ||
      // !formData.CityID ||
      !formData.pincode ||
      !formData.addressLine1 ||
      !selectedDate ||
      selectedTimes.length === 0 ||
      cartItems.length === 0
    ) {
      showAlert("Please fill all required fields.");
      return;
    }


    // Vehicle save now happens in step 3 advance

    if (user?.name === "GUEST") {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("custID", decryptedCustId);
        formDataToSend.append("FullName", formData.fullName);
        formDataToSend.append("PhoneNumber", formData.phone);
        formDataToSend.append("Email", formData.email);
        formDataToSend.append("ProfileImageFile", "");
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
    form.append(
      "OthersFullName",
      formData.isBookingForOthers ? formData.othersFullName : ""
    );
    form.append(
      "OthersPhoneNumber",
      formData.isBookingForOthers ? formData.othersPhoneNumber : ""
    );

    form.append("VechicleID", formData.VehicleID);
    form.append("BookingDate", bookingDateTime);
    form.append("TimeSlot", selectedTimes.join(","));
    form.append("PackageIds", packageIds);
    form.append("PackagePrice", packagePrice);
    form.append("TotalPrice", totalAmount);
    form.append("PaymentMethod", paymentMethod);
    form.append("BookingFrom", "web");

    form.append("FullAddress", formData.floorNumber + " " + formData.addressLine1);
    form.append("StateID", formData.StateID);
    form.append("CityID", formData.CityID);
    form.append("Pincode", formData.pincode);
    // form.append("FloorNumber", formData.floorNumber);
    form.append("CityName", formData.area);

    form.append("Longitude", formData.mapLocation.longitude);
    form.append("Latitude", formData.mapLocation.latitude);
    form.append("Notes", formData.technicianNote);
    form.append("CouponCode", couponApplied ? formData.appliedCouponCode : "");
    form.append("CouponAmount", getOriginalTotal() - getDiscountedTotal());
    form.append("GSTAmount", getGST());
    setIsLoading(true);

    try {
      const res = await axios.post(`${baseUrl}Bookings/insert-booking`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 || res.status === 201) {
        showAlert(
          "success",
          "Booking submitted successfully!",
          3000,
          "success"
        );

        if (paymentMethod === "razorpay") {
          const finalTotal = getFinalTotal();
          loadRazorpay(finalTotal, res.data);
        } else {
          clearCart();

         setPaymentStatus("success");
          setPaymentMessage("Booking submitted successfully!");
          setShowPaymentModal(true);

        }
      } else {
        showAlert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setIsLoading(false);
      showAlert("Error while booking. Please try again.");
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
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
          .filter((coupon) => {
            const from = new Date(coupon.ValidFrom);
            const till = new Date(coupon.ValidTill);
            return coupon.Status && from <= now && now <= till;
          })
          .map((coupon) => ({
            id: coupon.CouponID,
            Code: coupon.Code,
            Description: coupon.Description,
            DiscountValue: coupon.DiscountValue,
            minAmount: coupon.MinBookingAmount,
            validTill: new Date(coupon.ValidTill),
            DiscountType: coupon.DiscountType,
            MaxDisAmount: coupon.MaxDisAmount,
            MinBookingAmount: coupon.MinBookingAmount,
          }));

        setCouponList(formatted);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      }
    };

    fetchCoupons();
  }, []);


  const handleApplyCoupon = (coupon) => {
    const minAmount = coupon.MinBookingAmount || 0;
    if (totalAmount < minAmount) {
      alert(`This coupon requires a minimum booking amount of ₹${minAmount}`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponApplied(true);
    setShowCouponPopup(false);
    getFinalTotal();
  };

  const getOriginalTotal = () => totalAmount; // before discount

 const getDiscountedTotal = () => {
  let total = getOriginalTotal();

  if (appliedCoupon) {
    if (appliedCoupon.DiscountType === "percentage") {
      let discount = (total * appliedCoupon.DiscountValue) / 100;

      // Apply MaxDisAmount cap if present
      if (appliedCoupon.MaxDisAmount && discount > appliedCoupon.MaxDisAmount) {
        discount = appliedCoupon.MaxDisAmount;
      }

      total -= discount;
    } else {
      total -= appliedCoupon.DiscountValue;
    }
  }

  return Math.max(total, 0); // prevent negative total
};

const getGST = () => {
  const discountedTotal = getDiscountedTotal();
  const taxAmount = Math.round(discountedTotal * 0.18);
  return taxAmount;
};

  const getFinalTotal = () => {
    const originalTotal = getOriginalTotal();
    const discountedTotal = getDiscountedTotal();
    const taxAmount = getGST();

    return discountedTotal + taxAmount;
  };

  return (
    <>
    {cartItems.length === 0 ? (
      <div className="no-items">
        <div className="alert alert-info">No items in cart.</div>
      </div>
    ) : (
      <div className="container py-4">
      <div className="row">
        {/* Left: Time Slot Selection */}
        <div className="col-md-8 border-end left-scrollable">
          <div className="mb-4">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
            <p className="text-center mt-2">Step {step} of 4</p>
          </div>
          {step === 1 && (
            <>
              <h5>Select Date and Time</h5>

              {/* {showCalendar && ( */}
              <>
                <WeeklyCalendar
                  selectedDate={selectedDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                    fetchTimeSlots(date);
                    setSelectedTimes([]);
                    setDateTouched(true);
                  }}
                />
                {/* )} */}

                <div className="mb-3">
                  <>
                    <strong>🌅 Morning</strong>
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      {morningSlots.map((slot, i) => (
                        <div key={i} className="form-check form-check-inline timeslot-checkbox">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`morning-${i}`}
                            disabled={slot.disabled}
                            checked={selectedTimes.includes(slot.label)}
                            onChange={() => handleTimeSlotToggle(slot.label)}
                            style={{ 
                              transform: "scale(1.2)", 
                              marginRight: "8px",
                              accentColor: "#1890ae"
                            }}
                          />
                          <label 
                            className={`form-check-label tab-pill rounded-pill px-4 py-2 ${
                              selectedTimes.includes(slot.label) ? "active" : ""
                            } ${slot.disabled ? "disabled" : ""}`}
                            htmlFor={`morning-${i}`}
                            style={{ 
                              cursor: slot.disabled ? "not-allowed" : "pointer",
                              backgroundColor: selectedTimes.includes(slot.label) ? "#1890ae" : "transparent",
                              color: selectedTimes.includes(slot.label) ? "white" : "inherit",
                              border: "1px solid #1890ae"
                            }}
                          >
                            {slot.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </>
                </div>

                <div className="mb-3">
                  <strong>🌤️ Afternoon</strong>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {afternoonSlots.map((slot, i) => (
                      <div key={i} className="form-check form-check-inline timeslot-checkbox">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`afternoon-${i}`}
                          disabled={slot.disabled}
                          checked={selectedTimes.includes(slot.label)}
                          onChange={() => handleTimeSlotToggle(slot.label)}
                          style={{ 
                            transform: "scale(1.2)", 
                            marginRight: "8px",
                            accentColor: "#1890ae"
                          }}
                        />
                        <label 
                          className={`form-check-label tab-pill rounded-pill px-4 py-2 ${
                            selectedTimes.includes(slot.label) ? "active" : ""
                          } ${slot.disabled ? "disabled" : ""}`}
                          htmlFor={`afternoon-${i}`}
                          style={{ 
                            cursor: slot.disabled ? "not-allowed" : "pointer",
                            backgroundColor: selectedTimes.includes(slot.label) ? "#1890ae" : "transparent",
                            color: selectedTimes.includes(slot.label) ? "white" : "inherit",
                            border: "1px solid #1890ae"
                          }}
                        >
                          {slot.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <strong>🌇 Evening</strong>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {eveningSlots.map((slot, i) => (
                      <div key={i} className="form-check form-check-inline timeslot-checkbox">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`evening-${i}`}
                          disabled={slot.disabled}
                          checked={selectedTimes.includes(slot.label)}
                          onChange={() => handleTimeSlotToggle(slot.label)}
                          style={{ 
                            transform: "scale(1.2)", 
                            marginRight: "8px",
                            accentColor: "#1890ae"
                          }}
                        />
                        <label 
                          className={`form-check-label tab-pill rounded-pill px-4 py-2 ${
                            selectedTimes.includes(slot.label) ? "active" : ""
                          } ${slot.disabled ? "disabled" : ""}`}
                          htmlFor={`evening-${i}`}
                          style={{ 
                            cursor: slot.disabled ? "not-allowed" : "pointer",
                            backgroundColor: selectedTimes.includes(slot.label) ? "#1890ae" : "transparent",
                            color: selectedTimes.includes(slot.label) ? "white" : "inherit",
                            border: "1px solid #1890ae"
                          }}
                        >
                          {slot.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Selected Time Slots Summary */}
                {selectedTimes.length > 0 && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-block ">
														<h6 className="mb-0">Selected Time Slots ({selectedTimes.length}):</h6>
														<div className="ml-5">
															{selectedDate && `${selectedDate.toDateString()} - ${selectedTimes.join(", ")}`}
														</div>
													</div>
                      <button 
                        className="btn btn-outline-danger px-3 py-1"
                        onClick={() => setSelectedTimes([])}
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedTimes.map((time, index) => (
                        <span key={index} className="badge bg-primary">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
              {/* )} */}
            </>
          )}

          {step === 2 && (
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
                    <label className="form-label fw-semibold">Full Name <span className="text-danger">*</span></label>
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
                    <label className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
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
                     <label className="form-label fw-semibold">Email <span className="text-danger">*</span></label>
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
                formData={formData}
                setFormData={setFormData} // ✅ now it exists
                handlereInputChange={handlereInputChange}
                savedAddresses={savedAddresses}
                selectedState={selectedState}
                selectedCity={selectedCity}
                states={states}
                cities={cities}
                setSelectedState={setSelectedState} // ✅ Add this
                setSelectedCity={setSelectedCity} // ✅ Add this
                pincode={formData.pincode}
                setPincode={setPincode}
                addressLine1={formData.addressLine1}
                addressLine2={formData.addressLine2}
                setAddressLine1={setAddressLine1}
                setAddressLine2={setAddressLine2}
                handleMapClick={handleMapClick}
              />
                </div>
          )}
          {step === 3 && (
              <div
              ref={addressRef}
              className="border-start border-3 border-danger ps-3 pt-3 mt-4"
            >
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


            </div>
          )}

          {step === 4 && (
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
                    className="form-check-input d-none"
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

                <div className="text-end d-flex justify-content-end">
                  <button
                    className="tab tab-pill active btn-lg px-4 py-2 btn-confirm"
                    onClick={handleBookingSubmit}
                    disabled={isLoading}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 d-flex justify-content-between mb-3">
            {step > 1 && (
              <button
                className="btn btn-secondary px-4 py-2"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            {step < 4 && (
              <button
                className="btn btn-primary ms-auto px-4 py-2"
                onClick={handleNext}
              >
                Next
              </button>
            )}
          </div>
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

              {validatedItems.length === 0 ? (
                <p className="text-muted">No services in cart.</p>
              ) : (
                <div className="vstack gap-3">
                  {validatedItems.map((item, idx) => (
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
                        {validatingPrices ? <span className="text-muted">Validating...</span> : <>₹{item.price}</>}
                      </div>
                    </div>
                  ))}


                  {(() => {
                    const originalTotal = getOriginalTotal();
                    const discountedTotal = getDiscountedTotal();
                    const gstAmount = getGST(originalTotal);
                    const finalTotal = getFinalTotal();
                    const savings = couponApplied
                      ? originalTotal - discountedTotal
                      : 0;

                    return (
                      <div className="d-flex justify-content-between pt-2 border-top mt-2">
                        <strong>Total (incl. 18% GST)</strong>
                        <div className="text-end">
                          <strong className="text-primary">
                            ₹{finalTotal.toFixed(2)}
                          </strong>
                          <div className="small text-secondary">
                            <div>Base: ₹{getOriginalTotal().toFixed(2)}</div>
                            <div>GST (18%): ₹{gstAmount.toFixed(2)}</div>
                            {couponApplied && (
                              <div className="text-muted">
                                (Saved ₹{savings.toFixed(2)})
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
                      <button
                        className="btn  btn-outline-primary  px-3 py-2"
                        onClick={() => setShowCouponPopup(true)}
                      >
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
                        Hurray! You Saved ₹
                        {(totalAmount - getDiscountedTotal()).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-primary fw-bold">
                      {appliedCoupon.Code}
                    </span>
                    <br />
                    <span className="text-muted">Applied</span>
                    <br />
                    <button
                      className="btn btn-outline-danger mt-1 px-2 py-1"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponApplied(false);
                      }}
                    >
                      Remove
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

                  <i
                    className="bi bi-x-lg"
                    onClick={() => setShowCouponPopup(false)}
                  ></i>
                  {/* <button className="btn btn-sm btn-outline-secondary" >
                          
                          </button> */}
                </div>

                {couponList.map((coupon) => {
                  const daysLeft = Math.ceil(
                    (coupon.validTill - new Date()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <div
                      key={coupon.id}
                      className="border rounded p-3 mb-2 d-flex justify-content-between align-items-start flex-wrap"
                    >
                      <div>
                        <div className="fw-bold">{coupon.Code}</div>
                        <div className="small text-muted">
                          {coupon.Description}
                        </div>

                        {/* ✅ Min booking amount note */}
                        {/* {coupon.MinBookingAmount && (
                              <div className="small text-danger mt-1">
                                Requires minimum booking of ₹{coupon.MinBookingAmount}
                              </div>
                            )} */}

                        {/* 🏷️ Expiring soon */}
                        {daysLeft <= 3 && (
                          <span className="badge bg-warning text-dark mt-2">
                            Expiring Soon
                          </span>
                        )}
                      </div>

                      <button
                        className="btn btn-primary mt-2 px-3 py-1"
                        onClick={() => handleApplyCoupon(coupon)}
                        disabled={totalAmount < (coupon.MinBookingAmount || 0)}
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
    )}


    {showPaymentModal && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        position: "relative",
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        width: "90%",
        maxWidth: "350px",
        textAlign: "center",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      }}
    >
      {paymentStatus === "processing" ? (
        <>
          <div
            style={{
              width: 50,
              height: 50,
              margin: "0 auto 20px",
              border: "4px solid #1890ae",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <h4 style={{ marginBottom: 10 }}>Processing Payment</h4>
          <p style={{ color: "#666", marginBottom: 20 }}>
            Please wait... your booking is being processed.
          </p>
        </>
      ) : (
        <>
          <img
            src={
              paymentStatus === "success"
                ? "https://cdn-icons-png.flaticon.com/512/190/190411.png" // green check
                : "https://cdn-icons-png.flaticon.com/512/463/463612.png" // red cross
            }
            alt="Status Icon"
            style={{ width: 50, height: 50, marginBottom: 20 }}
          />
          <h4 style={{ marginBottom: 10 }}>
            {paymentStatus === "success" ? "Successful" : " Failed"}
          </h4>
          <p style={{ color: "#666", marginBottom: 20 }}>{paymentMessage}</p>
          <button
            onClick={() => {
              setShowPaymentModal(false);
              navigate("/profile?tab=mybookings"); // Redirect to bookings
            }}
            style={{
              backgroundColor: paymentStatus === "success" ? "#28a745" : "#dc3545",
              color: "#fff",
              padding: "8px 20px",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            OK
          </button>
        </>
      )}

      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  </div>
)}
    </>
  );
};

export default SelectTimeSlotPage;
