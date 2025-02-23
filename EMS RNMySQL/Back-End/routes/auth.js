const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: err.sqlMessage });
    }
    if (result.length === 0) {
      return res.status(401).json({ Error: 'Wrong email or password' });
    }
    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ Error: err.message });
      }
      if (!isMatch) {
        return res.status(401).json({ Error: 'Wrong email or password' });
      }
      res.json({ Status: true, Result: user });
    });
  });
});

// ...existing code...
module.exports = router;
