import { FastifyRequest, FastifyReply } from 'fastify';
import { GetTokenUseCase } from '@app/contexts/shared/token/application/use-cases';

export class GetTokenController {
  constructor(private readonly getTokenUseCase: GetTokenUseCase) {}

  async execute(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { username, password } = request.body as { username: string; password: string };
    const result = await this.getTokenUseCase.execute({ username, password });
    reply.send(result);
  }
}