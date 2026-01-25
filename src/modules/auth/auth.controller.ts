import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../utils/apiResponse";

export class AuthController {
  // TODO: Implement register logic
  static async register(req: Request, res: Response) {
    try {
      const payload = registerSchema.parse(req.body);
      const result = await AuthService.register(payload);

      res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          message: "User registered successfully",
          data: result,
        }),
      );
    } catch (error: any) {
      res.status(400).json(
        new ApiResponse({
          statusCode: 400,
          message: "Failed to register user",
          errors: [error],
        }),
      );
    }
  }

  // TODO: Implement login logic
  static async login(req: Request, res: Response) {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await AuthService.login(payload);

      res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message: "User logged in successfully",
          data: result,
        }),
      );
    } catch (error: any) {
      res.status(400).json(
        new ApiResponse({
          statusCode: 400,
          message: "Failed to login user",
          errors: [error],
        }),
      );
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json(
          new ApiResponse({
            statusCode: 401,
            message: "Unauthorized",
          }),
        );
      }

      const user = await AuthService.getUser(userId);

      res.status(200).json(user);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}
