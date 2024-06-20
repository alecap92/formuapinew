import { User } from "../models/user";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export enum AuthKeys {
  Authorization = "authorization",
  User = "user",
}

export async function generateToken(user: User, req: Request, res: Response) {
  try {
    const token = jwt.sign(user, process.env.JWT_SECRET!);
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = verified as User;
    return token;
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
}

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[AuthKeys.Authorization];
    const tokenByApiKey = req.headers[AuthKeys.Authorization];
    if (!token && !tokenByApiKey) return res.status(401).json("Access Denied");

    var verifiedToken;

    if (tokenByApiKey) {
      verifiedToken = jwt.verify(tokenByApiKey as string, process.env.JWT_SECRET!);
      req.user = verifiedToken as User;
      next(); 
      return;
    }

    verifiedToken = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = verifiedToken as User;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid token");
  }
}
