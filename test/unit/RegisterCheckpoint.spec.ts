import { RegisterCheckpointUseCase } from '@tracking/application/use-cases';
import {
  ICheckpointRepository,
  IUnitRepository,
} from '@tracking/domain/repositories';
import { CheckpointStatus } from '@tracking/domain/entities';
import {
  ValidationError,
  InvalidCheckpointStatusError,
  UnitNotFoundError,
  DuplicateCheckpointError,
} from '@shared/domain/errors';

describe('RegisterCheckpointUseCase', () => {
  let checkpointRepository: jest.Mocked<ICheckpointRepository>;
  let unitRepository: jest.Mocked<IUnitRepository>;
  let useCase: RegisterCheckpointUseCase;

  beforeEach(() => {
    checkpointRepository = {
      create: jest.fn(),
      findByTrackingId: jest.fn(),
      findByUnitId: jest.fn(),
      exists: jest.fn(),
    };

    unitRepository = {
      findById: jest.fn(),
      findByTrackingId: jest.fn(),
      findByStatus: jest.fn(),
      update: jest.fn(),
      exists: jest.fn(),
    };

    useCase = new RegisterCheckpointUseCase(
      checkpointRepository,
      unitRepository,
    );
  });

  it('should create a checkpoint successfully', async () => {
    // Arrange
    const dto = {
      unitId: 'UNIT001',
      trackingId: 'TRK001',
      status: CheckpointStatus.IN_TRANSIT,
      location: 'Test Location',
      description: 'Test Description',
    };

    const updateStatusMock = jest.fn();
    unitRepository.exists.mockResolvedValue(true);
    unitRepository.findById.mockResolvedValue({
      id: dto.unitId,
      trackingId: dto.trackingId,
      currentStatus: CheckpointStatus.CREATED,
      updateStatus: updateStatusMock,
      createdAt: new Date(),
      lastUpdated: new Date(),
    });
    checkpointRepository.exists.mockResolvedValue(false);
    checkpointRepository.create.mockImplementation(
      async (checkpoint) => checkpoint,
    );

    // Act
    const result = await useCase.execute(dto);

    // Assert
    expect(result).toEqual(
      expect.objectContaining({
        unitId: dto.unitId,
        trackingId: dto.trackingId,
        status: dto.status,
        location: dto.location,
        description: dto.description,
      }),
    );
    expect(checkpointRepository.create).toHaveBeenCalled();
    expect(unitRepository.update).toHaveBeenCalled();
  });

  it('should throw ValidationError when required fields are missing', async () => {
    // Arrange
    const dto = {
      unitId: '',
      trackingId: '',
      status: '',
      location: '',
      description: '',
    }; // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow(ValidationError);
  });

  it('should throw InvalidCheckpointStatusError when status is invalid', async () => {
    // Arrange
    const dto = {
      unitId: 'UNIT001',
      trackingId: 'TRK001',
      status: 'INVALID_STATUS',
    };

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow(
      InvalidCheckpointStatusError,
    );
  });

  it('should throw UnitNotFoundError when unit does not exist', async () => {
    // Arrange
    const dto = {
      unitId: 'NONEXISTENT',
      trackingId: 'TRK001',
      status: CheckpointStatus.IN_TRANSIT,
    };

    unitRepository.exists.mockResolvedValue(false);

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow(UnitNotFoundError);
  });

  it('should throw DuplicateCheckpointError when checkpoint already exists', async () => {
    // Arrange
    const dto = {
      unitId: 'UNIT001',
      trackingId: 'TRK001',
      status: CheckpointStatus.IN_TRANSIT,
    };

    unitRepository.exists.mockResolvedValue(true);
    checkpointRepository.exists.mockResolvedValue(true);

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow(
      DuplicateCheckpointError,
    );
  });
});
