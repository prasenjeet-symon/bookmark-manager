import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from "@/datasource/schema";
import { faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChooseLinkColorComponent from "../ChooseLinkColorComponent/ChooseLinkColorComponent";
import UpdateLinkComponent from "../UpdateLinkComponent/UpdateLinkComponent";
import { LinkItemComponentController } from "./LinkItemComponent.controller";
import "./LinkItemComponent.css";

export default function LinkItemComponent({ link, tabIdentifier, canShowNotes, canShowTags }: { link: Link; tabIdentifier: string; canShowNotes: boolean; canShowTags: boolean }) {
  const deleteLink = () => {
    const controller = new LinkItemComponentController();
    controller.deleteLink(tabIdentifier, link);
  };

  return (
    <HoverCard>
      <div className="link-item-component-style">
        <div>
          <img className="mr-2" src={link.icon || "https://placehold.jp/150x150"} alt="" />
          <HoverCardTrigger>
            <button type="button" style={{ backgroundColor: link.color ? link.color : "" }} className="text-base link-text">
              {link.title}
            </button>
          </HoverCardTrigger>
        </div>
        <div>
          <FontAwesomeIcon className="mr-2" size="sm" icon={faEllipsisVertical} />
          {/* More menu */}
          <div className="link-item-more-menu bg-background border-2">
            <UpdateLinkComponent link={link} tabIdentifier={tabIdentifier} />
            <ChooseLinkColorComponent link={link} tabIdentifier={tabIdentifier} />
            <div className="flex justify-between p-2 text-base" onClick={() => deleteLink()}>
              Delete link <FontAwesomeIcon className="ml-3" size="sm" icon={faTrash} />{" "}
            </div>
          </div>
        </div>
      </div>

      <HoverCardContent className={canShowNotes || canShowTags ? "block" : "hidden"}>
        {canShowNotes ? (
          <>
            <p className="font-bold text-lg">Notes</p>
            <p className="mb-2"> {link.notes} </p>
            <hr />
          </>
        ) : null}

        {canShowTags ? (
          <>
            <p className="font-bold text-lg mt-2 mb-2">Tags</p>
            <p>
              {link.tags.map((tag) => {
                return (
                  <Badge className="mr-2" variant="default" key={tag}>
                    {tag}
                  </Badge>
                );
              })}
            </p>
          </>
        ) : null}
      </HoverCardContent>
    </HoverCard>
  );
}
