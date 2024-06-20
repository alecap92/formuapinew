import { Router } from "express";
import { verifyToken } from "../auth/user";
import { FieldServices } from "../services/field";
import { FieldMiddleware } from "../middlewares/field";

const fieldRouter = Router();
const fieldServices = new FieldServices();
const fieldMiddleware = new FieldMiddleware();

fieldRouter.use(verifyToken);

fieldRouter.post("/new", fieldMiddleware.validateField, fieldServices.createField);
fieldRouter.get("/all", fieldServices.getFields);

export default fieldRouter;
