// categoryRouter.ts

import express from "express";
import { CategoryController } from "src/controllers";
import { auth } from "src/middlewares/auth";
import { INTERFACE_NAME } from "src/shared/constants";
import container from "src/utils/dependancy-injection";

const categoryRouter = express.Router();
const controller = container.get<CategoryController>(
  INTERFACE_NAME.CategoryController
);

categoryRouter.get("/:id", controller.getCategory.bind(controller));
categoryRouter.get("/", controller.getCategories.bind(controller));
categoryRouter.post("/", auth, controller.createCategory.bind(controller));
categoryRouter.patch("/:id", auth, controller.updateCategory.bind(controller));
categoryRouter.delete("/:id", auth, controller.deleteCategory.bind(controller));

export default categoryRouter;
