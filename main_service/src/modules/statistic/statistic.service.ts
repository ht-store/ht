import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { injectable } from "inversify";
import { DB } from "src/shared/database/connect";
import { orders, productSellWarranties, warranties, warrantyClaimCosts, warrantyClaims } from "src/shared/database/schemas";
import { IStatisticService } from "src/shared/interfaces/services";
import { RevenueType } from "src/shared/types";

@injectable()
export class StatisticService implements IStatisticService {

  async getStatistic(revenueType: RevenueType, payload: any) {
    let result;
    const startDate = new Date(payload.startDate)
    const endDate = new Date(payload.endDate)
    switch (revenueType) {
      case RevenueType.DAILY:
        result = await this.getDailyRevenue(startDate, endDate);
        break;
      case RevenueType.WEEKLY:
        result = await this.getWeeklyRevenue(startDate, endDate);
        break;
      case RevenueType.MONTHLY:
        result = await this.getMonthlyRevenue(startDate, endDate);
        break;
      case RevenueType.YEARLY:
        result = await this.getYearlyRevenue(startDate, endDate);
        break;
      default:
        result = await this.getDailyRevenue(startDate, endDate);
        break;
    }
    return result
    // return this._formatRevenueData(result)
  }

  private async getDailyRevenue(startDate: Date, endDate: Date){
    try {
      const orderRevenue = await DB
        .select({
          period: sql<string>`DATE(${orders.orderDate})`,
          totalRevenue: sql<number>`cast(sum(${orders.totalPrice}) as float)`,
          count: count(),
        })
        .from(orders)
        .where(and(gte(orders.orderDate, startDate), lte(orders.orderDate, endDate)))
        .groupBy(sql`DATE(${orders.orderDate})`)
        .orderBy(sql`DATE(${orders.orderDate})`);
      console.log(orderRevenue)
      const warrantyRevenue = await DB
        .select({
          period: sql<string>`DATE(${warrantyClaims.claimDate})`,
          totalRevenue: sql<number>`cast(sum(${warrantyClaimCosts.repairCost} + ${warrantyClaimCosts.partsCost} + ${warrantyClaimCosts.shippingCost}) as float)`,
          count: count(),
        })
        .from(warrantyClaimCosts)
        .where(and(gte(warrantyClaims.claimDate, startDate), lte(warrantyClaims.claimDate, endDate)))
        .innerJoin(warrantyClaims, eq(warrantyClaims.id, warrantyClaimCosts.claimId))
        .groupBy(sql`DATE(${warrantyClaims.claimDate})`)
        .orderBy(sql`DATE(${warrantyClaims.claimDate})`);
      console.log(warrantyRevenue)
      
      return {
        orderRevenue,
        warrantyRevenue
      }
    } catch (error) {
      throw error;
    }
  }

  private async getWeeklyRevenue(startDate: Date, endDate: Date) {
    try {
      const orderRevenue = await DB
        .select({
          period: sql<string>`EXTRACT(WEEK FROM ${orders.orderDate})`,
          totalRevenue: sql<number>`cast(sum(${orders.totalPrice}) as float)`,
          count: count(),
        })
        .from(orders)
        .where(and(gte(orders.orderDate, startDate), lte(orders.orderDate, endDate)))
        .groupBy(sql`EXTRACT(WEEK FROM ${orders.orderDate})`)
        .orderBy(sql`EXTRACT(WEEK FROM ${orders.orderDate})`);
      
      const warrantyRevenue = await DB
        .select({
          period: sql<string>`EXTRACT(WEEK FROM ${warrantyClaims.claimDate})`,
          totalRevenue: sql<number>`cast(sum(${warrantyClaimCosts.repairCost} + ${warrantyClaimCosts.partsCost} + ${warrantyClaimCosts.shippingCost}) as float)`,
          count: count(),
        })
        .from(warranties)
        .innerJoin(warrantyClaims, eq(warrantyClaims.id, warrantyClaimCosts.claimId))
        .where(and(gte(warrantyClaims.claimDate, startDate), lte(warrantyClaims.claimDate, endDate)))
        .groupBy(sql`EXTRACT(WEEK FROM ${warrantyClaims.claimDate})`)
        .orderBy(sql`EXTRACT(WEEK FROM ${warrantyClaims.claimDate})`);    
  
      return {
        orderRevenue,
        warrantyRevenue
      }
    } catch (error) {
      throw error;
    }
  }

  private async getMonthlyRevenue(startDate: Date, endDate: Date) {
    try {
      const orderRevenue = await DB
        .select({
          period: sql<string>`EXTRACT(MONTH FROM ${orders.orderDate})`,
          totalRevenue: sql<number>`cast(sum(${orders.totalPrice}) as float)`,
          count: count(),
        })
        .from(orders)
        .where(and(gte(orders.orderDate, startDate), lte(orders.orderDate, endDate)))
        .groupBy(sql`EXTRACT(MONTH FROM ${orders.orderDate})`)
        .orderBy(sql`EXTRACT(MONTH FROM ${orders.orderDate})`);
      
      const warrantyRevenue = await DB
        .select({
          period: sql<string>`EXTRACT(MONTH FROM ${warrantyClaims.claimDate})`,
          totalRevenue: sql<number>`cast(sum(${warrantyClaimCosts.repairCost} + ${warrantyClaimCosts.partsCost} + ${warrantyClaimCosts.shippingCost}) as float)`,
          count: count(),
        })
        .from(warranties)
        .innerJoin(warrantyClaims, eq(warrantyClaims.id, warrantyClaimCosts.claimId))
        .where(and(gte(warrantyClaims.claimDate, startDate), lte(warrantyClaims.claimDate, endDate)))
        .groupBy(sql`EXTRACT(MONTH FROM ${warrantyClaims.claimDate})`)
        .orderBy(sql`EXTRACT(MONTH FROM ${warrantyClaims.claimDate})`);
          
      return {
        orderRevenue,
        warrantyRevenue
      }
    } catch (error) {
      throw error;
    }
  }

  private async getYearlyRevenue(startDate: Date, endDate: Date) {
    try {
      const orderRevenue = await DB
        .select({
          period: sql<string>`EXTRACT(YEAR FROM ${orders.orderDate})`,
          totalRevenue: sql<number>`cast(sum(${orders.totalPrice}) as float)`,
          count: count(),
        })
        .from(orders)
        .where(and(gte(orders.orderDate, startDate), lte(orders.orderDate, endDate)))
        .groupBy(sql`EXTRACT(YEAR FROM ${orders.orderDate})`)
        .orderBy(sql`EXTRACT(YEAR FROM ${orders.orderDate})`);
      
      const warrantyRevenue = await DB
        .select({
          period: sql<string>`EXTRACT(YEAR FROM ${warrantyClaims.claimDate})`,
          totalRevenue: sql<number>`cast(sum(${warrantyClaimCosts.repairCost} + ${warrantyClaimCosts.partsCost} + ${warrantyClaimCosts.shippingCost}) as float)`,
          count: count(),
        })
        .from(warranties)
        .innerJoin(warrantyClaims, eq(warrantyClaims.id, warrantyClaimCosts.claimId))
        .where(and(gte(warrantyClaims.claimDate, startDate), lte(warrantyClaims.claimDate, endDate)))
        .groupBy(sql`EXTRACT(YEAR FROM ${warrantyClaims.claimDate})`)
        .orderBy(sql`EXTRACT(YEAR FROM ${warrantyClaims.claimDate})`);
      
      return {
        orderRevenue,
        warrantyRevenue
      }
    } catch (error) {
      throw error;
    }
  }

  // private _formatRevenueData(data: { orderRevenue: RevenueData[]; warrantyRevenue: RevenueData[] }): FormattedData[] {
  //   const combinedData = new Map<string, FormattedData>();
  
  //   data.orderRevenue.forEach(order => {
  //     const period = order.period;
  //     combinedData.set(period, {
  //       period,
  //       orderRevenue: order.totalRevenue,
  //       orderCount: order.count,
  //       warrantyRevenue: 0,
  //       warrantyCount: 0,
  //       revenueIn: order.totalRevenue,
  //     });
  //   });
  
  //   data.warrantyRevenue.forEach(warranty => {
  //     const period = warranty.period;
  //     if (combinedData.has(period)) {
  //       const existing = combinedData.get(period)!;
  //       existing.warrantyRevenue = warranty.totalRevenue;
  //       existing.warrantyCount = warranty.count;
  //       existing.revenueIn += warranty.totalRevenue;
  //     } else {
  //       combinedData.set(period, {
  //         period,
  //         orderRevenue: 0,
  //         orderCount: 0,
  //         warrantyRevenue: warranty.totalRevenue,
  //         warrantyCount: warranty.count,
  //         revenueIn: warranty.totalRevenue
  //       });
  //     }
  //   });
  
  //   return Array.from(combinedData.values());
  // }
}
