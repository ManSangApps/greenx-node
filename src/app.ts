import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

//Security Middleware
app.use(helmet());

// Parse JSON & URL-encoded payloads
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookie parser with secret
app.use(cookieParser(env.COOKIE_SECRET));

// CORS Middleware
const allowedOrigins = env.CORS_ORIGIN?.split(",") || [];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      // Allow configured origins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow localhost origins for development (Swagger UI)
      if (
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1")
      ) {
        return callback(null, true);
      }

      callback(new Error("CORS policy: This origin is not allowed"));
    },
    credentials: true,
  }),
);

/**
 * Swagger docs
 */
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Health check
 */
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

/**
 * Routes
 */
//API Versioning
const apiPrefix = "/api/v1";

app.use(`${apiPrefix}/auth`, authRoutes);

export default app;
