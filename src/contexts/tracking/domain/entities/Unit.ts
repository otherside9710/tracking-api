import { CheckpointStatus } from './CheckpointStatus';
import { Checkpoint } from './Checkpoint';

export class Unit {
  public readonly id: string;
  public readonly trackingId: string;
  public currentStatus: CheckpointStatus;
  public readonly createdAt: Date;
  public lastUpdated: Date;
  public checkpointHistory: Checkpoint[];

  constructor(params: {
    id: string;
    trackingId: string;
    currentStatus: CheckpointStatus;
    createdAt?: Date;
    lastUpdated?: Date;
    checkpointHistory?: Checkpoint[];
  }) {
    this.id = params.id;
    this.trackingId = params.trackingId;
    this.currentStatus = params.currentStatus;
    this.createdAt = params.createdAt || new Date();
    this.lastUpdated = params.lastUpdated || new Date();
    this.checkpointHistory = params.checkpointHistory || [];
  }

  updateStatus(newStatus: CheckpointStatus, checkpoint: Checkpoint): void {
    this.currentStatus = newStatus;
    this.lastUpdated = new Date();
    this.checkpointHistory.push(checkpoint);
  }
}
