const express = require("express");
const authRoutes = require("./routes/authroutes");
const tripRoutes = require("./routes/triproutes");
const errorHandler = require("./middleware/errormiddleware");

const app = express();


app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Travel Planner API Running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use(errorHandler);

module.exports = app;
