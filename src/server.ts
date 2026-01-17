import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const PORT = env.PORT || 8000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
