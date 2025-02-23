import express from "express";
const router = express.Router();

// API: Get All Calendar Events
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
  
  

// ✅ API: Add Event
router.post("/", (req, res) => {
  const { date, event_name, event_type, description, created_by } = req.body;
  const sql = "INSERT INTO calendar_events (date, event_name, event_type, description, created_by) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [date, event_name, event_type, description, created_by], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Event added successfully", eventId: result.insertId });
  });
});

// ✅ API: Delete Event
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM calendar_events WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Event deleted successfully" });
  });
});

export { router };
