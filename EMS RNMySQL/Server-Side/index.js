import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mysql from "mysql2";

const app = express();

// ✅ Fixed CORS issue
app.use(cors({
    origin: "http://localhost:5173", // Removed the trailing slash
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/auth', adminRouter);
app.use('/employee', EmployeeRouter);
app.use(express.static('Public'));

// ✅ Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Update with your MySQL username
    password: '', // Update with your MySQL password
    database: 'employees'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// ✅ Verify User Middleware
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Wrong Token" });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.json({ Status: false, Error: "Not authenticated" });
    }
};

// ✅ Calendar Routes

// Route to get all events (admin and employee can access)
app.get('/calendar', verifyUser, (req, res) => {
    db.query('SELECT * FROM events ORDER BY event_date', (err, results) => {
        if (err) {
            console.error("Error fetching events:", err);
            return res.status(500).json({ message: 'Error fetching events' });
        }
        console.log("Fetched Events:", results); // Log the events fetched from the DB
        res.status(200).json(results);
    });
});

// Route to add an event (admin only)
app.post('/calendar', async (req, res) => {
    try {
        const { event_name, event_date, event_type, created_by } = req.body;

        if (!event_name || !event_date || !event_type || !created_by) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const sql = `INSERT INTO events (event_name, event_date, event_type, created_by) VALUES (?, ?, ?, ?)`;
        const values = [event_name, event_date, event_type, created_by];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Error adding event", error: err });
            }
            console.log("Inserted Event:", result); // Log the result after inserting
            res.status(201).json({ id: result.insertId, ...req.body });
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

// Route to edit an event (admin only)
app.put('/calendar/:id', (req, res) => {
    const { id } = req.params;
    const { event_name, event_date, event_type } = req.body;

    const query = 'UPDATE events SET event_name = ?, event_date = ?, event_type = ? WHERE id = ?';
    db.query(query, [event_name, event_date, event_type, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error updating event' });
        }
        res.status(200).send({ message: 'Event updated successfully' });
    });
});

// ✅ Delete an event
app.delete('/calendar/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM events WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error deleting event' });
        }
        res.status(200).send({ message: 'Event deleted successfully' });
    });
});

// ✅ Verification Route
app.get('/verify', verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

// Admin Toggle Status
app.put("/auth/toggle_admin/:id", (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;

    const sql = "UPDATE admins SET is_active = ? WHERE id = ?";
    db.query(sql, [is_active, id], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: err });
        }
        return res.json({ Status: true, Message: "Status Updated Successfully" });
    });
});

// Admin creation
app.post('/api/admin', (req, res) => {
    console.log('Request received at /api/admin');
    console.log('Request body:', req.body);

    const { name, email, password, address, phone, profile_image, is_active } = req.body;

    // Ensure all required fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    res.status(201).json({ message: 'Admin added successfully' });
});
// ✅ Calendar Routes

// Route to get all events (only employee or admin can access)
app.get("/api/events", (req, res) => {
    const sql = "SELECT * FROM events"; // Ensure this matches your database table
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
app.patch("/auth/update_employee_status/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE employees SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            return res.json({ Status: false, Error: err });
        }
        return res.json({ Status: true, Message: "Employee status updated successfully" });
    });
});

  
app.post("/api/leaves", (req, res) => {
    const { employee_id, reason, start_date, end_date } = req.body;
  
    if (!employee_id || !reason || !start_date || !end_date) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    const sql = "INSERT INTO leave_requests (employee_id, reason, start_date, end_date) VALUES (?, ?, ?, ?)";
    db.query(sql, [employee_id, reason, start_date, end_date], (err, result) => {
      if (err) {
        console.error("Error inserting leave request:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ Status: "Success", message: "Leave request submitted successfully!" });
    });
  });
  
  app.get("/api/leaves", (req, res) => {
    const query = "SELECT * FROM leave_requests";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching leave requests:", err);
        res.status(500).json({ error: "Database error" });
      } else {
        res.json(results);
      }
    });
  });
  // ✅ Approve Leave Request
app.put("/api/leaves/:id/approve", (req, res) => {
    const leaveId = req.params.id;
    const query = "UPDATE leave_requests SET status = 'Approved' WHERE id = ?";

    db.query(query, [leaveId], (err, result) => {
        if (err) {
            console.error("Error approving leave:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Leave request approved successfully!" });
    });
});

// ✅ Reject Leave Request
app.put("/api/leaves/:id/reject", (req, res) => {
    const leaveId = req.params.id;
    const query = "UPDATE leave_requests SET status = 'Rejected' WHERE id = ?";

    db.query(query, [leaveId], (err, result) => {
        if (err) {
            console.error("Error rejecting leave:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Leave request rejected successfully!" });
    });
});
// API Route: Fetch leave requests for a specific employee
app.get("/api/leaves/:employee_id", (req, res) => {
    const { employee_id } = req.params;

    const sql = "SELECT reason, start_date, end_date, status FROM leave_requests WHERE employee_id = ?";
    db.query(sql, [employee_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000; // Use environment variable for port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
