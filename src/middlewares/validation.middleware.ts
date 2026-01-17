import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export const validateBody =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      // Extract readable errors
      const issues = parsed.error.issues.map((err) => ({
        path: err.path.join("."), // which field failed
        message: err.message, // what went wrong
      }));

      return next(
        new ApiError({
          statusCode: 400,
          message: "Invalid request body",
          data: issues,
        }),
      );
    }

    req.body = parsed.data;
    next();
  };
