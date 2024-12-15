import { Request, Response, NextFunction } from "express";
import { verifyAccessTokenFromRequest } from "../helper";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // const decode = verifyAccessTokenFromRequest(req);
  // console.log(decode.id);
  // req.userId = decode.id ? decode.id : 1;
  req.userId = 1;
  next();
};
