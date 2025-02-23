import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EmployeeLeaveRequest = () => {
  const { id } = useParams(); // Get employee ID from the URL
  const [leaveData, setLeaveData] = useState({
    reason: "",
    startDate: "",
    endDate: "",
  });
  const [leaveRequests, setLeaveRequests] = useState([]); // Store leave requests
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Employee ID from URL:", id);
    fetchLeaveRequests();
  }, [id]);

  // Fetch leave requests from the database
  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/leaves/${id}`);
      setLeaveRequests(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in again.");
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
  
      const leaveRequest = {
        employee_id: id,
        reason: leaveData.reason,
        start_date: leaveData.startDate,
        end_date: leaveData.endDate,
      };
  
      console.log("Submitting Leave Request:", leaveRequest);
  
      const response = await axios.post("http://localhost:3000/api/leaves", leaveRequest, config);
  
      console.log("Response from Server:", response.data);
  
      if (response.data.Status === "Success") {
        alert("Leave request submitted successfully!");
        setLeaveData({ reason: "", startDate: "", endDate: "" });
        fetchLeaveRequests(); // Refresh leave requests after submission
      } else {
        alert("Error submitting leave request: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("An error occurred. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Submit Leave Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="reason" className="form-label">
            Reason
          </label>
          <textarea
            className="form-control"
            id="reason"
            value={leaveData.reason}
            onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">
            Start Date
          </label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            value={leaveData.startDate}
            onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">
            End Date
          </label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            value={leaveData.endDate}
            onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {/* Display Leave Requests */}
      <h3 className="mt-4">Leave Requests</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Reason</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No leave requests found.
              </td>
            </tr>
          ) : (
            leaveRequests.map((request, index) => (
              <tr key={index}>
                <td>{request.reason}</td>
                <td>{request.start_date}</td>
                <td>{request.end_date}</td>
                <td>
                  <span className={`badge ${request.status === "Approved" ? "bg-success" : request.status === "Rejected" ? "bg-danger" : "bg-warning"}`}>
                    {request.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeLeaveRequest;
