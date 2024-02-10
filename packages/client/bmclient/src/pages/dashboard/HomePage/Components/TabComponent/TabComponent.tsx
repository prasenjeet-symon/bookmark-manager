import { useEffect, useState } from "react";
import tabLogo from "../../../../../assets/tabs.png";
import "./TabComponent.css";

import EmptyDataComponent from "@/components/shared/EmptyDataComponent/EmptyDataComponent";
import { ModelStoreStatus, UserTab } from "@/datasource/schema";
import { faCheckCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddTabComponent from "../AddTabComponent/AddTabComponent";
import ChooseTabColorComponent from "../ChoseTabColorComponent/ChoseTabColorComponent";
import TabSectionComponent from "../TabSectionComponent/TabSectionComponent";
import UpdateTabComponent from "../UpdateTabComponent/UpdateTabComponent";
import { TabComponentController } from "./TabComponent.controller";

export default function TabComponent() {
  const [tabs, setTabs] = useState<UserTab[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tabActive, setTabActive] = useState<UserTab>();

  useEffect(() => {
    setTabIndex(0);

    const subscription = new TabComponentController().getTabs()?.subscribe((model) => {
      setTabs(model.data);
      setIsLoading(model.status === ModelStoreStatus.READY ? false : true);

      if (getTabIndex() === 0 && model.data.length > 0) {
        setTabActive(model.data[0]);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  /**
   * Tab clicked
   */
  const handleClick = (tab: UserTab) => {
    setTabActive(tab);
    const index = tabs.findIndex((t) => t.identifier === tab.identifier);
    setTabIndex(index);
  };

  // Set tab index
  const setTabIndex = (index: number) => {
    localStorage.setItem("tabIndex", index.toString());
  };

  // Get tab index
  const getTabIndex = (): number => {
    const index = localStorage.getItem("tabIndex");
    return index ? parseInt(index) : 0;
  };

  /**
   * Delete tab
   */
  const deleteTab = (tab: UserTab) => {
    const controller = new TabComponentController();
    controller.deleteTab(tab);
  };

  /**
   * Get tab color
   */
  const getTabColor = (tab: UserTab) => {
    return tab.color ? tab.color : "#0D0608";
  };

  /**
   * Is empty
   */
  const isEmpty = () => {
    return tabs.length === 0 && !isLoading;
  };

  if (isLoading) {
    return "Loading...";
  }

  return (
    <>
      <section className="tab-component-style bg-slate-800">
        <div>
          {tabs.map((tab) => (
            <button
              style={{ backgroundColor: getTabColor(tab), border: tabActive?.identifier === tab.identifier ? "1px solid white" : "none" }}
              key={tab.identifier}
              type="button"
              onClick={() => handleClick(tab)}
              className="tab-item-button"
            >
              {tabActive?.identifier === tab.identifier ? (
                <div className="active-icon">
                  <FontAwesomeIcon size="sm" icon={faCheckCircle} />
                </div>
              ) : null}
              <div>
                {" "}
                {tab.name} {tab.canShowLinkCount ? "(" + tab.linkCount + ")" : ""}{" "}
              </div>
              <div className="tab-actions">
                {/* Delete */}
                <FontAwesomeIcon onClick={() => deleteTab(tab)} className="ml-3" size="sm" icon={faTrash} />
                {/* Edit */}
                <UpdateTabComponent tab={tab} />
                {/* Color */}
                <ChooseTabColorComponent tab={tab} />
              </div>
            </button>
          ))}
        </div>
        <div>
          {/* Plus button to add more tab */}
          <div className="add-tab-button bg-slate-950">
            <AddTabComponent />
          </div>
        </div>
      </section>

      {/* Tab content */}
      <section className="tab-content">
        {!isEmpty() && tabActive ? (
          <TabSectionComponent tab={tabActive!}></TabSectionComponent>
        ) : (
          <EmptyDataComponent img={tabLogo} title="No tab" description={"Looks like you do not have any tabs yet. Please add one by clicking plus button above"} />
        )}
      </section>
    </>
  );
}
