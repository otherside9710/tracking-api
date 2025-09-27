import { FastifyInstance } from 'fastify';
import { CheckpointSchemaValidator } from '@app/interfaces/tracking/http/validators';
import {
  GetTrackingHistoryController,
  ListUnitsByStatusController,
  RegisterCheckpointController
} from '@app/interfaces/tracking/http/controllers';

export async function checkpointRoutes(
  fastify: FastifyInstance,
  getTrackingHistoryController: GetTrackingHistoryController,
  listUnitsByStatusController: ListUnitsByStatusController,
  registerCheckpointController: RegisterCheckpointController
): Promise<void> {
  fastify.post(
    '/api/v1/checkpoints',
    { schema: CheckpointSchemaValidator.create() },
    registerCheckpointController.execute.bind(registerCheckpointController)
  );

  fastify.get(
    '/api/v1/tracking/:trackingId',
    { schema: CheckpointSchemaValidator.getTracking() },
    getTrackingHistoryController.execute.bind(getTrackingHistoryController)
  );

  fastify.get(
    '/api/v1/shipments',
    { schema: CheckpointSchemaValidator.listShipments() },
    listUnitsByStatusController.execute.bind(listUnitsByStatusController)
  );
}