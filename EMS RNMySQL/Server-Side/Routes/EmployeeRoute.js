import express from "express";
import pool from "../utils/db.js"; // Use the connection pool
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Middleware to verify JWT token and set req.user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from header
  console.log("Token received:", token);  // Log the token for debugging
  if (!token) {
    console.error("No token provided");
    return res.status(401).json({ message: "No token found. Please log in again." });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "fallback_secret_key",
    (err, user) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ message: "Token verification failed. Please log in again." });
      }
      req.user = user;
      next();
    }
  );
};

// Employee login route
router.post("/employee_login", async (req, res) => {
  console.log("Login Request Received:", req.body); // Debugging

  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ loginStatus: false, Error: "All fields are required!" });
  }

  const sql = "SELECT * FROM employees WHERE email = ?";
  try {
    const [result] = await pool.query(sql, [email]);
    if (result.length > 0) {
      const match = await bcrypt.compare(password, result[0].password);
      if (match) {
        const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key"; // Use environment variable for secret
        const token = jwt.sign(
          { id: result[0].id, role: "employee" },
          jwtSecret,
          { expiresIn: "7d" } // Set token expiration (1 hour)
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
          sameSite: "lax",
        });

        return res.json({
          loginStatus: true,
          id: result[0].id,
          role: "employee",
          message: "Login successful",
        });
      } else {
        return res.json({ loginStatus: false, Error: "Incorrect password!" });
      }
    } else {
      return res.json({ loginStatus: false, Error: "User not found!" });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ loginStatus: false, Error: "Database Error!" });
  }
});

// Get employee details route
router.get("/detail/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employees WHERE id = ?";
  try {
    const [result] = await pool.query(sql, [id]);
    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0] });
    } else {
      return res.json({ Status: false, Error: "Employee not found!" });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ Status: false, Error: "Database Error!" });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true, message: "Logged out successfully" });
});

// Submit leave request route
router.post('/leaves', async (req, res) => {
  const { employeeName, reason, startDate, endDate } = req.body;

  try {
    const [result] = await pool.execute(
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

// Employee views their calendar
router.get('/viewCalendar/:employee_id', authenticateToken, (req, res) => {
  const employeeId = req.params.employee_id;

  const query = 'SELECT * FROM calendar WHERE employee_id = ? ORDER BY date';
  pool.query(query, [employeeId], (err, results) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    res.status(200).json(results);
  });
});

// Add employee route
router.post("/add_employee", upload.single("image"), async (req, res) => {
  const sql = `INSERT INTO employees 
    (name, email, password, address, salary, image, category_id, phone_number, age, start_date) 
    VALUES (?)`;
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address,
      req.body.salary,
      req.file.filename,
      req.body.category_id,
      req.body.phone_number,
      req.body.age,
      req.body.start_date,
    ];
    await pool.query(sql, [values]);
    return res.json({ Status: true });
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: err });
  }
});
router.get('/employees', async (req, res) => {
  try {
    const { name, category_id, status } = req.query;

    // Build the query object based on filter parameters
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search for name
    }

    if (category_id) {
      query.category_id = category_id;
    }

    if (status) {
      query.status = status; // Filter by employee status (e.g., 'active', 'inactive')
    }

    // Find employees based on query
    const employees = await Employee.find(query);

    res.json({ Status: true, Result: employees });
  } catch (err) {
    res.status(500).json({ Status: false, Error: err.message });
  }
});

export { router as EmployeeRouter };
