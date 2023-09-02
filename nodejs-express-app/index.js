const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const promMid = require("express-prometheus-middleware");

dotenv.config();

const PORT = process.env.PORT;
const AUTH = process.env.AUTH_TYPE + " " + process.env.AUTH_TOKEN;

const app = express();

// CORS middleware
app.use(
  cors({
    origin: "*",
  })
);

// Auth middleware
app.use(function (req, res, next) {
  if (!req.headers.authorization || req.headers.authorization !== AUTH) {
    return res
      .status(403)
      .json({ error: "Invalid or no credentials. Access Forbidden." });
  }

  next();
});

// Prometheus middleware
app.use(
  promMid({
    metricsPath: "/metrics",
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    // authenticate: (req) => req.headers.authorization === `${auth_header}`, // Skipped as auth is already done above by "auth middleware"
  })
);

app.get("/time", (req, res) => {
  const serverEpochTime = Math.round(Date.now() / 1000);

  return res.json({
    epoch: serverEpochTime,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;
