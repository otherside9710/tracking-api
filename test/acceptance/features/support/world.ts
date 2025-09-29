import { World } from '@cucumber/cucumber';
import { FastifyInstance } from 'fastify';

export class CustomWorld extends World {
  app?: FastifyInstance;
  token?: string;
  response?: any;
}

export function getWorld(): CustomWorld {
  return this as CustomWorld;
}
