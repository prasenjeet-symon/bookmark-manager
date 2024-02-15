import { Card } from "@/components/ui/card";
import LoadingImage from "../../../../../assets/loading.gif";
import "./ImportingComponent.css";

export default function ImportingComponent() {
  return (
    <>
      <Card className="importing-component-style">
        <div>
          <img src={LoadingImage} alt="" />
        </div>
        <div>Importing Bookmarks</div>
        <div className="text-base text-slate-400">You can safely navigate back and do other things in application. Once import is successful we will let you know.</div>
      </Card>
    </>
  );
}
