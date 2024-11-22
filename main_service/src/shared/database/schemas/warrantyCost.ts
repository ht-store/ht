// import {
//   serial,
//   integer,
//   numeric,
//   varchar,
//   pgTable,
// } from "drizzle-orm/pg-core";
// import { warranties } from "./warranty";
// import { InferSelectModel } from "drizzle-orm";

// export const warrantyCosts = pgTable("warranty_costs", {
//   id: serial("id").primaryKey(),
//   warranty_id: integer("warranty_id").references(() => warranties.id, {
//     onDelete: "cascade",
//   }),
//   estimated_cost: numeric("estimated_cost", {
//     precision: 10,
//     scale: 2,
//   }).notNull(),
//   currency: varchar("currency", { length: 3 }).default("USD"),
// });

// export type WarrantyCost = InferSelectModel<typeof warrantyCosts>;
