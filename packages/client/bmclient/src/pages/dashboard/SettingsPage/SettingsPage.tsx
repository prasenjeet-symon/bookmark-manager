import BackButtonComponent from "@/components/shared/BackButtonComponent/BackButtonComponent";
import DashboardHeader from "@/components/shared/DashboardHeader/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { singleCall } from "@/datasource/http/http.manager";
import { NetworkApi } from "@/datasource/network.api";
import { ESubscriptionStatus, ModelStoreStatus, User, UserSetting } from "@/datasource/schema";
import { faCheckCircle, faCreditCardAlt, faExplosion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { SettingPageController } from "./SettingsPage.controller";
import "./SettingsPage.css";
import { formatPrice } from "@/datasource/utils";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<UserSetting[]>([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<ESubscriptionStatus>(ESubscriptionStatus.FREE_TRIAL);
  const [isButtonActive, setIsButtonActive] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const subscription = new SettingPageController().getUserSetting().subscribe((model) => {
      setSettings(model.data);
      setIsLoading(model.status === ModelStoreStatus.READY ? false : true);
    });

    const subscription1 = new SettingPageController().getSubscriptionStatus().subscribe((model) => {
      setSubscriptionStatus(model);
    });

    const subscription3 = new SettingPageController().getUser().subscribe((model) => {
      if (model.data.length === 0) {
        return;
      }

      setUser(model.data[0]);
    });

    return () => {
      subscription.unsubscribe();
      subscription1.unsubscribe();
      subscription3.unsubscribe();
    };
  }, []);

  // Update settings
  const updateSetting = () => {
    const controller = new SettingPageController();
    controller.updateUserSetting(settings[0]);
  };

  /**  Subscribe to premium */
  const subscribeToPremium = async () => {
    setIsButtonActive(false);
    await singleCall(new NetworkApi().subscribeToPremium());
    new SettingPageController().listenForSubscriptionStatus();
    setIsButtonActive(true);
  };

  /** Cancel subscription */
  const cancelSubscription = async () => {
    setIsButtonActive(false);
    await singleCall(new NetworkApi().cancelSubscription());
    new SettingPageController().listenForSubscriptionStatus();
    setIsButtonActive(true);
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
        {user !== null ? (
          <Card className="mb-10">
            <div className="setting-group">
              <div className="setting-header text-2xl mb-8"> Account Setting</div>
              <div className="setting-content">
                {/* Full name */}
                <div className="flex justify-between my-2 border-b-2 py-2">
                  <div className="text-base font-bold">Full name</div>
                  <div> {user.fullName}</div>
                </div>
                {/* Email */}
                <div className="flex justify-between my-2 border-b-2 py-2">
                  <div className="text-base font-bold">Email</div>
                  <div>{user.email}</div>
                </div>
                {/* Password */}
                <div className="flex justify-between my-2 border-b-2 py-2">
                  <div className="text-base font-bold">Password</div>
                  <div>********</div>
                </div>
                {/* user id */}
                <div className="flex justify-between my-2 py-2">
                  <div className="text-base font-bold">User id</div>
                  <div>{user.userId}</div>
                </div>
              </div>
            </div>
          </Card>
        ) : null}

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

        <Card className="mt-10">
          <div className="setting-group">
            <div className="setting-header text-2xl mb-8"> Payment Setting</div>
            <div className="setting-content">
              {/* Status */}
              <div className="flex justify-between items-start my-2 py-2">
                <div className="text-base font-bold mb-1">
                  <div className="font-bold mb-2 text-lg">Payment status</div>
                  <div className="font-normal text-base">
                     Subscribe to premium for only <span className="font-bold text-lg">{formatPrice(import.meta.env.VITE_SUBSCRIPTION_PRICE_CURRENCY, import.meta.env.VITE_SUBSCRIPTION_PRICE )}</span> per month. You can cancel anytime.
                  </div>
                </div>
                <div>
                  {subscriptionStatus === ESubscriptionStatus.INACTIVE ? (
                    <Button disabled={!isButtonActive} onClick={() => subscribeToPremium()} variant="link" className="border-2 border-cyan-300">
                      <FontAwesomeIcon icon={faCreditCardAlt} className="mr-2" /> Subscribe to premium
                    </Button>
                  ) : null}

                  {/* Free trial */}
                  {subscriptionStatus === ESubscriptionStatus.FREE_TRIAL ? (
                    <Button>
                      <FontAwesomeIcon icon={faExplosion} className="mr-2" /> Under Free trial
                    </Button>
                  ) : null}

                  {/* Premium member */}
                  {subscriptionStatus === ESubscriptionStatus.ACTIVE ? (
                    <>
                      <Button disabled={!isButtonActive} onClick={() => cancelSubscription()} variant="ghost" className="text-red-500">
                        Cancel
                      </Button>
                      <Button variant="outline">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" /> Premium member
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-10 bg-red-500">
          <div className="setting-group">
            <div className="setting-header text-2xl mb-8"> Danger Zone</div>
            <div className="setting-content">
              {/* Status */}
              <div className="flex justify-between align-center my-2 py-2">
                <div className="text-base font-bold mb-1">
                  <div className="font-bold text-lg">Delete account</div>
                  <div className="text-sm font-normal">Be careful! This action cannot be undone</div>
                </div>
                <div>
                  <Button variant="outline" className="bg-white text-red-500">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
