import cors from "cors";
import express from "express";
import { ENV } from "./config/env";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/auth.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Public endpoints — the only routes that DON'T need a token
app.use("/api/auth", authRoutes);

// Example protected route — proves the JWT middleware works
app.get("/api/me", authenticate, (req, res) => {
  res.json({ success: true, data: req.user });
});

// Must come after all routes
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`RxTrack API listening on http://localhost:${ENV.PORT}`);
});