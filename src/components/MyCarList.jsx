import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Car from '../images/car.avif'

const MyCarList = () => {
    const navigate = useNavigate();

    const [primaryCarId, setPrimaryCarId] = useState(1); // default primary

    const carList = [
        {
            id: 1,
            modelName: "Car Model No 1",
            fuelType: "Petrol",
            manufacturer: "Honda",
            image: Car
        },
        {
            id: 2,
            modelName: "Car Model No 2",
            fuelType: "Petrol",
            manufacturer: "Honda",
            image: Car,
        },
        {
            id: 3,
            modelName: "Car Model No 1",
            fuelType: "Petrol",
            manufacturer: "Honda",
            image: Car
        }
    ];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold">My Cars</h4>
                <button
                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                    onClick={() => navigate("/add-car")}
                >
                    <i className="bi bi-plus-circle" /> Add New Car
                </button>
            </div>

            <div className="mb-4">
                <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                        <i className="bi bi-search" />
                    </span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search your car"
                    />
                </div>
            </div>

            <div className="row g-4">
                {carList.map((car) => {
                    const isPrimary = car.id === primaryCarId;

                    return (
                        <div className="col-md-6 col-lg-4" key={car.id}>
                            <div
                                className={`border rounded shadow-sm h-100 p-3 d-flex flex-column ${isPrimary ? "border-primary" : ""
                                    }`}
                            >
                                <img
                                    src={car.image}
                                    alt={car.modelName}
                                    className="mb-3 rounded w-100"
                                    style={{ height: "160px", objectFit: "contain" }}
                                />
                                <div className="mb-2 position-relative">                                   
                                    <h6 className="fw-bold mb-1">{car.modelName}</h6>
                                    <div className="text-muted">Fuel Type: {car.fuelType}</div>
                                    <div className="text-muted">Manufacturer: {car.manufacturer}</div>
                                </div>
                                <div className="mt-auto d-flex flex-column gap-2">
                                    <button
                                        className="btn btn-primary w-100"
                                    >
                                        View Details
                                    </button>
                                    {isPrimary && (
                                        <button
                                            className="btn btn-outline-primary w-100"
                                            onClick={() => setPrimaryCarId(car.id)}
                                        >
                                           Primary
                                        </button>
                                    )}
                                    {!isPrimary && (
                                        <button
                                            className="btn btn-outline-secondary w-100"
                                            onClick={() => setPrimaryCarId(car.id)}
                                        >
                                            Make Primary
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MyCarList;
