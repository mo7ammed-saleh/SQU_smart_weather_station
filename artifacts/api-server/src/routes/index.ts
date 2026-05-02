import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import sensorsRouter from "./sensors.js";
import exportRouter from "./export.js";
import loggerRouter from "./logger.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/sensors", sensorsRouter);
router.use("/export", exportRouter);
router.use("/logger", loggerRouter);

export default router;
