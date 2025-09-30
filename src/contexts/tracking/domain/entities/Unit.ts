import { CheckpointStatus } from './CheckpointStatus';

export class Unit {
  public readonly id: string;
  public readonly trackingId: string;
  public currentStatus: CheckpointStatus;
  public readonly createdAt: Date;
  public lastUpdated: Date;

  constructor(params: {
    id: string;
    trackingId: string;
    currentStatus: CheckpointStatus;
    createdAt?: Date;
    lastUpdated?: Date;
  }) {
    this.id = params.id;
    this.trackingId = params.trackingId;
    this.currentStatus = params.currentStatus;
    this.createdAt = params.createdAt || new Date();
    this.lastUpdated = params.lastUpdated || new Date();
  }

  updateStatus(newStatus: CheckpointStatus): void {
    this.currentStatus = newStatus;
    this.lastUpdated = new Date();
  }
}
