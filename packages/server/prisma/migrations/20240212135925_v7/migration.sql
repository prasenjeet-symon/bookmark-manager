-- AlterTable
ALTER TABLE `link` MODIFY `title` MEDIUMTEXT NOT NULL,
    MODIFY `notes` MEDIUMTEXT NULL;

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

-- AddForeignKey
ALTER TABLE `TaskManager` ADD CONSTRAINT `TaskManager_userIdentifier_fkey` FOREIGN KEY (`userIdentifier`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;
