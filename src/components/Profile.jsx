
import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";


const ImageURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;
const Profile = () => {
  const [user, setUser] = useState({
    FullName: "",
    PhoneNumber: "",
    Email: "",
    AlternateNumber: "",
    ProfileImage: "",
  });
  const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;

  const [editing, setEditing] = useState(false);
  const userdata = JSON.parse(localStorage.getItem("user")) || {};
  const token = userdata?.token || "";
  const bytes = CryptoJS.AES.decrypt(userdata.id, secretKey);
  const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);

  useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_CARBUDDY_BASE_URL}Customer/Id?Id=${decryptedCustId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },

            });
              
          const data = res.data[0] || {};
          console.log("Fetched user profile:", data);
        
          setUser({
            FullName: data.FullName || "",
            Email: data.Email ,
            PhoneNumber: data.PhoneNumber || "",
            AlternateNumber: data.AlternateNumber || "",
            ProfileImage: data.ProfileImage || "",
          });

          // localStorage.setItem("user", JSON.stringify({ ...parsed, ...data }));
        } catch (err) {
          console.error("Failed to fetch user profile", err);
        }
      };

      fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

 const handleSave = async () => {
  try {

    const formData = new FormData();
    formData.append("CustID", decryptedCustId || "");
    formData.append("FullName", user.FullName || "");
    formData.append("Email", user.Email || "");
    formData.append("PhoneNumber", user.PhoneNumber || "");
    formData.append("AlternateNumber", user.AlternateNumber || "");

    // If image is base64 string, convert to file
    if (user.ProfileImage?.startsWith("data:image")) {
      const blob = await fetch(user.ProfileImage).then((r) => r.blob());
      formData.append("ProfileImageFile", blob, "profile.jpg");
    }

    const res = await fetch(
      `${process.env.REACT_APP_CARBUDDY_BASE_URL}Customer/update-customer`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Failed to update profile");

    const updatedData = await res.json();
    window.dispatchEvent(new Event("userProfileUpdated"));
    setEditing(false);
    alert("Profile updated successfully!");
  } catch (err) {
    console.error("Save failed:", err);
    alert("Error updating profile");
  }
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prev) => ({ ...prev, ProfileImage: reader.result }));
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
                <button
                  className="btn btn-outline-primary px-4 py-2"
                  onClick={() => setEditing(true)}
                >
                  <i className="bi bi-pencil-fill"></i> Edit
                </button>
              )}
            </div>

            {/* Profile Image */}
            <div className="text-center mb-4">
              {user.ProfileImage && (
               <img
                    src={user?.ProfileImage ? `${ImageURL}${user.ProfileImage}` : "/assets/img/avatar.png"}
                    alt="Profile"
                    className="rounded-circle border"
                     style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null; // prevent infinite loop
                      e.target.src = "/assets/img/avatar.png"; // fallback to default
                    }}
                  />
              ) || (
                <img
                  src="/assets/img/avatar.png"
                  alt="Profile"
                  // className="rounded-circle border"
                />
              )}
              

              {/* <img
                src={user.ProfileImage || "/assets/img/avatar.png"}
                alt="Profile"
                className="rounded-circle border"
                width={100}
                height={100}
              /> */}
              {editing && (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="FullName"
                value={user.FullName}
                onChange={handleInputChange}
                placeholder="Enter your name"
                readOnly={!editing}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mobile</label>
              <input
                type="text"
                className="form-control"
                name="PhoneNumber"
                value={user.PhoneNumber}
                readOnly
              />
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                    className="form-control"
                    name="Email"
                    value={user.Email}
                    onChange={handleInputChange}
                    readOnly={!editing}
                />

            </div>

            <div className="mb-3">
              <label className="form-label">Alternate Number</label>
              <input
                type="text"
                className="form-control"
                name="AlternateNumber"
                value={user.AlternateNumber}
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
