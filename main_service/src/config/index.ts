import dotenv from "dotenv";

// if (process.env.NODE_ENV === "dev") {
//   dotenv.config({ path: `.env.dev` });
// } else {
//   dotenv.config();
// }

dotenv.config();

interface Config {
  TEST: string;
  BASE_URL?: string;
  PORT: string;
  DB_URL: string;
  JWT_ACCESS_SECRET_KEY?: string;
  JWT_REFRESH_SECRET_KEY?: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_URL: string;
  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
  FOLDER_PATH: string;
  PUBLIC_ID_PREFIX: string;
  BUCKET_NAME: string;
  REGION: string;
  S3_ACCESS_KEY: string;
  S3_SECRET_KEY: string;
  PUBLIC_KEY: string;
  SECRET_KEY: string;
  WEBHOOK_SECRET: string;
  APP_PREFIX: string;
  SUCCESS_URL: string;
  CANCEL_URL: string;
  KAFKA_CLIENT_ID: string;
  KAFKA_GROUP_ID: string;
  KAFKA_BROKERS: string[];
}

const configuration: Config = {
  TEST: "test",
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT!,
  DB_URL:
    process.env.DB_URL ||
    "postgresql://maiphuonglam:mpl08092002@localhost:5432/store",
  JWT_ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
  REDIS_HOST: process.env.REDIS_HOST!,
  REDIS_PORT: +process.env.REDIS_PORT!,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD!,
  REDIS_URL: process.env.REDIS_URL!,
  CLOUD_NAME: process.env.CLOUD_NAME!,
  API_KEY: process.env.API_KEY!,
  API_SECRET: process.env.API_SECRET!,
  FOLDER_PATH: process.env.FOLDER_PATH!,
  PUBLIC_ID_PREFIX: process.env.PUBLIC_ID_PREFIX!,
  BUCKET_NAME: process.env.BUCKET_NAME!,
  REGION: process.env.REGION!,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY!,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY!,
  PUBLIC_KEY: process.env.PUBLIC_KEY!,
  SECRET_KEY: process.env.SECRET_KEY!,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET!,
  APP_PREFIX: process.env.APP_PREFIX!,
  SUCCESS_URL: process.env.SUCCESS_URL || "http://localhost:3000/success",
  CANCEL_URL: process.env.CANCEL_URL!,
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || "main_service",
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || "main_service_group",
  KAFKA_BROKERS: [process.env.KAFKA_BROKER_1 || "localhost:9092"],
};

export default configuration;
