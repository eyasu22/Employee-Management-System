import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployeeDetails = () => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    image: '',
    address: '',
    category: '',
    salary: '',
    password: '',
    confirmPassword: ''
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in again.');
      navigate('/login');
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    axios.get(`http://localhost:3000/auth/employee/${id}`, config)
      .then((result) => {
        if (result.data.Status) {
          setEmployee({
            name: result.data.Result[0].name,
            email: result.data.Result[0].email,
            image: result.data.Result[0].image,
            address: result.data.Result[0].address || '',
            category: result.data.Result[0].category || '',
            salary: result.data.Result[0].salary || '',
            password: '',
            confirmPassword: ''
          });
        } else {
          console.log(result.data.Error);
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert('Session expired. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.log(err);
        }
      });
  }, [id, navigate]);

  const validateForm = () => {
    let formErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!employee.email.trim()) formErrors.email = "Email is required.";
    else if (!emailPattern.test(employee.email)) formErrors.email = "Invalid email format.";

    if (!employee.address.trim()) formErrors.address = "Address is required.";

    if (employee.password && employee.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters.";
    }

    if (employee.password !== employee.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in again.');
      navigate('/login');
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('category', employee.category);
    formData.append('salary', employee.salary);
    formData.append('address', employee.address);

    if (employee.image) {
      formData.append('image', employee.image);
    }

    if (employee.password) {
      formData.append('password', employee.password);
    }

    try {
      const response = await axios.put(`http://localhost:3000/auth/edit_employee/${id}`, formData, config);
      if (response.data.Status) {
        navigate(`/employee_detail/${id}`);
      } else {
        alert(response.data.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Only JPG, JPEG, and PNG files are allowed." });
        setEmployee({ ...employee, image: '' });
      } else {
        setErrors({ ...errors, image: '' });
        setEmployee({ ...employee, image: file });
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" value={employee.name} disabled />
          </div>

          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Category</label>
            <input type="text" className="form-control" value={employee.category} disabled />
          </div>

          <div className="col-12">
            <label className="form-label">Salary</label>
            <input type="text" className="form-control" value={employee.salary} disabled />
          </div>

          <div className="col-12">
            <label className="form-label">Image</label>
            <input type="file" className="form-control" onChange={handleImageChange} />
            {errors.image && <div className="text-danger">{errors.image}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Address</label>
            <input
              type="text"
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              value={employee.address}
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
            {errors.address && <div className="text-danger">{errors.address}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={employee.password}
                onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                value={employee.confirmPassword}
                onChange={(e) => setEmployee({ ...employee, confirmPassword: e.target.value })}
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeDetails;
