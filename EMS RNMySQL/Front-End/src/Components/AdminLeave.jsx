import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './AdminLeave.css';

const AdminLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/leave/requests')
      .then(response => setLeaveRequests(response.data))
      .catch(error => console.error('Error fetching leave requests:', error));
  }, []);

  const handleUpdateStatus = (id, status) => {
    axios.put(`http://localhost:3000/leave/update/${id}`, { status })
      .then(response => {
        setLeaveRequests(prev =>
          prev.map(request => request.id === id ? { ...request, status } : request)
        );
      })
      .catch(error => console.error('Error updating status:', error));
  };

  return (
    <div className="admin-container">
      <h2>Admin - Leave Requests</h2>
      {leaveRequests.length === 0 ? <p>No leave requests found.</p> : (
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map(request => (
              <tr key={request.id}>
                <td>{request.employee_id}</td>
                <td>{request.start_date}</td>
                <td>{request.end_date}</td>
                <td>{request.type}</td>
                <td>{request.reason}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === 'Pending' && (
                    <>
                      <button className="approve" onClick={() => handleUpdateStatus(request.id, 'Approved')}>Approve</button>
                      <button className="reject" onClick={() => handleUpdateStatus(request.id, 'Rejected')}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminLeave;
