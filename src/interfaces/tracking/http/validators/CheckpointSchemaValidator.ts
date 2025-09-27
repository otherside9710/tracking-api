import { FastifySchema } from 'fastify';

export class CheckpointSchemaValidator {
  static create(): FastifySchema {
    return {
      body: {
        type: 'object',
        required: ['unitId', 'trackingId', 'status'],
        properties: {
          unitId: { type: 'string' },
          trackingId: { type: 'string' },
          status: { 
            type: 'string',
            enum: ['CREATED', 'PICKED_UP', 'IN_TRANSIT', 'AT_FACILITY', 
                   'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION']
          },
          timestamp: { type: 'string', format: 'date-time' },
          location: { type: 'string' },
          description: { type: 'string' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            unitId: { type: 'string' },
            trackingId: { type: 'string' },
            status: { type: 'string' },
            timestamp: { type: 'string' },
            location: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    };
  }

  static getTracking(): FastifySchema {
    return {
      params: {
        type: 'object',
        properties: {
          trackingId: { type: 'string' }
        },
        required: ['trackingId']
      }
    };
  }

  static listShipments(): FastifySchema {
    return {
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string' }
        }
      }
    };
  }
}