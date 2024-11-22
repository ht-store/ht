import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId: number;
      roleId: number;
      rawBody?: string;
    }
  }
}

// This is to ensure the file is treated as a module
export {};
