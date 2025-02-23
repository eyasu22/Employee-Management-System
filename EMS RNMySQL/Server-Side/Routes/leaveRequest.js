import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

// ✅ Create a MySQL connection
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Change this if your MySQL user is different
  password: '',  // Add your password if applicable
  database: 'employees'
});

// ✅ POST: Create a new leave request
router.post('/leaves', async (req, res) => {
  const { employeeName, reason, startDate, endDate } = req.body;

  try {
    const [result] = await db.execute(
      'INSERT INTO leave_requests (employee_name, reason, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
      [employeeName, reason, startDate, endDate, 'Pending']
    );

    res.status(201).json({ 
      id: result.insertId, 
      employeeName, 
      reason, 
      startDate, 
      endDate, 
      status: 'Pending' 
    });
  } catch (error) {
    console.error("❌ Error submitting leave request:", error);
    res.status(500).json({ message: 'Error submitting leave request', error });
  }
});

export { router };
