import { Request, Response } from "express";
import { User } from "../../models/user";
import { createJWTToken } from "../../helpers/jwt-token";

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const user = await User.findOne({ name: username, password: password });

  if (!user) {
    return res.status(400).json({ message: "Invalid username and password" });
  }

  return res.status(200).json({
    message: "Success",
    username,
    accessToken: createJWTToken({
      name: user.name,
      password: user.password,
      userId: user._id,
    }),
  });
};
