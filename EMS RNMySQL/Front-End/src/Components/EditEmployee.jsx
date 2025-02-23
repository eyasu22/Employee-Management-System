import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
    category_id: "",
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/category');
        if (response.data.Status) {
          setCategory(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchEmployee = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage

      if (!token) {
        alert('No token found. Please log in again.');
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
      };

      try {
        const response = await axios.get(`http://localhost:3000/auth/employees/${id}`, config);
        setEmployee({
          name: response.data.Result[0].name,
          email: response.data.Result[0].email,
          address: response.data.Result[0].address,
          salary: response.data.Result[0].salary,
          category_id: response.data.Result[0].category_id,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchCategories();
    fetchEmployee();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate salary
    if (parseFloat(employee.salary) <= 0) {
      alert("Salary must be greater than 0.");
      return; // Prevent form submission if salary is invalid
    }
  
    const token = localStorage.getItem("token"); // Get the token from localStorage
  
    if (!token) {
      alert("No token found. Please log in again.");
      navigate("/login");
      return;
    }
  
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`, // Include the token in the headers
      },
    };
  
    try {
      const response = await axios.put(
        `http://localhost:3000/auth/edit_employee/${id}`,
        employee,
        config
      );
      if (response.data.Status) {
        navigate("/dashboard/employee");
      } else {
        alert(response.data.Error);
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Employee</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail4" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail4"
              placeholder="Enter Email"
              autoComplete="off"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>
          <div className='col-12'>
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              autoComplete="off"
              value={employee.salary}
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="1234 Main St"
              autoComplete="off"
              value={employee.address}
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              value={employee.category_id} // Ensure the select element has the correct value
              onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
            >
              {category.map((c) => {
                return <option key={c.id} value={c.id}>{c.name}</option>;
              })}
            </select>
          </div>
          
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;