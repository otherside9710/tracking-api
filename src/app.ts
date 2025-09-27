import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config as dotenvConfig } from 'dotenv';
import { config, validateConfig } from '@app/config/environment';
import { InMemoryCheckpointRepository, InMemoryUnitRepository } from '@tracking/infrastructure/repositories';
import { RegisterCheckpointUseCase, GetTrackingHistoryUseCase, ListUnitsByStatusUseCase } from '@tracking/application/use-cases';
import { 
  GetTrackingHistoryController,
  ListUnitsByStatusController,
  RegisterCheckpointController
} from '@app/interfaces/tracking/http/controllers';
import { checkpointRoutes } from '@app/interfaces/tracking/http/routes';
import { errorHandler } from '@app/interfaces/tracking/http/middlewares';

dotenvConfig();
validateConfig();

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: config.logging.level,
      transport: config.server.environment !== 'production' ? {
        target: 'pino-pretty'
      } : undefined
    }
  });

  await fastify.register(cors, {
    origin: config.cors.allowedOrigins
  });
  
  await fastify.register(helmet);
  
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  // DI - Dependency Injection
  const checkpointRepository = new InMemoryCheckpointRepository();
  const unitRepository = new InMemoryUnitRepository();

  const registerCheckpointUseCase = new RegisterCheckpointUseCase(
    checkpointRepository,
    unitRepository
  );
  const getTrackingHistoryUseCase = new GetTrackingHistoryUseCase(
    checkpointRepository,
    unitRepository
  );
  const listUnitsByStatusUseCase = new ListUnitsByStatusUseCase(unitRepository);

  const getTrackingHistoryController = new GetTrackingHistoryController(
    getTrackingHistoryUseCase
  );
  
  const listUnitsByStatusController = new ListUnitsByStatusController(
    listUnitsByStatusUseCase
  );
  
  const registerCheckpointController = new RegisterCheckpointController(
    registerCheckpointUseCase
  );

  await checkpointRoutes(
    fastify,
    getTrackingHistoryController,
    listUnitsByStatusController,
    registerCheckpointController
  );

  fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  fastify.setErrorHandler(errorHandler);

  return fastify;
}