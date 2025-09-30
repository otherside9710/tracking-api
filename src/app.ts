import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config as dotenvConfig } from 'dotenv';
import { config, validateConfig } from '@app/config/environment';
import { checkpointRoutes } from '@app/interfaces/tracking/http/routes';
import { tokenRoutes } from '@app/interfaces/token/http/routes';
import { healthRoutes } from '@app/interfaces/health/routes/healthRoutes';
import { DependencyContainer } from '@app/config/dependencies';
import { errorHandler } from '@app/interfaces/tracking/http/middlewares';

dotenvConfig();
validateConfig();

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: config.logging.level,
      transport:
        config.server.environment !== 'production'
          ? {
              target: 'pino-pretty',
            }
          : undefined,
    },
  });

  await fastify.register(cors, {
    origin: config.cors.allowedOrigins,
  });

  await fastify.register(helmet);

  await fastify.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
  });

  //DI (Dependency Injection)
  const {
    getTrackingHistoryController,
    listUnitsByStatusController,
    registerCheckpointController,
    getTokenController,
  } = DependencyContainer.getControllers();

  // Register routes
  await healthRoutes(fastify);

  await checkpointRoutes(
    fastify,
    getTrackingHistoryController,
    listUnitsByStatusController,
    registerCheckpointController,
  );

  await tokenRoutes(fastify, getTokenController);

  fastify.setErrorHandler(errorHandler);

  return fastify;
}
