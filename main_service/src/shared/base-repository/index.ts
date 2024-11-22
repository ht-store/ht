import { injectable, unmanaged } from "inversify";
import { IRepository } from "../interfaces/repositories/IRepository.interface";
import { PgTableWithColumns } from "drizzle-orm/pg-core";
import { DB } from "../database/connect";
import { eq } from "drizzle-orm";
import { BasePropsType } from "../types";
import { logger } from "../middlewares";

@injectable()
export class Repository<T> implements IRepository<T> {
  protected db;
  protected table;

  constructor(@unmanaged() table: PgTableWithColumns<any>) {
    this.table = table;
    this.db = DB; // Initialize the DB connection
  }

  async findAll(): Promise<T[]> {
    try {
      return (await this.db.select().from(this.table)) as T[];
    } catch (error) {
      logger.error("Error in findAll:", error);
      throw error;
    }
  }

  async findById(id: number): Promise<T | null> {
    try {
      const [result] = await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.id, id));
      return (result as T) || null;
    } catch (error) {
      logger.error("Error in findById:", error);
      throw error;
    }
  }

  async add(data: BasePropsType<T>): Promise<T> {
    try {
      const [result] = (await this.db
        .insert(this.table)
        .values(data)
        .returning()
        .execute()) as Record<string, any>[];

      return result as T;
    } catch (error) {
      logger.error("Error in add:", error);
      throw error;
    }
  }

  async update(id: number, data: Partial<BasePropsType<T>>): Promise<T> {
    try {
      const [result] = (await this.db
        .update(this.table)
        .set(data)
        .where(eq(this.table.id, id))
        .returning()
        .execute()) as Record<string, any>[];
      return result as T;
    } catch (error) {
      logger.error("Error in update:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<T> {
    try {
      const [result] = (await this.db
        .delete(this.table)
        .where(eq(this.table.id, id))
        .returning()
        .execute()) as Record<string, any>[];
      return result as T;
    } catch (error) {
      logger.error("Error in delete:", error);
      throw error;
    }
  }
}
