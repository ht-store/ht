import { injectable } from "inversify";
import { Repository } from "src/shared/base-repository";
import { User, users } from "src/shared/database/schemas ";
import { IUserRepository } from "src/shared/interfaces/repositories";
import { eq } from "drizzle-orm";
@injectable()
export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  constructor() {
    super(users);
  }
  async findByRoleId(roleId: number): Promise<User[]> {
    return await this.db.select().from(users).where(eq(users.roleId, roleId));
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user || null;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));
    return user || null;
  }
}
