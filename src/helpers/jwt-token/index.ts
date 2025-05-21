import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "todo-app-be";

export const createJWTToken = (payLoad: any) => {
  return jwt.sign(payLoad, JWT_SECRET, {
    expiresIn: 60 * 24 * 1000,
  });
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const user: any = jwt.verify(req.headers.authorization, JWT_SECRET);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    if (Date.now() > user.exp * 1000) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const tokenUser = await User.findById(user.userId);

    if (!tokenUser) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    (req as any).user = tokenUser;

    next();
  } catch (error: any) {
    return res
      .status(401)
      .json({ message: "Something wwnt wrong 123" + error.message });
  }
};
