const express = require("express");
const authRoutes = require("./routes/authroutes");
const tripRoutes = require("./routes/triproutes");
const errorHandler = require("./middleware/errormiddleware");

const app = express();

app.use((req, res, next) => {
  const configuredOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
    : [];
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...configuredOrigins
  ];
  const requestOrigin = req.headers.origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    res.header("Access-Control-Allow-Origin", requestOrigin);
    res.header("Vary", "Origin");
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

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
