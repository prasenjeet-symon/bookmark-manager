import DashboardHeader from "@/components/shared/DashboardHeader/DashboardHeader";
import HeaderMobileDashboard from "@/components/shared/MobileHeaderDashboardComponent/MobileHeaderDashboardComponent";
import { useState } from "react";
import SearchComponent from "./Components/SearchComponent/SearchComponent";
import TabComponent from "./Components/TabComponent/TabComponent";
import "./HomePage.css";

export default function DashboardHomePage() {
  const [canShowSearch, setCanShowSearch] = useState<boolean>(false);

  return (
    <>
      <DashboardHeader />
      <HeaderMobileDashboard />
      <section className="page-content">
        {canShowSearch ? <SearchComponent onClose={() => setCanShowSearch(false)} /> : null}
        {canShowSearch ? null : <TabComponent onSearchClick={() => setCanShowSearch(true)} />}
      </section>
    </>
  );
}
