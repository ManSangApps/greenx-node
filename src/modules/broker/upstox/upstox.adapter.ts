import { env } from "../../../config/env";
import { BrokerOAuthAdapter, BrokerTokenPayload } from "../broker.types";
import { upstoxExchangeToken } from "./upstox.oauth";

export class UpstoxAdapter implements BrokerOAuthAdapter {
  getAuthUrl(state: string): string {
    console.log(
      "url params",
      "https://api.upstox.com/v2/login/authorization/dialog" +
        `?response_type=code` +
        `&client_id=${env.UPSTOX_CLIENT_ID}` +
        `&redirect_uri=${env.UPSTOX_REDIRECT_URI}` +
        `&state=${state}`,
    );
    return (
      "https://api.upstox.com/v2/login/authorization/dialog" +
      `?response_type=code` +
      `&client_id=${env.UPSTOX_CLIENT_ID}` +
      `&redirect_uri=${env.UPSTOX_REDIRECT_URI}` +
      `&state=${state}`
    );
  }

  async exchangeCodeForToken(code: string): Promise<BrokerTokenPayload> {
    return upstoxExchangeToken(code);
  }
}
