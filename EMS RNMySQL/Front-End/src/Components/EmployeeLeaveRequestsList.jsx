import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeLeaveRequestsList = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch employee's leave requests from the backend
    axios.get('http://localhost:3000/api/leaves')
      .then((response) => {
        setLeaveRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching leave requests:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Your Leave Requests</h2>
      {loading ? (
        <p>Loading leave requests...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Employee Name</th>
              <th>Reason</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.employeeName}</td>
                <td>{leave.reason}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeLeaveRequestsList;
