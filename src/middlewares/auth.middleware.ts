import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/apiResponse";

const JWT_SECRET = env.JWT_SECRET!;

// 🔑 Define your token payload shape
interface TokenPayload {
  userId: number;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json(
        new ApiResponse({
          statusCode: 401,
          message: "Missing or invalid authorization header",
        }),
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json(
      new ApiResponse({
        statusCode: 401,
        message: "Invalid or expired token",
      }),
    );
  }
}
