import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const httpLogsEnabled = process.env.HTTP_LOGS === "true";

app.use(
  pinoHttp({
    logger,
    autoLogging: httpLogsEnabled,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
if (!httpLogsEnabled) {
  app.use((req, res, next) => {
    res.on("finish", () => {
      if (res.statusCode >= 500) {
        req.log.error(
          {
            req: {
              method: req.method,
              url: req.url?.split("?")[0],
            },
            res: { statusCode: res.statusCode },
          },
          "HTTP request failed",
        );
      }
    });
    next();
  });
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
