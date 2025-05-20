import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "todo-app-be";

export const createJWTToken = (payLoad: any) => {
  return jwt.sign(payLoad, JWT_SECRET, {
    expiresIn: 60 * 24 * 1000,
  });
};
