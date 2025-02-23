import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const [role, setRole] = useState(""); // To hold the selected role
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  // Handle role selection change
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  // Handle login navigation
  const handleLoginClick = () => {
    if (role) {
      if (role === "employee") {
        navigate("/employee_login");
      } else if (role === "admin") {
        navigate("/adminlogin");
      }
    } else {
      alert("Please select a role!");
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/verify")
      .then((result) => {
        if (result.data.Status) {
          if (result.data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/employee_detail/" + result.data.id);
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <h2 className="text-center">Login As</h2>
        <div className="mt-5 mb-2">
          <label htmlFor="role" className="form-label">
            Select Role:
          </label>
          <select
            className="form-select"
            id="role"
            value={role}
            onChange={handleRoleChange}
          >
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="button"
          className="btn btn-primary w-100 mt-3"
          onClick={handleLoginClick}
        >
          Login
        </button>

        {/* Button to open modal */}
        <button
          type="button"
          className="btn btn-info w-100 mt-2"
          onClick={() => setShowModal(true)}
        >
          More About Us
        </button>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">About Our Organization</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <h4>🚀 Empowering Technology and Education</h4>
                <p>
                  We specialize in **IT training, system development, and technical support** to help businesses and individuals grow in the digital world.
                </p>

                <h5>💻 **Basic Computer Training:**</h5>
                <ul>
                  <li>✔ Computer Basic Operations</li>
                  <li>✔ MS Office Applications</li>
                  <li>✔ Computer Safety & Internet Usage</li>
                </ul>

                <h5>👨‍💻 **Programming Courses:**</h5>
                <ul>
                  <li>✔ Kids Coding</li>
                  <li>✔ Beginners Programming (C++, Java, Python)</li>
                  <li>✔ Intermediate & Advanced Programming Training</li>
                </ul>

                <h5>🛠 **System Development:**</h5>
                <ul>
                  <li>✔ Desktop Applications</li>
                  <li>✔ Organization & Business Websites</li>
                  <li>✔ Mobile App Development</li>
                </ul>

                <h5>🔧 **Maintenance & Installation:**</h5>
                <ul>
                  <li>✔ Computer Maintenance & Troubleshooting</li>
                  <li>✔ Network Design & Installation</li>
                  <li>✔ Software Repair & Installation</li>
                  <li>✔ Data Recovery Services</li>
                </ul>

                <p>
                  🌟 **Our goal is to provide high-quality IT education and services to empower individuals and businesses.**  
                  Contact us today to learn more!
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;
