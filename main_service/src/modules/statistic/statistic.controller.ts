import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "src/shared/constants";
import { IStatisticService } from "src/shared/interfaces/services";
import { RevenueType } from "src/shared/types";

@injectable()
export class StatisticController {
  constructor(@inject(TYPES.StatisticService) private statisticService: IStatisticService) {}

  async getDailyStatistic(req: Request, res: Response, next: NextFunction) {
    try {
      const type = <RevenueType>req.query.type;
      const payload = req.query;
      const data = await this.statisticService.getStatistic(type, payload);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }


}