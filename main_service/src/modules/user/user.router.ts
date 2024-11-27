import express from "express";
import { UserController } from "./user.controller";
import { TYPES } from "src/shared/constants";
import { auth } from "src/shared/middlewares/auth.middleware";
import container from "src/common/ioc-container";

const userRouter = express.Router();
const controller = container.get<UserController>(TYPES.UserController);

// Admin routes - require admin authentication

userRouter.get(
  "/customers",
  auth,
  // validateAdmin,
  controller.getAllCustomers.bind(controller)
);

userRouter.get(
  "/employees",
  auth,
  // validateAdmin,
  controller.getAllEmployees.bind(controller)
);
userRouter.get(
  "/",
  auth,
  // validateAdmin,
  controller.getAllUsers.bind(controller)
);
userRouter.get(
  "/:id",
  auth,
  // validateAdmin,
  controller.getUserById.bind(controller)
);

userRouter.put(
  "/:id",
  auth,
  // validateAdmin,
  controller.updateUser.bind(controller)
);

userRouter.delete(
  "/:id",
  auth,
  // validateAdmin,
  controller.deleteUser.bind(controller)
);

// User routes - require normal user authentication
userRouter.put("/profile", auth, controller.updateProfile.bind(controller));

export default userRouter;
