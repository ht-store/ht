import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { StockMovement, stockMovements } from "src/shared/database/schemas ";
import { IStockMovementRepository } from "src/shared/interfaces/repositories";

@injectable()
export class StockMovementRepository
  extends Repository<StockMovement>
  implements IStockMovementRepository
{
  constructor() {
    super(stockMovements);
  }
}
