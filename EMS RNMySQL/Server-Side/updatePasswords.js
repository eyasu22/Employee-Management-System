import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "employees", // Ensure this matches your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const updatePasswords = async () => {
  try {
    const [admins] = await pool.query("SELECT id, password FROM admin");
    for (const admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await pool.query("UPDATE admin SET password = ? WHERE id = ?", [
        hashedPassword,
        admin.id,
      ]);
      console.log(`Password for admin with ID ${admin.id} has been hashed.`);
    }
    console.log("All passwords have been hashed.");
  } catch (err) {
    console.error("Error updating passwords:", err);
  }
};

updatePasswords();
