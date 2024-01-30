-- DropForeignKey
ALTER TABLE `link` DROP FOREIGN KEY `Link_categoryIdentifier_fkey`;

-- AlterTable
ALTER TABLE `link` MODIFY `categoryIdentifier` VARCHAR(37) NULL;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_categoryIdentifier_fkey` FOREIGN KEY (`categoryIdentifier`) REFERENCES `Category`(`identifier`) ON DELETE SET NULL ON UPDATE CASCADE;
