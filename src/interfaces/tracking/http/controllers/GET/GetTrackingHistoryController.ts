import { FastifyRequest, FastifyReply } from 'fastify';
import { GetTrackingHistoryUseCase } from '@tracking/application/use-cases';

export class GetTrackingHistoryController {
  constructor(
    private getTrackingHistoryUseCase: GetTrackingHistoryUseCase
  ) {}

  async execute(
    request: FastifyRequest<{ Params: { trackingId: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const result = await this.getTrackingHistoryUseCase.execute(
      request.params.trackingId
    );
    reply.send(result);
  }
}