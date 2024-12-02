import { eq } from "drizzle-orm";
import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { Address, addresses } from "src/shared/database/schemas";
import { IAddressRepository } from "src/shared/interfaces/repositories";

@injectable()
export class AddressRepository
  extends Repository<Address>
  implements IAddressRepository
{
  constructor() {
    super(addresses);
  }
  
  async findByUserId(userId: number): Promise<Address | null> {
   try {
    const [address] = await this.db.select().from(addresses).where(eq(addresses.userId, userId)).execute()
    return address
   } catch (error) {
    throw error
   }
  }
}
