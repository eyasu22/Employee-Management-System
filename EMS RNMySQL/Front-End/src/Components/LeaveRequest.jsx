import React, { useState } from 'react';
import axios from 'axios';
//import './LeaveRequest.css';

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    employee_id: '',  // Employee ID
    startDate: '',
    endDate: '',
    type: 'Sick Leave',
    reason: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/leave/request', formData)
      .then(response => {
        setMessage('Leave request submitted successfully!');
        setFormData({ employee_id: '', startDate: '', endDate: '', type: 'Sick Leave', reason: '' });
      })
      .catch(err => setMessage('Error submitting leave request.'));
  };

  return (
    <div className="leave-container">
      <h2>Request Leave</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <label>Employee ID:</label>
        <input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} required />

        <label>Start Date:</label>
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />

        <label>End Date:</label>
        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />

        <label>Leave Type:</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Paid Leave">Paid Leave</option>
        </select>

        <label>Reason:</label>
        <textarea name="reason" value={formData.reason} onChange={handleChange} required></textarea>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default LeaveRequest;
