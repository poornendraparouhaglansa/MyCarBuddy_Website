import React, { useEffect, useState } from "react";

const Profile = () => {
    const [user, setUser] = useState({
        name: "",
        identifier: "",
        mobile: "",
        city: "",
        state: "",
        imageUrl: "",
    });

    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            const parsed = JSON.parse(saved);
            setUser({
                ...parsed,
                mobile: parsed.mobile || "",
                city: parsed.city || "",
                state: parsed.state || "",
                imageUrl: parsed.imageUrl || "",
            });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("userProfileUpdated"));
        setEditing(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setUser((prev) => ({ ...prev, imageUrl: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm rounded-4 p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="mb-0">Profile Details</h4>
                            {!editing && (
                                <button className="btn btn-outline-primary" onClick={() => setEditing(true)}>
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Profile Image */}
                        <div className="text-center mb-4">
                            <img
                                src={user.imageUrl || "https://via.placeholder.com/100"}
                                alt="Profile"
                                className="rounded-circle border"
                                width={100}
                                height={100}
                            />
                            {editing && (
                                <div className="mt-2">
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={user.name}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                                readOnly={!editing}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email or Mobile (Identifier)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="identifier"
                                value={user.identifier}
                                readOnly
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mobile Number</label>
                            <input
                                type="text"
                                className="form-control"
                                name="mobile"
                                value={user.mobile}
                                onChange={handleInputChange}
                                readOnly={!editing}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">City</label>
                            <input
                                type="text"
                                className="form-control"
                                name="city"
                                value={user.city}
                                onChange={handleInputChange}
                                readOnly={!editing}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">State</label>
                            <input
                                type="text"
                                className="form-control"
                                name="state"
                                value={user.state}
                                onChange={handleInputChange}
                                readOnly={!editing}
                            />
                        </div>

                        {editing && (
                            <button className="btn btn-success w-100" onClick={handleSave}>
                                Save Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
