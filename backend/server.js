const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const client = require("prom-client");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Prometheus default metrics (CPU/RAM/event loop...)
client.collectDefaultMetrics({ prefix: "node_" });

// Health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.use("/api/projects", projectRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`✅ API running on :${PORT}`));
});
