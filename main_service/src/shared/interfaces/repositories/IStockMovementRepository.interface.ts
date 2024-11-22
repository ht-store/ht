import { StockMovement } from "src/shared/database/schemas ";
import { IRepository } from "./IRepository.interface";

export interface IStockMovementRepository extends IRepository<StockMovement> {}
