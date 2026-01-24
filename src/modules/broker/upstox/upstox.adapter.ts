import { env } from "../../../config/env";
import { BrokerOAuthAdapter, BrokerTokenPayload } from "../broker.types";
import { upstoxExchangeToken } from "./upstox.oauth";

export class UpstoxAdapter implements BrokerOAuthAdapter {
  getAuthUrl(state: string) {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: env.UPSTOX_CLIENT_ID,
      redirect_uri: env.UPSTOX_REDIRECT_URI,
      state,
    });

    return `https://api.upstox.com/v2/login/authorization/dialog?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<BrokerTokenPayload> {
    return upstoxExchangeToken(code);
  }
}
