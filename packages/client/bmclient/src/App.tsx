import { useToast } from "@/components/ui/use-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import { ErrorManager } from "./datasource/http/error.manager";
import { SuccessManager } from "./datasource/http/success.manager";
import AuthenticationPage from "./pages/authentication/AuthenticationPage/AuthenticationPage";
import EmailSentPage from "./pages/authentication/EmailSentPage/EmailSentPage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage/ForgotPasswordPage";
import PasswordResetSuccessPage from "./pages/authentication/PasswordResetSuccessPage/PasswordResetSuccessPage";
import SetNewPasswordPage from "./pages/authentication/SetPasswordPage/SetPasswordPage";
import SignUpPage from "./pages/authentication/SignUpPage/SignUpPage";
import SigninPage from "./pages/authentication/SigninPage/SigninPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage/DashboardPage";
import { default as DashboardHomePage } from "./pages/dashboard/HomePage/HomePage";
import HomePage from "./pages/HomePage/HomePage";
import SettingsPage from "./pages/dashboard/SettingsPage/SettingsPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "auth",
    element: <AuthenticationPage />,
    children: [
      {
        path: "",
        element: <SigninPage />,
      },
      {
        path: "signin",
        element: <SigninPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "forgot-password-sent",
        element: <EmailSentPage />,
      },
      {
        path: "set-password",
        element: <SetNewPasswordPage />,
      },
      {
        path: "set-password-success",
        element: <PasswordResetSuccessPage />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardPage />,
    children: [
      {
        path: "",
        element: <DashboardHomePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage/>
      }
    ],
  },
]);
/**
 *
 *
 *
 *
 */
function App() {
  const { toast } = useToast();

  useEffect(() => {
    // Handle error
    const subsError = ErrorManager.getInstance().observable.subscribe((error) => {
      console.log(error, "FROM UI");
      toast({
        description: error,
        variant: "destructive",
        title: "Oops! Something went wrong.",
      });
    });

    // Handle success
    const subsSuccess = SuccessManager.getInstance().observable.subscribe((message) => {
      toast({
        description: message,
      });
    });

    return () => {
      subsError.unsubscribe();
      subsSuccess.unsubscribe();
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={routes} />
        <Toaster />
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
