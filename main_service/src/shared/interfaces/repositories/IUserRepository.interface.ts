import { User } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  findByRoleId(roleId: number): Promise<User[]>;
}
