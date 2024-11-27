import { RevenueType } from "../../types/statistic.type";

export interface IStatisticService {
  getStatistic(revenueType: RevenueType, payload: any) : Promise<any>
}