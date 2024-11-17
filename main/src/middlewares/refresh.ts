import { Request, Response, NextFunction } from "express";
import { verifyRefreshTokenFromRequest } from "src/utils/helper";

export const refresh = (req: Request, res: Response, next: NextFunction) => {
  const decode = verifyRefreshTokenFromRequest(req);
  req.userId = decode.id;
  next();
};
