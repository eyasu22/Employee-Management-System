import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Set up body parser
app.use(bodyParser.json());

// Set up MySQL connection
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

// Route to fetch all events (for both admin and employee)
app.get('/calendar', (req, res) => {
  db.query('SELECT * FROM events ORDER BY event_date', (err, results) => {
    if (err) {
      res.status(500).json({ message: 'Error fetching events' });
      return;
    }
    res.status(200).json(results);
  });
});

// Route to add an event (for admin only)
app.post('/calendar', (req, res) => {
  const { event_name, event_date, event_type, created_by } = req.body;
  
  if (!event_name || !event_date || !event_type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const query = 'INSERT INTO events (event_name, event_date, event_type, created_by) VALUES (?, ?, ?, ?)';
  db.query(query, [event_name, event_date, event_type, created_by], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error adding event' });
    }
    res.status(201).json({ id: result.insertId, event_name, event_date, event_type });
  });
});

// Route to edit an event (for admin only)
router.put("/calendar/:id", async (req, res) => {
  const { title, start_date, end_date } = req.body;
  const { id } = req.params;

  if (!title || !start_date || !end_date) {
    return res.status(400).json({ Status: false, Error: "Missing required fields" });
  }

  try {
    const sql = "UPDATE calendar SET title = ?, start_date = ?, end_date = ? WHERE id = ?";
    const values = [title, start_date, end_date, id];

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Event not found" });
    }

    return res.json({ Status: true, Message: "Event updated successfully" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ Status: false, Error: err.message });
  }
});


// Route to delete an event (for admin only)
app.delete('/calendar/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM events WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting event' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
