import { ListUnitsByStatusUseCase } from '@tracking/application/use-cases';
import { Unit, CheckpointStatus } from '@tracking/domain/entities';
import { InvalidCheckpointStatusError } from '@shared/domain/errors';

describe('ListUnitsByStatusUseCase', () => {
  const mockUnitRepository = {
    findByTrackingId: jest.fn(),
    findById: jest.fn(),
    findByStatus: jest.fn(),
    update: jest.fn(),
    exists: jest.fn(),
  };

  const useCase = new ListUnitsByStatusUseCase(mockUnitRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list units by provided status', async () => {
    const mockUnits = [
      new Unit({
        id: 'UNIT001',
        trackingId: 'TRK001',
        currentStatus: CheckpointStatus.IN_TRANSIT,
        lastUpdated: new Date('2025-09-30T12:00:00Z'),
      }),
      new Unit({
        id: 'UNIT002',
        trackingId: 'TRK002',
        currentStatus: CheckpointStatus.IN_TRANSIT,
        lastUpdated: new Date('2025-09-30T13:00:00Z'),
      }),
    ];

    mockUnitRepository.findByStatus.mockResolvedValue(mockUnits);

    const result = await useCase.execute(CheckpointStatus.IN_TRANSIT);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('UNIT001');
    expect(result[0].currentStatus).toBe(CheckpointStatus.IN_TRANSIT);
    expect(result[1].id).toBe('UNIT002');
    expect(mockUnitRepository.findByStatus).toHaveBeenCalledWith(
      CheckpointStatus.IN_TRANSIT,
    );
  });

  it('should list CREATED units when no status is provided', async () => {
    const mockUnits = [
      new Unit({
        id: 'UNIT003',
        trackingId: 'TRK003',
        currentStatus: CheckpointStatus.CREATED,
        lastUpdated: new Date('2025-09-30T14:00:00Z'),
      }),
    ];

    mockUnitRepository.findByStatus.mockResolvedValue(mockUnits);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('UNIT003');
    expect(result[0].currentStatus).toBe(CheckpointStatus.CREATED);
    expect(mockUnitRepository.findByStatus).toHaveBeenCalledWith(
      CheckpointStatus.CREATED,
    );
  });

  it('should throw InvalidCheckpointStatusError when status is invalid', async () => {
    await expect(useCase.execute('INVALID_STATUS')).rejects.toThrow(
      InvalidCheckpointStatusError,
    );
    expect(mockUnitRepository.findByStatus).not.toHaveBeenCalled();
  });

  it('should return empty array when no units are found', async () => {
    mockUnitRepository.findByStatus.mockResolvedValue([]);

    const result = await useCase.execute(CheckpointStatus.DELIVERED);

    expect(result).toHaveLength(0);
    expect(mockUnitRepository.findByStatus).toHaveBeenCalledWith(
      CheckpointStatus.DELIVERED,
    );
  });
});
