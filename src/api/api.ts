import '../middlewares/instrument.js'
import express, { Application } from "express";
import messageRoutes from "./routes/messageRoutes.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import { specs } from "../docs/swagger.js";
import swaggerUi from 'swagger-ui-express'
import * as Sentry from "@sentry/node"

const api: Application = express();
api.use(express.json({ limit: "50mb" }));

api.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));
api.use("/api", messageRoutes);

Sentry.setupExpressErrorHandler(api)

api.use(errorMiddleware);

export default api;
