import { DomainError } from './DomainError';

export class InvalidCheckpointStatusError extends DomainError {
  constructor(status: string) {
    super(`Invalid status: ${status}`, 'INVALID_CHECKPOINT_STATUS', 400);
  }
}

export class DuplicateCheckpointError extends DomainError {
  constructor() {
    super(
      'Checkpoint already exists for this unit, status, and timestamp',
      'DUPLICATE_CHECKPOINT',
      409
    );
  }
}

export class UnitNotFoundError extends DomainError {
  constructor(unitId: string) {
    super(`Unit with ID ${unitId} not found`, 'UNIT_NOT_FOUND', 404);
  }
}

export class TrackingNotFoundError extends DomainError {
  constructor(trackingId: string) {
    super(
      `No unit found with trackingId: ${trackingId}`,
      'TRACKING_NOT_FOUND',
      404
    );
  }
}