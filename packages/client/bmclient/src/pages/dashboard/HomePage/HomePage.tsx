import DashboardHeader from "@/components/shared/DashboardHeader/DashboardHeader";
import TabComponent from "./Components/TabComponent/TabComponent";
import "./HomePage.css";

export default function DashboardHomePage() {
  
  return (
    <>
      <DashboardHeader />
      <section className="page-content">
        <TabComponent />
      </section>
    </>
  );
}
