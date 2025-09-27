import { FastifyRequest, FastifyReply } from 'fastify';
import { ListUnitsByStatusUseCase } from '@tracking/application/use-cases';

export class ListUnitsByStatusController {
  constructor(
    private listUnitsByStatusUseCase: ListUnitsByStatusUseCase
  ) {}

  async execute(
    request: FastifyRequest<{ Querystring: { status?: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const result = await this.listUnitsByStatusUseCase.execute(
      request.query.status
    );
    reply.send(result);
  }
}