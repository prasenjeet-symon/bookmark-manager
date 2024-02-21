import BackButtonComponent from "@/components/shared/BackButtonComponent/BackButtonComponent";
import DashboardHeader from "@/components/shared/DashboardHeader/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import scriptImage from "../../../assets/document.png";
import "./InstallScriptPage.css";
import script from "./script";

export default function InstallScriptPage() {
  return (
    <>
      <DashboardHeader />
      <section className="install-script-page-style page-content">
        <BackButtonComponent />
        <Card>
          {/* Image */}
          <img src={scriptImage} alt="Add to Linkify" />

          {/* Heading */}
          <h1 className="text-3xl"> Install Browser Script </h1>

          {/* Description  */}
          <p className="text-base text-slate-500"> You can easily install the browser script in your browser. That will help you quickly add bookmarks with single click. </p>

          {/* Tutorial */}
          <div className="bg-slate-700 p-5 border rounded">
            <ul>
              <li className="text-sm mb-2 list-disc ml-5"> Make bookmark manager visible on the tab bar. Use CTRL + SHIFT + B to open it.</li>
              <li className="text-sm mb-2 list-disc ml-5"> Once visible, drag button below to bookmark manager to add script.</li>
            </ul>
          </div>

          {/* Button */}
          <Button className="mt-5">
            <a href={script(import.meta.env.VITE_BASE_URL + "/dashboard/add-bookmark")}>Add to Linkify</a>
          </Button>
        </Card>
      </section>
    </>
  );
}
