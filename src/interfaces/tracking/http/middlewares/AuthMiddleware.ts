import { FastifyRequest, FastifyReply } from 'fastify';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const apiKey = request.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    reply.code(401).send({ error: 'Unauthorized' });
    return;
  }
}