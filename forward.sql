-- $ D:\Developer\Damdafayton\upwork-oaysus\oaysus-serverless\node_modules\.bin\prisma migrate diff --from-url postgresql://oaysus:dym8fqx7wxk*ntw3XTY@oaysus.c9jrslambwvl.us-east-1.rds.amazonaws.com/oaysusDev --to-schema-datamodel ./prisma/schema.prisma --script
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "deletethis";

-- CreateTable
CREATE TABLE "store_session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "store_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upsell" (
    "id" SERIAL NOT NULL,
    "shopId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "views" INTEGER NOT NULL,
    "conversion" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "triggers" JSONB NOT NULL,
    "content" JSONB NOT NULL,

    CONSTRAINT "Upsell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Billing" (
    "id" SERIAL NOT NULL,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_email_key" ON "Shop"("email");

-- AddForeignKey
ALTER TABLE "Upsell" ADD CONSTRAINT "Upsell_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

