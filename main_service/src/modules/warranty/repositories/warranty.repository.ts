import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { warranties, Warranty } from "src/shared/database/schemas";
import { IWarrantyRepository } from "src/shared/interfaces/repositories";

@injectable()
export class WarrantyRepository
  extends Repository<Warranty>
  implements IWarrantyRepository
{
  constructor() {
    super(warranties);
  }
  async findBySkuId(skuId: number): Promise<Warranty | null> {
    const [warranty] = await this.db
      .select()
      .from(warranties)
      .where(eq(warranties.skuId, skuId));
    return warranty || null;
  }
}
