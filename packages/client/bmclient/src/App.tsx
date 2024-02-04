import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import AuthenticationPage from "./pages/authentication/AuthenticationPage/AuthenticationPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage/DashboardPage";
import HomePage from "./pages/dashboard/HomePage/HomePage";
import SigninPage from "./pages/authentication/SigninPage/SigninPage";
import SignUpPage from "./pages/authentication/SignUpPage/SignUpPage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage/ForgotPasswordPage";
import EmailSentPage from "./pages/authentication/EmailSentPage/EmailSentPage";
import SetNewPasswordPage from "./pages/authentication/SetPasswordPage/SetPasswordPage";
import PasswordResetSuccessPage from "./pages/authentication/PasswordResetSuccessPage/PasswordResetSuccessPage";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <SetNewPasswordPage />,
  },
  {
    path: "auth",
    element: <AuthenticationPage />,
    children: [],
  },
  {
    path: "dashboard",
    element: <DashboardPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
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
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={routes} />
    </ThemeProvider>
  );
}

export default App;
