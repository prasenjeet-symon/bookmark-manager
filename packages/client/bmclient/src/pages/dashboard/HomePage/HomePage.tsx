import { Button } from "@/components/ui/button";
import { singleCall } from "@/datasource/http/http.manager";
import { NetworkApi } from "@/datasource/network.api";

export default function DashboardHomePage() {
  const logOut = async () => {
    await singleCall(new NetworkApi().logout());
  };

  return (
    <div>
      <h1>HomePage Of Dashboard</h1>

      <Button variant="destructive" type="button" onClick={logOut}>
        LogOut
      </Button>
    </div>
  );
}
