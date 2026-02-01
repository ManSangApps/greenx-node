import prisma from "../../config/db";
import { SupportedBrokers } from "./broker.types";
import { DeltaAdapter } from "./delta/delta.adapter";
import { UpstoxAdapter } from "./upstox/upstox.adapter";

function getBrokerAdapter(broker: SupportedBrokers) {
  switch (broker) {
    case "upstox":
      return new UpstoxAdapter();

    default:
      throw new Error("Unsupported broker");
  }
}

export async function getBrokerAuthUrl(
  broker: SupportedBrokers,
  userId: string,
) {
  const adapter = getBrokerAdapter(broker);
  return adapter.getAuthUrl(String(userId));
}

export async function connectBrokerAccount(
  broker: SupportedBrokers,
  userId: number,
  code: string,
) {
  const adapter = getBrokerAdapter(broker);
  const token = await adapter.exchangeCodeForToken(code);

  return prisma.brokerAccount.upsert({
    where: {
      userId_broker: {
        userId,
        broker,
      },
    },
    update: {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken ?? null,
      tokenExpireAt: token.expireAt ?? null,
      brokerUserId: token.brokerUserId,
      isActive: true,
    },
    create: {
      userId,
      broker,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken ?? null,
      tokenExpireAt: token.expireAt ?? null,
      brokerUserId: token.brokerUserId,
    },
  });
}

export async function connectDeltaBrokerAccount(
  userId: number,
  apiKey: string,
  apiSecret: string,
) {
  const adapter = new DeltaAdapter(apiKey, apiSecret);

  const account = await adapter.getAccountInfo();

  return prisma.brokerAccount.upsert({
    where: {
      userId_broker: {
        userId,
        broker: "delta",
      },
    },
    update: {
      accessToken: apiKey,
      refreshToken: apiSecret, // ⚠️ encrypt later
      brokerUserId: account.user_id,
      isActive: true,
    },
    create: {
      userId,
      broker: "delta",
      accessToken: apiKey,
      refreshToken: apiSecret,
      brokerUserId: account.user_id,
    },
  });
}

export async function getUserBrokerAccounts(userId: number) {
  return prisma.brokerAccount.findMany({
    where: {
      userId,
      isActive: true,
    },
    select: {
      broker: true,
      brokerUserId: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });
}
