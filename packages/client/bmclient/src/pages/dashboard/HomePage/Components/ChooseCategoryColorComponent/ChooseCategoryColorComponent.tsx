import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TabCategory } from "@/datasource/schema";
import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ChooseCategoryColorComponentController } from "./ChooseCategoryColorComponent.component";
import './ChooseCategoryColorComponent.css';

export default function ChooseCategoryColorComponent({ category }: { category: TabCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const darkColors = [
    "#2B2D42",
    "#D90429",
    "#FF6600",
    "#FFC300",
    "#26BF6F",
    "#336699",
    "#FF0099",
    "#792359",
    "#8338EC",
    "#3A86FF",
    "#F72585",
    "#7209B7",
    "#4361EE",
    "#4CC9F0",
    "#16C79A",
    "#26A69A",
    "#2B9348",
    "#BADC58",
    "#FFD166",
    "#EF476F",
    "#0D0608",
  ];

  const updateColor = (color: string) => {
    category.color = color;
    const controller = new ChooseCategoryColorComponentController();
    controller.updateCategoryColor(category);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <FontAwesomeIcon onClick={() => setIsOpen(true)} icon={faPenFancy} size="sm" className="ml-3 hover:cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="choose-category-color-component-style" onInteractOutside={() => setIsOpen(false)}>
        <DialogHeader>
          <DialogTitle>Change category color</DialogTitle>
          <DialogDescription>Pick and click on the color to change the category's color. It will help you to organize your bookmarks.</DialogDescription>
        </DialogHeader>
        <div className="category-choose-color-dialog-content">
          {darkColors.map((color) => {
            return <div key={color} className="color-item" style={{ backgroundColor: color }} onClick={() => updateColor(color)}></div>;
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
