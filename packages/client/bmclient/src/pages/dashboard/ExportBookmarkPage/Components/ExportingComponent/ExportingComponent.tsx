import { Card } from "@/components/ui/card";
import LoadingImage from "../../../../../assets/loading.gif";
import "./ExportingComponent.css";

export default function ExportingComponent() {
  return (
    <>
      <Card className="exporting-component-style">
        <div>
          <img src={LoadingImage} alt="" />
        </div>
        <div>Exporting Bookmarks</div>
        <div className="text-base text-slate-400">You can safely navigate back and do other things in application. Once export is successful we will let you know.</div>
      </Card>
    </>
  );
}
