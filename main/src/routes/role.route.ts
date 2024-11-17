import express from "express";
import { RoleController } from "src/controllers";
import { auth } from "src/middlewares/auth";
import { INTERFACE_NAME } from "src/shared/constants";
import container from "src/utils/dependancy-injection";

const roleRouter = express.Router();
const controller = container.get<RoleController>(INTERFACE_NAME.RoleController);

roleRouter.get("/:id", controller.getRole.bind(controller));
roleRouter.get("/", controller.getRoles.bind(controller));
roleRouter.post("/", auth, controller.createRole.bind(controller));
roleRouter.patch("/:id", auth, controller.updateRole.bind(controller));
roleRouter.delete("/:id", auth, controller.deleteRole.bind(controller));

export default roleRouter;
