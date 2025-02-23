import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserEdit, FaSignOutAlt, FaCalendarAlt, FaPlane } from "react-icons/fa";
import FooterEmployee from "./FooterEmployee";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/BluehubtechnologyLogo.png";

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:3000/auth/employee/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result[0]);
        } else {
          console.log(result.data.Error);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.log(err);
        }
      });
  }, [id, navigate]);

  const handleLogout = () => {
    axios.get("http://localhost:3000/auth/logout").then(() => {
      localStorage.removeItem("token");
      navigate("/");
    });
  };

  if (!employee) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <header className="bg-dark text-white py-3 text-center fw-bold fs-4">
        Employee Management System - Blue Hub
      </header>

      <div className="d-flex flex-grow-1">
        <aside className="bg-dark text-white p-3" style={{ width: "260px" }}>
          <div className="text-center">
            <img
              src={logo}
              alt="Blue Hub Logo"
              className="img-fluid mb-3 rounded-circle"
              style={{ width: "120px", height: "120px" }}
            />
          </div>
          <h5 className="text-center">Dashboard</h5>
          <button
            className="btn btn-info w-100 mb-2 hover-btn"
            onClick={() => navigate(`/edit_employee_details/${id}`)}
          >
            <FaUserEdit /> Edit Details
          </button>
          <button
            className="btn btn-primary w-100 mb-2 hover-btn"
            onClick={() => navigate(`/employee/leave-request/${id}`)}
          >
            <FaPlane /> Leave Request
          </button>
          <button
            className="btn btn-success w-100 mb-2 hover-btn"
            onClick={() => navigate(`/employee/calendar/${id}`)}
          >
            <FaCalendarAlt /> View Calendar
          </button>
          <button
            className="btn btn-danger w-100 hover-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </aside>

        <main className="p-4 flex-grow-1 d-flex flex-column align-items-center">
          <div className="text-center">
            <img
              src={`http://localhost:3000/Images/` + employee.image}
              className="rounded-circle border border-primary"
              alt="Employee"
              style={{ width: "200px", height: "200px" }}
            />
            <h3 className="fw-bold mt-3">{employee.name}</h3>
            <p>Email: {employee.email}</p>
            <p>Salary: birr {employee.salary}</p>
            <p>Address: {employee.address}</p>
            <p>Category: {employee.category_id}</p>
          </div>
        </main>
      </div>

      <FooterEmployee />
    </div>
  );
};

export default EmployeeDetail;
