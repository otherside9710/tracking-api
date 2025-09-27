import { FastifyInstance } from 'fastify';
import { CheckpointSchemaValidator } from '@app/interfaces/tracking/http/validators';
import {
  GetTrackingHistoryController,
  ListUnitsByStatusController,
  RegisterCheckpointController
} from '@app/interfaces/tracking/http/controllers';
import { authMiddleware } from '@app/interfaces/tracking/http/middlewares';

export async function checkpointRoutes(
  fastify: FastifyInstance,
  getTrackingHistoryController: GetTrackingHistoryController,
  listUnitsByStatusController: ListUnitsByStatusController,
  registerCheckpointController: RegisterCheckpointController
): Promise<void> {
  fastify.post(
    '/api/v1/checkpoints',
    { 
      schema: CheckpointSchemaValidator.create(),
      onRequest: [authMiddleware]
    },
    registerCheckpointController.execute.bind(registerCheckpointController)
  );

  fastify.get(
    '/api/v1/tracking/:trackingId',
    { 
      schema: CheckpointSchemaValidator.getTracking(),
      onRequest: [authMiddleware]
    },
    getTrackingHistoryController.execute.bind(getTrackingHistoryController)
  );

  fastify.get(
    '/api/v1/shipments',
    { 
      schema: CheckpointSchemaValidator.listShipments(),
      onRequest: [authMiddleware]
    },
    listUnitsByStatusController.execute.bind(listUnitsByStatusController)
  );
}