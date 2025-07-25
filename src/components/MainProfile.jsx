import React, { useState } from "react";
import Profile from "./Profile";
import AddressTab from "./AddressTab";
import { useLocation, useNavigate } from "react-router-dom";
import MyBookings from "./MyBookings";
import MyCarList from "./MyCarList";

const MainProfile = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get("tab") || "profile";

    const [activeTab, setActiveTab] = useState(initialTab);
    const navigation = useNavigate();

    const tabs = [
        { key: "profile", label: "Profile", icon: "👤" },
        { key: "addresses", label: "Addresses", icon: "🏠" },
        { key: "mybookings", label: "My Bookings", icon: "📅" },
        { key: "mycars", label: "My Car List", icon: "🚗" },
        { key: "test3", label: "Test 3", icon: "🧪" },
        { key: "test4", label: "Test 4", icon: "🛠️" },
        { key: "logout", label: "Log Out", icon: "🚪" },
    ];

    const user = JSON.parse(localStorage.getItem("user"));
    const userName = user?.name || "Guest User";
    const userIdentifier = user?.identifier || "No identifier";

    const renderTabContent = () => {
        switch (activeTab) {
            case "profile":
                return <Profile />;
            case "addresses":
                return <AddressTab />;
            case "mybookings":
                return <MyBookings />;
            case "mycars":
                return <MyCarList />;
            case "test3":
                return <div>Test 3</div>;
            case "test4":
                return <div>Test 4</div>;
            default:
                return <Profile />;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigation('/');
    };

    return (
        <div className="profile-container d-flex">
            <aside className="profile-sidebar p-4">
                <div className="text-center mb-4">
                    <img
                        src="https://via.placeholder.com/80"
                        alt="User"
                        className="rounded-circle mb-2"
                    />
                    <h6 className="mb-0">{userName}</h6>
                    <small className="text-muted">{userIdentifier}</small>
                </div>

                <ul className="nav flex-column">
                    {tabs.map((tab) => (
                        <li key={tab.key} className="nav-item mb-2">
                            {tab.key === "logout" ? (
                                <button className="nav-link btn-logout" onClick={handleLogout}>
                                    {tab.icon} {tab.label}
                                </button>
                            ) : (
                                <button
                                    className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="profile-content p-2 flex-grow-1">
                {renderTabContent()}
            </main>

            {/* Style */}
            <style jsx>{`
        .profile-container {
          display: flex;
          min-height: 100vh;
          background: #f8f9fb;
          min-width: 900px;
        }
        .profile-sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #dee2e6;
          min-height: 100vh;
        }
        .nav-link {
          background: none;
          border: none;
          color: #333;
          font-weight: 500;
          text-align: left;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px;
          transition: all 0.2s ease-in-out;
        }
        .nav-link:hover {
          background: #f1f3f5;
        }
        .nav-link.active {
          background: #e9ecef;
          font-weight: bold;
        }
        .btn-logout {
          color: #dc3545;
        }
        .profile-content {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
      `}</style>
        </div>
    );
};
export default MainProfile;
