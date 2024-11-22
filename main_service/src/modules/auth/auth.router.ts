import express from "express";
import { AuthController } from "./auth.controller";
import { TYPES } from "src/shared/constants";
import { auth, refresh } from "src/shared/middlewares";
import container from "src/common/ioc-container";
const authRouter = express.Router();
const controller = container.get<AuthController>(TYPES.AuthController);

authRouter.post("/register", controller.resigter.bind(controller));
authRouter.post("/login", controller.login.bind(controller));
authRouter.post("/logout", auth, controller.logout.bind(controller));
authRouter.get(
  "/refresh-token",
  refresh,
  controller.refreshToken.bind(controller)
);
authRouter.get("/me", auth, controller.me.bind(controller));

export default authRouter;
