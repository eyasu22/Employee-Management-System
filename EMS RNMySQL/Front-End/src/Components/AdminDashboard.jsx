import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    category_id: '',
    status: '',
  });

  // Fetch categories for the category filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/category');
        setCategories(response.data.Result);
      } catch (err) {
        console.error('Error fetching categories', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch employees based on filter
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { name, category_id, status } = filters;
        const response = await axios.get('http://localhost:3000/auth/employees', {
          params: { name, category_id, status },
        });
        setEmployees(response.data.Result);
      } catch (err) {
        console.error('Error fetching employees', err);
      }
    };

    fetchEmployees();
  }, [filters]); // Refetch employees when filters change

  return (
    <div>
      <h2>Admin Dashboard - Employee Management</h2>

      {/* Search and Filter Section */}
      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />

        <select
          value={filters.category_id}
          onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Employees List */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.category_id}</td>
              <td>{employee.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
