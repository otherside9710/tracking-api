import { FastifyRequest, FastifyReply } from 'fastify';
import { DomainError } from '@shared/domain/errors';
import * as Sentry from '@sentry/node';
import { config } from '@app/config/environment';

if (!config.monitoring.sentryDsn) {
  console.warn('Sentry DSN no está configurado. El monitoring de errores estará deshabilitado.');
} else {
  Sentry.init({
    dsn: config.monitoring.sentryDsn,
    sendDefaultPii: true,
    environment: config.server.environment,
    tracesSampleRate: 1.0,
    integrations: [],
  });
}

interface ErrorWithStatusCode extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(
  error: ErrorWithStatusCode,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  let errorResponse: { statusCode: number; error: string; code: string };
  const timestamp = new Date().toISOString();

  if (error instanceof DomainError) {
    errorResponse = {
      statusCode: error.statusCode,
      error: error.message,
      code: error.code
    };
  } else if (error.statusCode) {
    errorResponse = {
      statusCode: error.statusCode,
      error: error.message,
      code: error.code || 'FASTIFY_ERROR'
    };
  } else {
    errorResponse = {
      statusCode: 500,
      error: 'Internal Server Error',
      code: 'INTERNAL_SERVER_ERROR'
    };
  }

  // Log local
  console.error({
    timestamp,
    method: request.method,
    url: request.url,
    ...errorResponse,
    stack: error.stack
  });

  // Enviar a Sentry con contexto adicional
  Sentry.withScope((scope) => {
    // Agregar tags útiles para filtrar
    scope.setTag('errorCode', errorResponse.code);
    scope.setTag('statusCode', errorResponse.statusCode.toString());
    scope.setTag('method', request.method);
    scope.setLevel(errorResponse.statusCode >= 500 ? 'error' : 'warning');

    // Agregar contexto adicional
    scope.setContext('request', {
      url: request.url,
      method: request.method,
      headers: request.headers,
      query: request.query,
      params: request.params,
      timestamp
    });

    // Agregar información del cliente
    scope.setUser({
      ip_address: request.ip
    });

    // Capturar el error con todo el contexto
    if (error instanceof DomainError) {
      Sentry.captureException(error);
    } else if (errorResponse.statusCode >= 500) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(error.message, 'warning');
    }
  });

  reply.status(errorResponse.statusCode).send(errorResponse);
}