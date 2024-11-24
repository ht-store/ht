import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import {
  productSellWarranties,
  ProductSellWarranty,
} from "src/shared/database/schemas";
import { IProductSellWarrantyRepository } from "src/shared/interfaces/repositories";

@injectable()
export class ProductSellWarrantyRepository
  extends Repository<ProductSellWarranty>
  implements IProductSellWarrantyRepository
{
  constructor() {
    super(productSellWarranties);
  }
  async findByStatus(status: string): Promise<ProductSellWarranty[]> {
    return await this.db
      .select()
      .from(productSellWarranties)
      .where(eq(productSellWarranties.warrantyStatus, status));
  }
  async findBySerial(serialId: number): Promise<ProductSellWarranty | null> {
    const [productWarranty] = await this.db
      .select()
      .from(productSellWarranties)
      .where(eq(this.table.serialId, serialId));

    return productWarranty || null;
  }
}
