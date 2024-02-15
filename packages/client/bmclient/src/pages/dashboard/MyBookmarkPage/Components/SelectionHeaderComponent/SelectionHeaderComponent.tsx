import { Card } from "@/components/ui/card";
import { Link, TabCategory } from "@/datasource/schema";
import { faArrowAltCircleLeft, faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectCategoryComponent from "../SelectCategoryComponent/SelectCategoryComponent";
import { SelectionHeaderComponentController } from "./SelectionHeaderComponent.controller";
import "./SelectionHeaderComponent.css";

export default function SelectionHeaderComponent({ links, clear }: { links: Link[]; clear: () => void }) {
  const deleteMultipleLinks = () => {
    new SelectionHeaderComponentController().deleteLinks(links);
  };

  const moveLinks = (category: TabCategory) => {
    new SelectionHeaderComponentController().moveLinksToCategory(links, category);
  };

  return (
    <>
      <Card className="selection-header-component-style bg-slate-800">
        <div>
          <FontAwesomeIcon onClick={clear} icon={faClose} className="mr-2 cursor-pointer" /> {links.length} Selected
        </div>
        <div>
          {/* Delete button */}
          <FontAwesomeIcon onClick={deleteMultipleLinks} className="cursor-pointer" icon={faTrash} />
          {/* Move icon */}
          <SelectCategoryComponent selectedCategory={(category) => {
            moveLinks(category);
          }} selectedTab={() => {}} />
          
        </div>
      </Card>
    </>
  );
}
