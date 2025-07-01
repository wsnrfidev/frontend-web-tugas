import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PeopleTable from "../components/PeopleTable";
import EditProfileModal from "../components/EditProfileModal";

function Dashboard() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const defaultAvatar =
    "https://www.svgrepo.com/show/384674/account-avatar-profile-user-13.svg";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    } else {
      setIsChecking(false);
    }

    if (localStorage.getItem("mode") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, [navigate]);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("mode", isDark ? "dark" : "light");
  };

  if (isChecking) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white p-8 transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
          Data Orang
        </h1>

        <button
          onClick={toggleDarkMode}
          className="px-3 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          🌓
        </button>
      </div>

      <button
        onClick={() => setShowProfile(true)}
        className="mb-6 px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 flex items-center gap-2 transition"
      >
        <img
          src={user.photo || defaultAvatar}
          alt="Profile"
          className="w-6 h-6 rounded-full object-cover border"
        />
        <span>My Profile</span>
      </button>

      <PeopleTable />

      {showProfile && (
        <EditProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

export default Dashboard;
