import { CreateUser, User } from "src/shared/database/schemas ";

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getAllCustomers(): Promise<User[]>;
  getAllEmployees(): Promise<User[]>;
  getUserById(id: number): Promise<User>;
  getUserByEmail(email: string): Promise<User>;
  getUserByPhone(phone: string): Promise<User>;
  createUser(data: CreateUser): Promise<User>;
  updateUser(id: number, data: Partial<CreateUser>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
}
