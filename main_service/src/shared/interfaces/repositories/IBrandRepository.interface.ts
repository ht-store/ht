import { Brand } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface IBrandRepository extends IRepository<Brand> {}
