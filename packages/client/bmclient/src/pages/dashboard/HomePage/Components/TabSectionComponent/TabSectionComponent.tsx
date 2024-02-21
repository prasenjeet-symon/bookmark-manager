import EmptyDataComponent from "@/components/shared/EmptyDataComponent/EmptyDataComponent";
import { ModelStoreStatus, TabCategory, UserTab } from "@/datasource/schema";
import { useEffect, useState } from "react";
import NoCategoryImage from "../../../../../assets/categories.png";
import AddCategoryComponent from "../AddCategoryComponent/AddCategoryComponent";
import CategoryItemComponent from "../CategoryItemComponent/CategoryItemComponent";
import { TabSectionComponentController } from "./TabSectionComponent.controller";
import "./TabSectionComponent.css";

export default function TabSectionComponent({ tab }: { tab: UserTab }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<TabCategory[]>([]);

  useEffect(() => {
    const _subscription = new TabSectionComponentController().getCategory(tab.identifier).subscribe((model) => {
      setCategories(model.data);
      setIsLoading(model.status === ModelStoreStatus.BOOTING ? true : false);
    });

    return () => _subscription?.unsubscribe();
  }, [tab]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex">
        <div className="flex-1"></div>
        <div>
          <AddCategoryComponent tabIdentifier={tab.identifier} />
        </div>
      </div>
      {categories.length === 0 && !isLoading ? (
        <EmptyDataComponent
          title="No categories found"
          description="Looks like you don't have any categories yet. Please add some by clicking the button above"
          img={NoCategoryImage}
        />
      ) : null}
      <ThreeColumnLayout tabCategories={categories} tabIdentifier={tab.identifier} />
    </>
  );
}

/**
 *
 *
 *
 */

const ThreeColumnLayout: React.FC<{ tabCategories: TabCategory[]; tabIdentifier: string }> = ({ tabCategories, tabIdentifier }) => {
  const [firstColumnItems, setFirstColumnItems] = useState<TabCategory[]>([]);
  const [secondColumnItems, setSecondColumnItems] = useState<TabCategory[]>([]);
  const [thirdColumnItems, setThirdColumnItems] = useState<TabCategory[]>([]);

  const fillColumns = () => {
    // Clear the columns
    setFirstColumnItems([]);
    setSecondColumnItems([]);
    setThirdColumnItems([]);

    // Calculate the number of items per column
    const itemsPerColumn = Math.ceil(tabCategories.length / 3);

    // Fill the columns with items
    tabCategories.forEach((category, index) => {
      if (index < itemsPerColumn) {
        setFirstColumnItems((prevItems) => [...prevItems, category]);
      } else if (index < 2 * itemsPerColumn) {
        setSecondColumnItems((prevItems) => [...prevItems, category]);
      } else {
        setThirdColumnItems((prevItems) => [...prevItems, category]);
      }
    });
  };

  useEffect(() => {
    fillColumns();
  }, [tabCategories]);

  return (
    <div className="three-column-layout-style">
      <div>
        {firstColumnItems.map((category) => (
          <CategoryItemComponent key={category.identifier} category={category} />
        ))}
      </div>
      <div>
        {secondColumnItems.map((category) => (
          <CategoryItemComponent key={category.identifier} category={category} />
        ))}
      </div>
      <div>
        {thirdColumnItems.map((category) => (
          <CategoryItemComponent key={category.identifier} category={category} />
        ))}
      </div>
    </div>
  );
};
