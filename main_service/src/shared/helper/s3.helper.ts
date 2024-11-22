import config from "src/config";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";

const s3Client = new S3Client({
  region: config.REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_KEY,
  },
});

export default s3Client;

export const getObjectUrl = async (key: string) => {
  const params = {
    Bucket: config.BUCKET_NAME,
    Key: key,
  };

  const url = await getSignedUrl(s3Client, new PutObjectCommand(params));
  return url;
};

export const putObjectUrl = async (
  file: Express.Multer.File,
  contentType: string
): Promise<string> => {
  const params = new PutObjectCommand({
    Bucket: config.BUCKET_NAME,
    Key: "/productfiles/" + file.originalname,
    ContentType: "image/jpeg",
    Body: file.buffer,
  });

  const result = await s3Client.send(params);
  const signedUrl = new GetObjectCommand({
    Bucket: config.BUCKET_NAME,
    Key: "/productfiles/" + file.originalname,
  });
  const url = await getSignedUrl(s3Client, signedUrl);
  return url;
};

export const deleteObject = async (key: string) => {
  const params = {
    Bucket: config.BUCKET_NAME,
    Key: key,
  };

  await s3Client.send(new DeleteObjectCommand(params));
};

export const setProfilePic = () => {
  multer({});
};
