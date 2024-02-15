-- DropForeignKey
ALTER TABLE `linkhiddentag` DROP FOREIGN KEY `LinkHiddenTag_linkIdentifier_fkey`;

-- DropForeignKey
ALTER TABLE `linktag` DROP FOREIGN KEY `LinkTag_linkIdentifier_fkey`;

-- AlterTable
ALTER TABLE `link` MODIFY `identifier` VARCHAR(100) NOT NULL,
    MODIFY `icon` LONGTEXT NULL,
    MODIFY `notes` TEXT NULL;

-- AlterTable
ALTER TABLE `linkhiddentag` MODIFY `linkIdentifier` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `linktag` MODIFY `linkIdentifier` VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE `LinkTag` ADD CONSTRAINT `LinkTag_linkIdentifier_fkey` FOREIGN KEY (`linkIdentifier`) REFERENCES `Link`(`identifier`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkHiddenTag` ADD CONSTRAINT `LinkHiddenTag_linkIdentifier_fkey` FOREIGN KEY (`linkIdentifier`) REFERENCES `Link`(`identifier`) ON DELETE RESTRICT ON UPDATE CASCADE;
