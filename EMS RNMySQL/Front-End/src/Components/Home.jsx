import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import CSS
import Footer from "./Footer"; // Import Footer component

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminCount();
    fetchEmployeeCount();
    fetchSalaryCount();
    fetchAdminRecords();
  }, []);

  const fetchAdminRecords = () => {
    axios.get("http://localhost:3000/auth/admin_records").then((result) => {
      if (result.data.Status) {
        setAdmins(result.data.Result);
        setFilteredAdmins(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const fetchAdminCount = () => {
    axios.get("http://localhost:3000/auth/admin_count").then((result) => {
      if (result.data.Status) {
        setAdminTotal(result.data.Result[0].admin);
      }
    });
  };

  const fetchEmployeeCount = () => {
    axios.get("http://localhost:3000/auth/employee_count").then((result) => {
      if (result.data.Status) {
        setEmployeeTotal(result.data.Result[0].employee);
      }
    });
  };

  const fetchSalaryCount = () => {
    axios.get("http://localhost:3000/auth/salary_count").then((result) => {
      if (result.data.Status) {
        setSalaryTotal(result.data.Result[0].salaryOFEmp);
      } else {
        alert(result.data.Error);
      }
    });
  };

  const toggleAdminStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:3000/auth/toggle_admin/${id}`, {
        is_active: newStatus,
      });
  
      if (response.data.Status) {
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => !(admin.id === id && newStatus === 0))
        );
      } else {
        alert("Failed to update admin status!");
      }
    } catch (err) {
      console.error("Toggle Error:", err.response ? err.response.data : err.message);
      alert("Error updating status.");
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query === "") {
      setFilteredAdmins(admins); // Reset to show all if search is empty
    } else {
      setFilteredAdmins(admins.filter((admin) => admin.email.toLowerCase().includes(query.toLowerCase())));
    }
  };

  // Paginate Results
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdmins = filteredAdmins.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Number of pages based on filtered data
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredAdmins.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="home-container">
      <div className="stats-container">
        <div className="stat-card">
          <h4>Admin</h4>
          <h5>{adminTotal}</h5>
        </div>
        <div className="stat-card">
          <h4>Employee</h4>
          <h5>{employeeTotal}</h5>
        </div>
        <div className="stat-card">
          <h4>Salary</h4>
          <h5>{salaryTotal} Birr</h5>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Admin by Email"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="admin-list-container">
        <h3>Admin List</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentAdmins.map((a) => (
              <tr key={a.id} className={a.is_active ? "active" : "inactive"}>
                <td>{a.email}</td>
                <td>
                  <select
                    value={a.is_active}
                    onChange={(e) => toggleAdminStatus(a.id, parseInt(e.target.value))}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          {pageNumbers.map((number) => (
            <button key={number} onClick={() => paginate(number)} className="page-btn">
              {number}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
