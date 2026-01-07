const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const client = require("prom-client");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// ===== Prometheus metrics =====
client.collectDefaultMetrics({ prefix: "node_" });

// Histogram pour latence HTTP
const httpRequestDurationMs = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [5, 10, 25, 50, 100, 200, 400, 800, 1500, 3000],
});

// Middleware pour mesurer le temps des requêtes
app.use((req, res, next) => {
  const end = httpRequestDurationMs.startTimer();
  res.on("finish", () => {
    // ⚠️ req.route existe seulement après matching d’une route express
    const route = req.route?.path || req.path || "unknown";
    end({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
  });
  next();
});

// ===== Middlewares =====
app.use(express.json());
app.use(morgan("dev"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.setHeader("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Routes
app.use("/api/projects", projectRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI || process.env.DB_URL).then(() => {
  app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
});
