import { Request, Response } from "express";
import { brokerParamSchema, brokerCallBackSchema } from "./broker.schema";
import {
  getBrokerAuthUrl,
  connectBrokerAccount,
  getUserBrokerAccounts,
  connectDeltaBrokerAccount,
} from "./broker.service";
import { env } from "../../config/env";
import { ApiError } from "../../utils/apiError";

import jwt from "jsonwebtoken";
import { ApiResponse } from "../../utils/apiResponse";

export async function brokerConnectController(req: Request, res: Response) {
  const { broker } = brokerParamSchema.parse(req.params);
  const { token } = req.query as { token?: string };

  if (!token) {
    throw new ApiError({
      statusCode: 401,
      message: "Missing auth token",
    });
  }

  let payload: { userId: number };

  try {
    payload = jwt.verify(token, env.JWT_SECRET) as { userId: number };
  } catch {
    throw new ApiError({
      statusCode: 401,
      message: "Invalid auth token",
    });
  }

  const userId = payload.userId;

  // 🔐 Encode userId into OAuth state
  const state = jwt.sign({ userId }, env.OAUTH_STATE_SECRET, {
    expiresIn: "8h",
  });

  const url = await getBrokerAuthUrl(broker, state);
  res.redirect(url);
}

export async function brokerCallbackController(req: Request, res: Response) {
  const { broker } = brokerParamSchema.parse(req.params);
  const { code, state } = brokerCallBackSchema.parse(req.query);

  const payload = jwt.verify(state, env.OAUTH_STATE_SECRET) as {
    userId: number;
  };

  await connectBrokerAccount(broker, payload.userId, code);

  res.redirect(
    `${env.FRONTEND_URL}/dashboard?broker=${broker}&status=connected`,
  );
}

export async function connectDeltaBrokerController(
  req: Request,
  res: Response,
) {
  if (!req.user) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const { apiKey, apiSecret } = req.body as {
    apiKey?: string;
    apiSecret?: string;
  };

  if (!apiKey || !apiSecret) {
    throw new ApiError({
      statusCode: 400,
      message: "Missing API key or secret",
    });
  }

  await connectDeltaBrokerAccount(req.user.userId, apiKey, apiSecret);

  res.json(
    new ApiResponse({
      statusCode: 200,
      message: "Delta broker connected successfully",
    }),
  );
}

export async function getBrokerAccountsController(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const userId = req.user.userId;

  const accounts = await getUserBrokerAccounts(userId);

  res.json(
    accounts.map((acc) => ({
      broker: acc.broker,
      brokerUserId: acc.brokerUserId,
      isActive: acc.isActive,
      connectedAt: acc.createdAt,
    })),
  );
}
