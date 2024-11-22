import { BasePropsType } from "src/shared/types";

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  add(data: BasePropsType<T> | BasePropsType<T>[]): Promise<T>;
  update(id: number, data: Partial<BasePropsType<T>>): Promise<T>;
  delete(id: number): Promise<T>;
}
