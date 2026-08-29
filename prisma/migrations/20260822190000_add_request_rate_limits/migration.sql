CREATE TABLE "request_rate_limits" (
    "id" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "request_rate_limits_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "request_rate_limits_route_keyHash_windowStart_key"
ON "request_rate_limits"("route", "keyHash", "windowStart");

CREATE INDEX "request_rate_limits_expiresAt_idx"
ON "request_rate_limits"("expiresAt");
