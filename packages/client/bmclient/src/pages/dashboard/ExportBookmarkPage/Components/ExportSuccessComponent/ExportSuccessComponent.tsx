import { Card } from "@/components/ui/card";
import './ExportSuccessComponent.css';
import SuccessImage from "../../../../../assets/success.gif";
import { Button } from "@/components/ui/button";

export default function ExportSuccessComponent({ clicked }: { clicked: () => void }) {
  return (
    <>
      <Card className="export-success-component-style">
        <div>
          <img src={SuccessImage} alt="" />
        </div>
        <div className="text-green-400">Exported bookmark Successfully</div>
        <div className="text-base text-slate-400">We have exported all your bookmarks successfully. Your download will start soon.</div>
        <div>
          <Button onClick={clicked}>Awesome</Button>
        </div>
      </Card>
    </>
  );
}
