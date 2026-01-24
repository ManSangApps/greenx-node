import prisma from "../../config/db";
import { SupportedBrokers } from "./broker.types";
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
  console.log("adapter", adapter);
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
  });
}
