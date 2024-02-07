import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./TabComponent.css";
import tabLogo from '../../../../../assets/tabs.png';

import EmptyDataComponent from "@/components/shared/EmptyDataComponent/EmptyDataComponent";
import { ModelStoreStatus, UserTab } from "@/datasource/schema";
import AddTabComponent from "../AddTabComponent/AddTabComponent";
import ChooseTabColorComponent from "../ChoseTabColorComponent/ChoseTabColorComponent";
import TabSectionComponent from "../TabSectionComponent/TabSectionComponent";
import UpdateTabComponent from "../UpdateTabComponent/UpdateTabComponent";
import { TabComponentController } from "./TabComponent.controller";
import { trimText } from "@/datasource/utils";

export default function TabComponent() {
  const [activeTab, setActiveTab] = useState<string>("");
  const [tabs, setTabs] = useState<UserTab[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [tab, setTab] = useState<UserTab>();

  useEffect(() => {
    const subscription = new TabComponentController().getTabs()?.subscribe((model) => {
      setTabs(model.data);
      setIsLoading(model.status === ModelStoreStatus.BOOTING ? true : false);

      if (model.status === ModelStoreStatus.READY && model.data.length !== 0 && !isDirty) {
        setActiveTab(model.data[0].identifier);
        setTab(model.data[0]);
        setIsDirty(true);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  /**
   * Check if tab is empty
   */
  const isEmpty = () => {
    return tabs.length === 0 && !isLoading;
  };

  /**
   * Tab clicked
   */
  const handleClick = (tab: string) => {
    setActiveTab(tab);
    setTab(tabs.find((t) => t.identifier === tab));
    setIsDirty(true);
  };

  /**
   *
   * Delete tab
   */
  const deleteTab = (tab: UserTab) => {
    new TabComponentController().deleteTab(tab);
  };

  /**
   * Get tab color
   */
  const getTabColor = (tab: UserTab) => {
    if (tab.color) {
      return tab.color;
    } else {
      return "#0D0608";
    }
  };

  return (
    <>
      <section className="tab-section bg-slate-800">
        <div>
          {tabs.map((tab) => (
            <div
              key={tab.identifier}
              style={{ backgroundColor: getTabColor(tab), border: `2px solid ${tab.identifier === activeTab ? "white" : "transparent"}` }}
              className="tab-item"
              onClick={() => setActiveTab(tab.identifier)}
            >
              <span onClick={() => handleClick(tab.identifier)} className="tab-text">
                {trimText(tab.name, 10)}
              </span>
              <span className="tab-actions">
                {/* Edit icon */}
                <span>
                  <UpdateTabComponent tab={tab} />
                </span>

                {/* Choose color */}
                <span>
                  <ChooseTabColorComponent tab={tab} />
                </span>

                {/* Delete icon */}
                <span>
                  <FontAwesomeIcon onClick={() => deleteTab(tab)} icon={faDeleteLeft} />
                </span>
              </span>
            </div>
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
        {tab && !isEmpty() ? (
          <TabSectionComponent tab={tab}></TabSectionComponent>
        ) : (
          <EmptyDataComponent
            img={tabLogo}
            title="No tab"
            description={"Looks like you do not have any tabs yet. Please add one by clicking plus button above"}
          />
        )}
      </section>
    </>
  );
}
