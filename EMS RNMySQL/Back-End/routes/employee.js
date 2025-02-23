const express = require('express');
const router = express.Router();
const db = require('../db');

// Fetch employee details
router.get('/employee/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM employees WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: err.sqlMessage });
    }
    res.json({ Status: true, Result: result });
  });
});

// Update employee details
router.put('/edit_employee/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, salary, address, category_id } = req.body;
  const query = `
    UPDATE employees
    SET name = ?, email = ?, salary = ?, address = ?, category_id = ?
    WHERE id = ?
  `;
  db.query(query, [name, email, salary, address, category_id, id], (err, result) => {
    if (err) {
      return res.status(500).json({ Error: err.sqlMessage });
    }
    res.json({ Status: true, Result: result });
  });
});

// ...existing code...
module.exports = router;
