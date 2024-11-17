import { StockMovement, stockMovements } from "src/database/schemas";
import { IRepository, Repository } from "./repository";
import { injectable } from "inversify";

export interface IStockMovementRepository extends IRepository<StockMovement> {}

@injectable()
export class StockMovementRepository
  extends Repository<StockMovement>
  implements IStockMovementRepository
{
  constructor() {
    super(stockMovements);
  }
}
