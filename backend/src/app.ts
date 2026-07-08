import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import resumeRoutes from "./routes/resume.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Basic abuse protection on the AI-calling endpoints.
  app.use(
    "/api/resume",
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 30,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, error: { message: "Too many requests. Please slow down." } },
    })
  );

  app.get("/api/health", (_req, res) => {
    res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api/resume", resumeRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
