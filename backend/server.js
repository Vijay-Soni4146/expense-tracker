const express = require("express");
const cors = require("cors");
const { requestLogger, responseLogger } = require("./middleware/logger");
const { errorHandler, notFound } = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });
  next();
});

app.use(requestLogger);
app.use(responseLogger);

// Routes
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/statistics", require("./routes/statistics"));
app.use("/api/users", require("./routes/users"));
app.use("/api/categories", require("./routes/categories"));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(` API is running: http://localhost:${PORT}/api`);
});
