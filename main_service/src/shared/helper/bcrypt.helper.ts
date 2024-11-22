import bcrypt from "bcrypt";
import config from "src/config";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { UnAuthorizedError } from "src/shared/errors";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
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
