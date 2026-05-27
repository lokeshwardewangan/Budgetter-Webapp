import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './shared/config/env.js';
import connectToDb from './shared/db/conn.js';
import { logger } from './shared/lib/logger.js';

const SHUTDOWN_TIMEOUT_MS = 10_000;

async function start(): Promise<void> {
  await connectToDb();
  const server = app.listen(env.PORT, () => {
    logger.info(`Server listening on PORT ${env.PORT}`);
  });

  const shutdown = (signal: string): void => {
    logger.info({ signal }, 'Shutting down');
    const forceExit = setTimeout(() => {
      logger.error('Shutdown timed out — forcing exit');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();

    server.close(async (err) => {
      if (err) logger.error({ err }, 'Error while closing HTTP server');
      try {
        await mongoose.disconnect();
      } catch (e) {
        logger.error({ err: e }, 'Error while disconnecting Mongoose');
      }
      clearTimeout(forceExit);
      process.exit(err ? 1 : 0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'Unhandled promise rejection');
  });
  process.on('uncaughtException', (err) => {
    logger.fatal({ err }, 'Uncaught exception');
    shutdown('uncaughtException');
  });
}

start().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
