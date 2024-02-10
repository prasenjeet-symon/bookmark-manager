import BackButtonComponent from "@/components/shared/BackButtonComponent/BackButtonComponent";
import DashboardHeader from "@/components/shared/DashboardHeader/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ModelStoreStatus, UserSetting } from "@/datasource/schema";
import { useEffect, useState } from "react";
import { SettingPageController } from "./SettingsPage.controller";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<UserSetting[]>([]);

  useEffect(() => {
    const subscription = new SettingPageController().getUserSetting().subscribe((model) => {
      setSettings(model.data);
      setIsLoading(model.status === ModelStoreStatus.READY ? false : true);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Update settings
  const updateSetting = () => {
    const controller = new SettingPageController();
    controller.updateUserSetting(settings[0]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (settings.length === 0 && !isLoading) {
    return <div>No settings found</div>;
  }

  return (
    <>
      <DashboardHeader />

      <section className="page-content setting-page-style">
        <BackButtonComponent />

        <Card>
          <div className="setting-group">
            <div className="setting-header text-2xl mb-8"> Dashboard Settings</div>
            <div className="setting-content">
              <div className="setting-item flex justify-between pv-2 my-10 align-middle">
                <div>
                  <div className="text-base font-bold mb-1">Show number of bookmarks in Category</div>
                  <div className="text-sm text-gray-300">Show number of bookmarks in each category in dashboard. Please mark the switch open if you want to see it</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      onCheckedChange={() => {
                        settings[0].showNumberOfBookmarkInCategory = !settings[0].showNumberOfBookmarkInCategory;
                        updateSetting();
                      }}
                      checked={settings[0].showNumberOfBookmarkInCategory}
                      id="airplane-mode"
                    />
                    <Label htmlFor="airplane-mode"></Label>
                  </div>
                </div>
              </div>

              <div className="setting-item flex justify-between pv-2 my-10 align-middle">
                <div>
                  <div className="text-base font-bold mb-1">Show number of bookmarks on Tab</div>
                  <div className="text-sm text-gray-300"> Show number of bookmarks on each tab in dashboard. Please mark the switch open if you want to see it</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      onCheckedChange={() => {
                        settings[0].showNumberOfBookmarkInTab = !settings[0].showNumberOfBookmarkInTab;
                        updateSetting();
                      }}
                      checked={settings[0].showNumberOfBookmarkInTab}
                      id="airplane-mode"
                    />
                    <Label htmlFor="airplane-mode"></Label>
                  </div>
                </div>
              </div>

              <div className="setting-item flex justify-between pv-2 my-10 align-middle">
                <div>
                  <div className="text-base font-bold mb-1">Show tags in tooltip</div>
                  <div className="text-sm text-gray-300"> Show tags in tooltip for each and every bookmark. Please mark the switch open if you want to see it</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      onCheckedChange={() => {
                        settings[0].showTagsInTooltip = !settings[0].showTagsInTooltip;
                        updateSetting();
                      }}
                      checked={settings[0].showTagsInTooltip}
                      id="airplane-mode"
                    />
                    <Label htmlFor="airplane-mode"></Label>
                  </div>
                </div>
              </div>

              <div className="setting-item flex justify-between pv-2 my-10 align-middle">
                <div>
                  <div className="text-base font-bold mb-1">Show notes in tooltip</div>
                  <div className="text-sm text-gray-300"> Show notes in tooltip for each and every bookmark. Please mark the switch open if you want to see it</div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      onCheckedChange={() => {
                        settings[0].showNoteInTooltip = !settings[0].showNoteInTooltip;
                        updateSetting();
                      }}
                      checked={settings[0].showNoteInTooltip}
                      id="airplane-mode"
                    />
                    <Label htmlFor="airplane-mode"></Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
