import { S3Client } from "@aws-sdk/client-s3";
import config from "src/config";

const s3Client = new S3Client({
  region: config.REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_KEY,
  },
});

export default s3Client;
