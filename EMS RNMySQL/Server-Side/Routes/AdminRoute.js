import express from "express";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import cookieParser from "cookie-parser";
 // or require('express') if using CommonJS
const app = express(); // Initialize the app

const router = express.Router();
router.use(cookieParser());


const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "employees", // Ensure this matches your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const JWT_SECRET_KEY = "jwt_secret_key"; // Define the secret key

// Middleware to verify JWT token and set req.user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.error("No token provided");
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

router.post("/adminlogin", async (req, res) => {
  console.log("Login Request Received:", req.body); // Debugging

  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ loginStatus: false, Error: "All fields are required!" });
  }

  const sql = "SELECT * FROM admin WHERE email = ?";
  try {
    const [result] = await pool.query(sql, [email]);
    if (result.length > 0) {
      const match = await bcrypt.compare(password, result[0].password);
      if (match) {
        const token = jwt.sign(
          { id: result[0].id, role: "admin" },
          JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return res.json({
          loginStatus: true,
          token, // Include the token in the response
          id: result[0].id,
          role: "admin", // Ensure the role is set to "admin"
        });
      } else {
        return res.json({ loginStatus: false, Error: "Incorrect password!" });
      }
    } else {
      return res.json({ loginStatus: false, Error: "User not found!" });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res
      .status(500)
      .json({ loginStatus: false, Error: "Database Error!" });
  }
});

router.get("/category", async (req, res) => {
  const sql = "SELECT * FROM category";
  try {
    const [result] = await pool.query(sql);
    return res.json({ Status: true, Result: result });
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" });
  }
});

router.post("/add_category", async (req, res) => {
  const sql = "INSERT INTO category (`name`) VALUES (?)";
  try {
    await pool.query(sql, [req.body.category]);
    return res.json({ Status: true });
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" });
  }
});

// Add employee
// Add employee
router.post("/add_employee", upload.single("image"), async (req, res) => {
  const sql = `INSERT INTO employees 
    (name, email, password, address, salary, image, category_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  try {
    const hash = await bcrypt.hash(req.body.password, 10); // Hash password
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.address || null,  // Handle NULL values
      req.body.salary || null,
      req.file ? req.file.filename : null, // Handle file upload
      req.body.category_id || null,
    ];
    await pool.query(sql, values);
    return res.json({ Status: true, Message: "Employee added successfully" });
  } catch (err) {
    console.error("Query error:", err);
    return res.status(500).json({ Status: false, Error: err });
  }
});
app.put("/calendar/:id", (req, res) => {
  const eventId = req.params.id;
  const { event_name, event_date, event_type, created_by } = req.body;

  if (!eventId) {
    return res.status(400).json({ error: "Event ID is required" });
  }

  // ✅ Ensure `connection` is used here
  const sql = `UPDATE calendar_events SET event_name = ?, event_date = ?, event_type = ?, created_by = ? WHERE id = ?`;

  connection.query(sql, [event_name, event_date, event_type, created_by, eventId], (err, result) => {
    if (err) {
      console.error("Error updating event:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Event updated successfully", result });
  });
});

app.put("/auth/toggle_admin/:id", (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;
  const sql = "UPDATE admin SET is_active = ? WHERE id = ?";
  
  db.query(sql, [is_active, id], (err, result) => {
      if (err) {
          return res.json({ Status: false, Error: err.message });
      }
      return res.json({ Status: true, Message: "Admin status updated successfully!" });
  });
});


router.get("/employees", async (req, res) => {
  const sql = "SELECT * FROM employees";
  try {
    const [result] = await pool.query(sql);
    return res.json({ Status: true, Result: result });
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" });
  }
});

router.get("/employee/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employees WHERE id = ?";
  try {
    const [result] = await pool.query(sql, [id]);
    return res.json({ Status: true, Result: result });
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" });
  }
});

router.put(
  "/edit_employee/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const id = req.params.id;
    const { name, email, address, salary, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
      // Check if employee exists
      const checkSql = "SELECT * FROM employees WHERE id = ?";
      const [employee] = await pool.query(checkSql, [id]);
      if (employee.length === 0) {
        return res
          .status(404)
          .json({ Status: false, Error: "Employee not found" });
      }
      app.patch("/auth/update_employee_status/:id", (req, res) => {
        console.log("Request body:", req.body); // Log the incoming request data
      
        const employeeId = req.params.id;
        const { status } = req.body;
      
        if (status) {
          console.log(`Updating status for employee ${employeeId} to ${status}`);
          // Logic to update employee status
          return res.status(200).json({ Status: "Success", message: "Employee status updated" });
        } else {
          console.log("Status not provided");
          return res.status(400).json({ Status: "Error", message: "Invalid status" });
        }
      });
      

      // Prepare update query
      let sql, values;
      if (image) {
        sql = `UPDATE employees SET name = ?, email = ?, address = ?, salary = ?, category_id = ?, image = ? WHERE id = ?`;
        values = [name, email, address, salary, category_id, image, id];
      } else {
        sql = `UPDATE employees SET name = ?, email = ?, address = ?, salary = ?, category_id = ? WHERE id = ?`;
        values = [name, email, address, salary, category_id, id];
      }

      // Execute update query
      await pool.query(sql, values);
      res.json({ Status: true, Message: "Employee updated successfully" });
    } catch (err) {
      console.error("Error updating employee:", err);
      res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
  }
);

router.patch("/update_employee_status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const query = "UPDATE employees SET status = ? WHERE id = ?";
    const [result] = await db.query(query, [status, id]);

    if (result.affectedRows > 0) {
      res.json({ Status: true, Message: "Employee status updated successfully" });
    } else {
      res.json({ Status: false, Error: "Failed to update employee status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, Error: "Server error" });
  }
});


/*router.delete("/delete_admin/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM admin WHERE id = ?";
  try {
    const [result] = await pool.query(sql, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Admin not found" });
    }
    return res.json({ Status: true, Message: "Admin deleted successfully" });
  } catch (err) {
    console.error("Query error:", err);
    return res.status(500).json({ Status: false, Error: "Query Error" });
  }
});*/

router.get("/admin_count", async (req, res) => {
  const sql = "SELECT COUNT(id) AS admin FROM admin";
  try {
    const [result] = await pool.query(sql);
    return res.json({ Status: true, Result: result });
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" + err });
  }
});

router.get("/employee_count", async (req, res) => {
  const sql = "SELECT COUNT(id) AS employee FROM employees";
  try {
    const [result] = await pool.query(sql);
    return res.json({ Status: true, Result: result });
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" + err });
  }
});

router.get("/salary_count", async (req, res) => {
  const sql = "SELECT SUM(salary) AS salaryOFEmp FROM employees";
  try {
    const [result] = await pool.query(sql);
    return res.json({ Status: true, Result: result });
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" + err });
  }
});

router.get("/admin_records", async (req, res) => {
  const sql = "SELECT * FROM admin";
  try {
    const [result] = await pool.query(sql);
    return res.json({ Status: true, Result: result });
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" + err });
  }
});

router.get("/admin_profile", authenticateToken, async (req, res) => {
  const sql = "SELECT * FROM admin WHERE id = ?";
  const adminId = req.user.id;
  
  try {
    const [result] = await pool.query(sql, [adminId]);
    console.log("Database Query Result:", result); // Debugging: Log the full result

    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0] });
    } else {
      return res.json({ Status: false, Error: "Admin not found" });
    }
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" });
  }
});


router.get("/admin/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  console.log(`Fetching admin with id: ${id}`); // Debugging line
  const sql = "SELECT * FROM admin WHERE id = ?";
  try {
    const [result] = await pool.query(sql, [id]);
    if (result.length > 0) {
      console.log("Admin found:", result[0]); // Debugging line
      return res.json({ Status: true, Result: result[0] });
    } else {
      console.log("Admin not found"); // Debugging line
      return res.json({ Status: false, Error: "Admin not found" });
    }
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" });
  }
});

// Update admin profile
{/*router.put(
  "/edit_admin/:id",
  authenticateToken,
  upload.single("profile_image"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, address, phone } = req.body;
      const profileImage = req.file ? req.file.filename : null;

      console.log("Request Body:", req.body);
      console.log("Uploaded File:", req.file);

      // Check if admin exists
      const checkSql = "SELECT * FROM admin WHERE id = ?";
      const [admin] = await pool.query(checkSql, [id]);
      if (admin.length === 0) {
        return res
          .status(404)
          .json({ Status: false, Error: "Admin not found" });
      }

      // Prepare update query
      let sql, values;
      if (profileImage) {
        sql = `UPDATE admin SET name = ?, email = ?, address = ?, phone = ?, profile_image = ? WHERE id = ?`;
        values = [name, email, address, phone, profileImage, id];
      } else {
        sql = `UPDATE admin SET name = ?, email = ?, address = ?, phone = ? WHERE id = ?`;
        values = [name, email, address, phone, id];
      }

      // Execute update query
      await pool.query(sql, values);
      res.json({ Status: true, Message: "Admin profile updated successfully" });
    } catch (err) {
      console.error("Error updating admin:", err);
      res.status(500).json({ Status: false, Error: "Internal Server Error" });
    }
  }
);
*/}
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});


// 1. Request Leave (Employee)
router.post("/request_leave", authenticateToken, async (req, res) => {
  const { start_date, end_date, reason } = req.body;
  const employee_id = req.user.id; // Get employee ID from token

  if (!start_date || !end_date || !reason) {
    return res.status(400).json({ Status: false, Error: "All fields are required" });
  }

  const sql = "INSERT INTO leave_requests (employee_id, start_date, end_date, reason) VALUES (?, ?, ?, ?)";
  try {
    await pool.query(sql, [employee_id, start_date, end_date, reason]);
    return res.json({ Status: true, Message: "Leave request submitted successfully" });
  } catch (err) {
    console.error("Query error:", err);
    return res.status(500).json({ Status: false, Error: "Database Error" });
  }
});

// 2. View All Leave Requests (Admin)
router.get("/admin/leave_requests", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ Status: false, Error: "Access denied" });
  }

  const sql = "SELECT lr.*, e.name AS employee_name FROM leave_requests lr JOIN employees e ON lr.employee_id = e.id";
  try {
    const [result] = await pool.query(sql);
    return res.json({ Status: true, Result: result });
  } catch (err) {
    console.error("Query error:", err);
    return res.status(500).json({ Status: false, Error: "Database Error" });
  }
});

// 3. Update Leave Status (Admin Approve/Reject)
router.put("/admin/update_leave_status/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ Status: false, Error: "Access denied" });
  }

  const { status } = req.body; // Accepts 'Approved' or 'Rejected'
  const leaveId = req.params.id;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ Status: false, Error: "Invalid status" });
  }

  const sql = "UPDATE leave_requests SET status = ? WHERE id = ?";
  try {
    await pool.query(sql, [status, leaveId]);
    return res.json({ Status: true, Message: `Leave request ${status}` });
  } catch (err) {
    console.error("Query error:", err);
    return res.status(500).json({ Status: false, Error: "Database Error" });
  }
});

// 4. Delete Leave Request (Admin)
router.delete("/admin/delete_leave/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ Status: false, Error: "Access denied" });
  }

  const leaveId = req.params.id;
  const sql = "DELETE FROM leave_requests WHERE id = ?";

  try {
    const [result] = await pool.query(sql, [leaveId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Leave request not found" });
    }
    return res.json({ Status: true, Message: "Leave request deleted successfully" });
  } catch (err) {
    console.error("Query error:", err);
    return res.status(500).json({ Status: false, Error: "Database Error" });
  }
});



// Add a route to create the admin table with a phone number and profile image attribute
router.get("/create_admin_table", async (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS admin (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      address VARCHAR(255),
      phone VARCHAR(20),
      profile_image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    await pool.query(sql);
    return res.json({
      Status: true,
      Message: "Admin table created successfully",
    });
  } catch (err) {
    console.error("Query error:", err);
    return res.json({ Status: false, Error: "Query Error" });
  }
});
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
router.put("/admin/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdmin = await Admin.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ Error: "Admin not found" });
    }

    res.json({ Status: true, Message: "Admin updated successfully!", updatedAdmin });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ Error: "Server error while updating admin" });
  }
});

app.post("/api/admin", (req, res) => {
  console.log("Received Request Body:", req.body);

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  res.status(201).json({ message: "Admin added successfully", data: { name, email } });
});;

app.post('/calendar', async (req, res) => {
  const { event_name, event_date, event_type, created_by } = req.body;

  if (!event_name || !event_date || !event_type || !created_by) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sql = 'INSERT INTO calendar (event_name, event_date, event_type, created_by) VALUES (?, ?, ?, ?)';
    const values = [event_name, event_date, event_type, created_by];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/events', (req, res) => {
  const query = 'SELECT * FROM events';  // Modify the table name if necessary

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events:', err.message);  // Log the error message
      return res.status(500).json({ message: 'Internal Server Error', error: err.message });  // Send the error message as response
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No events found' });
    }

    res.status(200).json(results);  // Send the events as a JSON response
  });
});


export { router as adminRouter };
