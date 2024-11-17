import bcrypt from "bcrypt";
import config from "src/config";
import { Request } from "express";
import jwt from "jsonwebtoken";
import logger from "src/utils/logger";
import { UnAuthorizedError } from "src/shared/errors";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import s3Client from "./s3";
export const hash = async (input: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(input, salt);
};

export const compareHash = async (
  input: string,
  hashString: string
): Promise<boolean> => {
  return await bcrypt.compare(input, hashString);
};

const { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = config;

// Ensure the secret keys are defined
if (!JWT_ACCESS_SECRET_KEY || !JWT_REFRESH_SECRET_KEY) {
  throw new Error("JWT secret keys are not defined in the config");
}

// Signing and verifying tokens
export const signAccessToken = (id: number, roleId: number): string => {
  const payload = { id, roleId };
  const options = { expiresIn: "24h" };
  return jwt.sign(payload, JWT_ACCESS_SECRET_KEY, options);
};

export const signRefreshToken = (id: number, roleId: number): string => {
  const payload = { id, roleId };
  const options = { expiresIn: "7d" };
  return jwt.sign(payload, JWT_REFRESH_SECRET_KEY, options);
};

export const verifyAccessToken = (
  token: string
): { id: number; roleId: number } => {
  return jwt.verify(token, JWT_ACCESS_SECRET_KEY) as {
    id: number;
    roleId: number;
  };
};

export const verifyRefreshToken = (
  token: string
): { id: number; roleId: number } => {
  return jwt.verify(token, JWT_REFRESH_SECRET_KEY) as {
    id: number;
    roleId: number;
  };
};

// Middleware to verify access token from the request
export const verifyAccessTokenFromRequest = (
  req: Request
): { id: number; roleId: number } => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    throw new UnAuthorizedError("Missing authorization token");
  }

  const token = authorizationHeader.split(" ")[1];
  try {
    return verifyAccessToken(token);
  } catch (error: any) {
    logger.error("Error verify access token from request");
    throw new UnAuthorizedError(error.message);
  }
};

export const verifyRefreshTokenFromRequest = (
  req: Request
): { id: number; roleId: number } => {
  const refresh_token = req.query.refresh_token as string;
  if (!refresh_token) {
    throw new UnAuthorizedError("Missing refresh_token");
  }

  try {
    return verifyRefreshToken(refresh_token);
  } catch (error: any) {
    logger.error("Error verify refresh token from request");
    throw new UnAuthorizedError(error.message);
  }
};

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
