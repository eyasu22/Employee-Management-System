import mysql from 'mysql2/promise';

// Create a MySQL pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employees', // Make sure this matches your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to add a calendar event
const addEvent = async (date, event_name, event_type) => {
  const sql = `INSERT INTO calendar_events (date, event_name, event_type) VALUES (?, ?, ?)`;
  try {
    const [result] = await pool.query(sql, [date, event_name, event_type]);
    console.log(`Event "${event_name}" added successfully with ID ${result.insertId}.`);
  } catch (err) {
    console.error('Database error:', err);
  }
};

// Add multiple calendar events
const events = [
  { date: '2025-02-26', event_name: 'fasiga', event_type: 'holiday' },
  { date: '2025-03-01', event_name: 'team_meeting', event_type: 'workday' },
  { date: '2025-04-15', event_name: 'conference', event_type: 'event' },
  { date: '2025-05-20', event_name: 'public_holiday', event_type: 'holiday' },
];

// Add each event
events.forEach(event => {
  addEvent(event.date, event.event_name, event.event_type);
});
