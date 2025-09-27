import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterCheckpointUseCase } from '@tracking/application/use-cases';
import { CreateCheckpointDTO } from '@tracking/application/dto';

export class RegisterCheckpointController {
  constructor(
    private registerCheckpointUseCase: RegisterCheckpointUseCase
  ) {}

  async execute(
    request: FastifyRequest<{ Body: CreateCheckpointDTO }>,
    reply: FastifyReply
  ): Promise<void> {
    const result = await this.registerCheckpointUseCase.execute(request.body);
    reply.code(201).send(result);
  }
}