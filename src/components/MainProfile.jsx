import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import AddressTab from "./AddressTab";
import MyBookings from "./MyBookings";
import MyCarList from "./MyCarList";
import axios from "axios";
import CryptoJS from "crypto-js";

const ImageURL = process.env.REACT_APP_CARBUDDY_IMAGE_URL;
const secretKey = process.env.REACT_APP_ENCRYPT_SECRET_KEY;
const MainProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [userData, setUserData] = useState({
    FullName: "",
    PhoneNumber: "",
    Email: "",
    AlternateNumber: "",
    ProfileImage: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "Guest User";
  const userIdentifier = user?.identifier || "No identifier";
  const bytes = CryptoJS.AES.decrypt(user.id, secretKey);
    const decryptedCustId = bytes.toString(CryptoJS.enc.Utf8);

  if (!user) {
    navigate("/");
  }

  useEffect(() => {
      const fetchUser = async () => {
           try {
          const res = await axios.get(
            `${process.env.REACT_APP_CARBUDDY_BASE_URL}Customer/Id?Id=${decryptedCustId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },

            });
              
          const data = res.data[0] || {};
          console.log("Fetched user profile:", data);
        
          setUserData({
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
      fetchUser();
    } , []); 


  const handleTabClick = (key) => {
    if (key === "logout") {
      localStorage.removeItem("user");
      navigate("/");
    } else {
      setActiveTab(key);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "addresses":
        return <AddressTab />;
      case "mybookings":
        return <MyBookings />;
      case "mycars":
        return <MyCarList />;
      default:
        return <Profile />;
    }
  };

  const tabs = [
    { key: "profile", label: "👤 Profile" },
    { key: "addresses", label: "🏠 Addresses" },
    { key: "mybookings", label: "📅 My Bookings" },
    { key: "mycars", label: "🚗 My Car List" },
    { key: "logout", label: "🚪 Log Out" },
  ];

  return (
    <div className="container py-4">

      {!user ? (
        <div className="alert alert-danger">
          {/* You are not logged in. Please log in to access your profile. */}
        </div>
      ) : (
        <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <div className="text-center mb-3">
              <img
                  src={userData?.ProfileImage ? `${ImageURL}${userData.ProfileImage}` : "/assets/img/avatar.png"}
                  alt="Profile"
                  className="rounded-circle border"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = "/assets/img/avatar.png"; // fallback to default
                  }}
                />
              <h6 className="mt-2 mb-0">{userData.FullName}</h6>
              <small className="text-muted">{userData.PhoneNumber}</small>
            </div>

            <div className="nav flex-column nav-pills">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`nav-link text-start ${
                    activeTab === tab.key ? "active" : ""
                  }`}
                  onClick={() => handleTabClick(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-md-9">
          <div className="card shadow-sm p-4">{renderContent()}</div>
        </div>
      </div>
      )}
      
    </div>
  );
};

export default MainProfile;
