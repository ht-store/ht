import express from "express";
import { UserController } from "src/controllers/user.controller";
import { updateUserSchema } from "src/dtos";
import { auth } from "src/middlewares/auth";
// import { validateAdmin } from "src/middlewares/validateAdmin";
import { validationResource } from "src/middlewares/validation";
import { INTERFACE_NAME } from "src/shared/constants";
import container from "src/utils/dependancy-injection";

const userRouter = express.Router();
const controller = container.get<UserController>(INTERFACE_NAME.UserController);

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
  validationResource(updateUserSchema),
  controller.updateUser.bind(controller)
);

userRouter.delete(
  "/:id",
  auth,
  // validateAdmin,
  controller.deleteUser.bind(controller)
);

// User routes - require normal user authentication
userRouter.put(
  "/profile",
  auth,
  validationResource(updateUserSchema),
  controller.updateProfile.bind(controller)
);

export default userRouter;
