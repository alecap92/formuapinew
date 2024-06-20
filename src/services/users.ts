import { AuthKeys, generateToken } from "../auth/user";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/user";
import { UserRepository } from "../repository/user";
import { comparePassword, hashPassword } from "../utils/bcrypt";

export class UserServices {
  public async createUser(req: Request<{}, {}, User, {}>, res: Response, next: NextFunction) {
    try {
      const userRepository = new UserRepository();
      const { password } = req.body;
      const hashedPassword = await hashPassword(password);
      const user = await userRepository.create({ ...req.body, password: hashedPassword });
      const userAux = user?.toObject() as User;
      console.log("New user created", userAux.email);
      userAux.password = "";
      const token = await generateToken(userAux, req, res);
      res.cookie(AuthKeys.Authorization, token);
      return res.status(201).send({...user, token});
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async getUser(req: Request, res: Response) {
    try {
      console.log(req.user);
      return req.user ? res.status(200).send(req.user) : res.status(404).send("User not found");
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async loginUser(req: Request<{}, {}, User, {}>, res: Response, NextFunction: NextFunction) {
    try {
      const userRepository = new UserRepository();
      const user = await userRepository.findByEmail(req.body.email);
      const isValidPassword = await comparePassword(req.body.password, user!.password);

      if (!isValidPassword) return res.status(400).send("Invalid password");

      const userAux = user?.toObject() as User;
      userAux.password = "";
      const token = await generateToken(userAux, req, res);

      return res
        .cookie(AuthKeys.Authorization, token)
        .status(200)
        .send({ ...userAux, password: "", token });
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }

  public async updateUser(req: Request<{}, {}, User, {}>, res: Response, next: NextFunction) {
    try {
      const userRepository = new UserRepository();

      const { password } = req.body;

      if (password) {
        const hashedPassword = await hashPassword(password);
        req.body.password = hashedPassword;
      }

      const user = await userRepository.update(req.user._id! as unknown as string, { ...req.body });
      const userAux = user?.toObject() as User;
      userAux.password = "";
      return res.status(200).send(userAux);
    } catch (error) {
      console.log(error);
      return res.status(400).send("Bad request");
    }
  }
}
