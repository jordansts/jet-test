import { Request, Response, NextFunction } from "express";
import { logError } from "../shareable/utils/errorLogger.js";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): void => {
  logError("Error occurred:", err);
  
  res.status(err.status ?? 500).json({
    status: "ERROR",
    statusCode: err.status ?? 500,
    message: err.message ?? "Internal Server Error",
  });
};

export default errorMiddleware;
