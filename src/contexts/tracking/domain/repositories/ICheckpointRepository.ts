import { Checkpoint, CheckpointStatus } from '@context/tracking/domain/entities';

export interface ICheckpointRepository {
  create(checkpoint: Checkpoint): Promise<Checkpoint>;
  findByTrackingId(trackingId: string): Promise<Checkpoint[]>;
  findByUnitId(unitId: string): Promise<Checkpoint[]>;
  exists(unitId: string, status: CheckpointStatus, timestamp: Date): Promise<boolean>;
}