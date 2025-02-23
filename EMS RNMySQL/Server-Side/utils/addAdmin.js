import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

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
  return await bcrypt.hash(plainPassword, saltRounds);
};

const addUser = async (
  name,
  email,
  plainPassword,
  address,
  phone,
  profile_image
) => {
  const hashedPassword = await hashPassword(plainPassword);
  const sql = `INSERT INTO admin (name, email, password, address, phone, profile_image) VALUES (?, ?, ?, ?, ?, ?)`;
  try {
    await pool.query(sql, [
      name,
      email,
      hashedPassword,
      address,
      phone,
      profile_image,
    ]);
    console.log(`Admin ${name} added successfully.`);
  } catch (err) {
    console.error("Database error:", err);
  }
};

// **Adding Admin Users**
addUser(
  "Eyasu Degefe",
  "eyasudegefe@gmail.com",
  "eyasu123",
  "Hossana, Ethiopia",
  "1234567890",
  "eyu.jpeg"
);
addUser("Zola Tesfaye", "zola@example.com", "zola123", "Addis Ababa, Ethiopia", "9876543210", "zola.jpg");
addUser("Natnael Teshome", "nati@gmail.com", "nati123", "Adama, Ethiopia", "0912345678", "nati.jpg");
addUser("Hanna Mekonnen", "hanna@gmail.com", "hanna123", "Bahir Dar, Ethiopia", "0923456789", "hanna.jpg");
