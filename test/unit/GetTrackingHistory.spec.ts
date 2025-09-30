import { GetTrackingHistoryUseCase } from '@tracking/application/use-cases';
import { Unit, Checkpoint, CheckpointStatus } from '@tracking/domain/entities';
import { ValidationError, TrackingNotFoundError } from '@shared/domain/errors';

describe('GetTrackingHistoryUseCase', () => {
  const mockUnitRepository = {
    findByTrackingId: jest.fn(),
    findById: jest.fn(),
    findByStatus: jest.fn(),
    update: jest.fn(),
    exists: jest.fn(),
  };

  const mockCheckpointRepository = {
    create: jest.fn(),
    findByTrackingId: jest.fn(),
    findByUnitId: jest.fn(),
    exists: jest.fn(),
  };

  const useCase = new GetTrackingHistoryUseCase(
    mockCheckpointRepository,
    mockUnitRepository,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get tracking history successfully', async () => {
    // Arrange
    const mockUnit = new Unit({
      id: 'UNIT001',
      trackingId: 'TRK001',
      currentStatus: CheckpointStatus.IN_TRANSIT,
    });

    const mockCheckpoints = [
      new Checkpoint({
        id: 'CP002',
        unitId: 'UNIT001',
        trackingId: 'TRK001',
        status: CheckpointStatus.IN_TRANSIT,
        timestamp: new Date('2025-09-30T13:00:00Z'),
        location: 'Miami',
        description: 'In transit',
      }),
      new Checkpoint({
        id: 'CP001',
        unitId: 'UNIT001',
        trackingId: 'TRK001',
        status: CheckpointStatus.CREATED,
        timestamp: new Date('2025-09-30T12:00:00Z'),
        location: 'New York',
        description: 'Package received',
      }),
    ];

    mockUnitRepository.findByTrackingId.mockResolvedValue(mockUnit);
    mockCheckpointRepository.findByTrackingId.mockResolvedValue(
      mockCheckpoints,
    );

    // Act
    const result = await useCase.execute('TRK001');

    // Assert
    expect(result.trackingId).toBe('TRK001');
    expect(result.unitId).toBe('UNIT001');
    expect(result.currentStatus).toBe(CheckpointStatus.IN_TRANSIT);
    expect(result.checkpoints).toHaveLength(2);
    expect(result.checkpoints[0].id).toBe('CP002'); // Most recent first
    expect(result.checkpoints[1].id).toBe('CP001');
    expect(mockUnitRepository.findByTrackingId).toHaveBeenCalledWith('TRK001');
    expect(mockCheckpointRepository.findByTrackingId).toHaveBeenCalledWith(
      'TRK001',
    );
  });

  it('should throw ValidationError when trackingId is not provided', async () => {
    await expect(useCase.execute('')).rejects.toThrow(ValidationError);
    await expect(useCase.execute(undefined as any)).rejects.toThrow(
      ValidationError,
    );
  });

  it('should throw TrackingNotFoundError when unit does not exist', async () => {
    mockUnitRepository.findByTrackingId.mockResolvedValue(null);
    await expect(useCase.execute('TRK999')).rejects.toThrow(
      TrackingNotFoundError,
    );
  });

  it('should return empty checkpoints array when no checkpoints exist', async () => {
    const mockUnit = new Unit({
      id: 'UNIT001',
      trackingId: 'TRK001',
      currentStatus: CheckpointStatus.CREATED,
    });

    mockUnitRepository.findByTrackingId.mockResolvedValue(mockUnit);
    mockCheckpointRepository.findByTrackingId.mockResolvedValue([]);

    const result = await useCase.execute('TRK001');

    expect(result.checkpoints).toHaveLength(0);
  });
});
