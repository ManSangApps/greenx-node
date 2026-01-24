import { Request, Response } from "express";
import { brokerParamSchema, brokerCallBackSchema } from "./broker.schema";
import { getBrokerAuthUrl, connectBrokerAccount } from "./broker.service";
import { env } from "../../config/env";
import { ApiError } from "../../utils/apiError";

export async function brokerConnectController(req: Request, res: Response) {
  const { broker } = brokerParamSchema.parse(req.params);

  if (!req.user) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const userId = req.user.id;
  const url = await getBrokerAuthUrl(broker, userId);
  res.redirect(url);
}

export async function brokerCallbackController(req: Request, res: Response) {
  const { broker } = brokerParamSchema.parse(req.params);
  const { code, state } = brokerCallBackSchema.parse(req.query);

  await connectBrokerAccount(broker, Number(state), code);

  res.redirect(
    `${env.FRONTEND_URL}/dashboard?broker=${broker}&status=connected`,
  );
}
