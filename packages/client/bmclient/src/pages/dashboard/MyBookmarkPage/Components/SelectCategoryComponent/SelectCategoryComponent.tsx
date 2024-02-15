import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TabCategory, UserTab } from "@/datasource/schema";
import DropdownCategoryComponent from "@/pages/dashboard/HomePage/Components/AddLinkComponent/components/DropdownCategoryComponent/DropdownCategoryComponent";
import DropdownTabComponent from "@/pages/dashboard/HomePage/Components/AddLinkComponent/components/DropdownTabComponent/DropdownTabComponent";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./SelectCategoryComponent.css";
import { Button } from "@/components/ui/button";

export default function SelectCategoryComponent({ selectedCategory, selectedTab }: { selectedTab: (tab: UserTab) => void; selectedCategory: (category: TabCategory) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<UserTab | null>(null);
  const [category, setCategory] = useState<TabCategory | null>(null);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <FontAwesomeIcon onClick={() => setIsOpen(true)} className="cursor-pointer" icon={faArrowAltCircleLeft} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a category</DialogTitle>
            <DialogDescription>Please select desired category from the drop down menu.</DialogDescription>
          </DialogHeader>
          <DropdownTabComponent
            tabSelected={(tab) => {
              setTab(tab);
            }}
          />
          {tab ? <DropdownCategoryComponent selectedCategory={(category) => setCategory(category)} tab={tab} /> : null}

          <div className="select-category-footer">
            <Button variant="default"
              onClick={() => {
                if (category) {
                  selectedCategory(category);
                }
                if (tab) {
                  selectedTab(tab);
                }
                setIsOpen(false);
              }}
            >
              Select
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
