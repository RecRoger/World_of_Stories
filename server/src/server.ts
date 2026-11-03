import mongoose from 'mongoose';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { createApp } from './app.js';

async function main() {
  await mongoose.connect(env.MONGODB_URI);
  logger.info('Conectado a MongoDB');

  const server = createApp().listen(env.PORT, () => {
    logger.info(`API en http://localhost:${env.PORT}/api/v1 · docs en http://localhost:${env.PORT}/docs`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} recibido, cerrando...`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  logger.fatal({ err }, 'No se pudo arrancar el servidor');
  process.exit(1);
});
