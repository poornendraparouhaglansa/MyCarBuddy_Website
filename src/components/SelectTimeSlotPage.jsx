import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import WeeklyCalendar from "./WeeklyCalender";
import { format } from "date-fns";

const SelectTimeSlotPage = () => {
    const { cartItems } = useCart();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [showAddressFields, setShowAddressFields] = useState(false);
    const [dateTouched, setDateTouched] = useState(false);

    const navigate = useNavigate();

    const morningSlots = ["10 - 11AM", "11 - 12PM"];

    const afternoonSlots = ["12 - 1PM", "1 - 2PM", "2 - 3PM", "3 - 4PM"];
    const eveningSlots = ["4 - 5PM", "5 - 6PM"];

    const isToday = format(new Date(), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");


    const handleContinue = () => {
        if (selectedDate && selectedTime) {
            navigate("/checkout");
        } else {
            alert("Please select a date and time slot.");
        }
    };

    const totalAmount = cartItems.reduce((sum, i) => sum + i.price, 0);

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
                                onClick={() => setShowAddressFields(true)}
                            >
                                Continue
                            </button>
                        </div>
                    )}
                    {showAddressFields && (
                        <div className="border-start border-3 border-danger ps-3 pt-3 mt-4">
                            <h5 className="fw-bold">Select / Add Address</h5>
                            <p className="text-muted mb-3">Select from saved address or add a new address</p>

                            <div className="row">
                                {/* Left Column: Address Fields */}
                                <div className="col-md-7">
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Enter Locality *" />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Flat Number / Room Number / Suite (Optional)" />
                                    </div>
                                    <div className="text-end mt-3">
                                        <button
                                            className="btn btn-danger m-0 p-3"
                                        >
                                            Save
                                        </button>
                                    </div>
                                    <div className="mt-3">
                                        <p className="fw-bold mb-1">Choose from Saved Addresses</p>
                                        <div className="border p-3 rounded d-flex flex-column gap-2" style={{ maxWidth: "100%" }}>
                                            <div><i className="bi bi-geo-alt" /> Hyderabad, Hyderabad</div>
                                            <button className="btn btn-outline-dark w-100">Select</button>
                                        </div>
                                    </div>

                                    {/* <div className="text-end mt-3">
                                        <button
                                            className="btn btn-danger"
                                            onClick={handleContinue}
                                        >
                                            Continue
                                        </button>
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
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SelectTimeSlotPage;
