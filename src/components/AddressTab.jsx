import React from "react";

const addresses = [
  {
    id: 1,
    name: "Marian Bruma",
    phone: "0123456789",
    address1: "test - test",
    address2: "test - 12345",
    isPrimary: true,
  },
  {
    id: 2,
    name: "Bruma Marian",
    phone: "0123456789",
    address1: "test - test",
    address2: "test - 12345",
    isPrimary: false,
  },
];

const AddressTab = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Address</h5>
        <button className="btn btn-danger">Add address</button>
      </div>

      <div className="row">
        {addresses.map((addr) => (
          <div key={addr.id} className="col-md-6 mb-3">
            <div
              className={`p-3 rounded border ${
                addr.isPrimary ? "border-danger bg-light text-dark" : "border"
              }`}
            >
              <strong>{addr.name} - {addr.phone}</strong>
              {addr.isPrimary && (
                <span className="badge bg-danger ms-2">Primary address</span>
              )}
              <p className="mb-1">{addr.address1}</p>
              <p className="mb-2">{addr.address2}</p>
              <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
              <button className="btn btn-sm btn-outline-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressTab;
