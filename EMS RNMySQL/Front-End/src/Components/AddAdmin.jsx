import React, { useState } from "react";
import axios from "axios";
import './AddAdmin.css'; // Import the CSS for styling

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    profile_image: null,
    is_active: 1, // Default to active
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation functions
  const isValidName = (name) => /^[A-Za-z\s]+$/.test(name);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^[0-9]+$/.test(phone);
  const isValidImage = (file) => file && ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === "file") {
      const file = e.target.files[0];
      if (!file || !isValidImage(file)) {
        setMessage("Please upload a valid image file (JPG, PNG, GIF).");
        return;
      }
      setFormData({ ...formData, profile_image: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle show password toggle
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Validation checks
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (!isValidName(formData.name)) {
      setMessage("Name should only contain letters.");
      setLoading(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      setMessage("Invalid email format.");
      setLoading(false);
      return;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      setMessage("Phone number should only contain numbers.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting Data:", formData);
      
      const formDataObj = new FormData();
      for (const key in formData) {
        formDataObj.append(key, formData[key]);
      }

      const response = await axios.post(
        "http://localhost:3000/api/admin",
        formDataObj,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Response:", response.data);
      setMessage("Admin added successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        phone: "",
        profile_image: null,
        is_active: 1,
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-admin-container">
      <h2 className="title">Add Admin</h2>
      {message && (
        <p className={`message ${message.includes("successfully") ? "success" : "error"}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password (Min 6 chars)"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input-field"
          required
        />
        <label className="show-password-label">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={handleShowPassword}
          />
          Show Password
        </label>
        <input
          type="text"
          name="address"
          placeholder="Address (Optional)"
          value={formData.address}
          onChange={handleChange}
          className="input-field"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number (Only digits)"
          value={formData.phone}
          onChange={handleChange}
          className="input-field"
        />
        {/* File input for profile image */}
        <input
          type="file"
          name="profile_image"
          onChange={handleChange}
          className="input-field"
          accept="image/*"
        />
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Add Admin"}
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;
