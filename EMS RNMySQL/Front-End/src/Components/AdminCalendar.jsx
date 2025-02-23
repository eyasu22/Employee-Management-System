// Components/AdminCalendar.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminCalendar = () => {
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("work");

  // For demonstration, load entries for a specific employee (or all entries)
  const loadCalendarEntries = () => {
    // Adjust this URL as needed (here we use employee_id = 1 as an example)
    axios.get("http://localhost:3000/calendar/view/1")
      .then((res) => {
        if (res.data.Status) {
          setCalendarEntries(res.data.Result);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadCalendarEntries();
  }, []);

  const handleAddEntry = () => {
    axios.post("http://localhost:3000/calendar/set", {
      employee_id: employeeId,
      date: date,
      status: status,
    })
      .then((res) => {
        if (res.data.Status) {
          // Optionally reload entries or append the new one
          loadCalendarEntries();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mt-4">
      <h2>Calendar Management</h2>
      <div className="mb-4">
        <label>
          Employee ID:{" "}
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Enter Employee ID"
          />
        </label>
        <br />
        <label>
          Date:{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Status:{" "}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="work">Work Day</option>
            <option value="holiday">Holiday</option>
            <option value="closed">Closed Day</option>
          </select>
        </label>
        <br />
        <button className="btn btn-primary mt-2" onClick={handleAddEntry}>
          Add Calendar Entry
        </button>
      </div>
      <h3>Calendar Entries</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {calendarEntries.length > 0 ? (
            calendarEntries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.employee_id}</td>
                <td>{entry.date}</td>
                <td>{entry.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No calendar entries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCalendar;
