// controllers/calendarController.js
import db from "../util/db.js"; // Adjust the path if needed

// Create a new calendar entry (admin sets a day)
export const setCalendar = (req, res) => {
  const { employee_id, date, status } = req.body;
  const sql = "INSERT INTO employee_calendar (employee_id, date, status) VALUES (?, ?, ?)";
  db.query(sql, [employee_id, date, status], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: err.message });
    }
    res.status(201).json({ Status: true, Message: "Calendar entry added", Result: result });
  });
};

// Update an existing calendar entry (admin edits a day)
export const updateCalendar = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = "UPDATE employee_calendar SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: err.message });
    }
    res.json({ Status: true, Message: "Calendar entry updated", Result: result });
  });
};

// Get calendar entries for an employee (employee view)
export const getCalendar = (req, res) => {
  const { employee_id } = req.params;
  const sql = "SELECT * FROM employee_calendar WHERE employee_id = ? ORDER BY date ASC";
  db.query(sql, [employee_id], (err, results) => {
    if (err) {
      return res.status(500).json({ Status: false, Error: err.message });
    }
    res.json({ Status: true, Result: results });
  });
};
