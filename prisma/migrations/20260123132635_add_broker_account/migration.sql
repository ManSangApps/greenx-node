-- CreateTable
CREATE TABLE "brokerAccount" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "broker" TEXT NOT NULL,
    "brokerUserId" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "tokenExpireAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brokerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brokerAccount_userId_broker_key" ON "brokerAccount"("userId", "broker");

-- AddForeignKey
ALTER TABLE "brokerAccount" ADD CONSTRAINT "brokerAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
