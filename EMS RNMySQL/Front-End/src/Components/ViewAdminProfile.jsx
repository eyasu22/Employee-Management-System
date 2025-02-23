import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css"; // Import CSS file

const ViewAdminProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // Get token from storage

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/admin_profile", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        console.log(
          "Error fetching profile:",
          err.response ? err.response.data : err.message
        );
        if (err.response && err.response.status === 403) {
          alert("You are not authorized to view this profile.");
        } else {
          alert("An error occurred while fetching the profile data.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, token]);

  return (
    <div className="profile-container px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Admin Profile</h3>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : profile ? (
        <div className="profile-details card">
          <img
            src={`http://localhost:3000/Images/` + profile.profile_image}
            className="profile-image card-img-top"
            alt="Profile"
          />
          <div className="card-body">
            <p className="card-text">
              <strong>Name:</strong> {profile.name}
            </p>
            <p className="card-text">
              <strong>Email:</strong> {profile.email}
            </p>
            <p className="card-text">
              <strong>Address:</strong> {profile.address}
            </p>
            <p className="card-text">
              <strong>Phone:</strong> {profile.phone}
            </p>
            {/* Add more fields as necessary */}
          </div>
        </div>
      ) : (
        <p>No profile data found</p>
      )}
    </div>
  );
};

export default ViewAdminProfile;
