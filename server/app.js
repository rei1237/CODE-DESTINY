const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const paymentRoutes = require("./routes/payment.routes");
const fortuneRoutes = require("./routes/fortune.routes");

const app = express();

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((v) => v.trim())
  : true;

app.use(helmet());
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use("/api", globalLimiter);
app.use("/api/auth", authLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/fortune", fortuneRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "요청한 API 경로를 찾을 수 없습니다." });
});

app.use((err, req, res, next) => {
  console.error("[API ERROR]", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    message: err.message || "서버 내부 오류가 발생했습니다.",
  });
});

module.exports = app;
