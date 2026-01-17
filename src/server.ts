import app from "./app";
import prisma from "./config/db";
import { env } from "./config/env";
import { logger } from "./config/logger";

const PORT = env.PORT || 8000;

async function startServer() {
  try {
    logger.info("Checking database connection...");

    // 🔑 This is the Accelerate-safe DB check
    await prisma.$queryRaw`SELECT 1`;

    logger.info("Database connected successfully");

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info("Shutting down server...");

      server.close(async () => {
        await prisma.$disconnect();
        logger.info("Prisma disconnected");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("Failed to connect to database");
    logger.error(error);
    process.exit(1); // Do NOT start server
  }
}

startServer();
