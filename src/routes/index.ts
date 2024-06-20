import { Router } from "express";
import { verifyToken } from "../auth/user";
import userRoutes from "./user";
import formRouter from "./form";
import fieldRouter from "./field";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).send("ok");
});

router.get("/protected", verifyToken, (req, res) => {
  res.status(200).send("ok");
});

router.use("/user", userRoutes);
router.use("/form", formRouter);
router.use("/field", fieldRouter);

export default router;
