import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);  // Store user data
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted with values:", { email, password });

    try {
      const response = await axios.post("http://localhost:3000/auth/adminlogin", { email, password });

      console.log("Response from server:", response.data);

      if (response.data.loginStatus) {
        console.log("Login successful, navigating to appropriate page...");
        console.log("Token:", response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("id", response.data.id);
        setUserData(response.data);  // Save data in state
      } else {
        console.log("Login failed:", response.data.Error);
        setError(response.data.Error || "Login failed!");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    if (userData) {
      if (userData.role === "admin") {
        navigate("/dashboard");
      } else if (userData.role === "employee") {
        navigate(`/employee_detail/${userData.id}`);
      }
    }
  }, [userData, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div
        className="d-flex justify-content-center align-items-center vh-100 loginPage"
        style={{
          backgroundImage: "url(/hhh.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="p-3 rounded w-25 border loginForm">
        {error && <div className="text-warning">{error}</div>}

        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 email-input">
            <i className="fa fa-envelope"></i> {/* Icon for the email input */}
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              className="form-control rounded-0"
              required
            />
          </div>

          <div className="mb-3 password-input">
            <i className="fa fa-lock"></i> {/* Icon for the password input */}
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              className="form-control rounded-0"
              required
            />
          </div>

          <button
            className="btn btn-success w-100 rounded-0 mb-2"
            type="submit"
          >
            <i className="fa fa-sign-in"></i>
            Login
          </button>

          <div className="mb-1">
            <input
              type="checkbox"
              name="tick"
              id="tick"
              className="me-2"
              required
            />
            <label htmlFor="tick">You agree with terms & conditions</label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
