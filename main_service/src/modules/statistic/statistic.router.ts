import express from "express";
import { TYPES } from "src/shared/constants";
import { auth, refresh } from "src/shared/middlewares";
import container from "src/common/ioc-container";
import { StatisticController } from "./statistic.controller";
const statisticRouter = express.Router();
const controller = container.get<StatisticController>(TYPES.StatisticController);

statisticRouter.get('/', controller.getDailyStatistic.bind(controller));
export default statisticRouter;
