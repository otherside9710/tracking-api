import { IUnitRepository } from '@tracking/domain/repositories';
import { CheckpointStatus } from '@tracking/domain/entities';
import { UnitResponseDTO } from '@tracking/application/dto';
import { InvalidCheckpointStatusError } from '@shared/domain/errors';

export class ListUnitsByStatusUseCase {
  constructor(private unitRepository: IUnitRepository) {}

  async execute(status?: string): Promise<UnitResponseDTO[]> {
    if (
      status &&
      !Object.values(CheckpointStatus).includes(status as CheckpointStatus)
    ) {
      throw new InvalidCheckpointStatusError(status);
    }

    const units = status
      ? await this.unitRepository.findByStatus(status as CheckpointStatus)
      : await this.unitRepository.findByStatus(CheckpointStatus.CREATED);

    return units.map((unit) => ({
      id: unit.id,
      trackingId: unit.trackingId,
      currentStatus: unit.currentStatus,
      checkpointHistory: unit.checkpointHistory.map((checkpoint) => ({
        id: checkpoint.id,
        unitId: unit.id,
        trackingId: unit.trackingId,
        status: checkpoint.status,
        timestamp: checkpoint.timestamp.toISOString(),
        location: checkpoint.location,
        description: checkpoint.description,
      })),
      lastUpdated: unit.lastUpdated.toISOString(),
      createdAt: unit.createdAt.toISOString(),
    }));
  }
}
