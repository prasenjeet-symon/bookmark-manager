import { Card } from "@/components/ui/card";
import { Link, ModelStoreStatus, TabCategory } from "@/datasource/schema";
import { openUrlsInInterval } from "@/datasource/utils";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import AddLinkComponent from "../AddLinkComponent/AddLinkComponent";
import ChooseCategoryColorComponent from "../ChooseCategoryColorComponent/ChooseCategoryColorComponent";
import LinkItemComponent from "../LinkItemComponent/LinkItemComponent";
import UpdateCategoryComponent from "../UpdateCategoryComponent/UpdateCategoryComponent";
import { CategoryItemComponentController } from "./CategoryItemComponent.controller";
import "./CategoryItemComponent.css";
import ConfirmationDialogComponent from "@/components/shared/ConfirmationDialogComponent/ConfirmationDialogComponent";

export default function CategoryItemComponent({ category }: { category: TabCategory }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const subscription = new CategoryItemComponentController().getLinks(category).subscribe((model) => {
      setLinks(model.data);
      setIsLoading(model.status === ModelStoreStatus.READY ? false : true);
    });

    return () => subscription?.unsubscribe();
  }, [category]);

  const deleteCategory = () => {
    const controller = new CategoryItemComponentController();
    controller.deleteCategory(category);
  };

  // Open all links
  const openAllLinks = () => {
    openUrlsInInterval(links.map((p) => p.url));
  };

  return (
    <>
      <Card className="category-item-component-style">
        {/* header */}
        <div style={{ backgroundColor: category.color ? category.color : "#2B2D42" }}>
          <div> {category.name } { category.canShowLinkCount ? '(' + category.linkCount + ')' : '' }  </div>
          <div>
            {/* actions button */}
            {/* Edit button */}
            <UpdateCategoryComponent category={category} />

            {/* Delete icon */}
            <ConfirmationDialogComponent title="Delete category" description="Are you sure you want to delete this category?" confirm={deleteCategory} icon={faTrash} />

            {/* Change color icon */}
            <ChooseCategoryColorComponent category={category} />

          </div>
        </div>
        <div>
          {/* Always visible add link item  */}
          <AddLinkComponent categoryIdentifier={category.identifier} tabIdentifier={category.tabIdentifier} />

          {/* List all created links */}
          {links.map((p) => {
            return <LinkItemComponent canShowNotes={category.canShowNoteInTooltip} canShowTags={category.canShowTagInTooltip} key={p.identifier} tabIdentifier={category.tabIdentifier} link={p} />;
          })}
        </div>
      </Card>
    </>
  );
}
