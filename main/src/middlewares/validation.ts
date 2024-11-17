import { Request, Response, NextFunction } from "express";
import logger from "src/utils/logger";
import { AnyZodObject, ZodError } from "zod";

export const validationResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Start Validate");
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      logger.info("End Validate");

      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        logger.error("Validation Error", error);
        return res
          .status(400)
          .json({ message: "Validation error", details: error.errors });
      } else {
        logger.error("Error", error);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  };
