import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { STATUS_CODES, TYPES } from "src/shared/constants";
import { NotFoundError } from "src/shared/errors";
import { IAddressService } from "src/shared/interfaces/services";
import { logger } from "src/shared/middlewares";
import { CreateAddressDto, UpdateAddressDto } from "./dtos";
import { BaseResponse } from "src/common/responses";

@injectable()
export class AddressController {
  constructor(
    @inject(TYPES.AddressService) private addressService: IAddressService // Adjust interface and injection key as per your application setup
  ) {}

  async getAddresss(req: Request, res: Response, next: NextFunction) {
    try {
      const Addresss = await this.addressService.getAddresss();
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Get Addresss is successful", Addresss));
    } catch (error) {
      logger.error("Get Addresss failed", error);
      next(error);
    }
  }

  async getAddress(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const Address = await this.addressService.getOneAddress(id);
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Get Address is successful", Address));
    } catch (error) {
      logger.error(`Get Address with id ${id} failed`, error);
      next(error);
    }
  }

  async createAddress(req: Request, res: Response, next: NextFunction) {
    const createAddressDto = <CreateAddressDto>req.body;
    const userId = req.userId; // Assuming you have userId in request, adjust as per your authentication setup
    try {
      const newAddress = await this.addressService.createAddress(
        createAddressDto,
        userId
      );
      return res
        .status(STATUS_CODES.CREATED)
        .json(BaseResponse.success("Create Address is successful", newAddress));
    } catch (error) {
      logger.error("Create Address failed", error);
      next(error);
    }
  }

  async updateAddress(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    const updateAddressDto = <UpdateAddressDto>req.body;
    try {
      const updatedAddress = await this.addressService.updateAddress(
        id,
        updateAddressDto
      );
      return res
        .status(STATUS_CODES.OK)
        .json(BaseResponse.success("Update Address is successful", updatedAddress));
    } catch (error) {
      logger.error(`Update Address with id ${id} failed`, error);
      next(error);
    }
  }

  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id);
    try {
      const deletedAddress = await this.addressService.deleteAddress(id);
      return res
        .status(STATUS_CODES.OK)
        .json(
          BaseResponse.success("Delete Address is successfull", deletedAddress)
        );
    } catch (error) {
      logger.error(`Delete Address with id ${id} failed`, error);
      next(error);
    }
  }
}
