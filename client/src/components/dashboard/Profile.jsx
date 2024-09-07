// Profile.js
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
  });

  const [editProfile, setEditProfile] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ ...profile });

  const handleProfileUpdate = () => {
    setProfile(updatedProfile);
    setEditProfile(false);
  };

  return (
    <motion.div
      className="p-10 bg-PrimaryColor min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-ExtraDarkColor mb-6">Profile</h1>
      <div className="bg-SecondaryColor p-8 rounded-lg shadow-md w-full max-w-lg">
        {!editProfile ? (
          <div>
            <p className="text-DarkColor mb-4">
              <strong>Name:</strong> {profile.name}
            </p>
            <p className="text-DarkColor mb-4">
              <strong>Email:</strong> {profile.email}
            </p>
            <p className="text-DarkColor mb-4">
              <strong>Role:</strong> {profile.role}
            </p>
            <button
              className="bg-DarkColor text-white p-3 rounded mt-4 hover:bg-ExtraDarkColor transition"
              onClick={() => setEditProfile(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={updatedProfile.name}
              className="p-3 mb-4 w-full bg-PrimaryColor rounded"
              onChange={(e) =>
                setUpdatedProfile({ ...updatedProfile, name: e.target.value })
              }
            />
            <input
              type="email"
              value={updatedProfile.email}
              className="p-3 mb-4 w-full bg-PrimaryColor rounded"
              onChange={(e) =>
                setUpdatedProfile({ ...updatedProfile, email: e.target.value })
              }
            />
            <button
              className="bg-DarkColor text-white p-3 rounded mt-4 hover:bg-ExtraDarkColor transition"
              onClick={handleProfileUpdate}
            >
              Save Changes
            </button>
            <button
              className="bg-ExtraDarkColor text-white p-3 rounded mt-4 hover:bg-DarkColor transition ml-4"
              onClick={() => setEditProfile(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
