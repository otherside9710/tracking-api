import { CheckpointResponseDTO } from './CheckpointDTO';

export interface TrackingHistoryDTO {
  trackingId: string;
  unitId: string;
  currentStatus: string;
  checkpoints: CheckpointResponseDTO[];
}