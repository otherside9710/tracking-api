import { CheckpointStatus } from '@tracking/domain/entities/CheckpointStatus';
import { CheckpointResponseDTO } from './CheckpointDTO';

export interface UnitResponseDTO {
  id: string;
  trackingId: string;
  currentStatus: CheckpointStatus;
  checkpointHistory: CheckpointResponseDTO[];
  lastUpdated: string;
  createdAt: string;
}
