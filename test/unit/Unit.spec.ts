import { Unit } from '@tracking/domain/entities/Unit';
import { CheckpointStatus } from '@tracking/domain/entities/CheckpointStatus';

describe('Unit', () => {
  const mockDate = new Date('2025-09-30T12:00:00Z');

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create a unit with provided values', () => {
    const unit = new Unit({
      id: 'UNIT001',
      trackingId: 'TRK001',
      currentStatus: CheckpointStatus.CREATED,
    });

    expect(unit.id).toBe('UNIT001');
    expect(unit.trackingId).toBe('TRK001');
    expect(unit.currentStatus).toBe(CheckpointStatus.CREATED);
    expect(unit.createdAt).toEqual(mockDate);
    expect(unit.lastUpdated).toEqual(mockDate);
  });

  it('should create a unit with custom dates', () => {
    const customCreatedAt = new Date('2025-09-29T12:00:00Z');
    const customLastUpdated = new Date('2025-09-29T13:00:00Z');

    const unit = new Unit({
      id: 'UNIT001',
      trackingId: 'TRK001',
      currentStatus: CheckpointStatus.CREATED,
      createdAt: customCreatedAt,
      lastUpdated: customLastUpdated,
    });

    expect(unit.createdAt).toEqual(customCreatedAt);
    expect(unit.lastUpdated).toEqual(customLastUpdated);
  });

  it('should update status and lastUpdated date', () => {
    const unit = new Unit({
      id: 'UNIT001',
      trackingId: 'TRK001',
      currentStatus: CheckpointStatus.CREATED,
    });

    const newDate = new Date('2025-09-30T13:00:00Z');
    jest.setSystemTime(newDate);

    unit.updateStatus(CheckpointStatus.IN_TRANSIT);

    expect(unit.currentStatus).toBe(CheckpointStatus.IN_TRANSIT);
    expect(unit.lastUpdated).toEqual(newDate);
  });
});
