import { Category } from "src/shared/database/schemas";
import { IRepository } from "./IRepository.interface";

export interface ICategoryRepository extends IRepository<Category> {}
