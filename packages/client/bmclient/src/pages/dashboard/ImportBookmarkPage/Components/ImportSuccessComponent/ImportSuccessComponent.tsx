import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SuccessImage from "../../../../../assets/success.gif";
import "./ImportSuccessComponent.css";

export default function ImportSuccessComponent({ clicked }: { clicked: () => void }) {
  return (
    <>
      <Card className="import-success-component-style">
        <div>
          <img src={SuccessImage} alt="" />
        </div>
        <div className="text-green-400">Imported bookmark Successfully</div>
        <div className="text-base text-slate-400">We have imported all your bookmarks successfully. You can check them in MyBookmark section.</div>
        <div>
          <Button onClick={clicked}>Awesome</Button>
        </div>
      </Card>
    </>
  );
}
