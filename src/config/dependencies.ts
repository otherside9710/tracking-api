import { InMemoryCheckpointRepository, InMemoryUnitRepository } from '@tracking/infrastructure/repositories';
import { 
  RegisterCheckpointUseCase, 
  GetTrackingHistoryUseCase, 
  ListUnitsByStatusUseCase 
} from '@tracking/application/use-cases';
import { 
  GetTrackingHistoryController,
  ListUnitsByStatusController,
  RegisterCheckpointController
} from '@app/interfaces/tracking/http/controllers';
import { GetTokenController } from '@app/interfaces/token/http/controllers';
import { GetTokenUseCase } from '@app/contexts/shared/token/application/use-cases';

export class DependencyContainer {
  // Repositories
  private static checkpointRepository = new InMemoryCheckpointRepository();
  private static unitRepository = new InMemoryUnitRepository();

  // Use Cases
  private static registerCheckpointUseCase = new RegisterCheckpointUseCase(
    this.checkpointRepository,
    this.unitRepository
  );

  private static getTrackingHistoryUseCase = new GetTrackingHistoryUseCase(
    this.checkpointRepository,
    this.unitRepository
  );

  private static listUnitsByStatusUseCase = new ListUnitsByStatusUseCase(
    this.unitRepository
  );

  private static getTokenUseCase = new GetTokenUseCase();

  // Controllers
  private static getTrackingHistoryController = new GetTrackingHistoryController(
    this.getTrackingHistoryUseCase
  );

  private static listUnitsByStatusController = new ListUnitsByStatusController(
    this.listUnitsByStatusUseCase
  );

  private static registerCheckpointController = new RegisterCheckpointController(
    this.registerCheckpointUseCase
  );

  private static getTokenController = new GetTokenController(
    this.getTokenUseCase
  );

  static getControllers() {
    return {
      getTrackingHistoryController: this.getTrackingHistoryController,
      listUnitsByStatusController: this.listUnitsByStatusController,
      registerCheckpointController: this.registerCheckpointController,
      getTokenController: this.getTokenController
    };
  }
}