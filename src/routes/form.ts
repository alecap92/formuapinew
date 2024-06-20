import { Router } from "express";
import { verifyToken } from "../auth/user";
import { FormServices } from "../services/form";
import { FormMiddleware } from "../middlewares/form";
import multer from "multer";

const formRouter = Router();
const formServices = new FormServices();
const formMiddleware = new FormMiddleware();

formRouter.use(verifyToken);

formRouter.get("/all", formServices.getAllForms);
formRouter.get("/search/:id", formServices.getForm);
formRouter.post("/new", formMiddleware.validateForm, formServices.createForm);
formRouter.put("/update/:id", formServices.updateForm);
formRouter.delete("/delete/:id", formServices.deleteForm);
formRouter.get("/user", formServices.getFormsByUser);
formRouter.post("/fields", formMiddleware.validateFormDontHaveFields, formServices.addFieldsToForm);
formRouter.put("/fields/", formServices.updateFormFields);
formRouter.post("/procedure", formServices.generateFormProcedure);
formRouter.get("/procedure/:id", formServices.getProcedure);
formRouter.get("/procedure", formServices.getAllProcedures);
formRouter.get("/procedure/pdf/:procedure_id", formServices.generateFormPdf);
formRouter.post("/template/:form_id", multer().single("file"), formServices.uploadFormTemplate);

export default formRouter;
