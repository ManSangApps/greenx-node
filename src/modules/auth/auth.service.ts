import prisma from "../../config/db";
import { env } from "../../config/env";
import { ApiError } from "../../utils/apiError";
import { AuthResponse, LoginInput, RegisterInput } from "./auth.types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = env.JWT_SECRET!;

export class AuthService {
  //   Registration
  static async register(data: RegisterInput): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ApiError({
        statusCode: 400,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password_hash: hashedPassword,
        name: data.name,
        phone: data.phone ?? null,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        isActive: user.isActive,
      },
    };
  }

  //   Login
  static async login(data: LoginInput): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ApiError({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(data.password, user.password_hash);

    if (!isValid) {
      throw new ApiError({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return { token };
  }

  // User
  static async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
