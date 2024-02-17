/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `SubscriptionPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(37) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `priceId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `interval` VARCHAR(191) NOT NULL DEFAULT 'month',
    `intervalCount` INTEGER NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `adminIdentifier` VARCHAR(37) NOT NULL,

    UNIQUE INDEX `SubscriptionPlan_identifier_key`(`identifier`),
    UNIQUE INDEX `SubscriptionPlan_adminIdentifier_key`(`adminIdentifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FreeTrial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `userIdentifier` VARCHAR(37) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `FreeTrial_identifier_key`(`identifier`),
    UNIQUE INDEX `FreeTrial_userIdentifier_key`(`userIdentifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `userIdentifier` VARCHAR(37) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `priceId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `interval` VARCHAR(191) NOT NULL DEFAULT 'month',
    `intervalCount` INTEGER NOT NULL DEFAULT 1,
    `sessionId` VARCHAR(700) NOT NULL,
    `subscriptionId` VARCHAR(700) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Subscription_identifier_key`(`identifier`),
    UNIQUE INDEX `Subscription_userIdentifier_key`(`userIdentifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubscriptionTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userIdentifier` VARCHAR(37) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `price` DOUBLE NOT NULL DEFAULT 0.00,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `isPaid` BOOLEAN NOT NULL DEFAULT false,
    `isFailed` BOOLEAN NOT NULL DEFAULT false,
    `error` LONGTEXT NULL,
    `webhookEvent` VARCHAR(191) NOT NULL,
    `webhookId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_userId_key` ON `Admin`(`userId`);

-- AddForeignKey
ALTER TABLE `SubscriptionPlan` ADD CONSTRAINT `SubscriptionPlan_adminIdentifier_fkey` FOREIGN KEY (`adminIdentifier`) REFERENCES `Admin`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FreeTrial` ADD CONSTRAINT `FreeTrial_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionTransaction` ADD CONSTRAINT `SubscriptionTransaction_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
