import axios from "axios";
import React, { useEffect, useState } from "react";
import './Profile.css'; // Import CSS file
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      alert("No token found. Please log in again.");
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:3000/auth/admin_profile", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((result) => {
        console.log("Full Profile Data:", result.data); // Debugging
        if (result.data.Status) {
          setProfile(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.log("Error fetching profile:", err.response ? err.response.data : err.message);
        if (err.response && err.response.status === 403) {
          alert("You are not authorized to view this profile.");
        } else {
          alert("An error occurred while fetching the profile data.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="profile-container px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Admin Profile</h3>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : profile ? (
        <div className="profile-details card">
          {/* Check if profile_image exists, otherwise display a default image */}
     <img
            src={
              profile.profile_image
                ? `http://localhost:3000/Images/${profile.profile_image}` // Fetch image from the server
                : "/Image/default-profile.png" // Use default image if profile_image is null
            }
            className="profile-image card-img-top"
            alt="Profile"
          /> 
          <div className="card-body">
            <p className="card-text"><strong>Name:</strong> {profile.name || "N/A"}</p>
            <p className="card-text"><strong>Email:</strong> {profile.email}</p>
            <p className="card-text"><strong>Address:</strong> {profile.address || "N/A"}</p>
            <p className="card-text"><strong>Phone:</strong> {profile.phone || "N/A"}</p>
            {/* Add more fields as necessary */}
          </div>
        </div>
      ) : (
        <p>No profile data found</p>
      )}
    </div>
  );
};

export default Profile;
