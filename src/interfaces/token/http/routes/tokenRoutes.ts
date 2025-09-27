import { FastifyInstance } from 'fastify';
import { GetTokenController } from '@app/interfaces/token/http/controllers';
import { TokenSchemaValidator } from '@app/interfaces/token/http/validators';

export async function tokenRoutes(
  fastify: FastifyInstance,
  getTokenController: GetTokenController
): Promise<void> {
  fastify.post(
    '/api/v1/token',
    { schema: TokenSchemaValidator.token },
    getTokenController.execute.bind(getTokenController)
  );
}