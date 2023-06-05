import express from "express";
import { isAuth } from "../utils/auth.middleware";
import { userService } from "../domain/services/user.service";

// Router propio de usuarios
export const userRouter = express.Router();

userRouter.get("/", userService.getUsers);
userRouter.get("/:id", userService.getUserById);
userRouter.get("/name/:name", userService.getUserByName);
userRouter.post("/", userService.createUser);
userRouter.delete("/:id", isAuth, userService.deleteUser);
userRouter.put("/:id", isAuth, userService.updateUser);
userRouter.post("/login", userService.login);
