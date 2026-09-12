import cors from "cors";
import express from "express";
import { ENV } from "./config/env";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/auth.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import prescriptionRoutes from "./routes/prescription.routes";
import fulfillmentRoutes from "./routes/fulfillment.routes";
import analyticsRoutes from "./routes/analytics.routes";
import medicineRoutes from "./routes/medicine.routes";
import pharmacyRoutes from "./routes/pharmacy.routes";



const app = express();

app.use(
  cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Route mounting — /api/auth is public; other routers must enforce auth (either here or within their routers)
app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/fulfillments", fulfillmentRoutes);
app.use("/api/analytics", analyticsRoutes);   // add near app.use("/api/fulfillments", ...)
app.use("/api/medicines", medicineRoutes);
app.use("/api/pharmacies", pharmacyRoutes);  // add near app.use("/api/medicines", ...)
app.get("/", (_req, res) => {
  res.json({
    name: "RxTrack API",
    status: "online",
    frontendUrl: "http://localhost:3000",
    message: "RxTrack backend server is running! Open the frontend web app at http://localhost:3000"
  });
});

// Example public route — proves the server is running and CORS works
app.get("/api/public", (_req, res) => {
  res.json({ success: true, data: "This is a public route" });
});

// Example protected route — proves the JWT middleware works
app.get("/api/protected", authenticate, (req, res) => {
  res.json({ success: true, data: `Hello ${req.user?.email}, you are authenticated!` });
});
// Example protected route — proves the JWT middleware works
app.get("/api/me", authenticate, (req, res) => {
  res.json({ success: true, data: req.user });
});

// Must come after all routes
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(ENV.PORT, '0.0.0.0', () => {
  console.log(`RxTrack API listening on http://localhost:${ENV.PORT}`);
});