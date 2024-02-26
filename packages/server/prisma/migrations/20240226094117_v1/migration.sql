-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `profilePicture` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(37) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Admin_email_key`(`email`),
    UNIQUE INDEX `Admin_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `profilePicture` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(37) NOT NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `timeZone` VARCHAR(191) NOT NULL DEFAULT 'IST',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `maxSession` INTEGER NOT NULL DEFAULT 5,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionToken` VARCHAR(700) NOT NULL,
    `userIdentifier` VARCHAR(37) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `loc` VARCHAR(191) NOT NULL,
    `org` VARCHAR(191) NOT NULL,
    `postal` VARCHAR(191) NOT NULL,
    `timezone` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
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

-- CreateTable
CREATE TABLE `TaskManager` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userIdentifier` VARCHAR(37) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `status` ENUM('initial', 'success', 'error', 'uploading', 'processing') NOT NULL DEFAULT 'initial',
    `message` MEDIUMTEXT NOT NULL,
    `error` MEDIUMTEXT NOT NULL,
    `progress` DOUBLE NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `TaskManager_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userIdentifier` VARCHAR(37) NOT NULL,
    `isDarkMode` BOOLEAN NOT NULL DEFAULT true,
    `numberOfColumns` ENUM('THREE', 'FOUR', 'FIVE') NOT NULL,
    `showNumberOfBookmarkInTab` BOOLEAN NOT NULL DEFAULT false,
    `showNumberOfBookmarkInCategory` BOOLEAN NOT NULL DEFAULT false,
    `showTagsInTooltip` BOOLEAN NOT NULL DEFAULT false,
    `showNoteInTooltip` BOOLEAN NOT NULL DEFAULT false,
    `allowDragDropToMoveLink` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserSetting_userIdentifier_key`(`userIdentifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserTab` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(37) NOT NULL,
    `userIdentifier` VARCHAR(37) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `UserTab_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(37) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `color` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `tabIdentifier` VARCHAR(37) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Category_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Link` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(100) NOT NULL,
    `title` MEDIUMTEXT NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `icon` LONGTEXT NULL,
    `notes` MEDIUMTEXT NULL,
    `color` VARCHAR(191) NULL,
    `categoryIdentifier` VARCHAR(37) NULL,
    `userIdentifier` VARCHAR(37) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Link_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(37) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Tag_identifier_key`(`identifier`),
    UNIQUE INDEX `Tag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LinkTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `linkIdentifier` VARCHAR(100) NOT NULL,
    `tagIdentifier` VARCHAR(37) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HiddenTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(700) NOT NULL,
    `name` VARCHAR(700) NOT NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `HiddenTag_identifier_key`(`identifier`),
    UNIQUE INDEX `HiddenTag_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LinkHiddenTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `linkIdentifier` VARCHAR(700) NOT NULL,
    `tagIdentifier` VARCHAR(700) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubscriptionPlan` ADD CONSTRAINT `SubscriptionPlan_adminIdentifier_fkey` FOREIGN KEY (`adminIdentifier`) REFERENCES `Admin`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FreeTrial` ADD CONSTRAINT `FreeTrial_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionTransaction` ADD CONSTRAINT `SubscriptionTransaction_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskManager` ADD CONSTRAINT `TaskManager_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSetting` ADD CONSTRAINT `UserSetting_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserTab` ADD CONSTRAINT `UserTab_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_tabIdentifier_fkey` FOREIGN KEY (`tabIdentifier`) REFERENCES `UserTab`(`identifier`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_categoryIdentifier_fkey` FOREIGN KEY (`categoryIdentifier`) REFERENCES `Category`(`identifier`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkTag` ADD CONSTRAINT `LinkTag_linkIdentifier_fkey` FOREIGN KEY (`linkIdentifier`) REFERENCES `Link`(`identifier`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkTag` ADD CONSTRAINT `LinkTag_tagIdentifier_fkey` FOREIGN KEY (`tagIdentifier`) REFERENCES `Tag`(`identifier`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkHiddenTag` ADD CONSTRAINT `LinkHiddenTag_linkIdentifier_fkey` FOREIGN KEY (`linkIdentifier`) REFERENCES `Link`(`identifier`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkHiddenTag` ADD CONSTRAINT `LinkHiddenTag_tagIdentifier_fkey` FOREIGN KEY (`tagIdentifier`) REFERENCES `HiddenTag`(`identifier`) ON DELETE RESTRICT ON UPDATE CASCADE;
