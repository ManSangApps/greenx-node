import axios from "axios";
import { BrokerTokenPayload } from "../broker.types";
import qs from "qs";
import { env } from "../../../config/env";

export async function upstoxExchangeToken(
  code: string,
): Promise<BrokerTokenPayload> {
  const response = await axios.post(
    "https://api.upstox.com/v2/login/authorization/token",
    qs.stringify({
      code,
      client_id: env.UPSTOX_CLIENT_ID,
      client_secret: env.UPSTOX_CLIENT_SECRET,
      redirect_uri: env.UPSTOX_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const data = response.data;

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: new Date(Date.now() + data.expires_in * 1000),
    brokerUserId: data.user_id,
  };
}
