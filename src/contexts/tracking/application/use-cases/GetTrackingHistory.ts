import { ICheckpointRepository, IUnitRepository } from '@tracking/domain/repositories';
import { TrackingHistoryDTO } from '@tracking/application/dto';
import { ValidationError, TrackingNotFoundError } from '@shared/domain/errors';

export class GetTrackingHistoryUseCase {
  constructor(
    private checkpointRepository: ICheckpointRepository,
    private unitRepository: IUnitRepository
  ) {}

  async execute(trackingId: string): Promise<TrackingHistoryDTO> {
    if (!trackingId) {
      throw new ValidationError('TrackingId is required');
    }

    const unit = await this.unitRepository.findByTrackingId(trackingId);
    if (!unit) {
      throw new TrackingNotFoundError(trackingId);
    }

    const checkpoints = await this.checkpointRepository.findByTrackingId(trackingId);
    
    const sortedCheckpoints = checkpoints.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    return {
      trackingId: unit.trackingId,
      unitId: unit.id,
      currentStatus: unit.currentStatus,
      checkpoints: sortedCheckpoints.map(cp => ({
        id: cp.id,
        unitId: cp.unitId,
        trackingId: cp.trackingId,
        status: cp.status,
        timestamp: cp.timestamp.toISOString(),
        location: cp.location,
        description: cp.description
      }))
    };
  }
}