import './middlewares/instrument.js'
import express, { Application } from "express";
import messageRoutes from "./routes/messageRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import { specs } from "./docs/swagger.js";
import swaggerUi from 'swagger-ui-express'
import * as Sentry from "@sentry/node"

const app: Application = express();
app.use(express.json({ limit: "50mb" }));

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", messageRoutes);

Sentry.setupExpressErrorHandler(app)

app.use(errorMiddleware);

export default app;
