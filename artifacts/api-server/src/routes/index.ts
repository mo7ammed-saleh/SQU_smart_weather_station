import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import sensorsRouter from "./sensors.js";
import exportRouter from "./export.js";
import loggerRouter from "./logger.js";
import authRouter from "./auth.js";
import settingsRouter from "./settings.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/sensors", sensorsRouter);
router.use("/export", exportRouter);
router.use("/logger", loggerRouter);
router.use("/auth", authRouter);
router.use("/settings", settingsRouter);

export default router;
