const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const client = require("prom-client"); // Prometheus metrics

const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Collecte des métriques Node.js par défaut (CPU, RAM, event loop, etc.)
client.collectDefaultMetrics({
  prefix: "node_",
});

app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

//  Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Prometheus metrics endpoint
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
  app.listen(PORT, () =>
    console.log(`API running on http://localhost:${PORT}`)
  );
});
