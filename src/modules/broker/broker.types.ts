export type SupportedBrokers = "upstox" | "delta"; 

export interface BrokerOAuthAdapter {
  getAuthUrl(state: string): string;
  exchangeCodeForToken(code: string): Promise<BrokerTokenPayload>;
}

export interface BrokerTokenPayload {
  accessToken: string;
  refreshToken?: string;
  expireAt?: Date;
  brokerUserId?: string;
}
