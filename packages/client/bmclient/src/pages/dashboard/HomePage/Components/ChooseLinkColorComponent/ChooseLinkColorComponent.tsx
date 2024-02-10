import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@/datasource/schema";
import './ChooseLinkColorComponent.css';
import { ChooseLinkColorComponentController } from "./ChooseLinkColorComponent.component";

export default function ChooseLinkColorComponent({ link , tabIdentifier}: { link: Link, tabIdentifier: string }) {
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
    link.color = color;
    const controller = new ChooseLinkColorComponentController();
    controller.updateLink(link, tabIdentifier);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-between p-2 text-base" onClick={() => setIsOpen(true)}>
          Change color <FontAwesomeIcon className="ml-3" size="sm" icon={faPenFancy} />{" "}
        </div>
      </DialogTrigger>
      <DialogContent className="add-tab-dialog" onInteractOutside={() => setIsOpen(false)}>
        <DialogHeader>
          <DialogTitle>Change link color</DialogTitle>
          <DialogDescription>Pick and click on the color to change the link's color. It will help you highlight your links.</DialogDescription>
        </DialogHeader>
        <div className="link-choose-color-dialog-content">
          {darkColors.map((color) => {
            return <div key={color} className="color-item" style={{ backgroundColor: color }} onClick={() => updateColor(color)}></div>;
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
