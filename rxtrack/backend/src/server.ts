import cors from "cors";
import express from "express";
import { ENV } from "./config/env";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/auth.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import prescriptionRoutes from "./routes/prescription.routes";
import fulfillmentRoutes from "./routes/fulfillment.routes";
import analyticsRoutes from "./routes/analytics.routes";   // add near the other route imports



const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Route mounting — /api/auth is public; other routers must enforce auth (either here or within their routers)
app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/fulfillments", fulfillmentRoutes);
app.use("/api/analytics", analyticsRoutes);   // add near app.use("/api/fulfillments", ...)

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