import { Unit, CheckpointStatus } from '@context/tracking/domain/entities';

export interface IUnitRepository {
  findById(id: string): Promise<Unit | null>;
  findByTrackingId(trackingId: string): Promise<Unit | null>;
  findByStatus(status: CheckpointStatus): Promise<Unit[]>;
  update(unit: Unit): Promise<Unit>;
  exists(unitId: string): Promise<boolean>;
}