import bcrypt from "bcrypt";
import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "employees", // Ensure this matches your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

const addUser = async (email, plainPassword) => {
  const hashedPassword = await hashPassword(plainPassword);
  const sql = "INSERT INTO employees (email, password) VALUES (?, ?)";
  pool.query(sql, [email, hashedPassword], (err, result) => {
    if (err) {
      console.error("Database error:", err);
    } else {
      console.log(`User ${email} added successfully.`);
    }
  });
};

// Example usage
addUser("eyasudegefe22@gmail.com", "Eyasudegefe22");

