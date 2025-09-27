import { v4 as uuidv4 } from 'uuid';
import { ICheckpointRepository, IUnitRepository } from '@tracking/domain/repositories';
import { Checkpoint, CheckpointStatus } from '@tracking/domain/entities';
import { CreateCheckpointDTO, CheckpointResponseDTO } from '@tracking/application/dto';
import { 
  ValidationError,
  InvalidCheckpointStatusError,
  UnitNotFoundError,
  DuplicateCheckpointError
} from '@shared/domain/errors';

export class RegisterCheckpointUseCase {
  constructor(
    private checkpointRepository: ICheckpointRepository,
    private unitRepository: IUnitRepository
  ) {}

  async execute(dto: CreateCheckpointDTO): Promise<CheckpointResponseDTO> {
    if (!dto.unitId || !dto.trackingId || !dto.status) {
      throw new ValidationError('Missing required fields: unitId, trackingId, and status are required');
    }

    if (!Object.values(CheckpointStatus).includes(dto.status as CheckpointStatus)) {
      throw new InvalidCheckpointStatusError(dto.status);
    }

    const unitExists = await this.unitRepository.exists(dto.unitId);
    if (!unitExists) {
      throw new UnitNotFoundError(dto.unitId);
    }

    const timestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();
    
    const isDuplicate = await this.checkpointRepository.exists(
      dto.unitId,
      dto.status as CheckpointStatus,
      timestamp
    );
    
    if (isDuplicate) {
      throw new DuplicateCheckpointError();
    }

    const checkpoint = new Checkpoint({
      id: uuidv4(),
      unitId: dto.unitId,
      trackingId: dto.trackingId,
      status: dto.status as CheckpointStatus,
      timestamp,
      location: dto.location,
      description: dto.description
    });

    const savedCheckpoint = await this.checkpointRepository.create(checkpoint);

    const unit = await this.unitRepository.findById(dto.unitId);
    if (unit) {
      unit.updateStatus(dto.status as CheckpointStatus);
      await this.unitRepository.update(unit);
    }

    return {
      id: savedCheckpoint.id,
      unitId: savedCheckpoint.unitId,
      trackingId: savedCheckpoint.trackingId,
      status: savedCheckpoint.status,
      timestamp: savedCheckpoint.timestamp.toISOString(),
      location: savedCheckpoint.location,
      description: savedCheckpoint.description
    };
  }
}