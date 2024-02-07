import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserTab } from "@/datasource/schema";
import { faColonSign, faPallet, faPenClip, faPenFancy, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { ChooseTabColorComponentController } from "./ChoseTabColorComponent.component";
import "./ChoseTabColorComponent.css";

export default function ChooseTabColorComponent({ tab }: { tab: UserTab }) {
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
    tab.color = color;
    const controller = new ChooseTabColorComponentController();
    controller.updateTab(tab);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <FontAwesomeIcon onClick={() => setIsOpen(true)} icon={faPenFancy} />
      </DialogTrigger>
      <DialogContent className="add-tab-dialog" onInteractOutside={() => setIsOpen(false)}>
        <DialogHeader>
          <DialogTitle>Change tab color</DialogTitle>
          <DialogDescription>Pick and click on the color to change the tab's color. It will help you to organize your bookmarks.</DialogDescription>
        </DialogHeader>
        <div className="tab-choose-color-dialog-content">
          {darkColors.map((color) => {
            return <div key={color} className="color-item" style={{ backgroundColor: color }} onClick={() => updateColor(color)}></div>;
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
