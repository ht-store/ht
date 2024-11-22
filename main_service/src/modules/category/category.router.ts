// categoryRouter.ts

import express from "express";
import container from "src/common/ioc-container";
import { CategoryController } from "./category.controller";
import { TYPES } from "src/shared/constants";
import { auth } from "src/shared/middlewares";

const categoryRouter = express.Router();
const controller = container.get<CategoryController>(TYPES.CategoryController);

categoryRouter.get("/:id", controller.getCategory.bind(controller));
categoryRouter.get("/", controller.getCategories.bind(controller));
categoryRouter.post("/", auth, controller.createCategory.bind(controller));
categoryRouter.patch("/:id", auth, controller.updateCategory.bind(controller));
categoryRouter.delete("/:id", auth, controller.deleteCategory.bind(controller));

export default categoryRouter;
