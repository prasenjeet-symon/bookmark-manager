import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ErrorImage from "../../../../../assets/error.gif";
import "./ImportErrorComponent.css";

export default function ImportErrorComponent({ clicked }: { clicked: () => void }) {
  return (
    <>
      <Card className="import-error-component-style">
        <div>
          <img src={ErrorImage} alt="" />
        </div>
        <div className="text-red-400">Oops! Something went wrong</div>
        <div className="text-base text-slate-400">Looks like something went wrong. Please try again</div>
        <div>
          <Button onClick={clicked} variant="outline">
            Alright
          </Button>
        </div>
      </Card>
    </>
  );
}
