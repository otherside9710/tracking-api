import { ICheckpointRepository } from '@tracking/domain/repositories';
import { Checkpoint, CheckpointStatus } from '@tracking/domain/entities';

export class InMemoryCheckpointRepository implements ICheckpointRepository {
  private checkpoints: Map<string, Checkpoint> = new Map();

  async create(checkpoint: Checkpoint): Promise<Checkpoint> {
    this.checkpoints.set(checkpoint.id, checkpoint);
    return checkpoint;
  }

  async findByTrackingId(trackingId: string): Promise<Checkpoint[]> {
    return Array.from(this.checkpoints.values())
      .filter(cp => cp.trackingId === trackingId);
  }

  async findByUnitId(unitId: string): Promise<Checkpoint[]> {
    return Array.from(this.checkpoints.values())
      .filter(cp => cp.unitId === unitId);
  }

  async exists(unitId: string, status: CheckpointStatus, timestamp: Date): Promise<boolean> {
    return Array.from(this.checkpoints.values()).some(cp => 
      cp.unitId === unitId && 
      cp.status === status && 
      Math.abs(cp.timestamp.getTime() - timestamp.getTime()) < 1000 // 1 segundo de tolerance
    );
  }
}