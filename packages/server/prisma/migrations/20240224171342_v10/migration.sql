-- DropForeignKey
ALTER TABLE `linkhiddentag` DROP FOREIGN KEY `LinkHiddenTag_linkIdentifier_fkey`;

-- DropForeignKey
ALTER TABLE `linkhiddentag` DROP FOREIGN KEY `LinkHiddenTag_tagIdentifier_fkey`;

-- AlterTable
ALTER TABLE `linkhiddentag` MODIFY `linkIdentifier` VARCHAR(700) NOT NULL,
    MODIFY `tagIdentifier` VARCHAR(700) NOT NULL;

-- AddForeignKey
ALTER TABLE `LinkHiddenTag` ADD CONSTRAINT `LinkHiddenTag_linkIdentifier_fkey` FOREIGN KEY (`linkIdentifier`) REFERENCES `Link`(`identifier`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LinkHiddenTag` ADD CONSTRAINT `LinkHiddenTag_tagIdentifier_fkey` FOREIGN KEY (`tagIdentifier`) REFERENCES `HiddenTag`(`identifier`) ON DELETE RESTRICT ON UPDATE CASCADE;
