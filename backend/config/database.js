const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "expense_tracker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection error:", err.message);
  } else {
    console.log("✅ Database connected successfully!");
    connection.release();
  }
});
const dbPromise = db.promise();
module.exports = dbPromise;
