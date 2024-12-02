import express from "express";
import { TYPES } from "src/shared/constants";
import { RoleController } from "./role.controller";
import container from "src/common/ioc-container";
import { auth } from "src/shared/middlewares";

const RoleRouter = express.Router();
const controller = container.get<RoleController>(TYPES.RoleController);

RoleRouter.get("/:id", controller.getRole.bind(controller));
RoleRouter.get("/", controller.getRoles.bind(controller));
RoleRouter.post("/", auth, controller.createRole.bind(controller));
RoleRouter.patch("/:id", auth, controller.updateRole.bind(controller));
RoleRouter.delete("/:id", auth, controller.deleteRole.bind(controller));

export default RoleRouter;
