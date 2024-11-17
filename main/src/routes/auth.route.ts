import express from "express";

import { AuthController } from "src/controllers";
import { loginSchema, refreshTokenSchema, registerSchema } from "src/dtos";
import { auth } from "src/middlewares/auth";
import { refresh } from "src/middlewares/refresh";
import { validationResource } from "src/middlewares/validation";
import { INTERFACE_NAME } from "src/shared/constants";
import container from "src/utils/dependancy-injection";

const authRouter = express.Router();
const controller = container.get<AuthController>(INTERFACE_NAME.AuthController);

authRouter.post(
  "/register",
  validationResource(registerSchema),
  controller.resigter.bind(controller)
);
authRouter.post(
  "/login",
  validationResource(loginSchema),
  controller.login.bind(controller)
);
authRouter.post("/logout", auth, controller.logout.bind(controller));
authRouter.get(
  "/refresh-token",
  refresh,
  validationResource(refreshTokenSchema),
  controller.refreshToken.bind(controller)
);
authRouter.get("/me", auth, controller.me.bind(controller));

export default authRouter;
