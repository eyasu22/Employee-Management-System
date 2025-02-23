import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Button } from "react-bootstrap";
import logo from "../assets/BluehubtechnologyLogo.png";
import "./Home.css";

// Set axios defaults once
axios.defaults.withCredentials = true;

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("/dashboard");

  const handleLogout = async () => {
    try {
      const result = await axios.get("http://localhost:3000/auth/logout");
      if (result.data.Status) {
        localStorage.removeItem("valid");
        navigate("/");
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      alert("An error occurred while logging out.");
    }
  };

  const handleClick = (path) => {
    setActiveButton(path);
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            {/* Logo */}
            <NavLink to="/dashboard" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
              <img src={logo} alt="Organization Logo" style={{ width: "120px", height: "120px", marginRight: "10px" }} />
            </NavLink>

            {/* Menu */}
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="w-100">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive || activeButton === "/dashboard" ? "nav-link active text-white px-0 align-middle" : "nav-link text-white px-0 align-middle")}
                  onClick={() => handleClick("/dashboard")}
                >
                  <i className="fs-4 bi-house-door ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Dashboard</span>
                </NavLink>
              </li>
              <li className="w-100">
                <NavLink
                  to="/dashboard/employee"
                  className={({ isActive }) => (isActive || activeButton === "/dashboard/employee" ? "nav-link active text-white px-0 align-middle" : "nav-link text-white px-0 align-middle")}
                  onClick={() => handleClick("/dashboard/employee")}
                >
                  <i className="fs-4 bi-person-badge ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Manage User</span>
                </NavLink>
              </li>
              <li className="w-100">
                <NavLink
                  to="/dashboard/category"
                  className={({ isActive }) => (isActive || activeButton === "/dashboard/category" ? "nav-link active text-white px-0 align-middle" : "nav-link text-white px-0 align-middle")}
                  onClick={() => handleClick("/dashboard/category")}
                >
                  <i className="fs-4 bi-tags ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Category</span>
                </NavLink>
              </li>
              <li className="w-100">
                <NavLink
                  to="/dashboard/leave"
                  className={({ isActive }) => (isActive || activeButton === "/dashboard/leave" ? "nav-link active text-white px-0 align-middle" : "nav-link text-white px-0 align-middle")}
                  onClick={() => handleClick("/dashboard/leave")}
                >
                  <i className="fs-4 bi-calendar-check ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Leave Management</span>
                </NavLink>
              </li>
              <li className="w-100">
                <NavLink
                  to="/dashboard/calendar"
                  className={({ isActive }) => (isActive || activeButton === "/dashboard/calendar" ? "nav-link active text-white px-0 align-middle" : "nav-link text-white px-0 align-middle")}
                  onClick={() => handleClick("/dashboard/calendar")}
                >
                  <i className="fs-4 bi-calendar-event ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Calendar</span>
                </NavLink>
              </li>
              <li className="w-100">
                <NavLink
                  to="/dashboard/profile"
                  className={({ isActive }) => (isActive || activeButton === "/dashboard/profile" ? "nav-link active text-white px-0 align-middle" : "nav-link text-white px-0 align-middle")}
                  onClick={() => handleClick("/dashboard/profile")}
                >
                  <i className="fs-4 bi-person ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Profile</span>
                </NavLink>
              </li>
             { /*<li className="w-100">
                <Link to="/dashboard/add-admin" className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-person-plus ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Add Admin</span>
                </Link>
              </li>*/}
              <li className="w-100" onClick={handleLogout} style={{ cursor: "pointer" }}>
                <div className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-power ms-2"></i>
                  <span className="ms-2 d-none d-sm-inline">Logout</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col p-0 m-0">
          <div className="p-4 d-flex justify-content-between align-items-center bg-light shadow-sm">
            <h4 className="fw-bold">Employee Management System- Blue Hub</h4>
            <Button variant="outline-primary" onClick={() => navigate("/dashboard/profile")}>
              Go to Profile
            </Button>
          </div>
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="footer-dashboard bg-dark text-white">
        <div className="container py-3">
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <p>&copy; 2025 Blue Hub. All Rights Reserved.</p>
              <p>
                <NavLink to="/privacy-policy" className="footer-link text-white">
                  Privacy Policy
                </NavLink>{" "}
                |{" "}
                <NavLink to="/terms-of-service" className="footer-link text-white">
                  Terms of Service
                </NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
