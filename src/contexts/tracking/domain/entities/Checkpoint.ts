import { CheckpointStatus } from './CheckpointStatus';

export class Checkpoint {
  public readonly id: string;
  public readonly unitId: string;
  public readonly trackingId: string;
  public readonly status: CheckpointStatus;
  public readonly timestamp: Date;
  public readonly location?: string;
  public readonly description?: string;
  public readonly createdAt: Date;

  constructor(params: {
    id: string;
    unitId: string;
    trackingId: string;
    status: CheckpointStatus;
    timestamp: Date;
    location?: string;
    description?: string;
    createdAt?: Date;
  }) {
    this.id = params.id;
    this.unitId = params.unitId;
    this.trackingId = params.trackingId;
    this.status = params.status;
    this.timestamp = params.timestamp;
    this.location = params.location;
    this.description = params.description;
    this.createdAt = params.createdAt || new Date();
  }
}