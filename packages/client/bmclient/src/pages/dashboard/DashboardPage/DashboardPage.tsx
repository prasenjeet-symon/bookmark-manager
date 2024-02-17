import { ApplicationToken, Subscription } from "@/datasource/http/http.manager";
import { ESubscriptionStatus } from "@/datasource/schema";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<ESubscriptionStatus>(ESubscriptionStatus.FREE_TRIAL);

  useEffect(() => {
    Subscription.getInstance().bootUp();

    const subscription = ApplicationToken.getInstance().observable.subscribe((token) => {
      setIsAuthenticated(!!token);
      setIsLoading(false);
    });

    const subscription2 = Subscription.getInstance().status$.subscribe((status) => {
      setPaymentStatus(status);
    });

    return () => {
      subscription.unsubscribe();
      subscription2.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col align-center p-7 ml-2  mr-2 bg-card rounded shadow-sm border-2  md:w-1/3">
          <h2 className="text-2xl font-bold mb-10 text-center">Loading...</h2>
        </div>
      </div>
    );
  } else if (!isAuthenticated) {
    return <Navigate to="/auth/signin" />;
  } else if (isAuthenticated && paymentStatus === ESubscriptionStatus.INACTIVE) {
    return <Navigate to="/payment-required" />;
  } else {
    return <Outlet />;
  }
}
