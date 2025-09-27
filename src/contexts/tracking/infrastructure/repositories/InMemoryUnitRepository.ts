import { IUnitRepository } from '@tracking/domain/repositories';
import { Unit, CheckpointStatus } from '@tracking/domain/entities';

export class InMemoryUnitRepository implements IUnitRepository {
  private units: Map<string, Unit> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData(): void {
    const testUnits = [
      new Unit({ id: 'UNIT001', trackingId: 'TRK001', currentStatus: CheckpointStatus.CREATED }),
      new Unit({ id: 'UNIT002', trackingId: 'TRK002', currentStatus: CheckpointStatus.IN_TRANSIT }),
      new Unit({ id: 'UNIT003', trackingId: 'TRK003', currentStatus: CheckpointStatus.DELIVERED })
    ];
    
    testUnits.forEach(unit => this.units.set(unit.id, unit));
  }

  async findById(id: string): Promise<Unit | null> {
    return this.units.get(id) || null;
  }

  async findByTrackingId(trackingId: string): Promise<Unit | null> {
    return Array.from(this.units.values())
      .find(unit => unit.trackingId === trackingId) || null;
  }

  async findByStatus(status: CheckpointStatus): Promise<Unit[]> {
    return Array.from(this.units.values())
      .filter(unit => unit.currentStatus === status);
  }

  async update(unit: Unit): Promise<Unit> {
    this.units.set(unit.id, unit);
    return unit;
  }

  async exists(unitId: string): Promise<boolean> {
    return this.units.has(unitId);
  }
}