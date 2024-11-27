export type StatisticType = {

}

export type RevenueDataType = {
  period: string;
  totalRevenue: number;
  count: number;
}

export type RevenueFormattedDataType = {
  period: string;
  orderRevenue: number;
  orderCount: number;
  warrantyRevenue: number;
  warrantyCount: number;
  revenueIn: number;
}

export enum RevenueType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}


