import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/leaves")
      .then((response) => {
        console.log("Fetched Leave Requests:", response.data); // Debugging
        setLeaves(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leave requests:", error.response?.data || error.message);
        setLoading(false);
      });
  }, []);
  

  const handleApprove = (id) => {
    axios.put(`http://localhost:3000/api/leaves/${id}/approve`)
      .then((response) => {
        console.log("Approval Response:", response.data);
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === id ? { ...leave, status: "Approved" } : leave
          )
        );
      })
      .catch((error) => console.error("Error approving leave:", error.response?.data || error.message));
  };
  
  const handleReject = (id) => {
    axios.put(`http://localhost:3000/api/leaves/${id}/reject`)
      .then((response) => {
        console.log("Rejection Response:", response.data);
        setLeaves((prev) =>
          prev.map((leave) =>
            leave.id === id ? { ...leave, status: "Rejected" } : leave
          )
        );
      })
      .catch((error) => console.error("Error rejecting leave:", error.response?.data || error.message));
  };
  

  return (
    <div className="container mt-4">
      <h2>Leave Management</h2>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.employeeName}</td>
                <td>{leave.reason}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.status}</td>
                <td>
                  {leave.status === "Pending" && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleApprove(leave._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReject(leave.id)}
                      >
                        Reject
                      </button>
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

export default LeaveManagement;
