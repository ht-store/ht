import { injectable } from "inversify";
import { eq } from "drizzle-orm";
import { IRepository, Repository } from "./repository";
import { User, users } from "src/database/schemas";

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
}

@injectable()
export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  constructor() {
    super(users);
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
