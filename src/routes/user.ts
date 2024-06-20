import { Router } from "express";
import { UserMiddleware } from "../middlewares/user";
import { UserServices } from "../services/users";
import { verifyToken } from "../auth/user";

const userRoutes = Router();

const userMiddleware = new UserMiddleware();
const userServices = new UserServices();

userRoutes.post("/new", userMiddleware.validateUserExist, userServices.createUser);
userRoutes.post("/login", userMiddleware.validateUserLogin, userServices.loginUser);

userRoutes.use(verifyToken);
/* Protected routes */
userRoutes.get("/me", verifyToken, userServices.getUser);
userRoutes.put("/update", verifyToken, userServices.updateUser);

export default userRoutes;
