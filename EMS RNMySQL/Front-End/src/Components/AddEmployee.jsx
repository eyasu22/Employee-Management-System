import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    salary: "",
    address: "",
    category_id: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const validateForm = () => {
    let validationErrors = {};

    if (!employee.name.trim()) {
      validationErrors.name = "Name is required.";
    } else if (!/^[A-Za-z\s]+$/.test(employee.name)) {
      validationErrors.name = "Name can only contain letters and spaces.";
    }

    if (!employee.email.trim()) {
      validationErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(employee.email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!employee.password.trim()) {
      validationErrors.password = "Password is required.";
    } else if (employee.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters.";
    }

    if (!employee.confirmPassword.trim()) {
      validationErrors.confirmPassword = "Confirm password is required.";
    } else if (employee.password !== employee.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    if (!employee.salary.trim()) {
      validationErrors.salary = "Salary is required.";
    } else if (isNaN(employee.salary) || employee.salary <= 0) {
      validationErrors.salary = "Salary must be a positive number.";
    }

    if (!employee.address.trim()) {
      validationErrors.address = "Address is required.";
    }

    if (!employee.category_id) {
      validationErrors.category_id = "Please select a category.";
    }

    if (employee.image) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(employee.image.type)) {
        validationErrors.image = "Only JPG, PNG, and GIF images are allowed.";
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("password", employee.password);
    formData.append("address", employee.address);
    formData.append("salary", employee.salary);
    if (employee.image) {
      formData.append("image", employee.image);
    }
    formData.append("category_id", employee.category_id);

    axios
      .post("http://localhost:3000/auth/add_employee", formData)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Name"
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          <div className="col-12">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control rounded-0"
                placeholder="Enter Password"
                onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <small className="text-danger">{errors.password}</small>}
          </div>

          <div className="col-12">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control rounded-0"
                placeholder="Confirm Password"
                onChange={(e) => setEmployee({ ...employee, confirmPassword: e.target.value })}
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
          </div>

          <div className="col-12">
            <label className="form-label">Salary</label>
            <input
              type="number"
              className="form-control rounded-0"
              placeholder="Enter Salary"
              onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
            />
            {errors.salary && <small className="text-danger">{errors.salary}</small>}
          </div>

          <div className="col-12">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="1234 Main St"
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
            {errors.address && <small className="text-danger">{errors.address}</small>}
          </div>

          <div className="col-12">
            <label className="form-label">Category</label>
            <select className="form-select" onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}>
              <option value="">Select Category</option>
              {category.map((c) => (
                <option value={c.id} key={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <small className="text-danger">{errors.category_id}</small>}
          </div>

          <div className="col-12">
            <label className="form-label">Select Image</label>
            <input type="file" className="form-control rounded-0" accept="image/*" onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })} />
            {errors.image && <small className="text-danger">{errors.image}</small>}
          </div>

          <button type="submit" className="btn btn-primary w-100">Add Employee</button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
