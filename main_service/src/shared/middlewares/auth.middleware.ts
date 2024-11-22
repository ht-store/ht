import { Request, Response, NextFunction } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // const decode = verifyAccessTokenFromRequest(req);
  // req.userId = decode.id;
  req.userId = 1;
  next();
};
