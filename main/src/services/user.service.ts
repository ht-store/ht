import { inject, injectable } from "inversify";
import { User } from "src/database/schemas";
import { IUserRepository } from "src/repositories/user.repository";
import { INTERFACE_NAME } from "src/shared/constants";
import { NotFoundError, BadRequestError } from "src/shared/errors";
import { hash } from "src/utils/helper";

export type UpdateUserData = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  roleId?: number;
};

export type UpdatePasswordData = {
  oldPassword: string;
  newPassword: string;
};

export interface IUserService {
  getAllUsers(): Promise<User[]>;
  getAllCustomers(): Promise<User[]>;
  getAllEmployees(): Promise<User[]>;
  getUserById(id: number): Promise<User>;
  updateUser(id: number, data: UpdateUserData): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(INTERFACE_NAME.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getAllCustomers(): Promise<User[]> {
    try {
      return await this.userRepository.findByRoleId(5);
    } catch (error) {
      throw error;
    }
  }

  async getAllEmployees(): Promise<User[]> {
    try {
      return await this.userRepository.findByRoleId(2);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, data: UpdateUserData): Promise<User> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      if (data.email && data.email !== user.email) {
        const emailExisted = await this.userRepository.findByEmail(data.email);
        if (emailExisted) {
          throw new BadRequestError("Email already exists");
        }
      }

      if (data.phoneNumber && data.phoneNumber !== user.phoneNumber) {
        const phoneExisted = await this.userRepository.findByPhoneNumber(
          data.phoneNumber
        );
        if (phoneExisted) {
          throw new BadRequestError("Phone number already exists");
        }
      }

      if (data.password) {
        data.password = await hash(data.password);
      }

      const updatedUser = await this.userRepository.update(id, data);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundError("User not found");
      }

      await this.userRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
