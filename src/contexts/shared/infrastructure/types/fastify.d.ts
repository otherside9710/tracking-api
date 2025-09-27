import '@fastify/jwt'
import { JwtPayload } from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload
  }
}