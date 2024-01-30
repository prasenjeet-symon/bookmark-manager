-- DropForeignKey
ALTER TABLE `linkhiddentag` DROP FOREIGN KEY `LinkHiddenTag_tagIdentifier_fkey`;

-- AlterTable
ALTER TABLE `linkhiddentag` MODIFY `tagIdentifier` VARCHAR(300) NOT NULL;

-- AddForeignKey
ALTER TABLE `LinkHiddenTag` ADD CONSTRAINT `LinkHiddenTag_tagIdentifier_fkey` FOREIGN KEY (`tagIdentifier`) REFERENCES `HiddenTag`(`identifier`) ON DELETE RESTRICT ON UPDATE CASCADE;
