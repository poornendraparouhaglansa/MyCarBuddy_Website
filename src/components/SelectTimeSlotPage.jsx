import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import WeeklyCalendar from "./WeeklyCalender";
import { format } from "date-fns";
import { useAlert } from "../context/AlertContext";
import Checkout from "./Checkout";
import axios from "axios";

const SelectTimeSlotPage = () => {
    const baseUrl = process.env.REACT_APP_CARBUDDY_BASE_URL;
    const { cartItems } = useCart();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [showAddressFields, setShowAddressFields] = useState(false);
    const [dateTouched, setDateTouched] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const addressRef = useRef(null);
    const paymentRef = useRef(null);

    const { showAlert } = useAlert();

    const navigate = useNavigate();

    const morningSlots = ["10 - 11AM", "11 - 12PM"];

    const afternoonSlots = ["12 - 1PM", "1 - 2PM", "2 - 3PM", "3 - 4PM"];
    const eveningSlots = ["4 - 5PM", "5 - 6PM"];

    const isToday = format(new Date(), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");


    // const handleContinue = () => {
    //     if (selectedDate && selectedTime) {
    //         setShowCheckout(true);
    //         setTimeout(() => {
    //             paymentRef.current?.scrollIntoView({ behavior: "smooth" });
    //         }, 100);
    //     } else {
    //         showAlert("Please select a date and time slot.");
    //     }
    // };

    const totalAmount = cartItems.reduce((sum, i) => sum + i.price, 0);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await axios.get(`${baseUrl}State`);
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
            if (!selectedState) return;
            try {
                const response = await axios.get(`${baseUrl}City`);
                const filteredCities = response.data.filter(
                    (c) => c.StateID === parseInt(selectedState) && c.IsActive
                );
                setCities(filteredCities);
            } catch (err) {
                console.error("Error fetching cities:", err);
            }
        };

        fetchCities();
    }, [selectedState]);

    const handleContinue = async () => {
        if (!selectedDate || !selectedTime) {
            showAlert("Please select a date and time slot.");
            return;
        }

        if (!selectedState || !selectedCity || !addressLine1.trim()) {
            showAlert("Please complete the address (state, city, and address).");
            return;
        }

        const custId = JSON.parse(localStorage.getItem("user"))?.id;

        const payload = {
            custID: custId,
            addressLine1: addressLine1,
            addressLine2: 'addressLine2',
            stateID: Number(selectedState),
            cityID: Number(selectedCity),
            pincode: 500081,
            latitude: 17.4343443,
            longitude: 78.448224,
            isDefault: true,
            createdBy: 1,
            isActive: true,
        };

        try {
            const res = await axios.post(`${baseUrl}CustomerAddresses`, payload);

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



    return (
        <div className="container py-4">
            <div className="row">
                {/* Left: Time Slot Selection */}
                <div className="col-md-8 border-end left-scrollable">
                    <h5>Select Date and Time</h5>

                    <WeeklyCalendar selectedDate={selectedDate}
                        onDateSelect={(date) => {
                            setSelectedDate(date);
                            setSelectedTime("");
                            setDateTouched(true);
                        }} />

                    <div className="mb-3">
                        {dateTouched && (
                            <div className="alert alert-success d-flex align-items-center gap-3" role="alert">
                                <i className="bi bi-calendar-event" />
                                <div>
                                    <strong>
                                        You selected: {format(selectedDate, "EEEE, dd MMMM")}
                                        {selectedTime ? ` at ${selectedTime}` : " — Select a slot"}
                                    </strong>
                                </div>
                            </div>
                        )}


                        {!isToday && (
                            <>
                                <strong>🌅 Morning</strong>
                                <div className="d-flex gap-2 mt-2 flex-wrap">
                                    {morningSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            className={`btn ${selectedTime === slot ? "btn-danger" : "btn-outline-dark"}`}
                                            onClick={() => setSelectedTime(slot)}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mb-3">
                        <strong>🌤️ Afternoon</strong>
                        <div className="d-flex gap-2 mt-2 flex-wrap">
                            {afternoonSlots.map((slot) => (
                                <button
                                    key={slot}
                                    className={`btn ${selectedTime === slot ? "btn-danger" : "btn-outline-dark"}`}
                                    onClick={() => setSelectedTime(slot)}
                                >
                                    {slot}
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
                                    className={`btn ${selectedTime === slot ? "btn-danger" : "btn-outline-dark"}`}
                                    onClick={() => setSelectedTime(slot)}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedDate && selectedTime && !showAddressFields && (
                        <div className="text-end mt-3">
                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    setShowAddressFields(true)
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
                        <div ref={addressRef} className="border-start border-3 border-danger ps-3 pt-3 mt-4">
                            <h5 className="fw-bold">Select / Add Address</h5>
                            <p className="text-muted mb-3">Select from saved address or add a new address</p>

                            <div className="row">
                                {/* Left Column: Address Fields */}
                                <div className="col-md-7">
                                    {/* <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Enter Locality *" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Flat Number / Room Number / Suite *" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Landmark (Optional)" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="number" className="form-control" placeholder="Mobile Number *" />
                                    </div> */}
                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <select className="form-select" value={selectedState}
                                                onChange={(e) => {
                                                    setSelectedState(e.target.value);
                                                    setSelectedCity("");
                                                }}>
                                                <option value="">Select State</option>
                                                {states.map((state) => (
                                                    <option key={state.StateID} value={state.StateID}>
                                                        {state.StateName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <select className="form-select" value={selectedCity}
                                                onChange={(e) => setSelectedCity(e.target.value)}
                                                disabled={!selectedState}>
                                                <option value="">Select City</option>
                                                {cities.map((city) => (
                                                    <option key={city.CityID} value={city.CityID}>
                                                        {city.CityName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Address"
                                            value={addressLine1}
                                            onChange={(e) => setAddressLine1(e.target.value)}
                                        />
                                    </div>

                                    {/* <div className="mt-3">
                                        <p className="fw-bold mb-1">Choose from Saved Addresses</p>
                                        <div className="border p-3 rounded d-flex flex-column gap-2" style={{ maxWidth: "100%" }}>
                                            <div><i className="bi bi-geo-alt" /> Hyderabad, Hyderabad</div>
                                            <button className="btn btn-outline-dark w-100">Select</button>
                                        </div>
                                    </div> */}

                                </div>

                                {/* Right Column: Dummy Map */}
                                <div className="col-md-5">
                                    <div className="rounded border overflow-hidden shadow-sm" style={{ height: "80%", backgroundColor: "#f0f0f0" }}>
                                        <img
                                            src="https://www.mapsofindia.com/maps/telangana/cities/hyderabad-city-map.gif"
                                            alt="Map preview"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                </div>
                                <div className="text-end mt-3">
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleContinue}
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showCheckout && (
                        <div ref={paymentRef} className="mt-5">
                            <Checkout />
                        </div>
                    )}
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
                                                style={{ width: "64px", height: "64px", objectFit: "cover" }}
                                            />
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold">{item.title}</div>
                                                <div className="text-muted small">{item.duration}</div>
                                            </div>
                                            <div className="fw-bold text-success text-nowrap">₹{item.price}</div>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-between pt-2 border-top mt-2">
                                        <strong>Total</strong>
                                        <strong className="text-primary">₹{totalAmount}</strong>
                                    </div>
                                </div>
                            )}
                        </div>
                        {dateTouched && (
                            <div className="alert alert-success d-flex align-items-center gap-3 mt-3" role="alert">
                                <i className="bi bi-calendar-event" />
                                <div>
                                    <strong>
                                        You selected: {format(selectedDate, "EEEE, dd MMMM")}
                                        {selectedTime ? ` at ${selectedTime}` : " — Select a slot"}
                                    </strong>
                                    
                                </div>
                            </div>
                        )}

                    </div>
                </div>

            </div>

        </div>

    );
};

export default SelectTimeSlotPage;
