import { Link, TabCategory, UserTab } from "@/datasource/schema";
import { CategoryItemComponentController } from "../../../CategoryItemComponent/CategoryItemComponent.controller";
import "./SearchCategoryItemComponent.css";
import { Card } from "@/components/ui/card";
import UpdateCategoryComponent from "../../../UpdateCategoryComponent/UpdateCategoryComponent";
import ConfirmationDialogComponent from "@/components/shared/ConfirmationDialogComponent/ConfirmationDialogComponent";
import ChooseCategoryColorComponent from "../../../ChooseCategoryColorComponent/ChooseCategoryColorComponent";
import AddLinkComponent from "../../../AddLinkComponent/AddLinkComponent";
import LinkItemComponent from "../../../LinkItemComponent/LinkItemComponent";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function SearchCategoryItemComponent({ links, category, tab }: { links: Link[]; category: TabCategory | null; tab: UserTab | null }) {
  const deleteCategory = () => {
    if (!category) return;
    const controller = new CategoryItemComponentController();
    controller.deleteCategory(category);
  };

  if(!category || !tab) {
    return null;
  }

  return (
    <>
      <Card className="category-item-component-style">
        {/* header */}
        <div style={{ backgroundColor: category.color ? category.color : "#2B2D42" }}>
          <div>
           {tab.name} / {category.name} {category.canShowLinkCount ? "(" + links.length + ")" : ""}
          </div>
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
            return (
              <LinkItemComponent
                canShowNotes={category.canShowNoteInTooltip}
                canShowTags={category.canShowTagInTooltip}
                key={p.identifier}
                tabIdentifier={category.tabIdentifier}
                link={p}
              />
            );
          })}
        </div>
      </Card>
    </>
  );
}
