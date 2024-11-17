import express from "express";
import "reflect-metadata";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./utils/logger";
import config from "./config";
import { expressApp } from "./app";
import rawBodyParser from "./middlewares/raw-body";

dotenv.config();
function start() {
  const app = express();
  const port = Number(config.PORT) || 8001;
  const baseURL = config.BASE_URL || `http://localhost:${port}`;

  app.use(cors());
  app.use(rawBodyParser);
  app.use(express.urlencoded({ extended: true }));
  app.set("trust proxy", 1);

  if (process.env.NODE_ENV === "dev") {
    app.use(morgan("dev"));
  }

  expressApp(app); // Add this line for debugging

  app.listen(port, () => {
    logger.info(`Express server started on ${baseURL}`);
  });
}

start();
