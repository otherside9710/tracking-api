import { DomainError } from './DomainError';

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message, 'RESOURCE_NOT_FOUND', 404);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT_ERROR', 409);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ForbiddenError extends DomainError {
  constructor(message: string) {
    super(message, 'FORBIDDEN', 403);
  }
}