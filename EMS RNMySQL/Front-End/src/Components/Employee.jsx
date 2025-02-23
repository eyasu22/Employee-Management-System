import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css"; // Make sure to update the CSS for this page

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      navigate("/login");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch the list of employees
    axios
      .get("http://localhost:3000/auth/employees", config)
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while fetching the employee data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      navigate("/login");
      return;
    }

    const config = {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.patch(
        `http://localhost:3000/auth/update_employee_status/${id}`,
        { status: newStatus },
        config
      );

      if (response.data.Status) {
        setEmployees((prevEmployees) => {
          const updatedEmployees = prevEmployees.map((e) =>
            e.id === id ? { ...e, status: newStatus } : e
          );
          // If the new status is "inactive", filter it out of the list
          if (newStatus === "inactive") {
            return updatedEmployees.filter((e) => e.status !== "inactive");
          }
          return updatedEmployees;
        });
        alert("Employee status updated successfully!");
      } else {
        alert(response.data.Error || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      alert(`An error occurred while updating the employee status: ${error.response?.data?.Error || error.message}`);
    }
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3 className="title-text">Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success mb-3">
        Add New Employee
      </Link>

      <div className="employee-table-container">
        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((e) => (
                  <tr key={e.id} className={e.status === "inactive" ? "text-muted" : ""}>
                    <td>
                      <img
                        src={`http://localhost:3000/Images/${e.image}`}
                        alt="Employee"
                        className="employee-image"
                      />
                    </td>
                    <td>{e.name}</td>
                    <td>{e.email}</td>
                    <td>{e.address}</td>
                    <td>{e.salary}</td>
                    <td>
                      <select
                        className={`status-select ${e.status === "active" ? "bg-success" : "bg-danger"}`}
                        value={e.status}
                        onChange={(event) => handleStatusChange(e.id, event.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <Link to={`/dashboard/edit_employee/${e.id}`} className="btn btn-info btn-sm">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Employee;
