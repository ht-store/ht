import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { CreateUser, User } from "src/shared/database/schemas";
import { BadRequestError, NotFoundError } from "src/shared/errors";
import { hash } from "src/shared/helper/bcrypt.helper";
import { IUserRepository } from "src/shared/interfaces/repositories";
import { IUserService } from "src/shared/interfaces/services";
import { UpdateUserType } from "src/shared/types";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByPhone(phone: string): Promise<User> {
    try {
      const user = await this.userRepository.findByPhoneNumber(phone);
      if (!user) {
        throw new NotFoundError("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

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

  async createUser(data: CreateUser): Promise<User> {
    try {
      const emailExisted = await this.userRepository.findByEmail(data.email);
      if (emailExisted) {
        throw new BadRequestError("Email already exists");
      }

      const phoneExisted = await this.userRepository.findByPhoneNumber(
        data.phoneNumber
      );
      if (phoneExisted) {
        throw new BadRequestError("Phone number already exists");
      }

      data.password = await hash(data.password);

      const newUser = await this.userRepository.add({
        ...data,
        roleId: data.roleId, // default role is customer
        rt: null,
        stripeId: null,
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, data: UpdateUserType): Promise<User> {
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
