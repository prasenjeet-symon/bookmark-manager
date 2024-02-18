import { Button } from "@/components/ui/button";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import linkAddedImage from "../../../../../assets/connection.png";
import "./LinkAddedComponent.css";

export default function LinkAddedComponent({ addMore }: { addMore: () => void }) {
  return (
    <section className="link-added-component-style">
      <img src={linkAddedImage} alt="Link added image" />
      <h1 className="text-3xl">Link added successfully</h1>
      <p className="text-base text-slate-400"> Your link is bookmarked successfully into your desired tab and category.</p>
      <Button onClick={addMore} variant="default">
        <FontAwesomeIcon className="mr-2" icon={faAdd} /> Add more
      </Button>
    </section>
  );
}
