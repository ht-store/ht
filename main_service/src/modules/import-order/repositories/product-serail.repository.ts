import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { ProductSerial, productSerials } from "src/shared/database/schemas";
import { IProductSerialRepository } from "src/shared/interfaces/repositories";
import { and, eq } from "drizzle-orm";
@injectable()
export class ProductSerialRepository
  extends Repository<ProductSerial>
  implements IProductSerialRepository
{
  constructor() {
    super(productSerials);
  }
  async findBySerial(serial: string): Promise<ProductSerial | null> {
    const serials = await this.db
      .select()
      .from(productSerials)
      .where(
          eq(productSerials.serialNumber, serial),
      );
    return serials[0] ?? null;
  }
  async findFirstBySkuId(skuId: number): Promise<ProductSerial | null> {
    const serials = await this.db
      .select()
      .from(productSerials)
      .where(
        and(
          eq(productSerials.skuId, skuId),
          eq(productSerials.status, "inventory")
        )
      );
    return serials[0] ?? null;
  }

  async findFirstBySkuIdandSerial(
    skuId: number,
    serial: string
  ): Promise<ProductSerial | null> {
    const serials = await this.db
      .select()
      .from(productSerials)
      .where(
        and(
          eq(productSerials.serialNumber, serial),
          eq(productSerials.skuId, skuId),
          eq(productSerials.status, "inventory")
        )
      );
    return serials[0] ?? null;
  }
}
