export interface CreateCheckpointDTO {
  unitId: string;
  trackingId: string;
  status: string;
  timestamp?: string;
  location?: string;
  description?: string;
}

export interface CheckpointResponseDTO {
  id: string;
  unitId: string;
  trackingId: string;
  status: string;
  timestamp: string;
  location?: string;
  description?: string;
}