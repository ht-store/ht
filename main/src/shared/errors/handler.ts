import { Request, Response, NextFunction } from "express";
import {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
  UnAuthorizedError,
} from "./errors";
import logger from "src/utils/logger";

export const HandleErrorWithLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let reportError = true;
  let status = 500;
  let data = error.message;

  // skip common / known errors
  [NotFoundError, BadRequestError, ForbiddenError, UnAuthorizedError].forEach(
    (typeOfError) => {
      if (error instanceof typeOfError) {
        reportError = false;
        status = error.status;
        data = error.message;
      }
    }
  );

  if (reportError) {
    // error reporting tools implementation eg: Cloudwatch,Sentry etc;
    logger.error(error);
  } else {
    logger.warn(error); // ignore common errors caused by user
  }

  return res.status(status).json(data);
};

export const HandleUnCaughtException = async (error: Error) => {
  // error report / monitoring tools
  logger.error(error);
  // recover
  process.exit(1);
};
